import { VisualEditorBlockData, VisualEditorComponent } from "@/packages/visual-editor.utils";
import { defineComponent, PropType } from "vue";
import './block-resize.scss'

enum Direction {
    start = 'start',
    center = 'center',
    end = 'end'
}

export const BlockResize = defineComponent({
    props: {
        block: { type: Object as PropType<VisualEditorBlockData>, required: true },
        component: { type: Object as PropType<VisualEditorComponent>, required: true },
    },
    setup(props, ctx) {
        const onMousedown = (() => {
            let data = {
                startX: 0,
                startY: 0,
                startWidth: 0,
                startHeigt: 0,
                startLeft: 0,
                startTop: 0,
                direction: {
                    horizontal: Direction.start,
                    vertical: Direction.start
                }
            }
            const mousedown = (e: MouseEvent, direction: {
                horizontal: Direction,
                vertical: Direction
            }) => {
                e.stopPropagation()
                document.body.addEventListener('mousemove', mousemove)
                document.body.addEventListener('mouseup', mouseup)
                data = {
                    startX: e.clientX,
                    startY: e.clientY,
                    startWidth: props.block.width,
                    startHeigt: props.block.height,
                    startLeft: props.block.left,
                    startTop: props.block.top,
                    direction,

                }
            }
            const mousemove = (e: MouseEvent) => {
                let { startX, startY, startWidth, startHeigt, direction, startLeft, startTop } = data
                let { clientX: moveX, clientY: moveY } = e
                if (direction.horizontal == Direction.center) {
                    moveX = startX
                }
                if (direction.vertical == Direction.center) {
                    moveY = startY
                }
                let durX = moveX - startX
                let durY = moveY - startY
                const block = props.block as VisualEditorBlockData

                if (direction.vertical == Direction.start) {
                    durY = -durY
                    block.top = startTop - durY
                }
                if (direction.horizontal == Direction.start) {
                    durX = -durX
                    block.left = startLeft - durX
                }
                const width = startWidth + durX
                const height = startHeigt + durY

                block.width = width
                block.height = height
                block.hasResize = true


            }
            const mouseup = (e: MouseEvent) => {
                document.body.removeEventListener('mousemove', mousemove)
                document.body.removeEventListener('mouseup', mouseup)
            }
            return mousedown
        })()

        return () => {
            const { width, height } = props.component.resize || {}
            return <>
                {!!height && <>
                    <div class="block-resize block-resize-top"
                        onMousedown={e => onMousedown(e, { horizontal: Direction.center, vertical: Direction.start })} />
                    <div class="block-resize block-resize-bottom"
                        onMousedown={e => onMousedown(e, { horizontal: Direction.center, vertical: Direction.end })} />
                </>}
                {!!width && <>
                    <div class="block-resize block-resize-left"
                        onMousedown={e => onMousedown(e, { horizontal: Direction.start, vertical: Direction.center })} />
                    <div class="block-resize block-resize-right"
                        onMousedown={e => onMousedown(e, { horizontal: Direction.end, vertical: Direction.center })} />
                </>}

                { !!width && !!height && <>
                    <div class="block-resize block-resize-top-left"
                        onMousedown={e => onMousedown(e, { horizontal: Direction.start, vertical: Direction.start })} />
                    <div class="block-resize block-resize-top-right"
                        onMousedown={e => onMousedown(e, { horizontal: Direction.end, vertical: Direction.start })} />
                    <div class="block-resize block-resize-bottom-left"
                        onMousedown={e => onMousedown(e, { horizontal: Direction.start, vertical: Direction.end })} />
                    <div class="block-resize block-resize-bottom-right"
                        onMousedown={e => onMousedown(e, { horizontal: Direction.end, vertical: Direction.end })} />
                </>}



            </>
        }
    }
})