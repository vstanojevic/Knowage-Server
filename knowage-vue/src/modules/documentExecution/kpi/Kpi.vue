<template>
    <div v-if="kpi">
        <h1>IT WORKS</h1>
        <div v-for="(infoItem, index) in kpi.info" :key="index">
            <template v-if="infoItem.scorecard">
                <KnPerspectiveCard class="p-m-4" v-for="(perspective, index) in infoItem.scorecard.perspectives" :key="index" :mode="'execution'" :propPerspective="perspective"></KnPerspectiveCard>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { AxiosResponse } from 'axios'
import { iKpiDesigner } from '@/modules/kpi/kpiDocumentDesigner/KpiDocumentDesigner'
import KnPerspectiveCard from '@/components/UI/KnPerspectiveCard/KnPerspectiveCard.vue'

export default defineComponent({
    name: 'kpi',
    components: { KnPerspectiveCard },
    props: { id: { type: String }, documentId: { type: String }, reloadTrigger: { type: Boolean }, kpiTemplate: { type: Object as PropType<iKpiDesigner | null>, required: true } },
    data() {
        return {
            template: null as iKpiDesigner | null,
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
            this.loadKpiTemplate()
            await this.readKpiTemplate()
            this.$store.commit('setLoading', false)
        },
        loadKpiTemplate() {
            this.template = this.kpiTemplate
            console.log(' >>> LOADED KPI TEMPLATE: ', this.template)
        },
        async readKpiTemplate() {
            if (this.template) {
                await this.$http
                    .post(process.env.VUE_APP_KPI_ENGINE_API_URL + `1.0/jsonKpiTemplate/readKpiTemplate`, this.template)
                    .then((response: AxiosResponse<any>) => (this.kpi = response.data))
                    .catch(() => {})
                console.log(' >>> LOADED KPI: ', this.kpi)
            }
        }
    }
})
</script>
