<template>
    <Toolbar class="kn-toolbar kn-toolbar--primary">
        <template #left>
            {{ $t('managers.schedulationAgendaManagement.title') }}
        </template>
    </Toolbar>
    <ProgressBar mode="indeterminate" class="kn-progress-bar" v-if="loading" data-test="progress-bar" />
    <div :style="schedulationAgendaDescriptor.hCard.style">
        <Card>
            <template #content>
                <div class="p-d-flex p-ai-center p-mt-2">
                    <div class="p-d-flex">
                        <label for="startDate" class="kn-material-input-label p-m-2"> {{ $t('managers.schedulationAgendaManagement.detail.startDate') + ':' }}</label>
                        <span>
                            <Calendar id="startDate" class="kn-material-input" v-model="startDate" :showIcon="true" :manualInput="false" @date-select="setDateTime('startDate')" :minDate="minStartDate" data-test="start-date" />
                        </span>
                    </div>

                    <div class="p-d-flex p-ai-center">
                        <label for="startTime" class="kn-material-input-label p-m-2"> {{ $t('managers.schedulationAgendaManagement.detail.startTime') + ':' }}</label>
                        <span>
                            <Calendar id="startTime" class="kn-material-input" v-model="startTime" :manualInput="false" :timeOnly="true" hourFormat="24" :inline="true" @date-select="setDateTime('startTime')" data-test="start-time" />
                        </span>
                    </div>

                    <div class="p-d-flex">
                        <label for="endDate" class="kn-material-input-label p-m-2"> {{ $t('managers.schedulationAgendaManagement.detail.endDate') + ':' }}</label>
                        <span>
                            <Calendar id="endDate" class="kn-material-input" v-model="endDate" :showIcon="true" :manualInput="false" @date-select="setDateTime('endDate')" data-test="end-date" />
                        </span>
                    </div>

                    <div class="p-col-2 p-d-flex p-ai-center">
                        <label for="endTime" class="kn-material-input-label p-m-2"> {{ $t('managers.schedulationAgendaManagement.detail.endTime') + ':' }}</label>
                        <span>
                            <Calendar id="endTime" class="kn-material-input" v-model="endTime" :manualInput="false" :timeOnly="true" hourFormat="24" :inline="true" @date-select="setDateTime('endTime')" data-test="end-time" />
                        </span>
                    </div>

                    <div class="p-d-flex p-ai-center">
                        <div class="p-col-3">
                            <label for="package" class="kn-material-input-label"> {{ $t('managers.schedulationAgendaManagement.detail.package') }} </label>
                            <InputText v-model="selectedPackageName" id="package" class="kn-material-input" type="text" data-test="package-input" @click="showForm('packageForm')" :readonly="true" />
                        </div>
                    </div>

                    <div class="p-d-flex p-ai-center">
                        <div class="p-col-3">
                            <label for="document" class="kn-material-input-label"> {{ $t('managers.schedulationAgendaManagement.detail.document') }} </label>
                            <InputText v-model="selectedDocumentName" id="document" class="kn-material-input" type="text" data-test="document-input" @click="showForm('documentForm')" :readonly="true" />
                        </div>
                    </div>

                    <div class="p-d-flex p-ai-center">
                        <div class="p-col-3">
                            <Button class="p-button-text kn-button" :label="$t('managers.schedulationAgendaManagement.common.search')" @click="runSearch" data-test="search-button" />
                        </div>
                    </div>
                </div>
                <div class="kn-page-content p-grid p-m-0">
                    <div v-if="packageFormVisible">
                        <SchedulationAgendaDialog :itemList="packageList" :model="selectedPackage" :title="$t('managers.schedulationAgendaManagement.packageTypes.title')" @changed="selectedPackageChanged($event)" @close="closeForm" data-test="package-schedulation-form"></SchedulationAgendaDialog>
                    </div>
                    <div v-if="documentFormVisible">
                        <SchedulationAgendaDialog
                            :itemList="documentList"
                            :model="selectedDocument"
                            :title="$t('managers.schedulationAgendaManagement.documentTypes.title')"
                            @changed="selectedDocumentChanged($event)"
                            @close="closeForm"
                            data-test="document-schedulation-form"
                        ></SchedulationAgendaDialog>
                    </div>
                </div>
            </template>
        </Card>
    </div>
    <div class="p-col-12 p-sm-12 p-md-12 p-p-0 p-m-0 kn-router-view">
        <router-view :itemList="schedulations" />
    </div>
</template>

<script lang="ts">
import axios from 'axios'
import { defineComponent } from 'vue'
import { iDataItem } from './SchedulationAgenda'
import { formatDate } from '@/helpers/commons/localeHelper'
import Calendar from 'primevue/calendar'
import Card from 'primevue/card'
import Toolbar from 'primevue/toolbar'
import ProgressBar from 'primevue/progressbar'
import schedulationAgendaDescriptor from './SchedulationAgendaDescriptor.json'
import SchedulationAgendaDialog from './SchedulationAgendaDialog.vue'

export default defineComponent({
    name: 'schedulation-agenda',
    components: {
        Calendar,
        Card,
        Toolbar,
        ProgressBar,
        SchedulationAgendaDialog
    },
    data() {
        return {
            schedulationAgendaDescriptor: schedulationAgendaDescriptor,
            schedulations: [] as any,
            selectedPackage: null as iDataItem | null,
            selectedDocument: null as iDataItem | null,
            selectedPackageName: '',
            selectedDocumentName: '',
            packageFormVisible: false,
            documentFormVisible: false,
            packageList: [] as iDataItem[],
            documentList: [] as iDataItem[],
            loading: false,
            startDate: null as Date | null,
            startTime: null as Date | null,
            endDate: null as Date | null,
            endTime: null as Date | null,
            startDateTime: null as Date | null,
            endDateTime: null as Date | null
        }
    },
    computed: {
        minStartDate() {
            return new Date()
        }
    },
    created() {
        this.loadPackages()
        this.loadDocuments()
    },
    watch: {
        selectedPackage() {
            if (this.selectedPackage) this.selectedPackageName = this.selectedPackage.name
        },
        selectedDocument() {
            if (this.selectedDocument) this.selectedDocumentName = this.selectedDocument.name
        }
    },
    methods: {
        async loadPackages() {
            this.loading = true
            await axios
                .get(process.env.VUE_APP_RESTFUL_SERVICES_PATH + '/scheduleree/listAllJobs')
                .then((response) => {
                    let rawList = response.data.root
                    let filteredList = rawList.filter((x) => x.jobGroup == 'BIObjectExecutions')

                    filteredList.map((item: any) => {
                        this.packageList.push({
                            id: item.jobName,
                            name: item.jobName,
                            description: item.jobDescription
                        } as iDataItem)
                    })
                })
                .finally(() => (this.loading = false))
        },
        async loadDocuments() {
            this.loading = true
            await axios
                .get(process.env.VUE_APP_RESTFUL_SERVICES_PATH + '2.0/documents')
                .then((response) => {
                    this.documentList = response.data
                })
                .finally(() => (this.loading = false))
        },
        showForm(formType) {
            switch (formType) {
                case 'packageForm':
                    this.packageFormVisible = true
                    break
                case 'documentForm':
                    this.documentFormVisible = true
                    break
            }
        },
        closeForm() {
            if (this.packageFormVisible) this.packageFormVisible = false
            if (this.documentFormVisible) this.documentFormVisible = false
        },
        selectedPackageChanged(dataItem: any) {
            this.selectedPackage = dataItem
            console.log('selectedPackageChanged ', this.selectedPackage)
        },
        selectedDocumentChanged(dataItem: any) {
            this.selectedDocument = dataItem
            console.log('selectedDocument ', this.selectedDocument)
        },
        async runSearch() {
            this.loading = true
            await axios
                .get(process.env.VUE_APP_RESTFUL_SERVICES_PATH + `scheduleree/nextExecutions?start=${this.formatDateTime(this.startDateTime)}&end=${this.formatDateTime(this.endDateTime)}`)
                .then((response) => {
                    this.schedulations = response.data.root
                })
                .finally(() => (this.loading = false))

            this.$router.push('/schedulation-agenda/search-result')
        },
        setDateTime(type: string) {
            if (!this.startDateTime) this.startDateTime = new Date()
            if (!this.endDateTime) this.endDateTime = new Date()

            switch (type) {
                case 'startDate':
                    if (this.startDate) {
                        this.startDateTime.setFullYear(this.startDate.getFullYear())
                        this.startDateTime.setMonth(this.startDate.getMonth())
                        this.startDateTime.setDate(this.startDate.getDate())
                    }
                    break
                case 'startTime':
                    if (this.startTime) {
                        this.startDateTime.setHours(this.startTime.getHours())
                        this.startDateTime.setMinutes(this.startTime.getMinutes())
                    }
                    break
                case 'endDate':
                    if (this.endDate) {
                        this.endDateTime.setFullYear(this.endDate.getFullYear())
                        this.endDateTime.setMonth(this.endDate.getMonth())
                        this.endDateTime.setDate(this.endDate.getDate())
                    }
                    break
                case 'endTime':
                    if (this.endTime) {
                        this.endDateTime.setHours(this.endTime.getHours())
                        this.endDateTime.setMinutes(this.endTime.getMinutes())
                    }
                    break
            }
        },
        formatDateTime(date: any) {
            return formatDate(date, 'YYYY-MM-DDTHH:MM:SS')
        }
    }
})
</script>
