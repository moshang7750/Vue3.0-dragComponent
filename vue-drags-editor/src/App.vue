<template>
  <div class="app">
    <VisualEditor
      v-model="jsonData"
      :config="visualConFig"
      :formData="formData"
      :customProps="customProps"
    >
      <!-- <template #subBtn>
        <ElButton v-if="formData.type1 == '2222'">自定义按钮</ElButton>
        <ElTag v-else>自定义标签</ElTag>
      </template> -->
    </VisualEditor>
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
        type1: '222',
      },
      customProps: {
        subBtn: {
          onClick: () => {
            this.$notify({ message: '执行表单数据校验、提交到服务器' })
          },
        },
        mySelect: {
          onChange: (val: string) => {
            this.$notify({ message: val })
            // this.formData.accType = null
          },
        },
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
            slotName: 'subBtn',
          },
          {
            top: 213,
            left: 116,
            componentKey: 'select',
            adjustPosition: false,
            focus: false,
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
            model: { default: 'type1' },
            slotName: 'mySelect',
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
          {
            top: 309,
            left: 329,
            componentKey: 'number-range',
            adjustPosition: false,
            focus: false,
            zIndex: 0,
            width: 230,
            height: 40,
            hasResize: false,
            props: {},
            model: { start: 'minLevel', end: 'maxLevel' },
          },
          {
            top: 225,
            left: 461.5,
            componentKey: 'select',
            adjustPosition: false,
            focus: true,
            zIndex: 0,
            width: 193,
            height: 40,
            hasResize: false,
            props: { options: [{ label: '草莓', value: 'caomei' }] },
            model: { default: 'accType' },
            slotName: '',
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
