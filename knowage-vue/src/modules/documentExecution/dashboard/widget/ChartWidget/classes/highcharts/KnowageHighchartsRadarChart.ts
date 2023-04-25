import { KnowageHighcharts } from './KnowageHighcharts'
import { IWidget, IWidgetColumn } from '@/modules/documentExecution/dashboard/Dashboard'
import { IHighchartsChartSerie, IHighchartsSeriesLabelsSetting } from '@/modules/documentExecution/dashboard/interfaces/highcharts/DashboardHighchartsWidget'
import { createSerie } from './updater/KnowageHighchartsCommonUpdater'
import { updateRadarChartModel } from './updater/KnowageHighchartsRadarChartUpdater'
import * as highchartsDefaultValues from '../../../WidgetEditor/helpers/chartWidget/highcharts/HighchartsDefaultValues'
import deepcopy from 'deepcopy'

export class KnowageHighchartsRadarChart extends KnowageHighcharts {
    constructor(model: any) {
        super()
        this.setSpecificOptionsDefaultValues()
        if (model && model.CHART) this.updateModel(deepcopy(model))
        else if (model) {
            this.model = deepcopy(model)
            if (model.chart.type !== 'radar') {
                this.formatSeriesFromOtherChartTypeSeries()
                this.setSpecificOptionsDefaultValues()
            }
        }
        this.model.chart.type = 'radar'
        this.model.chart.polar = true
    }

    updateModel(oldModel: any) {
        updateRadarChartModel(oldModel, this.model)
    }

    setSpecificOptionsDefaultValues() {
        this.setHeatmapXAxis()
        this.setHeatmapYAxis()
    }

    setData(data: any, widgetModel: IWidget) {
        // TODO
        console.log('----------------------- DATA: ', data)
        if (this.model.series.length === 0) this.getSeriesFromWidgetModel(widgetModel)
        const measureColumns = widgetModel.columns.filter((column: IWidgetColumn) => column.fieldType === 'MEASURE')
        console.log('----------------------- measureColumns: ', measureColumns)


        // TODO - see if needed
        const formattedFields = [] as any[]
        data.metaData.fields.forEach((field: any, index: number) => {
            if (index !== 0) {
                const index = widgetModel.columns.findIndex((column: IWidgetColumn) => field.header.startsWith(column.columnName))
                if (index !== -1) formattedFields.push({ name: widgetModel.columns[index].columnName, dataIndex: field.dataIndex, type: widgetModel.columns[index].fieldType })
            }
        })

        console.log('----------------------- formattedFields: ', formattedFields)
        this.model.series.map((serie) => {
            console.log('------ SERIE: ', serie)
            const index = formattedFields.findIndex((field: any) => serie.name === field.name)
            const dataIndex = index !== -1 ? formattedFields[index].dataIndex : ''
            console.log('------ DATA INDEX: ', dataIndex)
            serie.data = []
            // TODO
            // const serieElement = {
            //     id: serie.name,// TODO
            //     name: serie.name,
            //     y: '', // TODO
            //     data: []
            // }
            data?.rows?.forEach((row: any) => {
                serie.data.push({
                    name: row[formattedFields[0].dataIndex],
                    y: row[dataIndex],
                    drilldown: false // TODO 
                })
            })
        })


        console.log('----------------------- this.model.series: ', this.model.series)

        return this.model.series
    }

    getSeriesFromWidgetModel(widgetModel: IWidget) {
        // TODO
        const measureColumn = widgetModel.columns.find((column: IWidgetColumn) => column.fieldType === 'MEASURE')
        if (!measureColumn) return
        this.model.series = [createSerie(measureColumn.columnName, measureColumn.aggregation, true)]
    }

    setHeatmapXAxis() {
        this.model.xAxis = highchartsDefaultValues.getDefaultHeatmapXAxis()
    }

    setHeatmapYAxis() {
        this.model.yAxis = highchartsDefaultValues.getDefaultHeatmapYAxis()
    }

    // TODO
    updateSeriesLabelSettings(widgetModel: IWidget) {
        if (!widgetModel || !widgetModel.settings.series || !widgetModel.settings.series.seriesLabelsSettings) return
        this.setAllSeriesSettings(widgetModel)
        this.setSpecificSeriesSettings(widgetModel)
    }

    setAllSeriesSettings(widgetModel: IWidget) {
        const allSeriesSettings = widgetModel.settings.series.seriesLabelsSettings[0]
        if (allSeriesSettings.label.enabled) {
            this.model.series.forEach((serie: any, index: number) =>
                this.updateSeriesDataWithSerieSettings(serie, allSeriesSettings, index))
        } else {
            this.resetSeriesSettings()
        }
    }

    resetSeriesSettings() {
        this.model.series.forEach((serie: any) => {
            serie.data.forEach((data: any) => {
                data.dataLabels = { ...highchartsDefaultValues.getDefaultSerieLabelSettings(), position: '' }
                data.dataLabels.formatter = undefined
            })
        })
    }

    setSpecificSeriesSettings(widgetModel: IWidget) {
        for (let i = 1; i < widgetModel.settings.series.seriesLabelsSettings.length; i++) {
            const seriesSettings = widgetModel.settings.series.seriesLabelsSettings[i] as IHighchartsSeriesLabelsSetting
            if (seriesSettings.label.enabled) seriesSettings.names.forEach((serieName: string) => this.updateSpecificSeriesLabelSettings(serieName, seriesSettings))
        }
    }

    updateSpecificSeriesLabelSettings(serieName: string, seriesSettings: IHighchartsSeriesLabelsSetting) {
        const index = this.model.series.findIndex((serie: any) => serie.name === serieName)
        if (index !== -1) this.updateSeriesDataWithSerieSettings(this.model.series[index], seriesSettings, index)

    }

    updateSeriesDataWithSerieSettings(serie: any, seriesSettings: IHighchartsSeriesLabelsSetting, index: number) {
        serie.data.forEach((data: any) => {
            data.dataLabels = {
                y: index * 40,
                backgroundColor: seriesSettings.label.backgroundColor ?? '',
                enabled: true,
                position: '',
                style: {
                    fontFamily: seriesSettings.label.style.fontFamily,
                    fontSize: seriesSettings.label.style.fontSize,
                    fontWeight: seriesSettings.label.style.fontWeight,
                    color: seriesSettings.label.style.color ?? ''
                },
                formatter: function () {
                    return KnowageHighchartsRadarChart.prototype.handleFormatter(this, seriesSettings.label)
                }
            }
        })
    }


    formatSeriesFromOtherChartTypeSeries() {
        this.model.series = this.model.series.map((serie: any) => { return this.getFormattedSerieFromOtherChartTypeSerie(serie) })
    }

    getFormattedSerieFromOtherChartTypeSerie(otherChartSerie: any) {
        // TODO
        const formattedSerie = { name: otherChartSerie.name, data: [], colorByPoint: true } as IHighchartsChartSerie
        if (otherChartSerie.accessibility) formattedSerie.accessibility
        return formattedSerie
    }
}
