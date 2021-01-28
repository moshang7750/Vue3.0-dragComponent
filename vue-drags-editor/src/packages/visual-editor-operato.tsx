import { defineComponent, PropType, reactive, watch } from "vue";
import { VisualEditorBlockData, VisualEditorConfig, VisualEditorModelValue } from "./visual-editor.utils";
import { ElButton, ElColorPicker, ElForm, ElFormItem, ElInput, ElInputNumber, ElOption, ElSelect } from 'element-plus'
import { VisualEditorProps, VisualEditorPropsType } from "./visual-editor.props";
import deepcopy from "deepcopy";

export const VisualEditorOperato = defineComponent({
    props: {
        block: { type: Object as PropType<VisualEditorBlockData> },
        config: { type: Object as PropType<VisualEditorConfig>, required: true },
        dataModel: { type: Object as PropType<{ value: VisualEditorModelValue }>, required: true },
        updateBlock: { type: Function as PropType<(newBlock: VisualEditorBlockData, oldBlock: VisualEditorBlockData) => void>, required: true },
        updateModelValue: { type: Function as PropType<(val: VisualEditorModelValue) => void>, required: true },
    },
    setup(props) {
        const state = reactive({
            editData: '' as any
        })
        const methods = {
            apply: () => {
                if (!props.block) { // 编辑容器
                    props.updateModelValue({
                        ...props.dataModel.value,
                        container: state.editData
                    })
                } else { // 编辑组件
                    const newBlock = {
                        ...props.block,
                        props: state.editData
                    }

                    props.updateBlock(newBlock, props.block)
                }
            },
            reset: () => {
                if (!props.block) {  // 编辑容器
                    state.editData = deepcopy(props.dataModel.value.container)
                } else {  // 编辑组件 
                    state.editData = deepcopy(props.block.props || {})
                }
            }
        }
        watch(() => props.block, () => {
            methods.reset()
        }, {
            immediate: true
        })

        const renderEditor = (propName: string, propConfig: VisualEditorProps) => {
            return {
                [VisualEditorPropsType.input]: () => (<ElInput v-model={state.editData[propName]} />),
                [VisualEditorPropsType.color]: () => (<ElColorPicker v-model={state.editData[propName]} />),
                [VisualEditorPropsType.select]: () => (<ElSelect v-model={state.editData[propName]} >
                    {
                        propConfig.options && propConfig.options.map(opt => (
                            <ElOption label={opt.label} value={opt.val} />
                        ))
                    }
                </ElSelect >)
            }[propConfig.type]
        }

        return () => {
            let content: JSX.Element | null = null
            if (!props.block) {
                content = <>
                    <ElFormItem label="容器宽度">
                        <ElInputNumber v-model={state.editData.width} {...{ step: 100 } as any} />
                    </ElFormItem>
                    <ElFormItem label="容器高度">
                        <ElInputNumber v-model={state.editData.height} {...{ step: 100 } as any} />
                    </ElFormItem>
                </>
            } else {
                const { componentKey } = props.block
                const component = props.config.componentMap[componentKey]
                if (!!component && !!component.props) {
                    content = <>
                        {Object.entries(component.props || {}).map(([propName, propConfig]) => {
                            return <ElFormItem label={propConfig.label} key={propName}>

                                {renderEditor(propName, propConfig)}
                                {/* {{
                                    [VisualEditorPropsType.input]: (<ElInput v-model={state.editData} />),
                                    [VisualEditorPropsType.color]: (<ElColorPicker v-model={state.editData} />),
                                    [VisualEditorPropsType.select]: (<ElSelect v-model={state.editData}  >
                                        { propConfig.options && propConfig.options.map(opt => (
                                            <ElOption label={opt.label} value={opt.val} />
                                        ))}
                                    </ElSelect>)
                                }[propConfig.type]} */}

                            </ElFormItem>
                        })}
                    </>
                }

            }
            return (
                <div class="visual-editor-operator">
                    <ElForm labelPosition="top">
                        {content}
                        <ElFormItem>
                            <ElButton type="primary" {...{ onClick: methods.apply } as any}> 应用</ElButton>
                            <ElButton type="default" {...{ onClick: methods.reset } as any}>重置</ElButton>
                        </ElFormItem>
                    </ElForm>
                </div>
            )
        }
    }
})