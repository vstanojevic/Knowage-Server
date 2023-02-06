<template>
    <div class="kn-page">
        <div>HERE</div>
        {{ treeBojan }}
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import testData from './test.json'

export default defineComponent({
    name: 'document-browser',
    components: {},
    props: { selectedMenuItem: { type: Object }, menuItemClickedTrigger: { type: Boolean } },
    data() {
        return {
            rows: ['Payer Gender', 'Party Size'],
            cols: ['Meal', 'Payer Smoker', 'Day of Week'],
            vals: ['Total Bill'],
            allTotal: [] as any,
            rowTotals: [] as any,
            rowKeys: [] as any,
            colTotals: [] as any,
            colKeys: [] as any,
            tree: {} as any,
            aggregators: {}
        }
    },
    watch: {},
    computed: {
        treeBojan() {}
    },
    print() {},
    async created() {
        // console.log('--------- testData: ', testData)
        testData.formattedTestData.forEach((record: any) => this.processRecord(record))
        console.log('----- THIS TREE: ', this.tree)
    },
    methods: {
        processRecord(record: any) {
            // this code is called in a tight loop
            const colKey = [] as any
            const rowKey = [] as any
            for (const x of Array.from(this.cols)) {
                colKey.push(x in record ? record[x] : 'null')
            }
            for (const x of Array.from(this.rows)) {
                rowKey.push(x in record ? record[x] : 'null')
            }
            const flatRowKey = rowKey.join(String.fromCharCode(0))
            const flatColKey = colKey.join(String.fromCharCode(0))

            this.allTotal.push(record)

            if (rowKey.length !== 0) {
                if (!this.rowTotals[flatRowKey]) {
                    this.rowKeys.push(rowKey)
                    // this.rowTotals[flatRowKey] = this.aggregator(rowKey, [])
                    this.rowTotals[flatRowKey] = []
                }
                this.rowTotals[flatRowKey].push(record)
            }

            if (colKey.length !== 0) {
                if (!this.colTotals[flatColKey]) {
                    this.colKeys.push(colKey)
                    // this.colTotals[flatColKey] = this.aggregator([], colKey)
                    this.colTotals[flatColKey] = []
                }
                this.colTotals[flatColKey].push(record)
            }

            if (colKey.length !== 0 && rowKey.length !== 0) {
                if (!this.tree[flatRowKey]) {
                    this.tree[flatRowKey] = {}
                }
                if (!this.tree[flatRowKey][flatColKey]) {
                    // this.tree[flatRowKey][flatColKey] = this.aggregator(rowKey, colKey)
                    this.tree[flatRowKey][flatColKey] = []
                }
                this.tree[flatRowKey][flatColKey].push(record)
            }
        }
    }
})
</script>

<style lang="scss"></style>
