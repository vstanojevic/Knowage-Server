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

                    <div v-if="kpiDesigner" class="p-grid">
                        {{ kpiDesigner }}
                        <KpiEditTypeCard v-if="showScorecards" class="p-col-12" :chartType="kpiDesigner.chart.type" @typeChanged="onTypeChanged"></KpiEditTypeCard>
                        <KpiEditDocumentTypeCard v-if="kpiDesigner.chart.type === 'kpi'" class="p-col-12" :propChart="kpiDesigner.chart"></KpiEditDocumentTypeCard>
                        <KpiEditKpiListCard :propData="kpiDesigner.chart.data" :kpiList="kpiList" class="p-col-12"></KpiEditKpiListCard>
                        <div class="p-grid p-col-12">
                            <KpiEditStyleCard class="p-col-6" :propStyle="kpiDesigner.chart.style"></KpiEditStyleCard>
                            <KpiEditOptionsCard class="p-col-6"></KpiEditOptionsCard>
                        </div>
                    </div>
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
            kpiDesigner: null as iKpiDesigner | null,
            kpiList: [] as iKpi[],
            scorecards: [] as iScorecard[],
            loading: false
        }
    },
    watch: {
        async id() {
            await this.loadKpi()
        }
    },
    computed: {
        showScorecards(): boolean {
            return (this.$store.state as any).user.functionalities.includes('ScorecardsManagement')
        }
    },
    created() {
        this.loadPage()
    },
    methods: {
        async loadPage() {
            this.loading = true
            await this.loadKpi()
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
                this.kpiDesigner = this.initializeKpiDesigner()
            }
            this.loading = false
            console.log('LOADED KPI DESIGNER: ', this.kpiDesigner)
        },
        initializeKpiDesigner() {
            return {
                chart: {
                    type: 'kpi',
                    model: 'list',
                    data: { kpi: [] },
                    style: { font: { color: '', fontFamily: 'roboto', fontWeight: '', size: '.6rem' } },
                    options: {
                        showtarget: '',
                        showtargetpercentage: '',
                        showthreshold: '',
                        showvalue: '',
                        vieweas: '',
                        history: {
                            size: '',
                            units: ''
                        }
                    }
                }
            } as iKpiDesigner
        },
        onTypeChanged(value: string) {
            if (this.kpiDesigner) this.kpiDesigner.chart.type = value
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
