import { defineComponent, PropType, reactive, watch } from "vue";
import { VisualEditorBlockData, VisualEditorConfig, VisualEditorModelValue } from "./visual-editor.utils";
import { ElColorPicker, ElForm, ElFormItem, ElInput, ElInputNumber, ElOption, ElSelect } from 'element-plus'
import { VisualEditorProps, VisualEditorPropsType } from "./visual-editor.props";
import deepcopy from "deepcopy";

export const VisualEditorOperato = defineComponent({
    props: {
        block: { type: Object as PropType<VisualEditorBlockData> },
        config: { type: Object as PropType<VisualEditorConfig>, required: true },
        dataModel: { type: Object as PropType<{ value: VisualEditorModelValue }>, required: true },
    },
    setup(props) {
        const state = reactive({
            editData: '' as any
        })
        watch(() => props.block, (val) => {
            if (!val) {  // 编辑容器
                state.editData = deepcopy(props.dataModel.value.container)
            } else {  // 编辑组件 
                state.editData = deepcopy(val.props || {})
            }
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
                        <ElInputNumber v-model={state.editData.width} />
                    </ElFormItem>
                    <ElFormItem label="容器高度">
                        <ElInputNumber v-model={state.editData.height} />
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
                    </ElForm>
                </div>
            )
        }
    }
})