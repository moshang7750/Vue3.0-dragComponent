<template>
  <div class="app">
    <VisualEditor
      v-model="jsonData"
      :config="visualConFig"
      :formData="formData"
    />
    <div style="text-align: center">
      {{ JSON.stringify(formData) }}
    </div>
  </div>
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
      formData: {
        usename: 'admin',
      },
      jsonData: {
        container: { width: 800, height: 500 },
        blocks: [
          {
            top: 51,
            left: 74,
            componentKey: 'text',
            adjustPosition: false,
            focus: false,
            zIndex: 0,
            width: 64,
            height: 22,
            hasResize: false,
            props: {},
            model: {},
          },
          {
            top: 135,
            left: 74,
            componentKey: 'button',
            adjustPosition: false,
            focus: false,
            zIndex: 0,
            width: 70,
            height: 40,
            hasResize: false,
            props: {},
            model: {},
          },
          {
            top: 164,
            left: 300.5,
            componentKey: 'select',
            adjustPosition: false,
            focus: true,
            zIndex: 0,
            width: 193,
            height: 40,
            hasResize: false,
            props: {
              options: [
                { label: '1111', value: '2222' },
                { label: '333', value: '444' },
              ],
            },
            model: {},
          },
          {
            top: 109,
            left: 607,
            componentKey: 'input',
            adjustPosition: false,
            focus: false,
            zIndex: 0,
            width: 178,
            height: 40,
            hasResize: false,
            props: {},
            model: {},
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
.app {
  padding-bottom: 100px;
}
</style>
