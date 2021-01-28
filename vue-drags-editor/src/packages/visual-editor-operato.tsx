import { defineComponent, PropType, reactive } from "vue";
import { VisualEditorBlockData, VisualEditorConfig } from "./visual-editor.utils";
import { ElColorPicker, ElForm, ElFormItem, ElInput, ElInputNumber, ElOption, ElSelect } from 'element-plus'
import { VisualEditorProps, VisualEditorPropsType } from "./visual-editor.props";

export const VisualEditorOperato = defineComponent({
    props: {
        block: { type: Object as PropType<VisualEditorBlockData> },
        config: { type: Object as PropType<VisualEditorConfig>, required: true },
    },
    setup(props) {
        const state = reactive({
            editData: '' as any
        })

        const renderEditor = (propName: string, propConfig: VisualEditorProps) => {
            return {
                [VisualEditorPropsType.input]: () => (<ElInput v-model={state.editData} />),
                [VisualEditorPropsType.color]: () => (<ElColorPicker v-model={state.editData} />),
                [VisualEditorPropsType.select]: () => (<ElSelect v-model={state.editData}>
                    { propConfig.options && propConfig.options.map(opt => (
                        <ElOption label={opt.label} value={opt.val} />
                    ))}
                </ElSelect>)
            }[propConfig.type]
        }

        return () => {
            let content: JSX.Element | null = null
            if (!props.block) {
                content = <>
                    <ElFormItem label="容器宽度">
                        <ElInputNumber {...{ modelValue: 1 }} />
                    </ElFormItem>
                    <ElFormItem label="容器高度">
                        <ElInputNumber {...{ modelValue: 1 }} />
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
                    <ElForm>
                        {content}
                    </ElForm>
                </div>
            )
        }
    }
})