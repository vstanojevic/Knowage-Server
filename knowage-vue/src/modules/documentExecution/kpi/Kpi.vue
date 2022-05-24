<template>
    <h1>IT WORKS</h1>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { AxiosResponse } from 'axios'
import { iKpiDesigner } from '@/modules/kpi/kpiDocumentDesigner/KpiDocumentDesigner'

export default defineComponent({
    name: 'kpi',
    components: {},
    props: { id: { type: String }, documentId: { type: String }, reloadTrigger: { type: Boolean } },
    data() {
        return {
            kpiDesigner: null as iKpiDesigner | null,
            kpi: null as any
        }
    },
    watch: {
        async id() {
            await this.loadPage()
        },
        async reloadTrigger() {
            await this.loadPage()
        }
    },
    async created() {
        await this.loadPage()
    },
    methods: {
        async loadPage() {
            this.$store.commit('setLoading', true)
            console.log('LOADED ID: ', this.id)
            console.log('LOADED DOCUMENT ID: ', this.documentId)
            await this.loadKpi()
            await this.readKpiTemplate()
            this.$store.commit('setLoading', false)
        },
        async loadKpi() {
            if (this.documentId) {
                await this.$http
                    .post(process.env.VUE_APP_KPI_ENGINE_API_URL + `1.0/kpisTemplate/getKpiTemplate`, { id: this.documentId })
                    .then((response: AxiosResponse<any>) => {
                        this.kpiDesigner = response.data.templateContent ? JSON.parse(response.data.templateContent) : response.data
                    })
                    .catch(() => {})
                console.log('LOADED KPI DESIGNER: ', this.kpiDesigner)
            }
        },
        async readKpiTemplate() {
            if (this.kpiDesigner) {
                await this.$http
                    .post(process.env.VUE_APP_KPI_ENGINE_API_URL + `1.0/jsonKpiTemplate/readKpiTemplate`, this.kpiDesigner)
                    .then((response: AxiosResponse<any>) => (this.kpi = response.data))
                    .catch(() => {})
                console.log('LOADED KPI: ', this.kpi)
            }
        }
    }
})
</script>
