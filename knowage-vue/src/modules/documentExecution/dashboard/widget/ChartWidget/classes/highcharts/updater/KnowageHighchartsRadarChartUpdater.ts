import { IHighchartsChartModel } from '@/modules/documentExecution/dashboard/interfaces/highcharts/DashboardHighchartsWidget'


export const updateRadarChartModel = (oldModel: any, newModel: IHighchartsChartModel) => {
    console.log('   ----- OLD CHART MODEL: ', oldModel)
    // getFormattedNoDataConfiguration(oldModel, newModel)
    //getFormattedLegend(oldModel, newModel)
    // getFormattedLabels(oldModel, newModel)
    // getFormattedSeries(oldModel, newModel, 1)
    // getFormattedTooltipSettings(oldModel, newModel)

    console.log('   ----- NEW CHART MODEL: ', newModel)
    return newModel
}
