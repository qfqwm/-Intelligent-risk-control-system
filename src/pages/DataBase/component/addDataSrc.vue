<template>
  <a-form id="form" ref="edit_and_Form" :model="form" :rules="rules" layout="vertical" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" autocomplete="off" @finish="sure">
    <a-drawer title="新增数据源" :width="450" :visible="visible" :body-style="{ paddingBottom: '80px' }" :footer-style="{ textAlign: 'right' }" @close="onClose">
      <a-row :gutter="16">
        <a-col :span="20">
          <a-form-item label="数据库类型:" name="databaseType" :rules="rules.databaseType">
            <a-select v-model:value="form.databaseType" placeholder="请输入">
              <a-select-option value="MySQL">MySQL</a-select-option>
              <a-select-option value="MongoDB">MongoDB</a-select-option>
              <a-select-option value="ElasticSearch">ElasticSearch</a-select-option>>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="20">
          <a-form-item label="数据源名称:" name="sourceName" :rules="rules.sourceName">
            <a-input v-model:value="form.sourceName" placeholder="请输入" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="20">
          <a-form-item label="连接信息:" name="connectMessage" :rules="rules.connectMessage">
            <a-input v-model:value="form.connectMessage" placeholder="请输入" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="20">
          <a-form-item label="驱动类名:" name="driverName" :rules="rules.driverName">
            <a-input v-model:value="form.driverName" placeholder="请输入" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="20">
          <a-form-item label="用户名:" name="username" :rules="rules.username">
            <a-input v-model:value="form.username" placeholder="请输入" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="20">
          <a-form-item label="密码:" name="password" :rules="rules.password">
            <a-input v-model:value="form.password" placeholder="请输入" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="20">
          <a-form-item label="数据源描述:" name="sourceDescription" :rules="rules.sourceDescription">
            <a-input v-model:value="form.sourceDescription" placeholder="请输入" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="20">
          <a-button type="primary" size="small" @click="Connectivity(form)">连通测试</a-button>
        </a-col>
      </a-row>
      <!-- 底部区域 -->
      <template #footer>
        <a-space>
          <a-button @click="onClose">取消</a-button>
          <a-button type="primary" html-type="submit" form="form">确定</a-button>
        </a-space>
      </template>
    </a-drawer>
  </a-form>
</template>
<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import emitter from '@/utils/bus';
  import { AddDataSource, EditDatabase } from '@/api/test/index';
  import { message } from 'ant-design-vue';

  const Connectivity = (form: any) => {
    const sd = reactive({
      form: form,
    });
    emitter.emit('sendchildod', sd);
  };

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
      Object.keys(form).forEach(function (key) {
        form[key] = '';
      });
      visible.value = true;
    }
    if (type == 'edit') {
      databaseId.value = record.databaseId;
      Object.keys(form).forEach(function (key) {
        form[key] = record[key];
      });
      visible.value = true;
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

  //表单验证规则
  const rules = ref({
    databaseType: [{ required: true, message: '请输入' }],
    sourceName: [
      { required: true, message: '请输入' },
      {
        max: 30,
        message: '长度不能大于30个字符',
        trigger: 'blur',
      },
      { pattern: /^[^\s]*$/, message: '不允许输入空格' },
    ],
    connectMessage: [
      { required: true, message: '请输入' },
      {
        max: 200,
        message: '长度不能大于200个字符',
        trigger: 'blur',
      },
      { pattern: /^[^\s]*$/, message: '不允许输入空格' },
    ],
    driverName: [
      { required: true, message: '请输入' },
      { pattern: /^[^\s]*$/, message: '不允许输入空格' },
    ],
    username: [
      { required: true, message: '请输入' },
      { pattern: /^[^\s]*$/, message: '不允许输入空格' },
    ],
    password: [
      { required: true, message: '请输入' },
      { pattern: /^[^\s]*$/, message: '不允许输入空格' },
    ],
    sourceDescription: [
      { required: true, message: '请输入' },
      {
        max: 200,
        message: '长度不能大于200个字符',
        trigger: 'blur',
      },
      { pattern: /^[^\s]*$/, message: '不允许输入空格' },
    ],
  });

  //关闭抽屉
  const onClose = () => {
    visible.value = false;
  };

  //数据库新增，编辑
  const sure = () => {
    if (type == 'add') {
      AddDataSource(form).then(function (res) {
        if (res.data.code == 100200) {
          emitter.emit('send');
          visible.value = false;
          message.success(res.data.msg);
        } else {
          message.warning(res.data.msg);
        }
      });
    }
    if (type == 'edit') {
      Object.keys(form_edit).forEach(function (key) {
        form_edit[key] = form[key];
      });
      form_edit.databaseId = databaseId.value;
      EditDatabase(form_edit).then(function (res) {
        if (res.data.code == 100200) {
          emitter.emit('send');
          visible.value = false;
          message.success(res.data.msg);
        } else {
          message.warning(res.data.msg);
        }
      });
    }
  };

  //监听模态框状态，清空表单错误提示
  const edit_and_Form = ref<any>(null);
  //监听模态框的变化，进入新增/编辑模态框清空表单验证的错误提示
  watch(
    () => visible.value,
    () => {
      if (visible.value === false) return edit_and_Form.value.resetFields();
    },
  );
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
