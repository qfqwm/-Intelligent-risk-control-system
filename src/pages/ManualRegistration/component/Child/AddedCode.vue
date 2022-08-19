<template>
  <div>
    <a-modal v-model:visible="visible" width="1000px" ok-text="确定" cancel-text="取消" :title="valuea" @ok="handleOk">
      <a-form :model="AddCodeTable" layout="inline" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" autocomplete="off">
        <div style="margin-bottom: 20px; padding-left: 30px">
          <a-row :gutter="16" style="margin-top: 10px">
            <a-col :span="24">
              <a-form-item style="width: 455%" has-feedback label="码表选择：" name="CodeTableSelection" :rules="[{ required: true }]">
                <a-select v-model:value="AddCodeTable.CodeTableSelection" placeholder="请输入码表名称" />
              </a-form-item>
            </a-col>
          </a-row>
        </div>
      </a-form>
      <AddedCodeDataVue />
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
  import emitter from '@/utils/bus';
  import AddedCodeDataVue from './Childs/AddedCodeData.vue';

  const visible = ref();
  const type = ref();
  emitter.on('Sendchild_add_edit', (t: any) => {
    visible.value = t.visible;
    type.value = t.type;
    showModal();
  });

  const AddCodeTable = reactive({
    CodeTableSelection: '',
  });

  const valuea = ref();

  const showModal = () => {
    visible.value = true;
    if (type.value == 'add') {
      valuea.value = '新增码表编码';
    }
    if (type.value == 'cite') {
      valuea.value = '码表引用';
    }
  };

  const handleOk = () => {
    visible.value = false;
  };
</script>
<style lang="less" scoped>
  .button {
    margin-bottom: 10px;

    button {
      margin-left: 20px;
    }
  }
</style>
