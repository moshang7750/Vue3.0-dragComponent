import { defineComponent, PropType, computed } from 'vue';
import {
  VisualEditorBlockData,
  VisualEditorConfig
} from './visual-editor.utils';

export const VisualEditorBlock = defineComponent({
  props: {
    block: { type: Object as PropType<VisualEditorBlockData>, required: true },
    config: { type: Object as PropType<VisualEditorConfig>, required: true }
  },
  setup(props, ctx) {
    const styles = computed(() => ({
      top: `${props.block.top}px`,
      left: `${props.block.left}px`
    }));
    return () => {
      const component = props.config.componentMap[props.block.componentKey];
      const Render = component.render();
      return (
        <div class="visual-editor-block" style={styles.value}>
          {Render}
        </div>
      );
    };
  }
});
