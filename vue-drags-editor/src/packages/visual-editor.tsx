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
    const handle = {
      current: {
        component: null as null | VisualEditorComponent
      },
      dragstart: (e: DragEvent, component: VisualEditorComponent) => {
        containerRef.value.addEventListener('dragenter', handle.dragenter);
        containerRef.value.addEventListener('dragover', handle.dragover);
        containerRef.value.addEventListener('dragleave', handle.dragleave);
        containerRef.value.addEventListener('drop', handle.drop);
        handle.current.component = component;
      },
      dragenter: (e: DragEvent) => {
        e.dataTransfer!.dropEffect = 'move';
      },
      dragover: (e: DragEvent) => {
        e.preventDefault();
      },
      dragleave: (e: DragEvent) => {
        e.dataTransfer!.dropEffect = 'none';
      },
      dragend: (e: DragEvent) => {
        handle.current.component = null;
        containerRef.value.removeEventListener('dragenter', handle.dragenter);
        containerRef.value.removeEventListener('dragover', handle.dragover);
        containerRef.value.removeEventListener('dragleave', handle.dragleave);
        containerRef.value.removeEventListener('drop', handle.drop);
      },
      drop: (e: DragEvent) => {
        console.log('drop', handle.current.component);
        ``;
        const value = dataModel.value.blocks || [];
        value.push({
          top: e.offsetY,
          left: e.offsetX
        });
        dataModel.value = {
          ...dataModel.value,
          blocks: value
        };
      }
    };
    return () => (
      <div class="visual-editor">
        <div class="visual-editor-metu">
          {props.config.componentList.map(comp => (
            <div
              class="visual-editor-metu-item"
              draggable
              onDragstart={e => handle.dragstart(e, comp)}
              onDragend={handle.dragend}
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
              onDrop={handle.drop}
            >
              {!!dataModel.value &&
                dataModel.value.blocks.map((block, index) => (
                  <VisualEditorBlock block={block} key={index} />
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
});
