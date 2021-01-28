export enum VisualEditorPropsType {
    input = 'input',
    color = 'color',
    select = 'select',

}
export type VisualEditorProps = {
    type: VisualEditorPropsType,
    label: string,
} & {
    options?: VisualEditorSelectOption
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