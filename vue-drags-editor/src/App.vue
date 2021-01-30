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
        container: { width: 1000, height: 800 },
        blocks: [
          {
            top: 65,
            left: 358,
            componentKey: 'text',
            adjustPosition: false,
            focus: false,
            zIndex: 0,
            width: 64,
            height: 22,
            hasResize: false,
            props: { text: '用户名' },
            model: {},
          },
          {
            top: 454,
            left: 442,
            componentKey: 'button',
            adjustPosition: false,
            focus: false,
            zIndex: 0,
            width: 70,
            height: 40,
            hasResize: false,
            props: { size: '', type: 'primary' },
            model: {},
            slotName: 'subBtn',
          },
          {
            top: 56,
            left: 442,
            componentKey: 'input',
            adjustPosition: false,
            focus: false,
            zIndex: 0,
            width: 186,
            height: 40,
            hasResize: true,
            props: {},
            model: { default: 'usename' },
          },
          {
            top: 260,
            left: 442,
            componentKey: 'number-range',
            adjustPosition: false,
            focus: false,
            zIndex: 0,
            width: 195,
            height: 40,
            hasResize: true,
            props: {},
            model: { start: 'minLevel', end: 'maxLevel' },
          },
          {
            top: 186,
            left: 442,
            componentKey: 'select',
            adjustPosition: false,
            focus: false,
            zIndex: 0,
            width: 193,
            height: 40,
            hasResize: false,
            props: { options: [{ label: '草莓', value: 'caomei' }] },
            model: { default: 'accType' },
            slotName: '',
          },
          {
            top: 337,
            left: 448.5,
            componentKey: 'image',
            adjustPosition: false,
            focus: false,
            zIndex: 0,
            width: 57,
            height: 69,
            hasResize: true,
            props: {
              url:
                'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
            },
            model: {},
            slotName: '',
          },
          {
            top: 127,
            left: 361,
            componentKey: 'text',
            adjustPosition: false,
            focus: false,
            zIndex: 0,
            width: 64,
            height: 22,
            hasResize: false,
            props: { text: '密码' },
            model: {},
            slotName: '',
          },
          {
            top: 269,
            left: 358,
            componentKey: 'text',
            adjustPosition: false,
            focus: false,
            zIndex: 0,
            width: 64,
            height: 22,
            hasResize: false,
            props: { text: '输入值 ' },
            model: {},
            slotName: '',
          },
          {
            top: 122,
            left: 446,
            componentKey: 'input',
            adjustPosition: false,
            focus: false,
            zIndex: 0,
            width: 178,
            height: 40,
            hasResize: false,
            props: {},
            model: { default: 'password' },
            slotName: '',
          },
          {
            top: 195,
            left: 358,
            componentKey: 'text',
            adjustPosition: false,
            focus: false,
            zIndex: 0,
            width: 64,
            height: 22,
            hasResize: false,
            props: { text: '选择器' },
            model: {},
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
