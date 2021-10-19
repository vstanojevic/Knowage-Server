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
                            <Calendar id="startDate" class="kn-material-input" v-model="startDateTime" :showIcon="true" :manualInput="false" :minDate="minStartDate" data-test="start-date" />
                        </span>
                    </div>

                    <div class="p-d-flex p-ai-center">
                        <label for="startTime" class="kn-material-input-label p-m-2"> {{ $t('managers.schedulationAgendaManagement.detail.startTime') + ':' }}</label>
                        <span>
                            <Calendar id="startTime" class="kn-material-input" v-model="startDateTime" :manualInput="false" :timeOnly="true" hourFormat="24" :inline="true" data-test="start-time" />
                        </span>
                    </div>

                    <div class="p-d-flex">
                        <label for="endDate" class="kn-material-input-label p-m-2"> {{ $t('managers.schedulationAgendaManagement.detail.endDate') + ':' }}</label>
                        <span>
                            <Calendar id="endDate" class="kn-material-input" v-model="endDateTime" :showIcon="true" :manualInput="false" data-test="end-date" />
                        </span>
                    </div>

                    <div class="p-col-2 p-d-flex p-ai-center">
                        <label for="endTime" class="kn-material-input-label p-m-2"> {{ $t('managers.schedulationAgendaManagement.detail.endTime') + ':' }}</label>
                        <span>
                            <Calendar id="endTime" class="kn-material-input" v-model="endDateTime" :manualInput="false" :timeOnly="true" hourFormat="24" :inline="true" data-test="end-time" />
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
                    <h1></h1>
                </div>
                <div class="kn-page-content p-grid p-m-0">
                    <div v-if="displayFormType == 'packageForm'">
                        <SchedulationAgendaDialog :itemList="packageList" :model="selectedPackage" :title="$t('managers.schedulationAgendaManagement.packageTypes.title')" @changed="selectedPackageChanged($event)" @close="closeForm" data-test="package-schedulation-form"></SchedulationAgendaDialog>
                    </div>
                    <div v-if="displayFormType == 'documentForm'">
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
            packageList: [] as iDataItem[],
            documentList: [] as iDataItem[],
            loading: false,
            startDateTime: null as Date | null,
            endDateTime: null as Date | null,
            displayFormType: ''
        }
    },
    computed: {
        minStartDate() {
            return new Date()
        }
    },
    created() {
        this.startDateTime = new Date()
        this.endDateTime = new Date()
        this.endDateTime.setDate(this.endDateTime.getDate() + 7)

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
            this.displayFormType = formType
        },
        closeForm() {
            this.displayFormType = ''
        },
        selectedPackageChanged(dataItem: any) {
            this.selectedPackage = dataItem
        },
        selectedDocumentChanged(dataItem: any) {
            this.selectedDocument = dataItem
        },
        runSearch() {
            this.loading = true

            let path = process.env.VUE_APP_RESTFUL_SERVICES_PATH + `scheduleree/nextExecutions?start=${this.formatDateTime(this.startDateTime)}&end=${this.formatDateTime(this.endDateTime)}`
            if (this.selectedPackage) {
                path += `&jobPackageName=${this.selectedPackage.id}`
            }
            if (this.selectedDocument) {
                path += `&document=${this.selectedDocument.label}`
            }
            axios
                .get(path)
                .then((response) => {
                    this.schedulations = response.data.root
                })
                .finally(() => (this.loading = false))

            this.$router.push('/schedulation-agenda/search-result')
        },
        formatDateTime(date: any) {
            return formatDate(date, 'YYYY-MM-DDTHH:MM:SS')
        }
    }
})
</script>
