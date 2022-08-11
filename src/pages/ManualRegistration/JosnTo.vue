<template>
  <div>
    <a-modal v-model:visible="visible" title="JOSN数据导入" @ok="handleOk">
      <a-form :model="formState" name="basic" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" autocomplete="off" @finish="onFinish">
        <a-form-item label="Josn数据" name="Josn" :rules="[{ required: true, message: '请输入Josn数据!' }]">
          <a-input v-model:value="formState.Josn" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
  import emitter from '@/utils/bus';
  interface FormState {
    Josn: string;
  }
  emitter.on('Josn', () => {
    visible.value = true;
  });
  const visible = ref<boolean>(false);
  const handleOk = (e: MouseEvent) => {
    console.log(e);
    visible.value = false;
  };
  // 表单
  const formState = reactive<FormState>({
    Josn: '',
  });
  const onFinish = (values: any) => {
    console.log('Success:', values);
  };
</script>
<style lang="less"></style>
