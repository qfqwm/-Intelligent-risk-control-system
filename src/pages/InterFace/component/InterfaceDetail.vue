<template>
  <a-form :model="formState" :style="{ padding: '0 0 24px 0' }" @finish="handleFinish" @finishFailed="handleFinishFailed">
    <a-typography-text type="secondary" :style="{ fontSize: '20px' }">接口名称：</a-typography-text>
    <a-row :style="{ height: '32px', color: '#999' }">
      <a-col :span="8">接口分类：</a-col>
      <a-col :span="8">请求协议：</a-col>
      <a-col :span="8">请求方式：</a-col>
    </a-row>
    <a-row :style="{ height: '32px', color: '#999' }">
      <a-col :span="8">支持格式：</a-col>
      <a-col :span="8">IP端口：</a-col>
      <a-col :span="8"></a-col>
    </a-row>
    <a-row :style="{ height: '32px', color: '#999' }">
      <a-col :span="8">Path：</a-col>
      <a-col :span="8"></a-col>
      <a-col :span="8"></a-col>
    </a-row>
    <a-row :style="{ height: '32px', color: '#999' }">
      <a-col :span="8">接口描述：</a-col>
      <a-col :span="8"></a-col>
      <a-col :span="8"></a-col>
    </a-row>
  </a-form>
  <div :style="{ background: '#f0f2f5', margin: '0 -24px', minHeight: '20px' }"></div>
  <a-tabs v-model:activeKey="activeKey" size="large">
    <a-tab-pane key="1" tab="请求参数">
      <a-table :columns="columns" :data-source="data" :pagination="false"> </a-table>
    </a-tab-pane>
    <a-tab-pane key="2" tab="请求Body" force-render>
      <a-table :columns="columns" :data-source="data1" :pagination="false"> </a-table>
    </a-tab-pane>
  </a-tabs>
  <div :style="{ background: '#f0f2f5', margin: '0 -24px', minHeight: '20px' }"></div>
  <a-tabs v-model:activeKey="activeKey" size="large">
    <a-tab-pane key="1" tab="接口返回参数">
      <a-table :columns="columns2" :data-source="data2" :pagination="false"> </a-table>
    </a-tab-pane>
  </a-tabs>
  <div :style="{ background: '#f0f2f5', margin: '0 -24px', minHeight: '20px' }"></div>
  <a-tabs v-model:activeKey="activeKey" size="large">
    <a-tab-pane key="1" tab="返回编码配置信息">
      <a-table :columns="columns3" :data-source="data3" :pagination="false"> </a-table>
    </a-tab-pane>
  </a-tabs>
  <div :style="{ background: '#f0f2f5', margin: '0 -24px', minHeight: '20px' }"></div>
  <a-tabs v-model:activeKey="activeKey" size="large">
    <a-tab-pane key="1" tab="重试机制配置信息">
      <a-typography-text :style="{ fontSize: '14px', lineHeight: '40px' }">重试编码配置</a-typography-text>
      <a-table :columns="columns4" :data-source="data4" :pagination="false"> </a-table>
      <a-typography-text :style="{ fontSize: '14px', lineHeight: '40px' }">超时重试配置</a-typography-text><br />
      <a-typography-text :style="{ fontSize: '14px', lineHeight: '40px' }">请求超时/网络超时时间 秒，重试 次，间隔 秒</a-typography-text>
    </a-tab-pane>
  </a-tabs>
  <div :style="{ background: '#f0f2f5', margin: '0 -24px', minHeight: '20px' }"></div>
  <a-tabs v-model:activeKey="activeKey" size="large">
    <a-tab-pane key="1" tab="正确返回码表配置信息">
      <a-typography-text :style="{ fontSize: '14px', lineHeight: '40px' }">返回码取值：</a-typography-text>
      <a-row :style="{ fontSize: '14px', lineHeight: '40px' }">
        <a-col :span="8"><a-typography-text :style="{ fontSize: '14px', lineHeight: '40px' }">缓存取数规则：</a-typography-text></a-col>
        <a-col :span="8"><a-typography-text :style="{ fontSize: '14px', lineHeight: '40px' }">缓存有效期：天时分秒</a-typography-text></a-col>
        <a-col :span="8"></a-col>
      </a-row>
    </a-tab-pane>
  </a-tabs>
  <div :style="{ background: '#f0f2f5', margin: '0 -24px', minHeight: '20px' }"></div>
  <!-- <a-affix :offset-bottom="1">
    <div :style="{ width: '100%', height: '40px', backgroundColor: '#ccc', padding: '0 100px' }">
      <a-button type="primary">返回上一页</a-button>
    </div>
  </a-affix> -->
</template>
<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  //接口名称
  interface FormState {
    user: string;
    password: string;
  }
  const formState = reactive({
    user: '',
    password: '',
  });
  const handleFinish = (values: FormState) => {
    console.log(values, formState);
  };
  const handleFinishFailed = () => {
    console.log(11);
  };
  //请求参数，请求body
  const activeKey = ref('1');
  const columns = [
    {
      title: '参数名称',
      dataIndex: 'name',
      key: 'name',
      width: '16%',
    },
    {
      title: '参数位置',
      dataIndex: 'aa',
      key: 'aa',
      width: '16%',
    },
    {
      title: '数据类型',
      dataIndex: 'type',
      key: 'type',
      width: '16%',
    },
    {
      title: '是否必填',
      dataIndex: 'bb',
      key: 'bb',
      width: '18%',
    },
    {
      title: '默认值',
      dataIndex: 'cc',
      key: 'cc',
      width: '16%',
    },
    {
      title: '说明',
      dataIndex: 'dd',
      key: 'dd',
      width: '18%',
    },
  ];

  const data = [
    {
      name: '1',
      aa: 'query',
      type: 'String',
      bb: '是',
      cc: '_',
      dd: '111',
    },
  ];
  const data1 = [];
  //接口返回参数
  const columns2 = [
    {
      title: '参数名称',
      dataIndex: 'name',
      key: 'name',
      width: '16%',
    },
    {
      title: '数据类型',
      dataIndex: 'aa',
      key: 'aa',
      width: '16%',
    },
    {
      title: '参数说明',
      dataIndex: 'type',
      key: 'type',
      width: '16%',
    },
  ];
  const data2 = [];
  //返回码表配置信息
  const columns3 = [
    {
      title: '编码取值',
      dataIndex: 'name',
      key: 'name',
      width: '16%',
    },
    {
      title: '编码名称',
      dataIndex: 'aa',
      key: 'aa',
      width: '16%',
    },
    {
      title: '编码含义',
      dataIndex: 'type',
      key: 'type',
      width: '16%',
    },
  ];
  const data3 = [];
  //充实机制配置信息
  const columns4 = [
    {
      title: '编码选取',
      dataIndex: 'name',
      key: 'name',
      width: '16%',
    },
    {
      title: '重试次数（次）',
      dataIndex: 'aa',
      key: 'aa',
      width: '16%',
    },
    {
      title: '间隔时长（S）',
      dataIndex: 'type',
      key: 'type',
      width: '16%',
    },
  ];
  const data4 = [];
  //返回上一页固钉
  const bottom = ref<number>(10);
</script>
<style scoped lang="less"></style>
