import deepcopy from "deepcopy";
import { ElButton, ElDialog, ElInput, ElTable, ElTableColumn } from "element-plus";
import { createApp, defineComponent, getCurrentInstance, onMounted, PropType, reactive } from "vue";
import { defer } from "../utils/defer";
import { VisualEditorProps } from "../visual-editor.props";

export interface TablePropEditorServiceOption {
    data: any[],
    config: VisualEditorProps,
    onConfirm: (val: any[]) => void
}

const keyGenerator = (() => {
    let count = 0
    return () => `auto_key_${count++}`
})()
const ServiceComponent = defineComponent({
    props: {
        option: { type: Object as PropType<TablePropEditorServiceOption>, required: true }
    },
    setup(props) {
        const ctx = getCurrentInstance()!
        const state = reactive({
            option: props.option,
            showFlag: false,
            mounted: (() => {
                const dfd = defer()
                onMounted(() => {
                    setTimeout(() => dfd.resolve(), 0)
                })
                return dfd.promise
            })(),
            editData: [] as any[]
        })


        const methods = {
            service: (option: TablePropEditorServiceOption) => {
                state.option = option
                state.editData = deepcopy(option.data || [])
                methods.show()
            },
            show: async () => {
                await state.mounted
                state.showFlag = true
            },
            hide: () => {
                state.showFlag = false

            },
            add: () => {
                state.editData.push({})
            },
            reset: () => {
                state.editData = deepcopy(state.option.data)
            },
            delete: (row: any) => {
                console.log(row, 'row')
            }
        }
        const handler = {
            onConfirm: () => {
                state.option.onConfirm(state.editData)
                methods.hide()
            },
            onCencel: () => {
                methods.hide()
            }
        }

        Object.assign(ctx.proxy!, methods)
        // @ts-ignore
        return () => (
            <ElDialog  {...{ modelValue: state.showFlag } as any} >
                {{
                    default: () => (
                        <div>
                            <div>
                                <ElButton {...{ onClick: methods.add } as any}>添加</ElButton>
                                <ElButton {...{ onClick: methods.reset } as any}>重置</ElButton>
                            </div>
                            <ElTable data={state.editData}>
                                <ElTableColumn {...{ type: 'index' } as any} />

                                {state.option.config.table!.options.map((item, index) => (
                                    <ElTableColumn  {...{ label: item.label }}>
                                        {{
                                            default: ({ row }: { row: any }) => (
                                                <ElInput v-model={row[item.field]} />
                                            )
                                        }}
                                    </ElTableColumn>
                                ))}
                                <ElTableColumn  {...{ label: '操作拦' } as any}>
                                    {{
                                        default: ({ row }: { row: any }) => (
                                            <ElButton type="danger"  {...{ onClick: methods.delete(row) }}>删除</ElButton>
                                        )
                                    }}
                                </ElTableColumn>
                            </ElTable>
                        </div>
                    ),
                    footer: () => (<>
                        <ElButton type="text"  {...{ onClick: handler.onCencel }} >取消</ElButton>
                        <ElButton type="primary" {...{ onClick: handler.onConfirm }} >确定</ElButton>
                    </>)
                }}


            </ElDialog>


        )

    }
})

export const $$tablePropEditor = (() => {
    let ins: any
    return (option: Omit<TablePropEditorServiceOption, 'onConfirm'>) => {
        if (!ins) {
            const el = document.createElement('div')
            document.body.appendChild(el)
            const app = createApp(ServiceComponent, { option })
            ins = app.mount(el)
        }
        const dfd = defer<any[]>()
        ins.service({
            ...option,
            onConfirm: dfd.resolve,
        })
        return dfd.promise
    }
})()
