import { AxiosResponse } from "axios"

export async function getKpiTemplate(documentId: string, $http: any) {
    let kpiTemplate = null
    if (documentId) {
        await $http
            .post(process.env.VUE_APP_KPI_ENGINE_API_URL + `1.0/kpisTemplate/getKpiTemplate`, { id: documentId })
            .then((response: AxiosResponse<any>) => {
                kpiTemplate = response.data.templateContent ? JSON.parse(response.data.templateContent) : response.data
            })
            .catch(() => { })
        return kpiTemplate
    }
}