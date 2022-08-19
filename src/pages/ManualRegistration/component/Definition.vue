<template>
  <div>
    <a-modal v-model:visible="visible" width="1000px" ok-text="确定" cancel-text="取消" title="码值定义" @ok="handleOk">
      <!-- 按钮区域 -->
      <div class="button">
        <a-button type="primary" size="middle" @click="showcode('add')">新增码值表</a-button>
        <a-button type="primary" size="middle" @click="handleAdd">新增自定义码值</a-button>
        <a-button type="primary" size="middle" @click="showcode('cite')">码表引用</a-button>
      </div>
      <AddedCodeVue />
      <AddedCustomVue />
      <a-form :model="CodeTable" layout="inline" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" autocomplete="off">
        <div style="padding-left: 30px">
          <a-row :gutter="16" style="margin-top: 10px">
            <a-col :span="24">
              <a-form-item style="width: 440%" has-feedback label="码表名称：" name="CodeTableName" :rules="rules.CodeTableName">
                <a-input v-model:value="CodeTable.CodeTableName" placeholder="请输入码表名称" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16" style="margin-top: 20px; margin-left: 5px">
            <a-col :span="24">
              <a-form-item style="width: 460%" label="码表说明：" name="CodeTableDescription">
                <a-textarea v-model:value="CodeTable.CodeTableDescription" :rows="3" placeholder="请输入码表说明" />
              </a-form-item>
            </a-col>
          </a-row>
        </div>
      </a-form>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
  import emitter from '@/utils/bus';
  import AddedCustomVue from './Child/AddedCustom.vue';
  import AddedCodeVue from './Child/AddedCode.vue';

  const visible = ref();
  let record: any = {};
  emitter.on('Sendchildsq', (t: any) => {
    visible.value = t.visible;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    record = t.record;
    showModal();
  });

  const CodeTable = reactive({
    CodeTableName: '',
    CodeTableDescription: '',
  });

  const rules = {
    CodeTableName: [{ required: true, message: '请填写码表名称' }],
  };

  const handleAdd = () => {
    emitter.emit('sendSon');
  };

  const showModal = () => {
    visible.value = true;
  };

  const handleOk = () => {
    visible.value = false;
  };

  const visible_Add = ref<boolean>(false);
  //码值定义模态框开关
  const showcode = (type: any) => {
    const sdds = reactive({
      type: type,
      visible: visible_Add,
    });
    emitter.emit('Sendchild_add_edit', sdds);
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
