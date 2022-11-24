import { IWidget, ITableWidgetColumnGroup } from '../../Dashboard'

export const getColumnGroup = (propWidget: IWidget, col: ITableWidgetColumnGroup) => {
    var modelGroups = propWidget.settings.configuration.columnGroups.groups
    if (propWidget.settings.configuration.columnGroups.enabled && modelGroups && modelGroups.length > 0) {
        for (var k in modelGroups) {
            if (modelGroups[k].columns.includes(col.id)) {
                return modelGroups[k]
            }
        }
    } else return false
}

export const getWidgetStyleByType = (propWidget: IWidget, styleType: string) => {
    const styleSettings = propWidget?.settings.style[styleType]
    if (styleSettings?.enabled) {
        const styleString = Object.entries(styleSettings.properties ?? styleSettings)
            .map(([k, v]) => `${k}:${v}`)
            .join(';')
        return styleString + ';'
    } else return ''
}

export const getWidgetStyleByTypeWithoutValidation = (propWidget: IWidget, styleType: string) => {
    const styleSettings = propWidget.settings.style[styleType]
    const styleString = Object.entries(styleSettings.properties ?? styleSettings)
        .map(([k, v]) => `${k}:${v}`)
        .join(';')
    return styleString + ';'
}
export const getColumnConditionalStyles = (colId: string, cellParams: any) => {
    var styleString = null as any
    var cellColumnConditionalStyles = cellParams.columnsWithConditionalStyles.filter((condition) => condition.target.includes(colId))
    var brothersColumnConditionalStyles = cellParams.columnsWithConditionalStyles.filter((condition) => !condition.target.includes(colId))

    if (cellColumnConditionalStyles.length > 0) {
        for (let i = 0; i < cellColumnConditionalStyles.length; i++) {
            if (isConditionMet(cellColumnConditionalStyles[i].condition, cellParams.value)) {
                styleString = styleString = cellColumnConditionalStyles[i].properties
                break
            } else styleString = isBrotherConditionMet(brothersColumnConditionalStyles, cellParams.columnDataMap, cellParams)
        }
    } else styleString = isBrotherConditionMet(brothersColumnConditionalStyles, cellParams.columnDataMap, cellParams)

    return styleString
}

const isBrotherConditionMet = (brothersColumnConditionalStyles, columnDataMap, cellParams) => {
    if (brothersColumnConditionalStyles.length > 0) {
        for (let i = 0; i < brothersColumnConditionalStyles.length; i++) {
            if (brothersColumnConditionalStyles[i].applyToWholeRow && isConditionMet(brothersColumnConditionalStyles[i].condition, cellParams.data[columnDataMap[brothersColumnConditionalStyles[i].target]])) {
                return brothersColumnConditionalStyles[i].properties
            }
        }
    }
}

export const isConditionMet = (condition, valueToCompare) => {
    var fullfilledCondition = false
    switch (condition.operator) {
        case '==':
            fullfilledCondition = valueToCompare == condition.value
            break
        case '>=':
            fullfilledCondition = valueToCompare >= condition.value
            break
        case '<=':
            fullfilledCondition = valueToCompare <= condition.value
            break
        case 'IN':
            fullfilledCondition = condition.value.split(',').indexOf(valueToCompare) != -1
            break
        case '>':
            fullfilledCondition = valueToCompare > condition.value
            break
        case '<':
            fullfilledCondition = valueToCompare < condition.value
            break
        case '!=':
            fullfilledCondition = valueToCompare != condition.value
            break
    }
    return fullfilledCondition
}
