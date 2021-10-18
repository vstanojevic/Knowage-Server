export interface iSchedulation {
    name: string
    group: string
    description?: string
    triggers?: Array
}

export interface iTrigger {
    jobName: string
    jobGroup: string
    triggerName: string
    triggerGroup: string
    triggerDescription: string
    triggerCalendarName: string
    triggerStartDate: string
    triggerStartTime: string
    triggerEndDate: string
    triggerEndTime: string
    triggerZonedStartTime: string
    triggerZonedEndTime: string
    triggerChronString: string
    triggerChronType: string
    triggerIsPaused: string
    jobParameters?: Array
    start?: jobParameters
    end?: jobParameters
    documents?: Array
    limited: Boolean
    executions?: Array
}

export interface iDataItem {
    id?: string
    name: string
    description?: string
}

export interface iGroupDataItem {
    color: string
    jobName: string
    date: Date | null
    dayOfWeek: string
    monthName: string
    year: number
    day: number
    document: string
    executions?: Array
}

export interface iGroupDataExecution {
    id?: string
    date: string
    jobName: string
    numberOfDocuments: number
    documents?: Array
}

export interface iDisplayMode {
    name: string
    code: string
}
