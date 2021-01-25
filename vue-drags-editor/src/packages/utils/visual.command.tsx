import { useCommander } from '../plugins/command.plugin';
import deepcopy from 'deepcopy';
import {
  VisualEditorBlockData,
  VisualEditorModelValue
} from '../visual-editor.utils';

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
      updateBlocks: (blocks: VisualEditorBlockData[]) => void;
    };
    dataModel: {
      value: VisualEditorModelValue;
    };
    dragstart: { on: (cb: () => void) => void; off: (cb: () => void) => void };
    dragend: { on: (cb: () => void) => void; off: (cb: () => void) => void };
  }
) {
  const commander = useCommander();
  commander.registry({
    name: 'delete',
    keyboard: ['backspace', 'delete', 'ctrl+d'],
    execute: () => {
      console.log('执行删除命令');
      let data = {
        before: focusData.value.unfocus,
        after: dataModel.value.blocks || []
      };
      return {
        undo: () => {
          console.log('撤回删除命令');
          methods.updateBlocks(data.after);
        },
        redo: () => {
          console.log('重做删除命令');
          methods.updateBlocks(data.before);
        }
      };
    }
  });

  commander.registry({
    name: 'drag',
    init () {
      this.data = {
        before: null as null | VisualEditorBlockData[],
        after: null as null | VisualEditorBlockData[]
      };
      const handler = {
        dragstart: () => this.data.before = deepcopy(dataModel.value.blocks || []),
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
      let before= this.data.before 
      let after = deepcopy(dataModel.value.blocks || []);
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

  commander.init();
  return {
    undo: () => commander.state.commands.undo(),
    redo: () => commander.state.commands.redo(),
    delete: () => commander.state.commands.delete()
  };
}
