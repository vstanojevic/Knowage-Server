<template>
    <div class="kn-page">
        <div class="kn-page-content p-grid p-m-0">
            <div class="kn-page-content p-grid p-m-0">
                <div class="p-col-12 p-p-0">
                    <Toolbar class="kn-toolbar kn-toolbar--primary">
                        <template #start>
                            {{ $t('kpi.kpiEdit.title') }}
                        </template>
                        <template #end>
                            <Button icon="pi pi-save" class="p-button-text p-button-rounded p-button-plain" @click="saveKpi" />
                            <Button icon="pi pi-times" class="p-button-text p-button-rounded p-button-plain" @click="closeKpi" />
                        </template>
                    </Toolbar>
                    <ProgressBar v-if="loading" class="kn-progress-bar" mode="indeterminate" />

                    <KpiEditTypeCard></KpiEditTypeCard>
                    <KpiEditDocumentTypeCard></KpiEditDocumentTypeCard>
                    <KpiEditKpiListCard></KpiEditKpiListCard>
                    <KpiEditStyleCard></KpiEditStyleCard>
                    <KpiEditOptionsCard></KpiEditOptionsCard>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { AxiosResponse } from 'axios'
import { iKpi, iScorecard, iKpiDesigner } from './KpiEdit'
import KpiEditDocumentTypeCard from './KpiEditDocumentTypeCard/KpiEditDocumentTypeCard.vue'
import KpiEditKpiListCard from './KpiEditKpiListCard/KpiEditKpiListCard.vue'
import KpiEditOptionsCard from './KpiEditOptionsCard/KpiEditOptionsCard.vue'
import KpiEditStyleCard from './KpiEditStyleCard/KpiEditStyleCard.vue'
import KpiEditTypeCard from './KpiEditTypeCard/KpiEditTypeCard.vue'

export default defineComponent({
    name: 'kpi-edit',
    components: { KpiEditDocumentTypeCard, KpiEditKpiListCard, KpiEditOptionsCard, KpiEditStyleCard, KpiEditTypeCard },
    props: { id: { type: String } },
    data() {
        return {
            kpiDesigner: {} as iKpiDesigner,
            kpiList: [] as iKpi[],
            scorecards: [] as iScorecard[],
            loading: false
        }
    },
    watch: {
        id() {}
    },
    created() {
        this.loadPage()
    },
    methods: {
        async loadPage() {
            this.loading = true
            await this.loadKpiList()
            await this.loadScorecards()
            this.loading = false
        },
        async loadKpiList() {
            await this.$http.get(process.env.VUE_APP_RESTFUL_SERVICES_PATH + `1.0/kpi/listKpi`).then((response: AxiosResponse<any>) => (this.kpiList = response.data))
            console.log('LOADED KPI LIST: ', this.kpiList)
        },
        async loadScorecards() {
            await this.$http.get(process.env.VUE_APP_RESTFUL_SERVICES_PATH + `1.0/kpiee/listScorecard`).then((response: AxiosResponse<any>) => (this.scorecards = response.data))
            console.log('LOADED SCORECARDS: ', this.scorecards)
        },
        async loadKpi() {
            this.loading = true
            if (this.id) {
                await this.$http.post(process.env.VUE_APP_RESTFUL_SERVICES_PATH + `1.0/kpisTemplate/getKpiTemplate`, { id: this.id }).then((response: AxiosResponse<any>) => (this.kpiDesigner = response.data))
            } else {
                this.kpiDesigner = {} as iKpiDesigner
            }
            this.loading = false
            console.log('LOADED KPI DESIGNER: ', this.kpiDesigner)
        },
        saveKpi() {
            console.log('SAVE KPI!')
        },
        closeKpi() {
            console.log('CLOSE KPI!')
        }
    }
})
</script>
