<template>
  <a-drawer title="接口测试" width="1200" :closable="false" :visible="visible" @close="onClose">
    <a-row>
      <a-col :span="14" :style="{ height: '88vh' }">
        <a-row :style="{ height: '40px' }">
          <a-col :span="5" class="inttest">接口名称：</a-col>
          <a-col :span="19"
            ><a-typography-text>{{ interfaceMsgs.interMsgName }}</a-typography-text></a-col
          >
        </a-row>
        <a-row :style="{ height: '40px' }">
          <a-col :span="5" class="inttest">Request URL：</a-col>
          <a-col :span="19"
            ><a-typography-text>{{ requestUrl }}</a-typography-text></a-col
          >
        </a-row>
        <a-row :style="{ height: '40px' }">
          <a-col :span="5" class="inttest">请求方式：</a-col>
          <a-col :span="19"
            ><a-typography-text>{{ interfaceMsgs.interMsgRequest }}</a-typography-text></a-col
          >
        </a-row>
        <!-- 输入参数 -->
        <a-tabs v-model:activeKey="activeKey" size="large">
          <a-tab-pane key="1" tab="输入参数">
            <a-table :columns="columns" :data-source="data" :pagination="false">
              <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'testValue'">
                  <a-input v-model:value="record.testValue" placeholder="请输入" allow-clear :rule="rules" @change="dataTest()" />
                </template>
              </template>
            </a-table>
          </a-tab-pane>
        </a-tabs>
        <template v-if="interfaceMsgs.interMsgRequest == 'POST'">
          <a-tabs v-model:activeKey="activeKey" size="large">
            <a-tab-pane key="1" tab="请求Body">
              <a-textarea v-model:value="textArea" placeholder="请输入" :rows="15" @change="bodyText()" />
            </a-tab-pane>
          </a-tabs>
        </template>
      </a-col>
      <a-col :span="10">
        <a-tabs v-model:activeKey="activeKey" size="large">
          <a-tab-pane key="1" tab="返回结果（JSON）">
            <a-card class="box">{{ resultData }}</a-card>
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
      <a-button style="margin-right: 8px" :disabled="interfaceTest" @click="faceTest">接口测试</a-button>
      <a-button style="margin-right: 8px" :disabled="copyRuselt" @click="copy">复制返回结果</a-button>
      <a-button @click="onClose">关闭</a-button>
    </div>
  </a-drawer>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import emitter from '@/utils/bus';
  import { InterfaceDetailSelect, InterfaceTestc } from '@/api/test/index';
  import { message } from 'ant-design-vue';

  const visible = ref<boolean>(false);
  const showDrawer = () => {
    visible.value = true;
  };
  const onClose = () => {
    visible.value = false;
  };
  interface interfaceMsgs {
    interDirId: number;
    interMsgApiProtocol: string; //请求协议
    interMsgApiType: string; //接口分类
    interMsgApiUrl: string; //Path
    interMsgCreateTime: string;
    interMsgDescribe: string; //接口描述
    interMsgId: string;
    interMsgIp: string; //IP端口
    interMsgName: string;
    interMsgOvertime: number;
    interMsgRequest: string; //请求协议
    interMsgSource: string;
    interMsgUpdateTime: string;
    isDelete: number;
  }
  //显示接口信息的接口名称、Request URL、请求方式
  const requestUrl = ref<string>();
  const interfaceMsgs = ref<interfaceMsgs>({} as any);
  const interMsgId = ref();
  const data = ref([] as any); //输入参数
  emitter.on('interfaceTest', (record: any) => {
    console.log(record);
    interfaceMsgs.value = record;
    interMsgId.value = record.interMsgId;
    requestUrl.value = record.interMsgApiProtocol.toLowerCase() + '://' + record.interMsgIp + record.interMsgApiUrl;
    async function InterfaceDetailSelect_way() {
      await InterfaceDetailSelect(interMsgId.value).then(res => {
        res.data.data.interfaceConfigs.forEach(p => {
          if (p.interConfigIsNull == '0') p.interConfigIsNull = '是';
          if (p.interConfigIsNull == '1') p.interConfigIsNull = '否';
          if (p.interConfigDataType == '0') p.interConfigDataType = 'Obj';
          if (p.interConfigDataType == '1') p.interConfigDataType = 'Array';
          if (p.interConfigDataType == '2') p.interConfigDataType = 'String';
          if (p.interConfigDataType == '3') p.interConfigDataType = 'Int';
          if (p.interConfigDataType == '4') p.interConfigDataType = 'Float';
          if (p.interConfigDistinguish == '0') data.value.push(p);
        });
      });
    }
    InterfaceDetailSelect_way();
    showDrawer();
  });

  const activeKey = ref('1');
  const columns = [
    {
      title: '参数名称',
      dataIndex: 'interConfigName',
      key: 'interConfigName',
      width: '16%',
    },
    {
      title: '参数位置',
      dataIndex: 'interConfigPlace',
      key: 'interConfigPlace',
      width: '16%',
    },
    {
      title: '数据类型',
      dataIndex: 'interConfigDataType',
      key: 'interConfigDataType',
      width: '16%',
    },
    {
      title: '是否必填',
      dataIndex: 'interConfigIsNull',
      key: 'interConfigIsNull',
      width: '18%',
    },
    {
      title: '测试值',
      dataIndex: 'testValue',
      key: 'testValue',
      width: '34%',
    },
  ];
  //判断请求方式出现请求body文本域
  const textArea = ref<string>('');
  const bodyText = () => {
    testData.value.requestBody = textArea.value;
  };
  //输入参数判断测试值是否正确输入，然后开启接口测试按钮
  // const testValue = ref();
  // watch(testValue, () => {
  //   console.log(1111, testValue.value);
  // });
  const interfaceTest = ref<boolean>(true);
  const copyRuselt = ref<boolean>(true);
  const dataTest = () => {
    data.value.forEach(p => {
      if (p.testValue == '') {
        interfaceTest.value = true;
      }
      if (p.testValue != '') {
        interfaceTest.value = false;
      }
    });
    let obj = {};
    for (let i in data.value) {
      obj[data.value[i].interConfigName] = data.value[i].testValue;
    }
    testData.value.inputParam = obj;
    console.log(testData.value);
  };

  //接口测试调用接口
  interface TestData {
    requestURL: string | undefined;
    requestMethod: string;
    inputParam: {};
    requestBody: {};
  }
  const testData = ref<TestData>({} as any);
  watch(interfaceMsgs, () => {
    if (interfaceMsgs.value.interMsgRequest == 'POST') {
      testData.value.requestURL = requestUrl.value;
      testData.value.requestBody = null as any;
    }
    if (interfaceMsgs.value.interMsgRequest == 'GET') {
      testData.value.requestURL = requestUrl.value;
    }
    testData.value.requestMethod = interfaceMsgs.value.interMsgRequest;
    // testData.value.inputParam = obj;
    // testData.value.requestBody = {};
  });
  async function faceTest() {
    await InterfaceTestc(testData.value).then(res => {
      console.log(res.data);
      resultData.value = res.data;
      copyRuselt.value = false;
    });
  }

  //返回结果
  const resultData = ref();
  //复制结果
  const copy = () => {
    message.success('复制成功');
  };
  //验证规则
  const rules = {
    testValue: [{ required: true, message: '新增目录不能为空', trigger: 'blur' }],
  };
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
    width: 100%;
    height: 730px;
    color: #fff;
    background-color: #333;
  }
</style>
