<template>
    <Card v-if="chart" class="p-m-2">
        <template #header>
            <Toolbar class="kn-toolbar kn-toolbar--secondary">
                <template #start>
                    {{ $t('kpi.kpiEdit.typeOfDocument') }}
                </template>
            </Toolbar>
        </template>
        <template #content>
            <div class=" p-d-flex p-flex-row">
                <div class="field-radiobutton p-mx-2" v-for="(option, index) in kpiEditDocumentTypeCardDescriptor.documentTypeOptions" :key="index">
                    <RadioButton :id="option.value" :value="option.value" v-model="chart.model" @change="$emit('documentTypeChanged')"></RadioButton>
                    <label :for="option.value" class="p-ml-2">{{ $t(option.label) }}</label>
                </div>
            </div>
        </template>
    </Card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { iChart } from '../KpiEdit'
import Card from 'primevue/card'
import RadioButton from 'primevue/radiobutton'
import kpiEditDocumentTypeCardDescriptor from './KpiEditDocumentTypeCardDescriptor.json'

export default defineComponent({
    name: 'kpi-edit-document-type-card',
    components: { Card, RadioButton },
    props: { propChart: { type: Object as PropType<iChart> } },
    emits: ['documentTypeChanged'],
    data() {
        return {
            kpiEditDocumentTypeCardDescriptor,
            chart: null as iChart | null
        }
    },
    watch: {
        propChart() {
            this.loadChart()
        }
    },
    created() {
        this.loadChart()
    },
    methods: {
        loadChart() {
            this.chart = this.propChart as iChart
        }
    }
})
</script>
