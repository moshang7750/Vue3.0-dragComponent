import { createVisualEditorConfig } from './packages/visual-editor.utils';
import { ElButton, ElInput } from 'element-plus';

export const visualConFig = createVisualEditorConfig();

visualConFig.registry('text', {
  label: '文本',
  preview: () => '预览文本',
  render: () => '渲染文本'
});
visualConFig.registry('button', {
  label: '按钮',
  preview: () => <ElButton>按钮</ElButton>,
  render: () => <ElButton>渲染按钮</ElButton>
});
visualConFig.registry('input', {
  label: '输入框',
  preview: () => <ElInput />,
  render: () => <ElInput />
});
