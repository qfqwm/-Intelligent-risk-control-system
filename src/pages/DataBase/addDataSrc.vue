<!--
 * @FileDescription: 新增数据库组件
 * @Author: wxy
 * @Date: 2022-08-3
 * @LastEditors: wxy
 * @LastEditTime: 最后更新时间
-->

<template lang="">
  <a-button type="primary" @click="showModal">新增数据源</a-button>
  <!-- <a-drawer
    v-model:visible="visible"
    class="custom-class"
    style="color: red"
    title="Basic Drawer"
    placement="right"
    @after-visible-change="afterVisibleChange"
  > -->
  <a-modal v-model:visible="visible" title="新增数据源" width=" 40%" wrap-class-name="full-modal" @ok="handleOk">
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
  </a-modal>
</template>
<script lang="ts">
  import { defineComponent, reactive } from 'vue';
  import type { SelectProps } from 'ant-design-vue';
  export default defineComponent({
    setup() {
      //弹窗气泡
      const visible = ref<boolean>(false);

      const showModal = () => {
        visible.value = true;
      };

      const handleOk = (e: MouseEvent) => {
        console.log(e);
        visible.value = false;
      };

      //添加内容
      const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
      };

      const validateMessages = {
        required: '${label} is required!',
        types: {
          email: '${label} is not a valid email!',
          number: '${label} is not a valid number!',
        },
        number: {
          range: '${label} must be between ${min} and ${max}',
        },
      };

      const formState = reactive({
        user: {
          name: '',
          age: undefined,
          email: '',
          website: '',
          introduction: '',
        },
      });
      const onFinish = (values: any) => {
        console.log('Success:', values);
      };

      //下拉框
      const options1 = ref<SelectProps['options']>([
        {
          value: 'MySQL',
          label: 'MySQL',
        },
        {
          value: 'MongoDB',
          label: 'MongoDB',
        },

        {
          value: 'ElasticSearch',
          label: 'ElasticSearch',
        },
      ]);
      const focus = () => {
        console.log('focus');
      };

      const handleChange = (value: string) => {
        console.log(`selected ${value}`);
      };

      return {
        //弹窗气泡
        visible,
        showModal,
        handleOk,
        //添加内容
        formState,
        onFinish,
        layout,
        validateMessages,
        //下拉框
        focus,
        handleChange,
        value1: ref('选择对应数据库'),
        options1,
      };
    },
  });
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
