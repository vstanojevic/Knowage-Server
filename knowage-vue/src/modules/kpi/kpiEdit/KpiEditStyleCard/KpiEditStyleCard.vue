<template>
    <Card v-if="font">
        <template #header>
            <Toolbar class="kn-toolbar kn-toolbar--secondary">
                <template #start>
                    {{ $t('common.style') }}
                </template>
            </Toolbar>
        </template>
        <template #content>
            <div class="p-grid">
                <div class="p-col-6 p-fluid">
                    <span class="p-float-label">
                        <Dropdown class="kn-material-input" v-model="font.size" :options="kpiEditStyleCardDescriptor.fontSizeOptions" optionValue="value">
                            <template #value="slotProps">
                                <div v-if="slotProps.value">
                                    <span>{{ getDropdownValueLabel(slotProps.value, kpiEditStyleCardDescriptor.fontSizeOptions) }}</span>
                                </div>
                            </template>
                            <template #option="slotProps">
                                <span :style="'font-size: ' + slotProps.option.value">{{ $t(slotProps.option.label) }}</span>
                            </template>
                        </Dropdown>
                        <label class="kn-material-input-label"> {{ $t('kpi.kpiEdit.fontSize') }} </label>
                    </span>
                </div>
                <div class="p-col-6 p-fluid">
                    <span class="p-float-label">
                        <Dropdown class="kn-material-input" v-model="font.fontFamily" :options="kpiEditStyleCardDescriptor.fontFamilyOptions" optionValue="value">
                            <template #value="slotProps">
                                <div v-if="slotProps.value">
                                    <span>{{ getDropdownValueLabel(slotProps.value, kpiEditStyleCardDescriptor.fontFamilyOptions) }}</span>
                                </div>
                            </template>
                            <template #option="slotProps">
                                <span :style="'font-family: ' + slotProps.option.value">{{ $t(slotProps.option.label) }}</span>
                            </template>
                        </Dropdown>
                        <label class="kn-material-input-label"> {{ $t('kpi.kpiEdit.fontSize') }} </label>
                    </span>
                </div>
                <div class="p-col-6 p-fluid">
                    <span class="p-float-label">
                        <Dropdown class="kn-material-input" v-model="font.fontWeight" :options="kpiEditStyleCardDescriptor.fontWeightOptions" optionValue="value">
                            <template #value="slotProps">
                                <div v-if="slotProps.value">
                                    <span>{{ getDropdownValueLabel(slotProps.value, kpiEditStyleCardDescriptor.fontWeightOptions) }}</span>
                                </div>
                            </template>
                            <template #option="slotProps">
                                <span :style="'font-weight: ' + slotProps.option.value">{{ $t(slotProps.option.label) }}</span>
                            </template>
                        </Dropdown>
                        <label class="kn-material-input-label"> {{ $t('kpi.kpiEdit.fontWeight.title') }} </label>
                    </span>
                </div>
                <div class="p-col-6 p-d-flex p-flex-column">
                    <label class="kn-material-input-label"> {{ $t('kpi.kpiEdit.color') }}</label>
                    <ColorPicker v-model="font.color" format="rgb" :inline="false" />
                </div>
            </div>
        </template>
    </Card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { iFont, iStyle } from '../KpiEdit'
import Card from 'primevue/card'
import ColorPicker from 'primevue/colorpicker'
import Dropdown from 'primevue/dropdown'
import kpiEditStyleCardDescriptor from './KpiEditStyleCardDescriptor.json'

export default defineComponent({
    name: 'kpi-edit-style-card',
    components: { Card, ColorPicker, Dropdown },
    props: { propStyle: { type: Object as PropType<iStyle>, required: true } },
    data() {
        return {
            kpiEditStyleCardDescriptor,
            font: null as iFont | null
        }
    },
    watch: {
        propStyle() {
            this.loadFont()
        }
    },
    created() {
        this.loadFont()
    },
    methods: {
        loadFont() {
            this.font = this.propStyle?.font as iFont
            console.log('LOADED FONT: ', this.font)
        },
        getDropdownValueLabel(value: string, options: { value: string; label: string }[]) {
            for (let i = 0; i < options.length; i++) {
                if (options[i].value === value) {
                    return this.$t(options[i].label)
                }
            }
        }
    }
})
</script>
