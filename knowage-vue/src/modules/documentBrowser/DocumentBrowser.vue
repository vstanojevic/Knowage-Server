<template>
    <div class="kn-page" style="overflow: auto">
        <button style="width: 200px" @click="testSomething">Click me</button>
        <table class="p-m-2">
            <Row v-for="(row, index) in tableData" :key="index" :propRow="row" :parentRow="tableData[index - 1]" @rowClicked="onRowClick"></Row>
        </table>

        <table class="p-m-2">
            <Row v-for="(row, index) in tableData2" :key="index" :propRow="row" :parentRow="tableData[index - 1]" @rowClicked="onRowClick"></Row>
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

import * as deepEqual from 'deep-equal'

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
            tableData: [] as any[],
            pivot: {} as any,
            columnHeadersMap: {} as any,
            tableData2: [] as any[]
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
        this.testSomething2()
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
        testSomething() {
            if (!this.tree) return
            // const rowKeysFromTree = Object.keys(this.tree)
            // console.log('-------- rowKeysFromTree: ', rowKeysFromTree)
            // rowKeysFromTree?.forEach((rowKeys: string) => console.log(rowKeys.split(String.fromCharCode(0))))

            // const dataArray = [
            //     ['name', 'gender', 'house', 'age', 'test'],
            //     ['Jon', 'm', 'Stark', 14, 140],
            //     ['Arya', 'f', 'Stark', 10, 140],
            //     ['Cersei', 'f', 'Baratheon', 38, 140],
            //     ['Tywin', 'm', 'Lannister', 67, 140],
            //     ['Tyrion', 'm', 'Lannister', 34, 140],
            //     ['Joffrey', 'm', 'Baratheon', 18, 140],
            //     ['Bran', 'm', 'Stark', 8, 140],
            //     ['Jaime', 'm', 'Lannister', 32, 140],
            //     ['Sansa', 'f', 'Stark', 12, 140]
            // ]

            // const rowsToPivot = ['gender', 'house']
            // const colsToPivot = ['name']
            // const aggregationDimension = 'age'
            // const aggregator = 'sum'

            //const pivot = new Pivot(dataArray, rowsToPivot, colsToPivot, aggregationDimension, aggregator)

            //demoData.data[0] = ['Entity', 'Product', 'Manufacturer', 'Class', 'Category', 'Quantity', 'Amount'] as any

            const dataArray = demoData2

            console.log('demoData: ', demoData2)

            console.log('dataARray.lengtjh', dataArray.length)

            const rowsToPivot = ['Payer Gender', 'Payer Smoker']
            const colsToPivot = ['Meal', 'Day of Week']
            const aggregationDimension = ['Tip']
            const aggregator = ['sum']

            this.pivot = new Pivot(dataArray, rowsToPivot, colsToPivot, aggregationDimension, aggregator)

            console.log('pivot.data', this.pivot.data, 'pivot.data.table', this.pivot.data.table)
            this.tableData = this.pivot.data.table

            this.testSomething2()
        },
        onRowClick(row: any) {
            console.log('-------- ROW CLICKED: ', row)
            const index = this.tableData.findIndex((tempRow: any) => deepEqual(tempRow, row))
            console.log('-------- INDEX: ', index)
            this.pivot.toggle(index)
            this.tableData = this.pivot.data.table
            // this.pivot.collapse(row.row)
            // this.tableData = this.pivot.data.table
            // setTimeout(() => {
            //     console.log('-------- PIVOT: ', this.pivot)
            //     this.pivot.expand(row.row)
            //     this.tableData = this.pivot.data.table
            // }, 5000)
        },
        testSomething2() {
            const dataArray = demoData2

            console.log('demoData: ', demoData2)

            console.log('dataARray.lengtjh', dataArray.length)

            const rowsToPivot = ['Payer Gender', 'Payer Smoker']
            const colsToPivot = ['Meal', 'Day of Week']
            let aggregationDimension = 'Tip'
            let aggregator = 'count'

            const pivot = new Pivot(dataArray, rowsToPivot, colsToPivot, aggregationDimension, aggregator)
            aggregationDimension = 'Total Bill'
            aggregator = 'sum'
            const pivot2 = new Pivot(dataArray, rowsToPivot, colsToPivot, aggregationDimension, aggregator)

            console.log('pivot.data', pivot.data, 'pivot.data.table', pivot.data.table)
            console.log('pivot.data2', pivot2.data, 'pivot.data.table2', pivot2.data.table)
            this.mergeTables(pivot.data.table, pivot2.data.table)

            // this.tableData2 = this.pivot.data.table
        },
        mergeTables(pivotTable1: any, pivotTable2: any) {
            pivotTable1.forEach((row: any, index: number) => {
                if (row.type === 'data' || row.type === 'rowHeader' || row.type === 'aggregated') {
                    row.value2 = pivotTable2[index].value
                }
            })
            console.log('-------- pivotTable 1: ', pivotTable1)
            this.tableData2 = pivotTable1
        }
    }
})
</script>

<style lang="scss">
table,
th,
td {
    border: 1px solid black;
    border-collapse: collapse;
}
</style>
