import { ITableWidgetBordersStyle, ITableWidgetColumnGroups, ITableWidgetColumnStyles, ITableWidgetConditionalStyle, ITableWidgetConditionalStyles, ITableWidgetCrossNavigation, ITableWidgetCustomMessages, ITableWidgetExports, ITableWidgetHeaders, ITableWidgetLinks, ITableWidgetPaddingStyle, ITableWidgetPagination, ITableWidgetPreview, ITableWidgetResponsive, ITableWidgetRows, ITableWidgetRowsStyle, ITableWidgetSelection, ITableWidgetShadowsStyle, ITableWidgetSummaryRows, ITableWidgetSummaryStyle, ITableWidgetTooltipStyle, ITableWidgetVisibilityCondition, ITableWidgetVisualization, ITawbleWidgetHeadersStyle } from "../../../../Dashboard"
import descriptor from './TableWidgetHelpersDescriptor.json'
import deepcopy from 'deepcopy'

export const getDefaultConditionalStyles = () => {
    return deepcopy(descriptor.defaultConditionalStyles) as ITableWidgetConditionalStyles
}

export const getDefaultConditionalStyle = () => {
    return deepcopy(descriptor.defaultConditionalStyle) as ITableWidgetConditionalStyle
}

export const getDefaultColumnGroups = () => {
    return deepcopy(descriptor.defaultColumnGroups) as ITableWidgetColumnGroups
}

export const getDefaultExportsConfiguration = () => {
    return deepcopy(descriptor.defaultExportsConfiguration) as ITableWidgetExports
}

export const getDefaultHeadersConfiguration = () => {
    return deepcopy(descriptor.defaultHeadersConfiguration) as ITableWidgetHeaders
}

export const getDefaultRowsConfiguration = () => {
    return deepcopy(descriptor.defaultRowsConfiguration) as ITableWidgetRows
}

export const getDefaultSummaryRowsConfiguration = () => {
    return deepcopy(descriptor.defaultSummaryRowsConfiguration) as ITableWidgetSummaryRows
}

export const getDefaultCustomMessages = () => {
    return deepcopy(descriptor.defaultCustomMessages) as ITableWidgetCustomMessages
}

export const getDefaultCrossNavigation = () => {
    return deepcopy(descriptor.defaultCrossNavigation) as ITableWidgetCrossNavigation
}

export const getDefaultLinks = () => {
    return deepcopy(descriptor.defaultLinks) as ITableWidgetLinks
}

export const getDefaultPreview = () => {
    return deepcopy(descriptor.defaultPreview) as ITableWidgetPreview
}


export const getDefaultSelection = () => {
    return deepcopy(descriptor.defaultSelection) as ITableWidgetSelection
}

export const getDefaultPagination = () => {
    return deepcopy(descriptor.defaultPagination) as ITableWidgetPagination
}


export const getDefaultBordersStyle = () => {
    return deepcopy(descriptor.defaultBordersStyle) as ITableWidgetBordersStyle
}

export const getDefaultColumnStyles = () => {
    return deepcopy(descriptor.defaultColumnStyles) as ITableWidgetColumnStyles
}

export const getDefaultHeadersStyle = () => {
    return deepcopy(descriptor.defaultHeadersStyle) as ITawbleWidgetHeadersStyle
}

export const getDefaultPaddingStyle = () => {
    return deepcopy(descriptor.defaultPaddingStyle) as ITableWidgetPaddingStyle
}

export const getDefaultRowsStyle = () => {
    return deepcopy(descriptor.defaultRowsStyle) as ITableWidgetRowsStyle
}

export const getDefaultShadowsStyle = () => {
    return deepcopy(descriptor.defaultShadowsStyle) as ITableWidgetShadowsStyle
}

export const getDefualtSummryStyle = () => {
    return deepcopy(descriptor.defaultSummaryStyle) as ITableWidgetSummaryStyle
}

export const getDefaultVisualizations = () => {
    return deepcopy(descriptor.defaultVisualizations) as ITableWidgetVisualization
}

export const getDefaultVisibilityCondition = () => {
    return deepcopy(descriptor.defaultVisibilityCondition) as ITableWidgetVisibilityCondition
}

export const getDefaultTooltips = () => {
    return deepcopy(descriptor.defaultTooltips) as ITableWidgetTooltipStyle[]
}

export const getDefaultResponsivnes = () => {
    return deepcopy(descriptor.defaultResponsivnes) as ITableWidgetResponsive
}