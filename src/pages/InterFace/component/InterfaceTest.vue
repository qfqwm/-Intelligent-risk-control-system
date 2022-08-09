<template>
  <a-drawer title="接口测试" width="920" :closable="false" :visible="visible" @close="onClose">
    <a-button type="primary" @click="showChildrenDrawer">Two-level drawer</a-button>
    <a-drawer title="Two-level Drawer" width="320" :closable="false" :visible="childrenDrawer" @close="onChildrenDrawerClose">
      <a-button type="primary" @click="showChildrenDrawer">This is two-level drawer</a-button>
    </a-drawer>
    <div
      :style="{
        position: 'absolute',
        bottom: 0,
        width: '100%',
        borderTop: '1px solid #e8e8e8',
        padding: '10px 16px',
        textAlign: 'right',
        left: 0,
        background: '#fff',
        borderRadius: '0 0 4px 4px',
      }"
    >
      <a-button style="margin-right: 8px" @click="onClose">Cancel</a-button>
      <a-button type="primary" @click="onClose">Submit</a-button>
    </div>
  </a-drawer>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import emitter from '@/utils/bus';
  console.log(11);

  const visible = ref<boolean>(false);

  const childrenDrawer = ref<boolean>(false);

  const showDrawer = () => {
    visible.value = true;
  };
  const onClose = () => {
    visible.value = false;
  };
  const showChildrenDrawer = () => {
    childrenDrawer.value = true;
  };
  const onChildrenDrawerClose = () => {
    childrenDrawer.value = false;
  };

  emitter.on('interfaceTest', (t: any) => {
    console.log(111, t);
    visible.value = t;
    showDrawer();
  });
</script>
<style scoped leng="less">
  button {
    margin: 0 5px;
  }

  .btn {
    border-radius: 10px;
    background: #379dd4;
  }
</style>
