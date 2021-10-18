<template>
    <div class="parent-card">
        <Card :style="schedulationAgendaDescriptor.card.style">
            <template #header>
                <span class="p-d-flex" :style="schedulationAgendaDescriptor.span.style">
                    <SelectButton class="small-margin" v-model="selectedDisplayMode" :options="displayModes" optionLabel="name" data-test="select-button" />
                </span>
            </template>
            <template #content>
                <div v-for="dataItem in groupedItemList" :key="dataItem" class="xyz">
                    <div class="p-grid">
                        <div v-if="displayMode == 'time'" class="kn-list--column p-col-3" style="overflow: visible">
                            <div class="flex-body">
                                <div class="flex-row">
                                    <p class="p-large">{{ dataItem.day }}</p>
                                </div>
                                <div class="flex-column">
                                    <p class="p-small-bold">{{ dataItem.dayOfWeek }}</p>
                                    <p class="p-small">{{ dataItem.monthName + ' ' + dataItem.year }}</p>
                                </div>
                            </div>
                        </div>
                        <div v-if="displayMode == 'package'" class="kn-list--column p-col-3" style="overflow: visible">
                            <div class="flex-body">
                                <div class="flex-row">
                                    <h2>{{ dataItem.jobName }}</h2>
                                </div>
                            </div>
                        </div>
                        <div v-if="displayMode == 'document'" class="kn-list--column p-col-3" style="overflow: visible">
                            <div class="flex-body">
                                <div class="flex-row">
                                    <h2>{{ dataItem.document }}</h2>
                                </div>
                            </div>
                        </div>
                        <div class="p-col-9">
                            <DataTable :value="dataItem.executions" v-model:expandedRows="expandedRows" class="p-datatable-sm kn-table" dataKey="date" :rows="10" responsiveLayout="stack" breakpoint="960px" data-test="data-table">
                                <template #empty>
                                    {{ $t('common.info.noDataFound') }}
                                </template>

                                <Column field="date">
                                    <template #body="slotProps">
                                        <div v-if="displayMode == 'time'" class="color-left-border" :style="{ borderLeftColor: getRandomColor(slotProps.data.jobName) }">
                                            {{ new Date(slotProps.data.date).getHours() + ':' + new Date(slotProps.data.date).getMinutes() }}
                                        </div>
                                        <div v-if="displayMode == 'package' || displayMode == 'document'" class="color-left-border" :style="{ borderLeftColor: getRandomColor(slotProps.data.jobName) }">
                                            {{ slotProps.data.date }}
                                        </div>
                                    </template></Column
                                >
                                <Column field="jobName"></Column>
                                <Column field="numberOfDocuments">
                                    <template #body="slotProps">
                                        <span class="number-span">
                                            {{ slotProps.data.numberOfDocuments }}
                                        </span>
                                    </template>
                                </Column>
                                <Column :expander="true" headerStyle="width: 3rem" />
                                <Column :style="schedulationAgendaDescriptor.table.iconColumn.style">
                                    <template #body>
                                        <Button icon="pi pi-pencil" class="p-button-link" @click="openRedirection()" :data-test="'action-button'" />
                                    </template>
                                </Column>
                                <template #expansion="slotProps">
                                    <div>
                                        <DataTable :value="slotProps.data.documents">
                                            <Column>
                                                <template #body>
                                                    <Button icon="pi pi-book" class="p-button-link" />
                                                </template>
                                            </Column>
                                            <Column :style="schedulationAgendaDescriptor.table.iconColumn.style">
                                                <template #body>
                                                    <Button icon="pi pi-document" class="p-button-link" />
                                                </template>
                                            </Column>
                                            <Column>
                                                <template #body="slotProps">
                                                    {{ slotProps.data }}
                                                </template>
                                            </Column>
                                        </DataTable>
                                    </div>
                                </template>
                            </DataTable>
                        </div>
                    </div>
                    <br />
                </div>
            </template>
        </Card>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { iSchedulation, iGroupDataItem, iDisplayMode } from './SchedulationAgenda'
import Card from 'primevue/card'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import SelectButton from 'primevue/selectbutton'
import schedulationAgendaDescriptor from './SchedulationAgendaDescriptor.json'
import { formatDate } from '@/helpers/commons/localeHelper'

export default defineComponent({
    name: 'schedulation-agenda-display',
    components: {
        Card,
        Column,
        DataTable,
        SelectButton
    },
    props: {
        itemList: Array
    },
    data() {
        return {
            selectedItem: {},
            displayMode: 'time',
            expandedRows: [],
            schedulationAgendaDescriptor,
            dataItemList: [] as iSchedulation[],
            groupedItemList: [] as iGroupDataItem[],
            colorDictionary: {},
            selectedDisplayMode: null as iDisplayMode | null,
            displayModes: [
                { name: this.$t('managers.schedulationAgendaManagement.detail.time'), code: 'time' },
                { name: this.$t('managers.schedulationAgendaManagement.detail.package'), code: 'package' },
                { name: this.$t('managers.schedulationAgendaManagement.detail.document'), code: 'document' }
            ]
        }
    },
    watch: {
        itemList() {
            this.dataItemList = this.itemList as iSchedulation[]
        },
        selectedDisplayMode() {
            if (this.selectedDisplayMode) {
                this.displayMode = this.selectedDisplayMode.code
                this.updateDisplayData(this.displayMode)
            }
        }
    },
    methods: {
        async updateDisplayData(displayType: string) {
            await this.runDisplay(displayType)
        },
        async runDisplay(displayType: string) {
            this.groupedItemList = [] as iGroupDataItem[]
            this.displayMode = displayType
            switch (displayType) {
                case 'time':
                    for (let i = 0; i < this.dataItemList.length; i++) {
                        if (this.dataItemList[i].triggers && this.dataItemList[i].triggers[0].executions) {
                            for (let j = 0; j < this.dataItemList[i].triggers.length; j++) {
                                for (let k = 0; k < this.dataItemList[i].triggers[j].executions.length; k++) {
                                    let item = this.groupedItemList.find((x) => x.date == this.dataItemList[i].triggers[j].executions[k])
                                    if (!item) {
                                        item = {
                                            jobName: '',
                                            color: 'red',
                                            date: this.dataItemList[i].triggers[j].executions[k],
                                            dayOfWeek: this.getDayOfWeekName(this.dataItemList[i].triggers[j].executions[k])!,
                                            monthName: this.getMonthName(this.dataItemList[i].triggers[j].executions[k])!,
                                            year: new Date(this.dataItemList[i].triggers[j].executions[k]).getFullYear(),
                                            day: new Date(this.dataItemList[i].triggers[j].executions[k]).getDate(),
                                            document: '',
                                            executions: [] as any
                                        }
                                        this.groupedItemList.push(item)
                                    }
                                    let execution = {
                                        date: this.dataItemList[i].triggers[j].executions[k],
                                        jobName: this.dataItemList[i].triggers[j].jobName,
                                        numberOfDocuments: this.dataItemList[i].triggers[j].documents.length,
                                        documents: this.dataItemList[i].triggers[j].documents
                                    }
                                    item.executions.push(execution)
                                }
                            }
                        }
                    }
                    break
                case 'package':
                    for (let i = 0; i < this.dataItemList.length; i++) {
                        if (this.dataItemList[i].triggers && this.dataItemList[i].triggers[0].executions) {
                            let item = {
                                jobName: this.dataItemList[i].name,
                                color: 'red',
                                date: null,
                                dayOfWeek: '',
                                monthName: '',
                                year: 0,
                                day: 0,
                                document: '',
                                executions: [] as any
                            }
                            for (let j = 0; j < this.dataItemList[i].triggers.length; j++) {
                                for (let k = 0; k < this.dataItemList[i].triggers[j].executions.length; k++) {
                                    let execution = {
                                        date: this.formatDateTime(this.dataItemList[i].triggers[j].executions[k]),
                                        jobName: this.dataItemList[i].triggers[j].jobName,
                                        numberOfDocuments: this.dataItemList[i].triggers[j].documents.length,
                                        documents: this.dataItemList[i].triggers[j].documents
                                    }
                                    item.executions.push(execution)
                                }
                                this.groupedItemList.push(item)
                            }
                        }
                    }
                    break
                case 'document':
                    for (let i = 0; i < this.dataItemList.length; i++) {
                        if (this.dataItemList[i].triggers && this.dataItemList[i].triggers[0].executions) {
                            for (let j = 0; j < this.dataItemList[i].triggers.length; j++) {
                                for (let k = 0; k < this.dataItemList[i].triggers[j].executions.length; k++) {
                                    for (let l = 0; l < this.dataItemList[i].triggers[j].documents.length; l++) {
                                        let item = this.groupedItemList.find((x) => x.document == this.dataItemList[i].triggers[j].documents[l])
                                        if (!item) {
                                            item = {
                                                jobName: '',
                                                color: 'red',
                                                date: null,
                                                dayOfWeek: '',
                                                monthName: '',
                                                year: 0,
                                                day: 0,
                                                document: this.dataItemList[i].triggers[j].documents[l],
                                                executions: [] as any
                                            }
                                            this.groupedItemList.push(item)
                                        }

                                        let execution = item.executions.find((x) => x.date == new Date(this.dataItemList[i].triggers[j].executions[k]))

                                        if (!execution) {
                                            execution = {
                                                date: this.formatDateTime(this.dataItemList[i].triggers[j].executions[k]),
                                                jobName: this.dataItemList[i].triggers[j].jobName,
                                                numberOfDocuments: this.dataItemList[i].triggers[j].documents.length,
                                                documents: this.dataItemList[i].triggers[j].documents
                                            }
                                            item.executions.push(execution)
                                        }
                                    }
                                }
                            }
                        }
                    }
                    break
            }
            console.log('groupedItemList ', JSON.stringify(this.groupedItemList))
        },
        openRedirection() {
            this.$router.push('/scheduler/edit-package-schedule?id=Test&clone=false')
        },
        getDayOfWeekName(date: any) {
            let inputDateValue = new Date(date)
            switch (inputDateValue.getDay()) {
                case 0:
                    return this.$t('common.days.monday')
                case 1:
                    return this.$t('common.days.tuesday')
                case 2:
                    return this.$t('common.days.wednesday')
                case 3:
                    return this.$t('common.days.thursday')
                case 4:
                    return this.$t('common.days.friday')
                case 5:
                    return this.$t('common.days.saturday')
                case 6:
                    return this.$t('common.days.sunday')
            }
        },
        getMonthName(date: any) {
            let inputDateValue = new Date(date)
            switch (inputDateValue.getMonth()) {
                case 0:
                    return this.$t('common.months.january')
                case 1:
                    return this.$t('common.months.february')
                case 2:
                    return this.$t('common.months.march')
                case 3:
                    return this.$t('common.months.april')
                case 4:
                    return this.$t('common.months.may')
                case 5:
                    return this.$t('common.months.june')
                case 6:
                    return this.$t('common.months.july')
                case 7:
                    return this.$t('common.months.august')
                case 8:
                    return this.$t('common.months.september')
                case 9:
                    return this.$t('common.months.october')
                case 10:
                    return this.$t('common.months.november')
                case 11:
                    return this.$t('common.months.december')
            }
        },
        getRandomColor(inputName: any) {
            let currentColor = this.colorDictionary[inputName]
            if (!currentColor) {
                var letters = '0123456789ABCDEF'
                var color = '#'
                for (var i = 0; i < 6; i++) {
                    color += letters[Math.floor(Math.random() * 16)]
                }
                currentColor = color
                this.colorDictionary[inputName] = currentColor
            }
            return currentColor
        },
        returnTime(inputDate: any) {
            var date = new Date(inputDate)
            if (date) {
                return date.toLocaleTimeString(navigator.language, {
                    hour: '2-digit',
                    minute: '2-digit'
                })
            }
        },
        formatDateTime(date: any) {
            return formatDate(date, 'DD/MM/YYYY HH:MM')
        }
    }
})
</script>

<style lang="scss" scoped>
.small-margin {
    margin: 5px;
}
.flex-row {
    flex-direction: row;
    display: flex;
    width: 15%;
}

.flex-column {
    flex-direction: column;
    display: flex;
    padding-top: 22px;
}

.flex-body {
    display: flex;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-content: center;
}
.p-large {
    text-align: center;
    font-weight: bold;
    font-size: 28px;
}
.p-small {
    text-align: left;
    margin: 2px;
}
.p-small-bold {
    font-weight: bold;
    text-align: left;
    margin: 2px;
}
.number-span {
    background: #5178d0;
    border-radius: 0.8em;
    color: #ffffff;
    display: inline-block;
    line-height: 1.6em;
    margin-right: 15px;
    text-align: center;
    width: 1.6em;
}
.color-left-border {
    border-left: 8px solid;
}
.parent-card {
    overflow: visible;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 15px;
}
</style>
