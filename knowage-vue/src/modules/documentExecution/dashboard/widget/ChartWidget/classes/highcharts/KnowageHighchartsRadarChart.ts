import { KnowageHighcharts } from './KnowageHighcharts'
import { IWidget, IWidgetColumn } from '@/modules/documentExecution/dashboard/Dashboard'
import { IHighchartsChartSerie, IHighchartsChartSerieData } from '@/modules/documentExecution/dashboard/interfaces/highcharts/DashboardHighchartsWidget'
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
        if (this.model.series.length === 0) this.getSeriesFromWidgetModel(widgetModel)

        this.model.series = [{
            "label": {
                "enabled": false
            },
            "selected": true,
            "initiallySelected": true,
            "name": "Food",
            "type": "",
            "connectNulls": true,
            "data": [
                {
                    "y": 930864,
                    "name": "Q2",
                    "datetype": "string"
                },
                {
                    "y": 1147708,
                    "name": "Q3",
                    "datetype": "string"
                },
                {
                    "y": 1047654,
                    "name": "Q1",
                    "datetype": "string"
                },
                {
                    "y": 965621,
                    "name": "Q4",
                    "datetype": "string"
                }
            ],
            "dataLabels": {
                "enabled": true,
                "labelFormat": "{y:,.0f}"
            },
            "tooltip": {
                "valueDecimals": 0,
                "scaleFactor": "empty",
                "ttBackColor": "#D6D6D6"
            }
        },
        {
            "label": {
                "enabled": false
            },
            "selected": true,
            "initiallySelected": true,
            "name": "Drink",
            "connectNulls": true,
            "data": [
                {
                    "y": 194835,
                    "name": "Q2",
                    "datetype": "string"
                },
                {
                    "y": 202356,
                    "name": "Q3",
                    "datetype": "string"
                },
                {
                    "y": 128144,
                    "name": "Q1",
                    "datetype": "string"
                },
                {
                    "y": 102185,
                    "name": "Q4",
                    "datetype": "string"
                }
            ],
            "dataLabels": {
                "enabled": true,
                "labelFormat": "{y:,.0f}"
            },
            "tooltip": {
                "valueDecimals": 0,
                "scaleFactor": "empty",
                "ttBackColor": "#D6D6D6"
            }
        },
        {
            "label": {
                "enabled": false
            },
            "selected": true,
            "initiallySelected": true,
            "name": "Non-Consumable",
            "connectNulls": true,
            "data": [
                {
                    "y": 540265,
                    "name": "Q2",
                    "datetype": "string"
                },
                {
                    "y": 714384,
                    "name": "Q3",
                    "datetype": "string"
                },
                {
                    "y": 568789,
                    "name": "Q1",
                    "datetype": "string"
                },
                {
                    "y": 578788,
                    "name": "Q4",
                    "datetype": "string"
                }
            ],
            "dataLabels": {
                "enabled": true,
                "labelFormat": "{y:,.0f}"
            },
            "tooltip": {
                "valueDecimals": 0,
                "scaleFactor": "empty",
                "ttBackColor": "#D6D6D6"
            }
        },
        {
            "label": {
                "enabled": false
            },
            "selected": true,
            "initiallySelected": true,
            "name": "Car",
            "connectNulls": true,
            "data": [
                {
                    "name": "Q2",
                    "datetype": "string"
                },
                {
                    "y": 17812,
                    "name": "Q3",
                    "datetype": "string"
                },
                {
                    "name": "Q1",
                    "datetype": "string"
                },
                {
                    "name": "Q4",
                    "datetype": "string"
                }
            ],
            "dataLabels": {
                "enabled": true,
                "labelFormat": "{y:,.0f}"
            },
            "tooltip": {
                "valueDecimals": 0,
                "scaleFactor": "empty",
                "ttBackColor": "#D6D6D6"
            }
        }]
        return this.model.series
    }

    getSeriesFromWidgetModel(widgetModel: IWidget) {
        // TODO
        // const measureColumn = widgetModel.columns.find((column: IWidgetColumn) => column.fieldType === 'MEASURE')
        // if (!measureColumn) return
        // this.model.series = [createSerie(measureColumn.columnName, measureColumn.aggregation, true)]
    }

    // TODO
    updateSeriesLabelSettings(widgetModel: IWidget) {
        // if (!widgetModel || !widgetModel.settings.series || !widgetModel.settings.series.seriesLabelsSettings || !widgetModel.settings.series.seriesLabelsSettings[0]) return
        // const seriesLabelSetting = widgetModel.settings.series.seriesLabelsSettings[0]
        // if (!seriesLabelSetting.label.enabled) return
        // this.model.series.forEach((serie: IHighchartsChartSerie) => {
        //     serie.data.forEach((data: IHighchartsChartSerieData) => {
        //         data.dataLabels = {
        //             backgroundColor: seriesLabelSetting.label.backgroundColor ?? '',
        //             distance: 30,
        //             enabled: true,
        //             position: '',
        //             style: {
        //                 fontFamily: seriesLabelSetting.label.style.fontFamily,
        //                 fontSize: seriesLabelSetting.label.style.fontSize,
        //                 fontWeight: seriesLabelSetting.label.style.fontWeight,
        //                 color: seriesLabelSetting.label.style.color ?? ''
        //             },
        //             formatter: function () {
        //                 return KnowageHighchartsPieChart.prototype.handleFormatter(this, seriesLabelSetting.label)
        //             }
        //         }
        //     })
        // })
    }

    setHeatmapXAxis() {
        this.model.xAxis = highchartsDefaultValues.getDefaultHeatmapXAxis()
    }

    setHeatmapYAxis() {
        this.model.yAxis = highchartsDefaultValues.getDefaultHeatmapYAxis()
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
