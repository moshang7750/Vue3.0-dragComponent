import { defineComponent, PropType, computed, ref } from 'vue';
import './visual-editor.scss';
import {
  VisualEditorModelValue,
  VisualEditorConfig,
  VisualEditorComponent,
  createNewBlock,
  VisualEditorBlockData
} from './visual-editor.utils';
import { useModel } from './utils/useModel';
import { VisualEditorBlock } from './visual-editor-block';
import { useVisualCommand } from './utils/visual.command';
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
    // 容器组件数据
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
    // 计算选中与为选中的组件数据
    const focusData = computed(() => {
      let focus: VisualEditorBlockData[] = [];
      let unfocus: VisualEditorBlockData[] = [];
      let blocks = dataModel.value.blocks || [];
      blocks.forEach((block: VisualEditorBlockData) => {
        (block.focus ? focus : unfocus).push(block);
      });
      return {
        focus, // 选中的组件数据
        unfocus // 未选中的组件数据
      };
    });

    // 菜单组件拖拽到容器事件
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
          value.push(
            createNewBlock({
              component: current!,
              top: e.offsetY,
              left: e.offsetX
            })
          );
          dataModel.value = {
            ...dataModel.value,
            blocks: value
          };
        }
      };
      return blockHandler;
    })();
    // 事件
    const methods = {
      clearFocus: (block?: VisualEditorBlockData) => {
        let blocks = dataModel.value.blocks || [];
        if (blocks.length == 0) return;
        if (block) {
          blocks = blocks.filter(item => item !== block);
        }
        blocks.forEach(block => (block.focus = false));
      }
    };
    const blockDraggier = (() => {
      let dragState = {
        startX: 0,
        startY: 0,
        startPos: [] as { left: number; top: number }[]
      };
      const mousedown = (e: MouseEvent) => {
        dragState = {
          startX: e.clientX,
          startY: e.clientY,
          startPos: focusData.value.focus.map(({ top, left }) => ({
            top,
            left
          }))
        };
        document.addEventListener('mousemove', mousemove);
        document.addEventListener('mouseup', mouseup);
      };
      const mousemove = (e: MouseEvent) => {
        const durX = e.clientX - dragState.startX;
        const durY = e.clientY - dragState.startY;
        focusData.value.focus.forEach(
          (block: VisualEditorBlockData, index: number) => {
            block.top = dragState.startPos[index].top + durY;
            block.left = dragState.startPos[index].left + durX;
          }
        );
      };
      const mouseup = (e: MouseEvent) => {
        document.removeEventListener('mousemove', mousemove);
        document.removeEventListener('mouseup', mouseup);
      };

      return { mousedown };
    })();
    // 组件激活函数
    const focusHandler = (() => {
      return {
        container: {
          onMousedown: (e: MouseEvent) => {
            e.stopPropagation(); // 阻止冒泡
            e.preventDefault(); // 阻止事件默认行为
            (dataModel.value.blocks || []).forEach(
              block => (block.focus = false)
            );
          }
        },
        block: {
          onMousedown: (e: MouseEvent, block: VisualEditorBlockData) => {
            e.stopPropagation(); // 阻止冒泡
            e.preventDefault(); // 阻止事件默认行为
            if (e.shiftKey) {
              // shift是否按下
              if (focusData.value.focus.length <= 1) {
                block.focus = true;
              } else {
                block.focus = !block.focus;
              }
            } else {
              // 如果当前 组件没有被选中 那么就选中当前组件，清除其他的组件的选中状态
              if (!block.focus) {
                block.focus = true;
                methods.clearFocus(block);
              }
            }
            blockDraggier.mousedown(e);
          }
        }
      };
    })();

    const commander = useVisualCommand();
    /*操作栏按钮*/
    const buttons = [
      {
        label: '撤销',
        icon: 'icon-back',
        handler: commander.undo,
        tip: 'ctrl+z'
      },
      {
        label: '重做',
        icon: 'icon-forward',
        handler: commander.redo,
        tip: 'ctrl+y, ctrl+shift+z'
      },
      {
        label: '删除',
        icon: 'icon-delete',
        handler: () => commander.delete,
        tip: 'ctrl+d, backspace, delete'
      }
      // {
      //   label: () => (previewModel.value ? '编辑' : '预览'),
      //   icon: () => (previewModel.value ? 'icon-edit' : 'icon-browse'),
      //   handler: () => {
      //     if (!previewModel.value) {
      //       methods.clearFocus();
      //     }
      //     previewModel.value = !previewModel.value;
      //   }
      // },
      // {
      //   label: '导入',
      //   icon: 'icon-import',
      //   handler: async () => {
      //     const text = await $dialog.textarea('', {
      //       title: '请输入导入的JSON数据'
      //     });
      //     if (!text) {
      //       return;
      //     }
      //     try {
      //       const data = JSON.parse(text);
      //       commander.updateModelValue(data);
      //     } catch (e) {
      //       ElNotification({
      //         title: '导入失败！',
      //         message: '导入的数据格式不正常，请检查！'
      //       });
      //     }
      //   }
      // },
      // {
      //   label: '导出',
      //   icon: 'icon-export',
      //   handler: () =>
      //     $dialog.textarea(JSON.stringify(dataModel.value), {
      //       title: '导出的JSON数据',
      //       editReadonly: true
      //     })
      // },
      // {
      //   label: '置顶',
      //   icon: 'icon-place-top',
      //   handler: () => commander.placeTop(),
      //   tip: 'ctrl+up'
      // },
      // {
      //   label: '置底',
      //   icon: 'icon-place-bottom',
      //   handler: () => commander.placeBottom(),
      //   tip: 'ctrl+down'
      // },

      // { label: '清空', icon: 'icon-reset', handler: () => commander.clear() },
      // {
      //   label: '关闭',
      //   icon: 'icon-close',
      //   handler: () => {
      //     methods.clearFocus();
      //     state.editFlag = false;
      //   }
      // }
    ];
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
        <div class="visual-editor-head">
          {buttons.map((btn, index) => (
            <div key={index} class="visual-editor-head-button">
              <i class={`iconfont ${btn.icon}`}></i>
              <span>{btn.label}</span>
            </div>
          ))}
        </div>
        <div class="visual-editor-operator">visual-editor-operato</div>
        <div class="visual-editor-body">
          <div class="visual-editor-content">
            <div
              ref={containerRef}
              class="visual-editor-container"
              style={containerStyles.value}
              {...focusHandler.container}
            >
              {!!dataModel.value &&
                dataModel.value.blocks.map((block, index) => (
                  <VisualEditorBlock
                    config={props.config}
                    block={block}
                    key={index}
                    {...{
                      onMousedown: (e: MouseEvent) =>
                        focusHandler.block.onMousedown(e, block)
                    }}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
});
