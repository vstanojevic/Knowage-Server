<template>
    <div v-show="!error" :id="chartID" style="width: 100%; height: 100%; margin: 0 auto"></div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { emitter } from '@/modules/documentExecution/dashboard/DashboardHelpers'
import { ISelection, IWidget, IWidgetColumn } from '../../../Dashboard'
import { IHighchartsChartModel } from '../../../interfaces/highcharts/DashboardHighchartsWidget'
import { mapActions } from 'pinia'
import { updateStoreSelections, executeChartCrossNavigation } from '../../interactionsHelpers/InteractionHelper'
import { formatActivityGauge, formatHeatmap } from './HighchartsModelFormattingHelpers'
import { formatForCrossNavigation } from './HighchartsContainerHelpers'
import Highcharts from 'highcharts'
import Highcharts3D from 'highcharts/highcharts-3d'
import HighchartsMore from 'highcharts/highcharts-more'
import HighchartsSolidGauge from 'highcharts/modules/solid-gauge'
import Accessibility from 'highcharts/modules/accessibility'
import NoDataToDisplay from 'highcharts/modules/no-data-to-display'
import SeriesLabel from 'highcharts/modules/series-label'
import HighchartsHeatmap from 'highcharts/modules/heatmap'
import cryptoRandomString from 'crypto-random-string'
import store from '../../../Dashboard.store'
import deepcopy from 'deepcopy'
import mainStore from '@/App.store'

HighchartsMore(Highcharts)
HighchartsSolidGauge(Highcharts)
HighchartsHeatmap(Highcharts)
Accessibility(Highcharts)
NoDataToDisplay(Highcharts)
SeriesLabel(Highcharts)
Highcharts3D(Highcharts)

export default defineComponent({
    name: 'highcharts-container',
    components: {},
    props: {
        widgetModel: { type: Object as PropType<IWidget>, required: true },
        dataToShow: { type: Object as any, required: true },
        dashboardId: { type: String, required: true },
        editorMode: { type: Boolean },
        propActiveSelections: {
            type: Array as PropType<ISelection[]>,
            required: true
        }
    },
    data() {
        return {
            chartID: cryptoRandomString({ length: 16, type: 'base64' }),
            chartModel: {} as IHighchartsChartModel,
            error: false,
            highchartsInstance: {} as any
        }
    },
    watch: {
        dataToShow() {
            this.onRefreshChart()
        }
    },
    mounted() {
        this.setEventListeners()
        this.onRefreshChart()
    },
    unmounted() {
        this.removeEventListeners()
    },
    methods: {
        ...mapActions(store, ['setSelections', 'getDatasetLabel']),
        ...mapActions(mainStore, ['setError']),
        setEventListeners() {
            emitter.on('refreshChart', this.onRefreshChart)
            emitter.on('widgetResized', this.resizeChart)
        },
        removeEventListeners() {
            emitter.off('refreshChart', this.onRefreshChart)
            emitter.off('widgetResized', this.resizeChart)
        },
        onRefreshChart(widgetId: any | null = null) {
            if (widgetId && widgetId !== this.widgetModel.id) return
            this.chartModel = this.widgetModel.settings.chartModel ? this.widgetModel.settings.chartModel.model : null
            this.updateChartModel()
        },
        updateChartModel() {
            if (!this.chartModel) return
            Highcharts.setOptions({ lang: { noData: this.chartModel.lang.noData } })

            this.widgetModel.settings.chartModel.setData(this.dataToShow, this.widgetModel)

            this.widgetModel.settings.chartModel.updateSeriesAccessibilitySettings(this.widgetModel)
            if (this.chartModel.chart.type !== 'heatmap') this.widgetModel.settings.chartModel.updateSeriesLabelSettings(this.widgetModel)
            this.chartModel.chart.type === 'heatmap' ? this.updateAxisLabels() : this.updateDataLabels()
            this.error = this.updateLegendSettings()
            if (this.error) return
            this.error = this.updateTooltipSettings()
            if (this.error) return

            this.widgetModel.settings.chartModel.updateChartColorSettings(this.widgetModel)

            this.setSeriesEvents()

            const modelToRender = this.getModelForRender()
            modelToRender.chart.backgroundColor = null

            console.log('-------- MODEL TO RENDER: ', modelToRender)
            // const tempModelToRender = {
            //     chart: {
            //         polar: true
            //     },

            //     title: {
            //         text: 'Highcharts Polar Chart'
            //     },

            //     subtitle: {
            //         text: 'Also known as Radar Chart'
            //     },

            //     pane: {
            //         startAngle: 0,
            //         endAngle: 360
            //     },

            //     xAxis: {
            //         tickInterval: 45,
            //         min: 0,
            //         max: 360,
            //         labels: {
            //             format: '{value}°'
            //         }
            //     },

            //     yAxis: {
            //         min: 0
            //     },

            //     plotOptions: {
            //         series: {
            //             pointStart: 0,
            //             pointInterval: 45
            //         },
            //         column: {
            //             pointPadding: 0,
            //             groupPadding: 0
            //         }
            //     },

            //     series: [
            //         {
            //             type: 'column',
            //             name: 'Column',
            //             data: [8, 7, 6, 5, 4, 3, 2, 1],
            //             pointPlacement: 'between'
            //         },
            //         {
            //             type: 'line',
            //             name: 'Line',
            //             data: [1, 2, 3, 4, 5, 6, 7, 8]
            //         },
            //         {
            //             type: 'area',
            //             name: 'Area',
            //             data: [1, 8, 2, 7, 3, 6, 4, 5]
            //         }
            //     ]
            // }

            try {
                this.highchartsInstance = Highcharts.chart(this.chartID, modelToRender as any)
                this.highchartsInstance.reflow()
            } catch (error: any) {
                console.log('--------- EROR: ', error)
                this.setError({ title: this.$t('common.toast.errorTitle'), msg: error ? error.message : '' })
            }
        },
        updateLegendSettings() {
            if (this.chartModel.plotOptions.pie) this.chartModel.plotOptions.pie.showInLegend = true
            if (this.chartModel.plotOptions.gauge) this.chartModel.plotOptions.gauge.showInLegend = true
            return this.widgetModel.settings.chartModel.updateFormatterSettings(this.chartModel.legend, 'labelFormat', 'labelFormatter', 'labelFormatterText', 'labelFormatterError')
        },
        updateDataLabels() {
            const dataLabels = this.chartModel.plotOptions && this.chartModel.plotOptions[this.chartModel.chart.type] ? this.chartModel.plotOptions[this.chartModel.chart.type].dataLabels : null
            if (dataLabels) {
                this.error = this.widgetModel.settings.chartModel.updateFormatterSettings(dataLabels, 'format', 'formatter', 'formatterText', 'formatterError')
                if (this.error) return
            }
        },
        updateAxisLabels() {
            const axisLabels = this.chartModel.xAxis && this.chartModel.xAxis.labels ? this.chartModel.xAxis.labels : null
            if (axisLabels) {
                this.error = this.widgetModel.settings.chartModel.updateFormatterSettings(axisLabels, 'format', 'formatter', 'formatterText', 'formatterError')
                if (this.error) return
            }
        },
        updateTooltipSettings() {
            let hasError = this.widgetModel.settings.chartModel.updateFormatterSettings(this.chartModel.tooltip, null, 'formatter', 'formatterText', 'formatterError')
            if (hasError) return hasError
            hasError = this.widgetModel.settings.chartModel.updateFormatterSettings(this.chartModel.tooltip, null, 'pointFormatter', 'pointFormatterText', 'pointFormatterError')
            return hasError
        },

        setSeriesEvents() {
            if (this.chartModel.plotOptions.series) {
                this.chartModel.plotOptions.series.events = {
                    click: this.executeInteractions
                }
            } else
                this.chartModel.plotOptions.series = {
                    events: { click: this.executeInteractions }
                }
        },
        executeInteractions(event: any) {
            if (this.chartModel.chart.type !== 'pie' && this.chartModel.chart.type !== 'heatmap') return
            if (this.widgetModel.settings.interactions.crossNavigation.enabled) {
                const formattedOutputParameters = formatForCrossNavigation(event, this.widgetModel.settings.interactions.crossNavigation, this.dataToShow, this.chartModel.chart.type)
                executeChartCrossNavigation(formattedOutputParameters, this.widgetModel.settings.interactions.crossNavigation, this.dashboardId)
            } else if (this.chartModel.chart.type === 'pie') {
                this.setSelection(event)
            }
        },
        setSelection(event: any) {
            if (this.editorMode || !this.widgetModel.settings.interactions.selection || !this.widgetModel.settings.interactions.selection.enabled) return
            const serieClicked = event.point?.options
            if (!serieClicked || !serieClicked.name) return
            updateStoreSelections(this.createNewSelection([serieClicked.name]), this.propActiveSelections, this.dashboardId, this.setSelections, this.$http)
        },
        createNewSelection(value: (string | number)[]) {
            const attributeColumn = this.widgetModel.columns.find((column: IWidgetColumn) => column.fieldType === 'ATTRIBUTE')
            const selection = {
                datasetId: this.widgetModel.dataset as number,
                datasetLabel: this.getDatasetLabel(this.widgetModel.dataset as number),
                columnName: attributeColumn?.columnName ?? '',
                value: value,
                aggregated: false,
                timestamp: new Date().getTime()
            }
            return selection
        },
        resizeChart() {
            setTimeout(() => {
                this.highchartsInstance.reflow()
            }, 100)
        },
        getModelForRender() {
            const formattedChartModel = deepcopy(this.chartModel)
            if (formattedChartModel.chart.type === 'activitygauge') {
                formatActivityGauge(formattedChartModel, this.widgetModel)
            } else if (formattedChartModel.chart.type === 'heatmap') {
                formatHeatmap(formattedChartModel)
            }
            return formattedChartModel
        }
    }
})
</script>
