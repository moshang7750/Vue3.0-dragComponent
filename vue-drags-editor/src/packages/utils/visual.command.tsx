import { useCommander } from '../plugins/command.plugin';
import deepcopy from 'deepcopy';
import {
  VisualEditorBlockData,
  VisualEditorModelValue
} from '../visual-editor.utils';

export function useVisualCommand({
  focusData,
  methods,
  dataModel
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
}) {
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

  // commander.registry({
  //   name: 'updateBlocks',
  //   execute: (blocks: VisualEditorBlockData[]) => {
  //     console.log('执行删除命令');
  //     let data = {
  //       before: deepcopy(dataModel.value.blocks || []),
  //       after: deepcopy(blocks)
  //     };
  //     return {
  //       undo: () => {
  //         methods.updateBlocks(data.after);
  //       },
  //       redo: () => {
  //         methods.updateBlocks(data.before);
  //       }
  //     };
  //   }
  // });

  return {
    undo: () => commander.state.commands.undo(),
    redo: () => commander.state.commands.redo(),
    delete: () => commander.state.commands.delete()
  };
}
