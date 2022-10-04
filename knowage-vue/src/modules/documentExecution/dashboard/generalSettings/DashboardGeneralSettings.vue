<template>
    <Teleport to=".dashboard-container">
        <div class="dashboardEditor">
            <Toolbar class="kn-toolbar kn-toolbar--primary">
                <template #start> {{ $t('dashboard.generalSettings.title') }} </template>
                <template #end>
                    <Button icon="pi pi-save" class="p-button-text p-button-rounded p-button-plain" @click="saveGeneralSettings" />
                    <Button icon="pi pi-times" class="p-button-text p-button-rounded p-button-plain" @click="$emit('closeGeneralSettings')" />
                </template>
            </Toolbar>

            <div class="p-grid p-m-0 p-p-0">
                <DashboardGeneralSettingsList class="p-col-3" @selectedOption="setSelectedOption"></DashboardGeneralSettingsList>
                <DashboardVariables v-if="selectedOption === 'Variables'" class="p-col-9" :propVariables="variables" :selectedDatasets="selectedDatasets" :selectedDatasetColumnNameMap="selectedDatasetColumnNameMap" :drivers="drivers" :profileAttributes="profileAttributes"></DashboardVariables>
            </div>
        </div>
    </Teleport>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { IVariable, IModelDataset, IDataset } from '@/modules/documentExecution/dashboard/Dashboard'
import { mapActions } from 'pinia'
import DashboardGeneralSettingsList from './DashboardGeneralSettingsList.vue'
import DashboardVariables from './DashboardVariables.vue'
import store from '@/modules/documentExecution/dashboard/Dashboard.store.js'
import mainStore from '@/App.store'
import deepcopy from 'deepcopy'

export default defineComponent({
    name: 'dashboard-general-settings',
    components: { DashboardGeneralSettingsList, DashboardVariables },
    props: { datasets: { type: Array as PropType<IDataset[]> }, documentDrivers: { type: Array }, profileAttributes: { type: Array as PropType<{ name: string; value: string }[]>, required: true } },
    emits: ['closeGeneralSettings'],
    data() {
        return {
            selectedOption: '' as string,
            dashboardModel: null as any,
            variables: [] as IVariable[],
            selectedDatasets: [] as IModelDataset[],
            selectedDatasetColumnNameMap: {},
            drivers: [] as any[]
        }
    },
    watch: {},
    computed: {},
    created() {
        this.loadDashboardModel()
        this.loadVariables()
        this.loadSelectedDatasets()
        this.loadSelectedDatasetColumnNames()
    },
    methods: {
        ...mapActions(store, ['getDashboard']),
        ...mapActions(mainStore, ['getUser']),
        loadDashboardModel() {
            // TODO - Remove hardcoded id
            this.dashboardModel = this.getDashboard(1)
        },
        loadVariables() {
            if (this.dashboardModel && this.dashboardModel.configuration) this.variables = deepcopy(this.dashboardModel.configuration.variables)
        },
        loadSelectedDatasets() {
            if (this.dashboardModel && this.dashboardModel.configuration) this.selectedDatasets = deepcopy(this.dashboardModel.configuration.datasets)
        },
        loadSelectedDatasetColumnNames() {
            if (!this.datasets || this.datasets.length === 0) return
            this.datasets.forEach((dataset: IDataset) => this.loadSelectedDatasetColumnName(dataset))
        },
        loadSelectedDatasetColumnName(dataset: IDataset) {
            this.selectedDatasetColumnNameMap[dataset.name] = []
            for (let i = 0; i < dataset.metadata.fieldsMeta.length; i++) {
                this.selectedDatasetColumnNameMap[dataset.name].push(dataset.metadata.fieldsMeta[i].name)
            }
        },
        loadDrivers() {
            // TODO - remove mock
            this.drivers = [
                {
                    name: 'Driver 1',
                    type: 'static',
                    multivalue: false,
                    value: 'Driver 1'
                },
                {
                    name: 'Driver 2',
                    type: 'dynamic',
                    multivalue: false,
                    value: 'Driver 2'
                }
            ]
        },
        setSelectedOption(option: string) {
            this.selectedOption = option
        },
        saveGeneralSettings() {}
    }
})
</script>
<style lang="scss">
.dashboardEditor {
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    background-color: white;
    position: absolute;
    z-index: 999;
    display: flex;
    flex-direction: column;
    .datasetEditor-container {
        flex: 1;
        display: flex;
    }
}
</style>
