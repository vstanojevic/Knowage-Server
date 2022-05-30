<template>
    <Dialog id="kn-perspective-kpi-list-dialog" class="p-fluid kn-dialog--toolbar--primary" :style="descriptor.style.dialog" :visible="visible" :modal="true" :closable="false">
        <template #header>
            <Toolbar class="kn-toolbar kn-toolbar--primary p-p-0 p-m-2 p-col-12">
                <template #start>
                    {{ $t('documentExecution.kpi.listOfKpiTarget') + ' ' + target?.name }}
                </template>
            </Toolbar>
        </template>

        <div v-if="target && target.criterion && target.kpis" class="p-m-5">
            <div class="p-d-flex p-flex-row">
                <div class="kn-flex">
                    <span class="p-float-label">
                        <InputText class="kn-material-input" v-model="target.criterion.translatedValueName" :disabled="true" />
                        <label class="kn-material-input-label"> {{ $t('documentExecution.kpi.evaluationCriterion') }}</label>
                    </span>
                </div>
                <div class="kn-flex">
                    <span class="p-float-label">
                        <InputText class="kn-material-input" v-model="priorityKpi" :disabled="true" />
                        <label class="kn-material-input-label"> {{ $t('documentExecution.kpi.priorityKpi') }}</label>
                    </span>
                </div>
            </div>

            <div v-for="(kpi, index) in target.kpis" :key="index" class="p-d-flex p-flex-column scorecards-kpi-container p-m-4">
                <div class="scorecards-kpi-info">
                    <!-- TODO -->
                    <!-- <i class="fas fa-square fa-2xl p-mr-2" :class="getKpiIconColorClass(kpi)"></i> -->
                    <i class="fas fa-square fa-2xl p-mr-2"></i>
                    <span> {{ kpi.name }}</span>
                </div>
            </div>
        </div>

        <template #footer>
            <Button class="kn-button kn-button--primary" @click="$emit('close')"> {{ $t('common.close') }}</Button>
        </template>
    </Dialog>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { iScorecardTarget } from '@/modules/managers/scorecards/Scorecards'
// TODO - add after scorecards is merged
// import {  getKpiIconColorClass } from '@/modules/'
import Dialog from 'primevue/dialog'
import descriptor from './KnPerspectiveCardDescriptor.json'

export default defineComponent({
    name: 'kn-perspective-kpi-list-dialog',
    components: { Dialog },
    props: { visible: { type: Boolean }, selectedTarget: { type: Object as PropType<iScorecardTarget | null> } },
    emits: ['close'],
    data() {
        return {
            descriptor,
            target: null as iScorecardTarget | null,
            priorityKpi: ''
        }
    },
    watch: {
        selectedTarget() {
            this.loadTarget()
        }
    },
    created() {
        this.loadTarget()
    },
    methods: {
        loadTarget() {
            this.target = this.selectedTarget as iScorecardTarget
            if (this.target) this.priorityKpi = this.target.options?.criterionPriority?.join(', ')
            console.log('LOADED TARGET: ', this.target)
        }
    }
})
</script>

<style lang="scss" scoped>
#kn-perspective-kpi-list-dialog .p-dialog-header,
#kn-perspective-kpi-list-dialog .p-dialog-content {
    padding: 0;
}
#kn-perspective-kpi-list-dialog .p-dialog-content {
    display: flex;
    flex-direction: column;
    flex: 1;
}
</style>
