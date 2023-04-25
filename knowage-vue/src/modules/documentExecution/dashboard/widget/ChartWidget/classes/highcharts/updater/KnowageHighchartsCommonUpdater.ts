import { hexToRgba } from "@/modules/documentExecution/dashboard/helpers/FormattingHelpers"
import { IHighchartsChartModel } from "@/modules/documentExecution/dashboard/interfaces/highcharts/DashboardHighchartsWidget"
import * as highchartsDefaultValues from '../../../../WidgetEditor/helpers/chartWidget/highcharts/HighchartsDefaultValues'

export const createSerie = (serieName: string, groupingFunction: string, colorByPoint: boolean) => {
    return { name: serieName, data: [], colorByPoint: colorByPoint, groupingFunction: groupingFunction, accessibility: highchartsDefaultValues.getDefaultSeriesAccessibilitySettings() }
}

export const createGaugeSerie = (serieName: string) => {
    return { name: serieName, data: [], colorByPoint: false, accessibility: highchartsDefaultValues.getDefaultSeriesAccessibilitySettings() }
}

export const createHeatMapSerie = (serieName: string) => {
    return { name: serieName, data: [], accessibility: highchartsDefaultValues.getDefaultSeriesAccessibilitySettings() }
}

export const getFormattedNoDataConfiguration = (oldModel: any, newModel: IHighchartsChartModel) => {
    if (oldModel.CHART.EMPTYMESSAGE) {
        newModel.lang.noData = oldModel.CHART.EMPTYMESSAGE.text
        newModel.noData.position = oldModel.CHART.EMPTYMESSAGE.position ? { align: oldModel.CHART.EMPTYMESSAGE.position.align, verticalAlign: oldModel.CHART.EMPTYMESSAGE.position.verticalAlign } : { align: '', verticalAlign: '' }

        if (oldModel.CHART.EMPTYMESSAGE.style) {
            newModel.noData.style = {
                fontFamily: oldModel.CHART.EMPTYMESSAGE.style.fontFamily ?? '',
                fontSize: oldModel.CHART.EMPTYMESSAGE.style.fontSize ?? '',
                fontWeight: oldModel.CHART.EMPTYMESSAGE.style.fontWeight,
                color: oldModel.CHART.EMPTYMESSAGE.style.color ? hexToRgba(oldModel.CHART.EMPTYMESSAGE.style.color) : '',
                backgroundColor: ''
            }
        }
    }
}

export const getFormattedSeries = (oldModel: any, newModel: IHighchartsChartModel, maxSeries: number | null) => {
    if (oldModel.CHART.VALUES.SERIE) {
        const colorByPoint = oldModel.CHART.type === 'PIE'
        let endIndex = maxSeries ? maxSeries : oldModel.CHART.VALUES.SERIE.length
        if (endIndex > oldModel.CHART.VALUES.SERIE.length) endIndex = oldModel.CHART.VALUES.SERIE.length
        for (let i = 0; i < endIndex; i++) {
            const serie = oldModel.CHART.VALUES.SERIE[i]
            switch (oldModel.CHART.type) {
                case 'PIE':
                case 'RADAR':
                    newModel.series.push(createSerie(serie.name, serie.groupingFunction, colorByPoint))
                    break;
                case 'HEATMAP':
                    newModel.series.push(createHeatMapSerie(serie.name))
                    break
                default:
                    newModel.series.push(createGaugeSerie(serie.name))
            }
        }
    }
}

export const getFormattedLegend = (oldModel: any, newModel: IHighchartsChartModel) => {
    if (oldModel.CHART.LEGEND) {
        newModel.legend = {
            enabled: oldModel.CHART.LEGEND.show,
            align: oldModel.CHART.LEGEND.position !== 'top' ? oldModel.CHART.LEGEND.position : 'center',
            layout: 'horizontal',
            verticalAlign: oldModel.CHART.LEGEND.position === 'top' ? 'top' : 'middle',
            itemStyle: {
                fontFamily: oldModel.CHART.LEGEND.style.fontFamily ?? '',
                fontSize: oldModel.CHART.LEGEND.style.fontSize ?? '',
                fontWeight: oldModel.CHART.LEGEND.style.fontWeight ?? '',
                color: oldModel.CHART.LEGEND.style.color ? hexToRgba(oldModel.CHART.LEGEND.style.color) : ''
            },
            backgroundColor: oldModel.CHART.LEGEND.style.backgroundColor ? hexToRgba(oldModel.CHART.LEGEND.style.backgroundColor) : '',
            borderWidth: 1,
            borderColor: ''
        }
    }
}

export const getFormattedLabels = (oldModel: any, newModel: IHighchartsChartModel) => {
    if (oldModel.CHART.VALUES.SERIE && oldModel.CHART.VALUES.SERIE[0] && oldModel.CHART.VALUES.SERIE[0].dataLabels && newModel.plotOptions.pie) {
        const oldDataLabelsSettings = oldModel.CHART.VALUES.SERIE[0].dataLabels
        newModel.plotOptions.pie.dataLabels = {
            enabled: true,
            distance: 30,
            style: {
                fontFamily: oldDataLabelsSettings.style.fontFamily,
                fontSize: oldDataLabelsSettings.style.fontSize,
                fontWeight: oldDataLabelsSettings.style.fontWeight,
                color: oldDataLabelsSettings.style.color ? hexToRgba(oldDataLabelsSettings.style.color) : ''
            },
            position: '',
            backgroundColor: ''
        }
    }
}

export const getFormattedTooltipSettings = (oldModel: any, newModel: IHighchartsChartModel) => {
    if (oldModel.CHART.VALUES.SERIE && oldModel.CHART.VALUES.SERIE[0] && oldModel.CHART.VALUES.SERIE[0].TOOLTIP) {
        const oldTooltipSettings = oldModel.CHART.VALUES.SERIE[0].TOOLTIP
        newModel.tooltip = {
            enabled: true,
            style: {
                fontFamily: oldTooltipSettings.style.fontFamily,
                fontSize: oldTooltipSettings.style.fontSize,
                fontWeight: oldTooltipSettings.style.fontWeight,
                color: oldTooltipSettings.style.color ? hexToRgba(oldTooltipSettings.style.color) : ''
            },
            backgroundColor: oldTooltipSettings.backgroundColor ? hexToRgba(oldTooltipSettings.backgroundColor) : ''
        }
    }
}


export const setFormattedAxisLabels = (oldAxis: any, newModelAxis: any) => {
    if (oldAxis.position) newModelAxis.labels.align = oldAxis.position
    if (oldAxis.style) {
        if (oldAxis.style.align) newModelAxis.labels.align = oldAxis.style.align
        if (oldAxis.style.color) newModelAxis.labels.style.color = hexToRgba(oldAxis.style.color)
        if (oldAxis.style.fontFamily) newModelAxis.labels.style.fontFamily = oldAxis.style.fontFamily
        if (oldAxis.style.fontSize) newModelAxis.labels.style.fontSize = oldAxis.style.fontSize
        if (oldAxis.style.fontWeight) newModelAxis.labels.style.fontWeight = oldAxis.style.fontWeight
        if (oldAxis.style.rotate) newModelAxis.labels.rotation = oldAxis.style.rotate
    }
}

export const setFormattedAxisTitle = (oldAxis: any, newModelAxis: any) => {
    const oldAxisTitle = oldAxis.TITLE
    if (!oldAxisTitle) return
    if (oldAxisTitle.text) {
        newModelAxis.title.enabled = true
        newModelAxis.title.text = oldAxisTitle.text
    }
    if (oldAxisTitle.style) {
        if (oldAxisTitle.style.align) newModelAxis.title.align = getFormattedTitleAlign(oldAxisTitle.style.align)
        if (oldAxisTitle.style.color) newModelAxis.title.style.color = hexToRgba(oldAxisTitle.style.color)
        if (oldAxisTitle.style.fontFamily) newModelAxis.title.style.fontFamily = oldAxisTitle.style.fontFamily
        if (oldAxisTitle.style.fontSize) newModelAxis.title.style.fontSize = oldAxisTitle.style.fontSize
        if (oldAxisTitle.style.fontWeight) newModelAxis.title.style.fontWeight = oldAxisTitle.style.fontWeight
    }
}

const getFormattedTitleAlign = (oldAxisTitleAlign: 'left' | 'center' | 'right') => {
    switch (oldAxisTitleAlign) {
        case 'left':
            return 'low'
        case 'right':
            return 'high'
        default:
            return 'middle'
    }
}