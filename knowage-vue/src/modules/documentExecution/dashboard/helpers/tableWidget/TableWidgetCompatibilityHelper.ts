import {
    IWidget,
    IWidgetColumn,
    IWidgetColumnFilter,
    ITableWidgetSettings,
    ITableWidgetPagination,
    ITableWidgetConditionalStyle,
    ITableWidgetTooltipStyle,
    ITableWidgetStyle,
    ITableWidgetInteractions,
    ITableWidgetConfiguration,
    ITableWidgetResponsive,
    ITableWidgetConditionalStyles
} from '../../Dashboard'
import { getFormattedConfiguration } from './TableWidgetConfigurationHelper'
import { getFormattedInteractions } from './TableWidgetInteractionsHelper'
import { getFormattedStyle } from './TableWidgetStyleHelper'
import { getSettingsFromWidgetColumns } from './TableWidgetColumnSettingsHelper'
import * as tableWidgetDefaultValues from '../../widget/WidgetEditor/helpers/tableWidget/TableWidgetDefaultValues'
import cryptoRandomString from 'crypto-random-string'

const columnNameIdMap = {}

export const formatTableWidget = (widget: any) => {
    console.log('TableWidgetCompatibilityHelper - formatTableWidget called for: ', widget)
    const formattedWidget = {
        id: widget.id,
        dataset: widget.dataset.dsId,
        type: widget.type,
        columns: getFormattedWidgetColumns(widget),
        conditionalStyles: [],
        theme: '',
        style: {},
        settings: {} as ITableWidgetSettings
    } as IWidget
    formattedWidget.settings = getFormattedWidgetSettings(widget)
    getFiltersForColumns(formattedWidget, widget)
    getSettingsFromWidgetColumns(formattedWidget, widget)

    console.log('TableWidgetCompatibilityHelper - FORMATTED WIDGET: ', formattedWidget)
    return formattedWidget
}

const getFormattedWidgetColumns = (widget: any) => {
    if (!widget.content || !widget.content.columnSelectedOfDataset) return []
    const formattedColumns = [] as IWidgetColumn[]
    for (let i = 0; i < widget.content.columnSelectedOfDataset.length; i++) {
        formattedColumns.push(getFormattedWidgetColumn(widget.content.columnSelectedOfDataset[i]))
    }
    return formattedColumns
}

const getFormattedWidgetColumn = (widgetColumn: any) => {
    const formattedColumn = { id: cryptoRandomString({ length: 16, type: 'base64' }), columnName: widgetColumn.name, alias: widgetColumn.alias, type: widgetColumn.type, fieldType: widgetColumn.fieldType, multiValue: widgetColumn.multiValue, filter: {} } as IWidgetColumn
    if (widgetColumn.isCalculated) {
        formattedColumn.formula = widgetColumn.formula
        formattedColumn.formulaEditor = widgetColumn.formulaEditor
    }
    columnNameIdMap[formattedColumn.columnName] = formattedColumn.id
    if (widgetColumn.aggregationSelected) formattedColumn.aggregation = widgetColumn.aggregationSelected
    return formattedColumn
}

const getFormattedWidgetSettings = (widget: any) => {
    const formattedSettings = {
        sortingColumn: getColumnId(widget.settings?.sortingColumn) ?? '',
        sortingOrder: widget.settings?.sortingOrder ?? '',
        updatable: widget.updateble,
        clickable: widget.cliccable,
        conditionalStyles: getFormattedConditionalStyles(widget),
        configuration: getFormattedConfiguration(widget) as ITableWidgetConfiguration,
        interactions: getFormattedInteractions(widget) as ITableWidgetInteractions,
        pagination: getFormattedPaginations(widget),
        style: getFormattedStyle(widget) as ITableWidgetStyle,
        tooltips: tableWidgetDefaultValues.getDefaultTooltips() as ITableWidgetTooltipStyle[],
        visualization: tableWidgetDefaultValues.getDefaultVisualizations(),
        responsive: tableWidgetDefaultValues.getDefaultResponsivnes() as ITableWidgetResponsive
    } as ITableWidgetSettings
    return formattedSettings
}
const getFormattedConditionalStyles = (widget: any) => {
    const formattedStyles = { enabled: false, conditions: [] } as ITableWidgetConditionalStyles
    if (widget.settings.rowThresholds?.enabled) {
        widget.settings.rowThresholds.list.forEach((rowThreshold: any) => {
            formattedStyles.conditions.push(createConditionFromRowThreshold(rowThreshold))
        })
    }

    return formattedStyles
}

const createConditionFromRowThreshold = (rowThreshold: any) => {
    const conditionStyle = {
        target: getColumnId(rowThreshold.column),
        applyToWholeRow: false,
        condition: { type: rowThreshold.compareValueType, operator: rowThreshold.condition, value: '' },
        properties: {
            'justify-content': '',
            'font-family': '',
            'font-size': '',
            'font-style': '',
            'font-weight': '',
            color: '',
            'background-color': '',
            icon: ''
        }
    } as ITableWidgetConditionalStyle
    switch (conditionStyle.condition.type) {
        case 'static':
            conditionStyle.condition.value = rowThreshold.compareValue
            break
        case 'parameter':
            conditionStyle.condition.value = getParameterValue(rowThreshold.compareValue)
            conditionStyle.condition.parameter = rowThreshold.compareValue
            break
        case 'variable':
            conditionStyle.condition.value = getVariableValue(rowThreshold.compareValue)
            conditionStyle.condition.variable = rowThreshold.compareValue
    }

    if (rowThreshold.style) {
        delete rowThreshold.style['border-top-color']
        delete rowThreshold.style['border-bottom-color']
        conditionStyle.properties = { ...rowThreshold.style, icon: '' }
    }

    return conditionStyle
}

const getFormattedPaginations = (widget: any) => {
    if (!widget.settings?.pagination) return tableWidgetDefaultValues.getDefaultPagination()
    return { enabled: widget.settings.pagination.enabled, itemsNumber: widget.settings.pagination.itemsNumber } as ITableWidgetPagination
}

const getFiltersForColumns = (formattedWidget: IWidget, oldWidget: any) => {
    if (!oldWidget.filters || oldWidget.filters.length === 0) return
    for (let i = 0; i < oldWidget.filters.length; i++) {
        const tempFilter = oldWidget.filters[i]
        const index = formattedWidget.columns?.findIndex((column: IWidgetColumn) => column.columnName === tempFilter.colName)
        if (index !== -1) {
            formattedWidget.columns[index].filter = { enabled: true, operator: tempFilter.filterOperator, value: tempFilter.filterVal1 }
            if (tempFilter.filterVal2 && formattedWidget.columns[index].filter) (formattedWidget.columns[index].filter as IWidgetColumnFilter).value2 = tempFilter.filterVal2
        }
    }
}

// TODO - PARAMETER VALUE
const getParameterValue = (parameterName: string) => {
    return 'MOCKED PARAMETER VALUE'
}

// TODO - VARIABLE VALUE
const getVariableValue = (variable: string) => {
    return 'MOCKED VARIABLE VALUE'
}

export const getColumnId = (widgetColumnName: string) => {
    return columnNameIdMap[widgetColumnName]
}
