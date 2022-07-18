<template>
  <div class="test-wrapper"> {{ testMsg }} </div>
</template>
<script setup lang="ts">
  const testMsg = ref<string>('test');
</script>
<style lang="less" scoped>
  .test-wrapper {
    height: 100%;
  }
</style>
