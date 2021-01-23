import { defineComponent } from 'vue';
import './visual-editor.scss';
export const VisualEditor = defineComponent({
  props: {},
  setup(props) {
    return () => {
      <div class="visual-editor">可视化编辑器</div>;
    };
  }
});
