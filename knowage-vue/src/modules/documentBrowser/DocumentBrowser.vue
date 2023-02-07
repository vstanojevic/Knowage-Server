<template>
    <div class="kn-page" style="overflow: auto">
        <div>HERE</div>
        <button @click="testSomething">Click me</button>
        <table>
            <Row v-for="(row, index) in tableData" :key="index" :propRow="row"></Row>
        </table>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import testData from './test.json'

import Pivot from 'quick-pivot'
import Row from './documentBrowserHome/row/Row.vue'
import demoData from './documentBrowserHome/row/demoData.json'
import demoData2 from './documentBrowserHome/row/demoData2.js'

export default defineComponent({
    name: 'document-browser',
    components: { Row },
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
            aggregators: {},
            tableData: [] as any[]
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
        // console.log('----- THIS TREE: ', this.tree)
        this.testSomething()
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
        },
        spanSize(arr: any, i: number, j: number) {
            // helper function for setting row/col-span in pivotTableRenderer
            let x
            if (i !== 0) {
                let asc, end
                let noDraw = true
                for (x = 0, end = j, asc = end >= 0; asc ? x <= end : x >= end; asc ? x++ : x--) {
                    if (arr[i - 1][x] !== arr[i][x]) {
                        noDraw = false
                    }
                }
                if (noDraw) {
                    return -1
                }
            }
            let len = 0
            while (i + len < arr.length) {
                let asc1, end1
                let stop = false
                for (x = 0, end1 = j, asc1 = end1 >= 0; asc1 ? x <= end1 : x >= end1; asc1 ? x++ : x--) {
                    if (arr[i][x] !== arr[i + len][x]) {
                        stop = true
                    }
                }
                if (stop) {
                    break
                }
                len++
            }
            return len
        },
        testSomething() {
            if (!this.tree) return
            // const rowKeysFromTree = Object.keys(this.tree)
            // console.log('-------- rowKeysFromTree: ', rowKeysFromTree)
            // rowKeysFromTree?.forEach((rowKeys: string) => console.log(rowKeys.split(String.fromCharCode(0))))

            const dataArray = [
                ['name', 'gender', 'house', 'age', 'test'],
                ['Jon', 'm', 'Stark', 14, 140],
                ['Arya', 'f', 'Stark', 10, 140],
                ['Cersei', 'f', 'Baratheon', 38, 140],
                ['Tywin', 'm', 'Lannister', 67, 140],
                ['Tyrion', 'm', 'Lannister', 34, 140],
                ['Joffrey', 'm', 'Baratheon', 18, 140],
                ['Bran', 'm', 'Stark', 8, 140],
                ['Jaime', 'm', 'Lannister', 32, 140],
                ['Sansa', 'f', 'Stark', 12, 140]
            ]

            const rowsToPivot = ['gender']
            const colsToPivot = ['name', 'house']
            const aggregationDimension = 'age'
            const aggregator = 'sum'

            // const pivot = new Pivot(dataArray, rowsToPivot, colsToPivot, aggregationDimension, aggregator)

            // demoData.data[0] = ['Entity', 'Product', 'Manufacturer', 'Class', 'Category', 'Quantity', 'Amount'] as any

            // const dataArray = demoData2

            // console.log('demoData: ', demoData2)

            // console.log('dataARray.lengtjh', dataArray.length)

            // const rowsToPivot = ['Payer Gender', 'Payer Smoker']
            // const colsToPivot = ['Day of Week', 'Meal']
            // const aggregationDimension = ['Tip']
            // const aggregator = ['sum']

            const pivot = new Pivot(dataArray, rowsToPivot, colsToPivot, aggregationDimension, aggregator)

            console.log('pivot.data', pivot.data, 'pivot.data.table', pivot.data.table)
            this.tableData = pivot.data.table
        }
    }
})
</script>

<style lang="scss"></style>
