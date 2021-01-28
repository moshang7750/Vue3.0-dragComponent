export enum VisualEditorPropsType {
    input = 'input',
    color = 'color',
    select = 'select',
    table = 'table'

}
export type VisualEditorProps = {
    type: VisualEditorPropsType,
    label: string,
} & {
    options?: VisualEditorSelectOption
} & {
    table?: VisualEditorTableOption
}
// Input
export function createEditorInputProp(label: string): VisualEditorProps {
    return {
        type: VisualEditorPropsType.input,
        label,
    }
}
// Color
export function createEditorColorProp(label: string): VisualEditorProps {
    return {
        type: VisualEditorPropsType.color,
        label,
    }
}

// Select
export type VisualEditorSelectOption = {
    label: string,
    val: string
}[]

export function createEditorSelectProp(label: string, options: VisualEditorSelectOption): VisualEditorProps {
    return {
        type: VisualEditorPropsType.select,
        label,
        options
    }
}


// table
export type VisualEditorTableOption = {
    label: string,      //列显示文本 
    field: string,      //列绑定的的字段 
}[]

export function createEditorTableProp(label: string, table: VisualEditorTableOption): VisualEditorProps {
    return {
        type: VisualEditorPropsType.table,
        label,
        table
    }

}