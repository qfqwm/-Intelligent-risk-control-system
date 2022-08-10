<template>
  <a-drawer title="接口测试" width="1200" :closable="false" :visible="visible" @close="onClose">
    <a-row>
      <a-col :span="14" :style="{ height: '88vh' }">
        <a-row :style="{ height: '40px' }">
          <a-col :span="5" class="inttest">接口名称：</a-col>
          <a-col :span="19"></a-col>
        </a-row>
        <a-row :style="{ height: '40px' }">
          <a-col :span="5" class="inttest">Request URL：</a-col>
          <a-col :span="19"></a-col>
        </a-row>
        <a-row :style="{ height: '40px' }">
          <a-col :span="5" class="inttest">请求方式：</a-col>
          <a-col :span="19"></a-col>
        </a-row>
        <a-tabs v-model:activeKey="activeKey" size="large">
          <a-tab-pane key="1" tab="输入参数">
            <a-table :columns="columns" :data-source="data" :pagination="false">
              <template #bodyCell="{ column }">
                <template v-if="column.dataIndex === 'cc'">
                  <a-input v-model:value="testValue" placeholder="请输入" allow-clear />
                </template>
              </template>
            </a-table>
          </a-tab-pane>
        </a-tabs>
      </a-col>
      <a-col :span="10">
        <a-tabs v-model:activeKey="activeKey" size="large">
          <a-tab-pane key="1" tab="返回结果（JSON）">
            <a-card class="box">222</a-card>
          </a-tab-pane>
        </a-tabs>
      </a-col>
    </a-row>
    <div
      :style="{
        position: 'absolute',
        bottom: 0,
        width: '100%',
        borderTop: '1px solid #e8e8e8',
        padding: '10px 16px',
        textAlign: 'left',
        left: 0,
        background: '#fff',
        borderRadius: '0 0 4px 4px',
      }"
    >
      <a-button style="margin-right: 8px" disabled @click="onClose">接口测试</a-button>
      <a-button style="margin-right: 8px" disabled @click="onClose">复制返回结果</a-button>
      <a-button @click="onClose">关闭</a-button>
    </div>
  </a-drawer>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import emitter from '@/utils/bus';
  const visible = ref<boolean>(false);
  const showDrawer = () => {
    visible.value = true;
  };
  const onClose = () => {
    visible.value = false;
  };
  emitter.on('interfaceTest', (t: any) => {
    console.log(111, t);
    visible.value = t;
    showDrawer();
  });

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
      title: '测试值',
      dataIndex: 'cc',
      key: 'cc',
      width: '34%',
    },
  ];

  const data = [
    {
      name: 'name',
      aa: 'query',
      type: 'String',
      bb: '否',
    },
    {
      name: 'num',
      aa: 'query',
      type: 'String',
      bb: '是',
    },
  ];
  const testValue = ref();
</script>
<style scoped leng="less">
  button {
    margin: 0 5px;
  }

  .btn {
    border-radius: 10px;
    background: #379dd4;
  }

  .inttest {
    display: flex;
    justify-content: flex-end;
  }

  .box {
    width: 90%;
    height: 600px;
    color: #fff;
    background-color: #333;
  }
</style>
