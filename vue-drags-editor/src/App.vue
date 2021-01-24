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
        container: {
          width: 800,
          height: 500
        },
        blocks: [
          {
            left: 100,
            top: 100,
            componentKey: 'button'
          },
          {
            left: 200,
            top: 200,
            componentKey: 'input'
          }
        ]
      }
    }
  }
})
</script>

<style lang="scss">
html,
body {
  margin: 0;
}
</style>
