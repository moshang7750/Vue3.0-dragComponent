import { createVisualEditorConfig } from './packages/visual-editor.utils';
import { ElButton, ElInput, ElOption, ElSelect } from 'element-plus';
import { createEditorColorProp, createEditorInputProp, createEditorSelectProp, createEditorTableProp } from './packages/visual-editor.props';
import { NumberRange } from './packages/compontents/number-range/number-range';
import './visual.config.scss'
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
  render: ({ props, size, custom }) => <ElButton
    {...custom}
    style={{
      width: !!size.width ? `${size.width}px` : null,
      height: !!size.height ? `${size.height}px` : null
    }}
    type={props.type} size={props.size}
  >{props.text || '按钮'}</ElButton>,
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
  },
  resize: {
    width: true,
    height: true
  }

});
visualConFig.registry('select', {
  label: '下拉框',
  preview: () => <ElSelect />,
  render: ({ props, model, custom }) => (
    <ElSelect key={(props.options || []).map((opt: any) => opt.value).join(',')} {...model.default}  {...custom}>
      {(props.options || []).map((opt: { label: string, value: string }, index: number) => (
        <ElOption label={opt.label} value={opt.value} key={index} />
      ))}
    </ElSelect>
  ),
  props: {
    options: createEditorTableProp('下拉选项', {
      options: [
        { label: '显示值', field: 'label' },
        { label: '绑定值', field: 'value' },
      ],
      showKey: 'label'
    })
  },
  model: {
    default: '绑定字段'
  }
});

visualConFig.registry('input', {
  label: '输入框',
  preview: () => <ElInput modelValue={''} />,
  render: ({ model, size, custom }) => {
    console.log()
    return <ElInput   {...custom} {...model.default}
      style={{
        width: !!size.width ? `${size.width}px` : null,
      }}
    />
  },
  resize: {
    width: true
  },
  model: {
    default: '绑定字段'
  }
});


visualConFig.registry('number-range', {
  label: '数字范围输入框',
  preview: () => <NumberRange />,
  render: ({ model, size }) => {
    return <NumberRange
      style={{ width: `${size.width}px` }}
      {...{
        start: model.start.value,
        'onUpdate:start': model.start.onChange,
        end: model.end.value,
        'onUpdate:end': model.end.onChange
      }} />
  },
  model: {
    start: '起始绑定字段',
    end: '结束绑定字段'
  },
  resize: {
    width: true
  }
});


visualConFig.registry('image', {
  label: '图片',
  resize: {
    width: true,
    height: true,
  },
  render: ({ props, size }) => {
    return (
      <div style={{
        height:
          `${size.height || 100}px`,
        width: `${size.width || 100}px`
      }} class="visual-block-image">
        <img src={props.url || 'https://cn.vuejs.org/images/logo.png'} />
      </div>
    )
  },
  preview: () => (
    <div style="text-align:center;">
      <div style="font-size:20px;background-color:#f2f2f2;color:#ccc;display:inline-flex;width:100px;height:50px;align-items:center;justify-content:center">
        <i class="el-icon-picture" />
      </div>
    </div>
  ),
  props: {
    url: createEditorInputProp('地址')
  },
})
