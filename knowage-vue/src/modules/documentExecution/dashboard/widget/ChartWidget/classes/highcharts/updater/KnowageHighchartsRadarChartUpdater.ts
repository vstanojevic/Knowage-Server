import { IHighchartsChartModel } from '@/modules/documentExecution/dashboard/interfaces/highcharts/DashboardHighchartsWidget'
import { getFormattedLegend, getFormattedNoDataConfiguration, getFormattedSeries, setFormattedAxisLabels, setFormattedAxisTitle } from './KnowageHighchartsCommonUpdater'
import * as highchartsDefaultValues from '../../../../WidgetEditor/helpers/chartWidget/highcharts/HighchartsDefaultValues'

export const updateRadarChartModel = (oldModel: any, newModel: IHighchartsChartModel) => {
    console.log('   ----- OLD CHART MODEL: ', oldModel)
    getFormattedNoDataConfiguration(oldModel, newModel)
    getFormattedAxisSettings(oldModel, newModel, 'x')
    getFormattedAxisSettings(oldModel, newModel, 'y')
    getFormattedLegend(oldModel, newModel)
    getFormattedSeries(oldModel, newModel, null)

    console.log('   ----- NEW CHART MODEL: ', newModel)
    return newModel
}


const getFormattedAxisSettings = (oldModel: any, newModel: IHighchartsChartModel, axis: 'x' | 'y') => {
    const oldAxis = axis === 'x' ? oldModel.CHART.AXES_LIST.AXIS[1] : oldModel.CHART.AXES_LIST.AXIS[0]
    const newModelAxis = axis === 'x' ? highchartsDefaultValues.getDefaultRadarXAxis() : highchartsDefaultValues.getDefaultRadarYAxis()
    if (!oldAxis) return
    setFormattedAxisLabels(oldAxis, newModelAxis)
    setFormattedAxisTitle(oldAxis, newModelAxis)

    axis === 'x' ? setXAxisSpecificValues(newModelAxis) : setYAxisSpecificValues(newModelAxis)
    axis === 'x' ? newModel.xAxis = newModelAxis : newModel.yAxis = newModelAxis
}

const setXAxisSpecificValues = (newModelAxis: any) => {
    newModelAxis.type = "category"
}

const setYAxisSpecificValues = (newModelAxis: any) => {
    newModelAxis.plotBands = []
    newModelAxis.plotLines = []
}