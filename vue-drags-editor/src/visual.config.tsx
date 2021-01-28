import { createVisualEditorConfig } from './packages/visual-editor.utils';
import { ElButton, ElInput, ElOption, ElSelect } from 'element-plus';
import { createEditorColorProp, createEditorInputProp, createEditorSelectProp, createEditorTableProp } from './packages/visual-editor.props';

export const visualConFig = createVisualEditorConfig();

visualConFig.registry('text', {
  label: '文本',
  preview: () => '预览文本',
  render: ({ props }) => <span style={{ color: props.color, fontSize: props.size }}>{props.text || '默认文本'}</span>,
  props: {
    text: createEditorInputProp('显示文本'),
    color: createEditorColorProp('字体颜色'),
    size: createEditorSelectProp('字体大小', [
      { label: '14px', val: '14px' },
      { label: '18px', val: '18px' },
      { label: '24px', val: '24px' }
    ])
  }
});
visualConFig.registry('button', {
  label: '按钮',
  preview: () => <ElButton>按钮</ElButton>,
  render: ({ props }) => <ElButton type={props.type} size={props.size}>{props.text || '按钮'}</ElButton>,
  props: {
    text: createEditorInputProp('显示文本'),
    type: createEditorSelectProp('按钮类型', [
      { label: '基础', val: 'primary' },
      { label: '成功', val: 'success' },
      { label: '警告', val: 'warning' },
      { label: '危险', val: 'danger' },
      { label: '提示', val: 'info' },
      { label: '文本', val: 'text' },
    ]),
    size: createEditorSelectProp('按钮类型', [
      { label: '默认', val: '' },
      { label: '中等', val: 'medium' },
      { label: '小', val: 'small' },
      { label: '迷你', val: 'mini' },
    ])
  }

});
visualConFig.registry('select', {
  label: '下拉框',
  preview: () => <ElSelect />,
  render: ({ props }) => <ElSelect >
    {(props.options || []).map((opt: { label: string, value: string }, index: number) => (
      <ElOption label={opt.label} value={opt.value} key={index} />
    ))}
  </ElSelect>,
  props: {
    options: createEditorTableProp('下拉选项', [
      { label: '显示值', field: 'label' },
      { label: '绑定值', field: 'value' },
    ])
  }
});

visualConFig.registry('input', {
  label: '输入框',
  preview: () => <ElInput />,
  render: () => <ElInput />
});
