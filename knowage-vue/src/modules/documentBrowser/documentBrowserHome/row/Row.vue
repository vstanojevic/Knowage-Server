<template>
    <tr v-if="propRow.type === 'colHeader'" @click="$emit('rowClicked', propRow)">
        <th v-for="(value, index) in uniqueColumnHeaders" :colspan="columnHeadersMap[value]" :key="index">{{ value }}</th>
    </tr>
    <tr v-else-if="propRow.type === 'rowHeader'" class="kn-cursor-pointer" @click="$emit('rowClicked', propRow)">
        <td v-for="(value, index) in propRow.value" :key="index" width="10%" :style="index === 0 ? style : ''" class="p-text-center">{{ value + ' | ' }} {{ propRow.value2 ? propRow.value2[index] : '' }}</td>
    </tr>
    <tr v-else-if="propRow.type === 'data'" @click="$emit('rowClicked', propRow)">
        <td v-for="(value, index) in propRow.value" :key="index" width="10%" :style="index === 0 ? style : ''" class="p-text-center">{{ value + ' | ' }} {{ propRow.value2 ? propRow.value2[index] : '' }}</td>
    </tr>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'row',
    components: {},
    props: { propRow: { type: Object, required: true }, parentRow: { type: Object, required: true } },

    data() {
        return {
            columnHeadersMap: {}
        }
    },
    computed: {
        style() {
            return {
                ['padding-left']: this.propRow.depth * 100 + 'px'
            }
        },
        uniqueColumnHeaders() {
            if (this.propRow.type !== 'colHeader') return []
            const temp = this.columnHeadersMap ? Object.keys(this.columnHeadersMap) : []
            return temp.filter((v: string, i: number, a: string[]) => a.indexOf(v) === i).map((value: string) => (this.parentRow ? value.split(String.fromCharCode(0))[1] : value))
        }
    },
    created() {
        this.loadColumnHeaderCountMap()
    },
    methods: {
        loadColumnHeaderCountMap() {
            if (this.propRow.type !== 'colHeader') return
            this.propRow.value.forEach((value: string, index: number) => {
                const tempValue = this.parentRow ? this.parentRow.value[index] + String.fromCharCode(0) + value : value
                if (!this.columnHeadersMap[tempValue]) this.columnHeadersMap[tempValue] = 1
                else this.columnHeadersMap[tempValue]++
            })
        }
    }
})
</script>
