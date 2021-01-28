<template>
  <VisualEditor v-model="jsonData" :config="visualConFig" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { VisualEditor } from './packages/visual-editor'
import { visualConFig } from './visual.config'
export default defineComponent({
  name: 'App',
  components: { VisualEditor },
  data() {
    return {
      visualConFig,

      jsonData: {
        container: { width: 800, height: 500 },
        blocks: [
          {
            top: 77,
            left: 172,
            componentKey: 'text',
            adjustPosition: false,
            focus: false,
            zIndex: 0,
            width: 64,
            height: 22,
            hasResize: false,
          },
          {
            top: 197,
            left: 248,
            componentKey: 'button',
            adjustPosition: false,
            focus: false,
            zIndex: 0,
            width: 98,
            height: 40,
            hasResize: false,
          },
          {
            top: 338,
            left: 262,
            componentKey: 'input',
            adjustPosition: false,
            focus: false,
            zIndex: 0,
            width: 178,
            height: 40,
            hasResize: false,
          },
          {
            top: 101,
            left: 491,
            componentKey: 'button',
            adjustPosition: false,
            focus: false,
            zIndex: 0,
            width: 98,
            height: 40,
            hasResize: false,
          },
          {
            top: 197,
            left: 407.5,
            componentKey: 'select',
            adjustPosition: false,
            focus: true,
            zIndex: 0,
            width: 193,
            height: 40,
            hasResize: false,
            props: { options: [{ label: '1111', value: '2222' }] },
          },
        ],
      },
    }
  },
})
</script>

<style lang="scss">
html,
body {
  margin: 0;
}
</style>
