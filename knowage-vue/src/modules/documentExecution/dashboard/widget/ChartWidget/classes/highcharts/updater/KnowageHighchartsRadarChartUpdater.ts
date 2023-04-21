import { IHighchartsChartModel } from '@/modules/documentExecution/dashboard/interfaces/highcharts/DashboardHighchartsWidget'
import { getFormattedNoDataConfiguration } from './KnowageHighchartsCommonUpdater'
import * as highchartsDefaultValues from '../../../../WidgetEditor/helpers/chartWidget/highcharts/HighchartsDefaultValues'
import { hexToRgba } from '@/modules/documentExecution/dashboard/helpers/FormattingHelpers'

export const updateRadarChartModel = (oldModel: any, newModel: IHighchartsChartModel) => {
    console.log('   ----- OLD CHART MODEL: ', oldModel)
    getFormattedNoDataConfiguration(oldModel, newModel)
    // TODO - Move to common updater ???
    getFormattedAxisSettings(oldModel, newModel, 'x')
    getFormattedAxisSettings(oldModel, newModel, 'y')
    //getFormattedLegend(oldModel, newModel)
    // getFormattedLabels(oldModel, newModel)
    // getFormattedSeries(oldModel, newModel, 1)
    // getFormattedTooltipSettings(oldModel, newModel)

    console.log('   ----- NEW CHART MODEL: ', newModel)
    return newModel
}


const getFormattedAxisSettings = (oldModel: any, newModel: IHighchartsChartModel, axis: 'x' | 'y') => {
    const oldAxis = axis === 'x' ? oldModel.CHART.AXES_LIST.AXIS[1] : oldModel.CHART.AXES_LIST.AXIS[0]
    const newModelAxis = axis === 'x' ? highchartsDefaultValues.getDefaultHeatmapXAxis() : highchartsDefaultValues.getDefaultHeatmapYAxis()
    if (!oldAxis) return
    setFormattedAxisLabels(oldAxis, newModelAxis)
    setFormattedAxisTitle(oldAxis, newModelAxis)
    axis === 'x' ? newModel.xAxis = newModelAxis : newModel.yAxis = newModelAxis
}

const setFormattedAxisLabels = (oldAxis: any, newModelAxis: any) => {
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

const setFormattedAxisTitle = (oldAxis: any, newModelAxis: any) => {
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