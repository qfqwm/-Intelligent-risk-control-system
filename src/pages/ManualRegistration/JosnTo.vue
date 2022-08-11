<template>
  <div>
    <a-modal v-model:visible="visible" :width="1000" title="JOSN数据导入" @ok="handleOk">
      <a-form :model="formState" layout="vertical" name="basic" :label-col="{ span: 2 }" :wrapper-col="{ span: 25 }" autocomplete="off" @finish="onFinish">
        <a-form-item label="Josn数据" name="Josn" :rules="[{ required: true, message: '请输入Josn数据!' }]">
          <a-textarea v-model:value="formState.Josn" :rows="10" placeholder="请导入参数" />
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
