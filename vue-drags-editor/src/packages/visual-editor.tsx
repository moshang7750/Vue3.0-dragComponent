import { defineComponent, PropType, computed, ref, reactive } from 'vue';
import './visual-editor.scss';
import { createEvent } from './plugins/event';
import {
  VisualEditorModelValue,
  VisualEditorConfig,
  VisualEditorComponent,
  createNewBlock,
  VisualEditorBlockData,
  VisualEditorMarkLine
} from './visual-editor.utils';
import { useModel } from './utils/useModel';
import { VisualEditorBlock } from './visual-editor-block';
import { useVisualCommand } from './utils/visual.command';
import { $$dialog } from './utils/dialog-service';
import { ElMessageBox } from 'element-plus'
import { $$dropdown, DropdownOption } from './utils/dropdown.service';
import { VisualEditorOperato } from './visual-editor-operato';
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
      height: `${dataModel.value.container.height}px`,
    }));
    // 计算选中与为选中的组件数据
    const focusData = computed(() => {
      let focus: VisualEditorBlockData[] = [];
      let unfocus: VisualEditorBlockData[] = [];
      dataModel.value.blocks?.forEach(block => {
        (block.focus ? focus : unfocus).push(block);
      });
      return {
        focus, // 选中的组件数据
        unfocus // 未选中的组件数据
      };
    });
    const state = reactive(({
      selectBlock: undefined as undefined | VisualEditorBlockData, // 当前选中的组件
    }))
    // 事件观察者
    const dragstart = createEvent();
    const dragend = createEvent();
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
          dragstart.emit();
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
          const blocks = [...(dataModel.value.blocks || [])];
          blocks.push(createNewBlock({
            component: current!,
            top: e.offsetY,
            left: e.offsetX,
          })
          );
          // 更新最新的组件数据
          methods.updateBlocks(blocks);
          dragend.emit();
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
      },
      updateBlocks: (blocks?: VisualEditorBlockData[]) => {
        dataModel.value = {
          ...dataModel.value,
          blocks
        };
      },
      showBlockData: (block: VisualEditorBlockData) => {
        $$dialog.textarea(JSON.stringify(block), '节点数据', { editReadonly: true })
      },
      importBlockData: async (block: VisualEditorBlockData) => {
        const text = await $$dialog.textarea('', '请输入节点JSON字符串')
        try {
          const data = JSON.parse(text || '')
          commander.updateBlock(data, block)
        } catch (error) {
          ElMessageBox.alert('解析JSON字符串出错')
        }
      }
    };
    const blockDraggier = (() => {
      const mark = reactive({
        x: null as null | number,
        y: null as null | number
      })
      let dragState = {
        startX: 0,
        startY: 0,
        startLeft: 0,
        startTop: 0,
        startPos: [] as { left: number; top: number }[],
        dragging: false,
        markLines: {} as VisualEditorMarkLine
      };
      const mousedown = (e: MouseEvent) => {
        dragState = {
          startX: e.clientX,
          startY: e.clientY,
          startLeft: state.selectBlock!.left,
          startTop: state.selectBlock!.top,
          startPos: focusData.value.focus.map(({ top, left }) => ({
            top,
            left
          })),
          dragging: false,
          markLines: (() => {
            const { focus, unfocus } = focusData.value
            const { top, left, width, height, hasResize } = state.selectBlock!
            let lines: VisualEditorMarkLine = { x: [], y: [] }
            unfocus.forEach(block => {
              const { top: t, left: l, width: w, height: h } = block
              lines.y.push({ top: t, showTop: t })                                // 顶部对齐顶部
              lines.y.push({ top: t + h, showTop: t + h })                        // 顶部对齐底部
              lines.y.push({ top: t + h / 2 - height / 2, showTop: t + h / 2 })  // 中间对齐中间 (垂直)
              lines.y.push({ top: t - height, showTop: t })                     // 底部对齐顶部
              lines.y.push({ top: t + h - height, showTop: t + h })              // 底部对齐底部 

              lines.x.push({ left: l, showLeft: l })                                  // 顶部对齐顶部
              lines.x.push({ left: l + w, showLeft: l + w })                          // 顶部对齐底部
              lines.x.push({ left: l + w / 2 - width / 2, showLeft: l + w / 2 })   // 中间对齐中间 (垂直)
              lines.x.push({ left: t - width, showLeft: l })                        // 底部对齐顶部
              lines.x.push({ left: l + w - width, showLeft: l + w })                 // 底部对齐底部 

            })
            //  
            return lines
          })()
        };
        document.addEventListener('mousemove', mousemove);
        document.addEventListener('mouseup', mouseup);
      };
      const mousemove = (e: MouseEvent) => {
        if (!dragState.dragging) {
          dragState.dragging = true
          dragstart.emit()
        }
        let { clientX: moveX, clientY: moveY } = e
        const { startX, startY } = dragState
        if (e.shiftKey) { // 水平 或垂直移动
          if (Math.abs(moveX - startX) > Math.abs(moveY - startY)) { // 以横向为主
            moveX = startX
          } else {
            moveY = startY
          }
        }

        const currentLeft = dragState.startLeft + moveX - startX
        const currentTop = dragState.startTop + moveY - startY
        const currentMark = {
          x: null as null | number,
          y: null as null | number,
        }


        for (let i = 0; i < dragState.markLines.y.length; i++) {
          const { top, showTop } = dragState.markLines.y[i]
          if (Math.abs(top - currentTop) < 3) {
            moveY = top + startY - dragState.startTop
            currentMark.y = showTop
            break
          }
        }
        for (let i = 0; i < dragState.markLines.x.length; i++) {
          const { left, showLeft } = dragState.markLines.x[i]
          if (Math.abs(left - currentLeft) < 3) {
            moveX = left + startX - dragState.startLeft
            currentMark.x = showLeft
            break
          }
        }
        mark.x = currentMark.x
        mark.y = currentMark.y

        const durX = moveX - startX
        const durY = moveY - startY

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
        mark.x = mark.y = null
        if (dragState.dragging) {
          dragend.emit()
        }
      };

      return { mark, mousedown };
    })();
    // 组件激活函数
    const focusHandler = (() => {
      return {
        container: {
          onMousedown: (e: MouseEvent) => {
            e.preventDefault(); // 阻止事件默认行为
            if (e.currentTarget !== e.target) return
            if (!e.shiftKey) {
              methods.clearFocus()
              state.selectBlock = undefined
            }
          }
        },
        block: {
          onMousedown: (e: MouseEvent, block: VisualEditorBlockData) => {
            // e.stopPropagation(); // 阻止冒泡
            // e.preventDefault(); // 阻止事件默认行为
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
            state.selectBlock = block
            blockDraggier.mousedown(e);
          }
        }
      };
    })();
    // 右键菜单处理函数
    const handler = {
      onContextmetuBlock: (e: MouseEvent, block: VisualEditorBlockData) => {
        e.stopPropagation()
        e.preventDefault()
        $$dropdown({
          reference: e,
          content: () => (
            <>
              <DropdownOption label="置顶节点" icon="icon-place-top" {...{ onClick: commander.placeTop }} />
              <DropdownOption label="置底节点" icon="icon-place-bottom" {...{ onClick: commander.placeBottom }} />
              <DropdownOption label="删除节点" icon="icon-delete" {...{ onClick: commander.delete }} />
              <DropdownOption label="查看数据" icon="icon-browse" {...{ onClick: () => methods.showBlockData(block) }} />
              <DropdownOption label="导入节点" icon="icon-import" {...{ onClick: () => methods.importBlockData(block) }} />
            </>
          )
        })
      }
    }
    //  命令对象 
    const commander = useVisualCommand({
      focusData,
      methods,
      dataModel,
      dragstart,
      dragend
    });
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
        label: '导入', icon: 'icon-import', handler: async () => {
          const text = await $$dialog.textarea('', '请输入导入的JSON字符串')
          try {
            const data = JSON.parse(text || '')
            dataModel.value = data
          } catch (e) {
            ElMessageBox.alert('解析JSON字符串出错')
          }
        }
      },
      { label: '导出', icon: 'icon-export', handler: () => $$dialog.textarea(JSON.stringify(dataModel.value), '导出的JSON数据', { editReadonly: true }) },
      {
        label: '删除',
        icon: 'icon-delete',
        handler: () => commander.delete(),
        tip: 'ctrl+d, backspace, delete'
      },
      { label: '置顶', icon: 'icon-place-top', handler: () => commander.placeTop(), tip: 'ctrl+up' },
      { label: '置底', icon: 'icon-place-bottom', handler: () => commander.placeBottom(), tip: 'ctrl+down' },
      { label: '清空', icon: 'icon-reset', handler: () => commander.clear() },
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
          {buttons.map((btn, index) => {
            const content = (<div
              key={index}
              class="visual-editor-head-button"
              onClick={btn.handler}
            >
              <i class={`iconfont ${btn.icon}`}></i>
              <span>{btn.label}</span>
            </div>)
            return !btn.tip ? content : (
              <el-tooltip effect="dark" content={btn.tip} placement="bottom">
                {content}
              </el-tooltip>
            )
          }

          )}
        </div>
        <VisualEditorOperato block={state.selectBlock} config={props.config} />
        <div class="visual-editor-body">
          <div class="visual-editor-content">
            <div
              ref={containerRef}
              class="visual-editor-container"
              style={containerStyles.value}
              {...focusHandler.container}
            >
              {!!dataModel.value &&
                dataModel.value.blocks?.map((block, index) => (
                  <VisualEditorBlock
                    config={props.config}
                    block={block}
                    key={index}
                    {...{
                      onMousedown: (e: MouseEvent) =>
                        focusHandler.block.onMousedown(e, block),
                      onContextmenu: (e: MouseEvent) => handler.onContextmetuBlock(e, block)
                    }}
                  />
                ))}

              {blockDraggier.mark.y !== null && (
                <div class="visual-editor-mark-line-y" style={{ top: `${blockDraggier.mark.y}px` }}></div>
              )}
              {blockDraggier.mark.x !== null && (
                <div class="visual-editor-mark-line-x" style={{ left: `${blockDraggier.mark.x}px` }}></div>
              )}

            </div>
          </div>
        </div>
      </div>
    );
  }
});
