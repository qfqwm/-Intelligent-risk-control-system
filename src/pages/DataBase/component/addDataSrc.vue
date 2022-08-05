<!--
 * @FileDescription: 新增数据库组件
 * @Author: wxy
 * @Date: 2022-08-3
 * @LastEditors: wxy
 * @LastEditTime: 最后更新时间
-->

<template>
  <!-- <a-modal v-model:visible="visible" title="新增数据源" width=" 40%" wrap-class-name="full-modal" @ok="handleOk">
    <a-form :model="formState" v-bind="layout" name="nest-messages" :validate-messages="validateMessages" @finish="onFinish">
      <a-form-item label="数据库类型" placeholder="请输入">
        <a-select ref="select" v-model:value="value1" style="width: 300px" @focus="focus" @change="handleChange">
          <a-select-option value="MySQL">MySQL</a-select-option>
          <a-select-option value="MongoDB">MongoDB</a-select-option>
          <a-select-option value="ElasticSearch">ElasticSearch</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :name="['user', 'name']" label="数据源名称" :rules="[{ required: true }]">
        <a-input placeholder="请输入" />
      </a-form-item>
      <a-form-item :name="['user', 'name']" label="JDBC URL" :rules="[{ required: true }]">
        <a-input placeholder="请输入" />
      </a-form-item>
      <a-form-item :name="['user', 'name']" label="驱动类名" :rules="[{ required: true }]">
        <a-input placeholder="请输入" />
      </a-form-item>
      <a-form-item :name="['user', 'name']" label="连接参数配置" :rules="[{ required: true }]">
        <a-input placeholder="请输入" />
      </a-form-item>
      <a-form-item :name="['user', 'name']" label="连接参数配置" :rules="[{ required: true }]">
        <a-input placeholder="请输入" />
      </a-form-item>

      <a-form-item :name="['user', 'name']" label="数据源名称" :rules="[{ required: true }]">
        <a-input v-model:value="formState.user.name" />
      </a-form-item>
      <a-form-item :name="['user', 'introduction']" label="数据源描述">
        <a-textarea v-model:value="formState.user.introduction" />
      </a-form-item>
      <a-form-item :wrapper-col="{ ...layout.wrapperCol, offset: 8 }">
        <a-button type="primary" html-type="submit">Submit</a-button>
      </a-form-item>
    </a-form>
  </a-modal> -->
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
  // import type { SelectProps } from 'ant-design-vue';
  import type { Rule } from 'ant-design-vue/es/form';
  import emitter from '@/utils/bus';

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

  const showDrawer = (type: string, record?: any) => {
    if (type == 'add') {
      visible.value = true;
      console.log(1121);
    }
    if (type == 'edit') {
      visible.value = true;
      console.log(232323);
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

  const rules: Record<string, Rule[]> = {
    databaseType: [{ required: true, message: '请输入' }],
    sourceName: [{ required: true, message: '请输入' }],
    connectMessage: [{ required: true, message: '请输入' }],
    driverName: [{ required: true, message: '请输入' }],
    username: [{ required: true, message: '请输入' }],
    password: [{ required: true, message: '请输入' }],
    sourceDescription: [{ required: true, message: '请输入' }],
  };

  const onClose = () => {
    visible.value = false;
  };

  const sure = () => {
    console.log(11);
  };

  //添加内容
  // const layout = {
  //   labelCol: { span: 8 },
  //   wrapperCol: { span: 16 },
  // };

  // const validateMessages = {
  //   required: '${label} is required!',
  //   types: {
  //     email: '${label} is not a valid email!',
  //     number: '${label} is not a valid number!',
  //   },
  //   number: {
  //     range: '${label} must be between ${min} and ${max}',
  //   },
  // };

  // const formState = reactive({
  //   user: {
  //     name: '',
  //     age: undefined,
  //     email: '',
  //     website: '',
  //     introduction: '',
  //   },
  // });
  // const onFinish = (values: any) => {
  //   console.log('Success:', values);
  // };

  // const focus = () => {
  //   console.log('focus');
  // };

  // const handleChange = (value: string) => {
  //   console.log(`selected ${value}`);
  // };
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
