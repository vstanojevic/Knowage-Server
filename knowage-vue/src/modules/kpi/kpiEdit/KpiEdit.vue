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
                            <Button icon="pi pi-save" class="p-button-text p-button-rounded p-button-plain" :disabled="saveButtonDisabled" @click="saveKpi" />
                            <Button icon="pi pi-times" class="p-button-text p-button-rounded p-button-plain" @click="closeKpi" />
                        </template>
                    </Toolbar>
                    <ProgressBar v-if="loading" class="kn-progress-bar" mode="indeterminate" />

                    <div v-if="kpiDesigner" class="p-grid">
                        {{ kpiDesigner }}
                        <KpiEditTypeCard v-if="showScorecards" class="p-col-12" :chartType="kpiDesigner.chart.type" @typeChanged="onTypeChanged"></KpiEditTypeCard>
                        <KpiEditDocumentTypeCard v-if="kpiDesigner.chart.type === 'kpi'" class="p-col-12" :propChart="kpiDesigner.chart"></KpiEditDocumentTypeCard>
                        <KpiEditKpiListCard :propData="kpiDesigner.chart.data" :kpiList="kpiList" :documentType="kpiDesigner.chart.model" class="p-col-12"></KpiEditKpiListCard>
                        <div class="p-grid p-col-12">
                            <KpiEditStyleCard :class="{ 'p-col-6': kpiDesigner.chart.type === 'kpi', 'p-col-12': kpiDesigner.chart.type !== 'kpi' }" :propStyle="kpiDesigner.chart.style"></KpiEditStyleCard>
                            <KpiEditOptionsCard v-if="kpiDesigner.chart.type === 'kpi'" class="p-col-6" :propOptions="kpiDesigner.chart.options"></KpiEditOptionsCard>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <KpiEditSaveDialog :visible="saveDialogVisible" @close="saveDialogVisible = false" @saveKpi="onKpiSave"></KpiEditSaveDialog>
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
import KpiEditSaveDialog from './KpiEditSaveDialog/KpiEditSaveDialog.vue'

export default defineComponent({
    name: 'kpi-edit',
    components: { KpiEditDocumentTypeCard, KpiEditKpiListCard, KpiEditOptionsCard, KpiEditStyleCard, KpiEditTypeCard, KpiEditSaveDialog },
    props: { id: { type: String } },
    data() {
        return {
            kpiDesigner: null as iKpiDesigner | null,
            kpiList: [] as iKpi[],
            scorecards: [] as iScorecard[],
            saveDialogVisible: false,
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
        },
        saveButtonDisabled(): boolean | null {
            return this.kpiDesigner && (this.kpiDesigner.chart.data.kpi.length === 0 || this.kpiMissingRequiredField())
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
                await this.$http.post(process.env.VUE_APP_KPI_ENGINE_API_URL + `1.0/kpisTemplate/getKpiTemplate`, { id: this.id }).then((response: AxiosResponse<any>) => {
                    this.kpiDesigner = JSON.parse(response.data.templateContent)
                    this.formatKpiDesigner()
                })
            } else {
                this.kpiDesigner = this.initializeKpiDesigner()
            }
            this.loading = false
            console.log('LOADED KPI DESIGNER: ', this.kpiDesigner)
        },
        formatKpiDesigner() {
            if (!this.kpiDesigner) return

            this.kpiDesigner.chart.style.font.size = this.getPixelsInEm(this.kpiDesigner.chart.style.font.size)
        },
        getPixelsInEm(pixels: string | number) {
            switch (pixels) {
                case '8px':
                    return '.6rem'
                case '10px':
                    return '.8rem'
                case '14px':
                    return '1rem'
                case '16px':
                    return '1.1rem'
                case '18px':
                    return '1.3rem'
                case '24px':
                    return '1.8rem'
                case '40px':
                    return '3rem'
                default:
                    return ''
            }
        },
        initializeKpiDesigner() {
            return {
                chart: {
                    type: 'kpi',
                    model: 'list',
                    data: { kpi: [] },
                    style: { font: { color: 'rgb(14,13,13)', fontFamily: 'roboto', fontWeight: 'normal', size: '.6rem' } },
                    options: {
                        showtarget: true,
                        showtargetpercentage: false,
                        showthreshold: true,
                        showvalue: true,
                        vieweas: '',
                        history: {
                            size: 1,
                            units: 'month'
                        }
                    }
                }
            } as iKpiDesigner
        },
        onTypeChanged(value: string) {
            if (this.kpiDesigner) this.kpiDesigner.chart.type = value
        },
        kpiMissingRequiredField(): boolean {
            if (!this.kpiDesigner) return false

            let missingField = false
            for (let i = 0; i < this.kpiDesigner.chart.data.kpi.length; i++) {
                const tempKpi = this.kpiDesigner.chart.data.kpi[i]
                if (!tempKpi.rangeMinValue || !tempKpi.rangeMaxValue) {
                    missingField = true
                    break
                }
            }

            return missingField
        },
        saveKpi() {
            console.log('SAVE KPI!')
            this.saveDialogVisible = true
        },
        async onKpiSave(kpiName: string) {
            this.loading = true
            const postData = {
                document: {
                    name: kpiName,
                    label: kpiName,
                    description: '',
                    type: 'KPI'
                },
                customData: {
                    templateContent: this.kpiDesigner
                },
                action: 'DOC_SAVE'
            }
            await this.$http
                .post(process.env.VUE_APP_RESTFUL_SERVICES_PATH + `2.0/saveDocument`, postData)
                .then((response: AxiosResponse<any>) => {
                    this.$store.commit('setInfo', {
                        title: this.$t('common.toast.createTitle'),
                        msg: this.$t('common.toast.success')
                    })
                    if (this.kpiDesigner) this.kpiDesigner.id = response.data.id
                })
                .finally(() => (this.saveDialogVisible = false))
            this.loading = false
        },
        closeKpi() {
            console.log('CLOSE KPI!')
        }
    }
})
</script>
