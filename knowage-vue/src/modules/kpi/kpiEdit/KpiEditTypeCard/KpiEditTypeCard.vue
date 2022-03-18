<template>
    <Card>
        <template #content>
            <div class=" p-d-flex p-flex-row">
                <div class="field-radiobutton p-mx-2" v-for="(option, index) in kpiEditTypeCardDescriptor.typeOptions" :key="index">
                    <RadioButton :id="option.value" :value="option.value" v-model="type" @change="onTypeChange"></RadioButton>
                    <label :for="option.value" class="p-ml-2">{{ $t(option.label) }}</label>
                </div>
            </div>
        </template>
    </Card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Card from 'primevue/card'
import RadioButton from 'primevue/radiobutton'
import kpiEditTypeCardDescriptor from './KpiEditTypeCardDescriptor.json'

export default defineComponent({
    name: 'kpi-edit-type-card',
    components: { Card, RadioButton },
    props: { chartType: { type: String } },
    emits: ['typeChanged'],
    data() {
        return {
            kpiEditTypeCardDescriptor,
            type: 'kpi' as string
        }
    },
    watch: {
        chartType() {
            this.loadType()
        }
    },
    created() {
        this.loadType()
    },
    methods: {
        loadType() {
            this.type = this.chartType as string
        },
        onTypeChange() {
            this.$emit('typeChanged', this.type)
        }
    }
})
</script>
