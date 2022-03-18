<template>
    <Card v-if="data">
        <template #header>
            <Toolbar class="kn-toolbar kn-toolbar--secondary">
                <template #start>
                    {{ $t('kpi.kpiEdit.kpiList') }}
                </template>
            </Toolbar>
        </template>
        <template #content>
            <div>
                {{ data.kpi }}
                <DataTable :value="data.kpi" class="p-datatable-sm kn-table" dataKey="name" v-model:filters="filters" :globalFilterFields="kpiEditKpiListCardDescriptor.globalFilterFields" responsiveLayout="stack" breakpoint="960px" :scrollable="true" scroll-height="60vh">
                    <template #header>
                        <div class="table-header p-d-flex p-ai-center">
                            <span id="search-container" class="p-input-icon-left p-mr-3">
                                <i class="pi pi-search" />
                                <InputText class="kn-material-input" v-model="filters['global'].value" type="text" :placeholder="$t('common.search')" data-test="filterInput" />
                            </span>
                            <Button id="kpi-edit-add-kpi-associations-button" class="kn-button kn-button--primary" :label="$t('kpi.kpiScheduler.addKpiAssociation')" @click="addKpiAssociationVisible = true"></Button>
                        </div>
                    </template>

                    <template #empty>{{ $t('common.info.noDataFound') }}</template>

                    <Column class="kn-truncated" v-for="col of kpiEditKpiListCardDescriptor.columns" :field="col.field" :header="$t(col.header)" :key="col.field" :style="col.style" :sortable="true"> </Column>

                    <Column field="vieweas" :header="$t('kpi.kpiEdit.viewAs')" key="vieweas" :sortable="true" :style="kpiEditKpiListCardDescriptor.columnStyle">
                        <template #body="slotProps">
                            <Dropdown class="kpi-edit-kpi-list-card-dropdown" v-model="slotProps.data[slotProps.column.props.field]" :options="kpiEditKpiListCardDescriptor.viewAsOptions" optionValue="value">
                                <template #value="slotProps">
                                    <div v-if="slotProps.value">
                                        <span>{{ slotProps.value === 'speedometer' ? $t('kpi.kpiEdit.speedometer') : $t('kpi.kpiEdit.kpiCard') }}</span>
                                    </div>
                                </template>
                                <template #option="slotProps">
                                    <span>{{ $t(slotProps.option.label) }}</span>
                                </template>
                            </Dropdown>
                        </template>
                    </Column>

                    <Column field="rangeMinValue" :header="$t('kpi.kpiEdit.rangeMinValue')" key="rangeMinValue" :sortable="true" :style="kpiEditKpiListCardDescriptor.columnStyle">
                        <template #body="slotProps">
                            <span class="p-float-label">
                                <InputText class="kn-material-input" type="number" v-model="slotProps.data[slotProps.column.props.field]" />
                                <label class="kn-material-input-label"> {{ $t('kpi.kpiEdit.rangeMinValue') + ' *' }} </label>
                            </span>
                        </template>
                    </Column>

                    <Column field="rangeMaxValue" :header="$t('kpi.kpiEdit.rangeMaxValue')" key="rangeMaxValue" :sortable="true" :style="kpiEditKpiListCardDescriptor.columnStyle">
                        <template #body="slotProps">
                            <span class="p-float-label">
                                <InputText class="kn-material-input" type="number" v-model="slotProps.data[slotProps.column.props.field]" />
                                <label class="kn-material-input-label"> {{ $t('kpi.kpiEdit.rangeMaxValue') + ' *' }} </label>
                            </span>
                        </template>
                    </Column>

                    <Column field="prefixSuffixValue" :header="$t('kpi.kpiEdit.prefixSuffixLabel')" key="prefixSuffixValue" :sortable="true" :style="kpiEditKpiListCardDescriptor.columnStyle">
                        <template #body="slotProps">
                            <span class="p-float-label">
                                <InputText class="kn-material-input" v-model="slotProps.data[slotProps.column.props.field]" maxLength="3" />
                                <label class="kn-material-input-label"> {{ $t('kpi.kpiEdit.prefixSuffixLabel') }} </label>
                            </span>
                        </template>
                    </Column>

                    <Column field="isSuffix" :header="$t('kpi.kpiEdit.showLabelAs')" key="isSuffix" :sortable="true" :style="kpiEditKpiListCardDescriptor.columnStyle">
                        <template #body="slotProps">
                            <Dropdown class="" v-model="slotProps.data[slotProps.column.props.field]" :options="kpiEditKpiListCardDescriptor.prefixSuffixOptions" optionValue="value">
                                <template #value="slotProps">
                                    <div v-if="slotProps.value">
                                        <span>{{ slotProps.value === 'true' ? $t('kpi.kpiEdit.suffix') : $t('kpi.kpiEdit.prefix') }}</span>
                                    </div>
                                </template>
                                <template #option="slotProps">
                                    <span>{{ $t(slotProps.option.label) }}</span>
                                </template>
                            </Dropdown>
                        </template>
                    </Column>

                    <Column :style="kpiEditKpiListCardDescriptor.iconColumnStyle">
                        <template #body="slotProps">
                            <Button icon="pi pi-trash" class="p-button-link" @click="deleteKpiAssociationConfirm(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>
            </div>

            <KpiEditKpiSelectDialog :kpiList="kpiList" :visible="addKpiAssociationVisible" :data="data" @close="addKpiAssociationVisible = false" @kpiSelected="onKpiSelected"></KpiEditKpiSelectDialog>
        </template>
    </Card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { iKpi, iKpiListItem } from '../KpiEdit'
import { filterDefault } from '@/helpers/commons/filterHelper'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import Dropdown from 'primevue/dropdown'
import kpiEditKpiListCardDescriptor from './KpiEditKpiListCardDescriptor.json'
import KpiEditKpiSelectDialog from './KpiEditKpiSelectDialog.vue'

export default defineComponent({
    name: 'kpi-edit-kpi-list-card',
    components: { Column, DataTable, Dropdown, KpiEditKpiSelectDialog },
    props: { propData: { type: Object }, kpiList: { type: Array as PropType<iKpi[]> } },
    data() {
        return {
            kpiEditKpiListCardDescriptor,
            data: { kpi: [] } as { kpi: iKpiListItem[] },
            filters: { global: [filterDefault] } as Object,
            addKpiAssociationVisible: false
        }
    },
    watch: {
        propData() {
            this.loadData()
        }
    },
    created() {
        this.loadData()
    },
    methods: {
        loadData() {
            this.data = this.propData as { kpi: iKpiListItem[] }
            console.log(' >>> LOADED DATA: ', this.data)
        },
        onKpiSelected(selectedKpi: iKpi[]) {
            console.log('SELECTED KPI: ', selectedKpi)
            this.data.kpi = []
            selectedKpi.forEach((kpi: iKpi) =>
                this.data.kpi.push({
                    isSuffix: 'false',
                    name: kpi.name,
                    prefixSuffixValue: '',
                    rangeMaxValue: '',
                    rangeMinValue: '',
                    vieweas: 'Speedometer',
                    category: kpi.category ? kpi.category.valueName : ''
                })
            )
            this.addKpiAssociationVisible = false
        },
        deleteKpiAssociationConfirm(kpi: iKpiListItem) {
            console.log('DELETE CONFIRM FOR: ', kpi)
        }
    }
})
</script>

<style lang="scss" scoped>
#kpi-edit-add-kpi-associations-button {
    flex: 0.15;
    height: 2.3rem;
    margin-left: auto;
    min-width: 150px;
}

.kpi-edit-kpi-list-card-dropdown {
    min-width: 150px;
    max-width: 200px;
}
</style>
