import { defineComponent, PropType, computed, onMounted, ref } from 'vue';
import {
  VisualEditorBlockData,

  VisualEditorConfig
} from './visual-editor.utils';

export const VisualEditorBlock = defineComponent({
  props: {
    block: { type: Object as PropType<VisualEditorBlockData>, required: true },
    config: { type: Object as PropType<VisualEditorConfig>, required: true },
    formData: { type: Object as PropType<Record<string, any>>, required: true },
  },
  setup(props, ctx) {
    const el = ref({} as HTMLDivElement);
    const classes = computed(() => [
      'visual-editor-block',
      {
        'visual-editor-block-focus': props.block.focus
      }
    ]);
    const styles = computed(() => ({
      top: `${props.block.top}px`,
      left: `${props.block.left}px`,
      zIndex: props.block.zIndex
    }));

    onMounted(() => {
      // 首次拖入 居中显示
      const { block } = props;
      if (block.adjustPosition === true) {
        const { offsetWidth, offsetHeight } = el.value;
        block.left = block.left - offsetWidth / 2;
        block.top = block.top - offsetHeight / 2;
        block.width = offsetWidth
        block.height = offsetHeight
        block.adjustPosition = false;
      }
    });

    return () => {
      const component = props.config.componentMap[props.block.componentKey];
      const formData = props.formData as Record<string, any>
      //  传递参数到左侧自定义组件中
      const Render = component.render({
        props: props.block.props || {},
        model: Object.entries(props.block.model || {}).reduce((_prev, [propName, modelName]) => {
          _prev[propName] = {
            [propName == 'default' ? 'modelValue' : propName]: formData[modelName],
            [propName == 'default' ? 'onUpdate:modelValue' : 'onChange']: (val: any) => {
              formData[modelName] = val
            }
          }
          return _prev
        }, {} as Record<string, any>)
      });
      return (
        <div class={classes.value} style={styles.value} ref={el}>
          {Render}
        </div>
      );
    };
  }
});
