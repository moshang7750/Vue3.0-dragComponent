import { defineComponent, PropType, computed, ref } from 'vue';
import './visual-editor.scss';
import {
  VisualEditorModelValue,
  VisualEditorConfig,
  VisualEditorComponent
} from './visual-editor.utils';
import { useModel } from './utils/useModel';
import { VisualEditorBlock } from './visual-editor-block';
export const VisualEditor = defineComponent({
  props: {
    modelValue: {
      type: Object as PropType<VisualEditorModelValue>,
      required: true
    },
    config: { type: Object as PropType<VisualEditorConfig>, required: true }
  },
  emits: {
    'update:modelValue': (val?: VisualEditorModelValue) => true
  },
  setup(props, ctx) {
    const dataModel = useModel(
      () => props.modelValue,
      val => ctx.emit('update:modelValue', val)
    );

    /* 渲染容器 */
    const containerRef = ref({} as HTMLDivElement);
    /*容器节点样式*/
    const containerStyles = computed(() => ({
      width: `${dataModel.value.container.width}px`,
      height: `${dataModel.value.container.height}px`
    }));
    // 拖拽事件
    const mutuDraggier = (() => {
      let current = null as null | VisualEditorComponent;
      const blockHandler = {
        dragstart: (e: DragEvent, component: VisualEditorComponent) => {
          containerRef.value.addEventListener(
            'dragenter',
            containerHandler.dragenter
          );
          containerRef.value.addEventListener(
            'dragover',
            containerHandler.dragover
          );
          containerRef.value.addEventListener(
            'dragleave',
            containerHandler.dragleave
          );
          containerRef.value.addEventListener('drop', containerHandler.drop);
          current = component;
        },
        dragend: (e: DragEvent) => {
          containerRef.value.removeEventListener(
            'dragenter',
            containerHandler.dragenter
          );
          containerRef.value.removeEventListener(
            'dragover',
            containerHandler.dragover
          );
          containerRef.value.removeEventListener(
            'dragleave',
            containerHandler.dragleave
          );
          containerRef.value.removeEventListener('drop', containerHandler.drop);
          current = null;
        }
      };
      const containerHandler = {
        dragenter: (e: DragEvent) => (e.dataTransfer!.dropEffect = 'move'),
        dragover: (e: DragEvent) => e.preventDefault(),
        dragleave: (e: DragEvent) => (e.dataTransfer!.dropEffect = 'none'),
        drop: (e: DragEvent) => {
          // console.log('drop', current);
          const value = dataModel.value.blocks || [];
          value.push({
            top: e.offsetY,
            left: e.offsetX,
            componentKey: current!.key
          });
          dataModel.value = {
            ...dataModel.value,
            blocks: value
          };
        }
      };
      return blockHandler;
    })();

    return () => (
      <div class="visual-editor">
        <div class="visual-editor-metu">
          {props.config.componentList.map(comp => (
            <div
              class="visual-editor-metu-item"
              draggable
              onDragstart={e => mutuDraggier.dragstart(e, comp)}
              onDragend={mutuDraggier.dragend}
            >
              <span class="visual-editor-metu-label">{comp.label}</span>
              {comp.preview()}
            </div>
          ))}
        </div>
        <div class="visual-editor-head">visual-editor-head</div>
        <div class="visual-editor-operator">visual-editor-operato</div>
        <div class="visual-editor-body">
          <div class="visual-editor-content">
            <div
              ref={containerRef}
              class="visual-editor-container"
              style={containerStyles.value}
            >
              {!!dataModel.value &&
                dataModel.value.blocks.map((block, index) => (
                  <VisualEditorBlock
                    config={props.config}
                    block={block}
                    key={index}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
});
