<template>
  <VisualEditor />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { VisualEditor } from './packages/visual-editor'
export default defineComponent({
  name: 'App',
  components: { VisualEditor }
})
</script>

<style lang="scss">
html,
body {
  margin: 0;
}
</style>
