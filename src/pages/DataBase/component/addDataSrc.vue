<template>
  <a-drawer title="新增数据源" :width="450" :visible="visible" :body-style="{ paddingBottom: '80px' }" :footer-style="{ textAlign: 'right' }" @close="onClose">
    <a-form :model="form" :rules="rules" layout="vertical">
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item label="数据库类型:" name="数据库类型:">
            <a-select v-model:value="form.databaseType" placeholder="请输入">
              <a-select-option value="MySQL">MySQL</a-select-option>
              <a-select-option value="MongoDB">MongoDB</a-select-option>
              <a-select-option value="ElasticSearch">ElasticSearch</a-select-option>>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="数据源名称:" name="数据源名称:">
            <a-input v-model:value="form.sourceName" placeholder="请输入" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="JDBC URL:" name="JDBC URL:">
            <a-input v-model:value="form.connectMessage" placeholder="请输入" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="驱动类名:" name="驱动类名:">
            <a-input v-model:value="form.driverName" placeholder="请输入" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="用户名:" name="用户名:">
            <a-input v-model:value="form.username" placeholder="请输入" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="密码:" name="密码:">
            <a-input v-model:value="form.password" placeholder="请输入" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="数据源描述:" name="数据源描述:">
            <a-input v-model:value="form.sourceDescription" placeholder="请输入" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <!-- 底部区域 -->
    <template #footer>
      <a-space>
        <a-button @click="onClose">取消</a-button>
        <a-button type="primary" @click="sure">确定</a-button>
      </a-space>
    </template>
  </a-drawer>
</template>
<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import type { Rule } from 'ant-design-vue/es/form';
  import emitter from '@/utils/bus';
  import { AddDataSource, EditDatabase } from '@/api/test/index';

  //弹窗气泡
  const visible = ref();
  let type = '';
  let record: any = {};
  emitter.on('sendchild', (t: any) => {
    visible.value = t.visible;
    type = t.type;
    record = t.record;
    showDrawer(type, record);
  });

  //编辑所需要的id
  const databaseId = ref('');
  //抽屉的开关控制
  const showDrawer = (type: string, record?: any) => {
    if (type == 'add') {
      visible.value = true;
      Object.keys(form).forEach(function (key) {
        form[key] = '';
      });
    }
    if (type == 'edit') {
      visible.value = true;
      databaseId.value = record.databaseId;
      Object.keys(form).forEach(function (key) {
        form[key] = record[key];
      });
    }
  };

  const form = reactive({
    databaseType: '',
    sourceName: '',
    connectMessage: '',
    driverName: '',
    username: '',
    password: '',
    sourceDescription: '',
  });

  const form_edit = reactive({
    databaseId: '',
    databaseType: '',
    sourceName: '',
    connectMessage: '',
    driverName: '',
    username: '',
    password: '',
    sourceDescription: '',
  });

  const rules: Record<string, Rule[]> = {
    databaseType: [{ required: true, message: '请输入' }],
    sourceName: [{ required: true, message: '请输入' }],
    connectMessage: [{ required: true, message: '请输入' }],
    driverName: [{ required: true, message: '请输入' }],
    username: [{ required: true, message: '请输入' }],
    password: [{ required: true, message: '请输入' }],
    sourceDescription: [{ required: true, message: '请输入' }],
  };

  //关闭抽屉
  const onClose = () => {
    visible.value = false;
  };

  //数据库新增，编辑
  const sure = () => {
    if (type == 'add') {
      AddDataSource(form).then(function (res) {
        if (res.data.msg == '返回成功') {
          emitter.emit('send');
        } else {
          alert(res.data.msg);
        }
      });
    }
    if (type == 'edit') {
      Object.keys(form_edit).forEach(function (key) {
        form_edit[key] = form[key];
      });
      form_edit.databaseId = databaseId.value;
      console.log(form_edit, 'ksjd');
      EditDatabase(form_edit).then(function (res) {
        if (res.data.msg == '修改成功') {
          console.log(res);

          emitter.emit('send');
        } else {
          alert(res.data.msg);
        }
      });
    }
  };
</script>
<style lang="less" scoped>
  .full-modal {
    .ant-modal {
      top: 0;
      float: right;
      margin: 0;
      padding-bottom: 0;
      max-width: 50%;
    }

    .ant-modal-content {
      display: flex;
      flex-direction: column;
      height: calc(100vh);
    }

    .ant-modal-body {
      flex: 1;
    }
  }

  .ant-form {
    float: left;

    .ant-input {
      width: 400px;
    }
  }
</style>
