export interface StructuralRequirement {
    id?: number
    taskID?: number
    regexExpression: string
    type: 'Includes' | 'Excludes'
}
