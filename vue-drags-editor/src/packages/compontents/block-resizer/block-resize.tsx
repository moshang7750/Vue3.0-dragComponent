import { VisualEditorBlockData, VisualEditorComponent } from "@/packages/visual-editor.utils";
import { defineComponent, PropType } from "vue";
import './block-resize.scss'
export const BlockResize = defineComponent({
    props: {
        block: { type: Object as PropType<VisualEditorBlockData>, required: true },
        component: { type: Object as PropType<VisualEditorComponent>, required: true },
    },
    setup(props, ctx) {


        return () => {
            const { width, height } = props.component.resize || {}
            return <>
                {!!height && <>
                    <div class="block-resize block-resize-top" />
                    <div class="block-resize block-resize-bottom" />
                </>}
                {!!width && <>
                    <div class="block-resize block-resize-left" />
                    <div class="block-resize block-resize-right" />
                </>}

                { !!width && !!height && <>
                    <div class="block-resize block-resize-top-left" />
                    <div class="block-resize block-resize-top-right" />
                    <div class="block-resize block-resize-bottom-left" />
                    <div class="block-resize block-resize-bottom-right" />
                </>}



            </>
        }
    }
})