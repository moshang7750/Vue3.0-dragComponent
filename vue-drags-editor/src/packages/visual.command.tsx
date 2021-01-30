import { useCommander } from './plugins/command.plugin';
import deepcopy from 'deepcopy';
import {
  VisualEditorBlockData,
  VisualEditorModelValue
} from './visual-editor.utils';

export function useVisualCommand(
  {
    focusData,
    methods,
    dataModel,
    dragstart,
    dragend
  }: {
    focusData: {
      value: {
        focus: VisualEditorBlockData[];
        unfocus: VisualEditorBlockData[];
      };
    };
    methods: {
      updateBlocks: (blocks?: VisualEditorBlockData[]) => void;
    };
    dataModel: {
      value: VisualEditorModelValue;
    };
    dragstart: { on: (cb: () => void) => void; off: (cb: () => void) => void };
    dragend: { on: (cb: () => void) => void; off: (cb: () => void) => void };
  }
) {
  const commander = useCommander();
  // 删除命令
  commander.registry({
    name: 'delete',
    keyboard: ['backspace', 'delete', 'ctrl+d'],
    execute: () => {
      // console.log('执行删除命令');
      let data = {
        before: focusData.value.unfocus,                  // 执行之前的数据
        after: dataModel.value.blocks || []               // 执行之后的数据
      };
      return {
        undo: () => {
          // console.log('撤回删除命令');
          methods.updateBlocks(data.after);
        },
        redo: () => {
          // console.log('重做删除命令');
          methods.updateBlocks(data.before);
        }
      };
    }
  });
  /**
    * 拖拽 命令, 适用于三种情况
    * 1 从菜单拖拽组件到容器画布
    * 2 在容器中拖拽组件 调整位置
    * 3 拖拽 调整组件的宽高
    * 
  */
  commander.registry({
    name: 'drag',
    init() {
      this.data = {
        before: null as null | VisualEditorBlockData[],
        after: null as null | VisualEditorBlockData[]
      };
      const handler = {
        dragstart: () => this.data.before = deepcopy(dataModel.value.blocks),
        dragend: () => commander.state.commands.drag()
      };
      dragstart.on(handler.dragstart);
      dragend.on(handler.dragend);
      return () => {
        dragstart.off(handler.dragstart)
        dragend.off(handler.dragend);
      };
    },
    execute() {
      let before = this.data.before
      let after = deepcopy(dataModel.value.blocks);
      return {
        // 首先执行redo
        redo: () => {
          methods.updateBlocks(deepcopy(after));
        },
        undo: () => {
          methods.updateBlocks(deepcopy(before));
        }
      };
    },
  });
  // 清空命令
  commander.registry({
    name: 'clear',
    execute: () => {
      let before = deepcopy(dataModel.value.blocks || [])
      let after = deepcopy([]);
      return {
        // 首先执行redo
        redo: () => {
          methods.updateBlocks(deepcopy(after));
        },
        undo: () => {
          methods.updateBlocks(deepcopy(before || []));
        }
      };
    },
  });
  // 置顶
  commander.registry({
    name: 'placeTop',
    keyboard: 'ctrl+up',
    execute: () => {
      let before = deepcopy(dataModel.value.blocks || [])
      let after = deepcopy((() => {
        const { focus, unfocus } = focusData.value
        const maxZIndex = unfocus.reduce((prev, block) => {
          return Math.max(prev, block.zIndex) + 1
        }, -Infinity)
        focus.forEach(block => block.zIndex = maxZIndex)
        return deepcopy(dataModel.value.blocks || [])
      })());
      return {
        // 首先执行redo
        redo: () => {
          methods.updateBlocks(deepcopy(after))
        },
        undo: () => {
          methods.updateBlocks(deepcopy(before))
        }
      };
    },
  });
  // 置底
  commander.registry({
    name: 'placeBottom',
    keyboard: 'ctrl+down',
    execute: () => {
      let before = deepcopy(dataModel.value.blocks || [])
      let after = deepcopy((() => {
        const { focus, unfocus } = focusData.value
        let mixZIndex = unfocus.reduce((prev, block) => {
          return Math.min(prev, block.zIndex) - 1
        }, Infinity)
        if (mixZIndex < 0) {
          const dur = Math.abs(mixZIndex)
          unfocus.forEach(block => block.zIndex += dur)
          mixZIndex = 0
        }
        focus.forEach(block => block.zIndex = mixZIndex)
        return deepcopy(dataModel.value.blocks)
      })());
      return {
        // 首先执行redo
        redo: () => {
          methods.updateBlocks(deepcopy(after))
        },
        undo: () => {
          methods.updateBlocks(deepcopy(before))
        }
      };
    },
  });

  commander.registry({
    name: 'updateBlock',
    execute: (newBlock: VisualEditorBlockData, oldBlock: VisualEditorBlockData) => {
      let blocks = deepcopy(dataModel.value.blocks || [])
      let data = {
        before: blocks,
        after: (() => {
          blocks = [...blocks]
          const index = dataModel.value.blocks!.indexOf(oldBlock)
          if (index > -1) {
            blocks.splice(index, 1, newBlock)
          }
          return deepcopy(blocks)
        })()
      }
      return {
        redo: () => {
          methods.updateBlocks(deepcopy(data.after))
        },
        undo: () => {
          methods.updateBlocks(deepcopy(data.before))
        }
      }
    }
  })

  commander.registry({
    name: 'updateModelValue',
    execute: (value: VisualEditorModelValue) => {
      let data = {
        before: deepcopy(dataModel.value),
        after: deepcopy(value)
      }
      return {
        redo: () => {

          dataModel.value = data.after
        },
        undo: () => {
          dataModel.value = data.before
        }
      }
    }
  })

  commander.init();
  return {
    undo: () => commander.state.commands.undo(),
    redo: () => commander.state.commands.redo(),
    delete: () => commander.state.commands.delete(),
    clear: () => commander.state.commands.clear(),
    placeTop: () => commander.state.commands.placeTop(),
    placeBottom: () => commander.state.commands.placeBottom(),
    updateBlock: (newBlock: VisualEditorBlockData, oldBlock: VisualEditorBlockData) => commander.state.commands.updateBlock(newBlock, oldBlock),
    updateModelValue: (value: VisualEditorModelValue) => commander.state.commands.updateModelValue(value)
  };

}
