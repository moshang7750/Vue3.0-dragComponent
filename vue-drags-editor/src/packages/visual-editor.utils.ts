import { VisualEditorProps } from "./visual-editor.props"

export interface VisualEditorBlockData {
    top: number,
    left: number,
    componentKey: string,               //  组件的唯一标识
    adjustPosition: boolean,
    focus: boolean                      //  是否选中
    zIndex: number,                     // z-index
    width: number,                      // 组件宽度         
    height: number,                     // 组件高度 
    hasResize: boolean,                 // 是否调整过宽度或者高度
    props: Record<string, any>          //  组件设计属性 
}
export interface VisualEditorModelValue {
    container: {
        height: number,                                             // 容器高度
        width: number,                                              // 容器宽度
    },
    blocks?: VisualEditorBlockData[],                                // block数据
}

export interface VisualEditorComponent {
    key: string,
    label: string,
    preview: () => JSX.Element,
    render: () => JSX.Element,
    props?: Record<string, VisualEditorProps>
}

export interface VisualEditorMarkLine {
    x: { left: number, showLeft: number }[]
    y: { top: number, showTop: number }[]
}

export function createNewBlock({
    component,
    left,
    top,
}: {
    component: VisualEditorComponent,
    top: number,
    left: number
}): VisualEditorBlockData {
    return {
        top,
        left,
        componentKey: component!.key,
        adjustPosition: true,
        focus: false,
        zIndex: 0,
        width: 0,
        height: 0,
        hasResize: false
    }
}


export function createVisualEditorConfig() {
    const componentList: VisualEditorComponent[] = []
    const componentMap: Record<string, VisualEditorComponent> = {}
    return {
        componentList,
        componentMap,
        registry: (key: string, component: Omit<VisualEditorComponent, "key">) => {
            let comp = { ...component, key }
            componentList.push(comp)
            componentMap[key] = comp
        }
    }
}

export type VisualEditorConfig = ReturnType<typeof createVisualEditorConfig>
