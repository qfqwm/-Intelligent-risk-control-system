<template>
  <a-drawer title="接口测试" width="1200" :closable="false" :visible="showVisible" :destroy-on-close="true" @close="onClose">
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
      <a-button type="primary" style="margin-right: 8px" :disabled="interfaceTest" :loading="iconLoading" @click="faceTest">接口测试</a-button>
      <a-button style="margin-right: 8px" :disabled="copyRuselt" @click="copy">复制返回结果</a-button>
      <a-button @click="onClose">关闭</a-button>
    </div>
  </a-drawer>
</template>
<script lang="ts" setup>
  import { ref, defineProps } from 'vue';
  import { InterfaceDetailSelect, InterfaceTestc } from '@/api/test/index';
  import { message } from 'ant-design-vue';
  const emit = defineEmits(['closeDrawer']);
  const props = defineProps({
    showInterfaceTest: {
      type: Object,
      default: () => {
        return {};
      },
    },
    textObject: {
      type: Object,
      default: () => {
        return {};
      },
    },
    showVisible: {
      type: Boolean,
    },
  });
  const showVisible = ref<boolean>(false);
  watch(
    () => props.showVisible,
    p => {
      showVisible.value = p;
    },
  );
  //显示接口信息的接口名称、Request URL、请求方式
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
  enum interConfigIsNull {
    '是',
    '否',
  }
  enum interConfigDataType {
    'Obj',
    'Array',
    'String',
    'Int',
    'Float',
  }
  const requestUrl = ref<string>();
  const interMsgId = ref();
  const interfaceMsgs = ref<interfaceMsgs>({} as any);
  watch(
    () => props.showInterfaceTest,
    p => {
      interfaceMsgs.value = p as any;
      requestUrl.value = p.interMsgApiProtocol.toLowerCase() + '://' + p.interMsgIp + p.interMsgApiUrl;
      interMsgId.value = p.interMsgId;
      if (props.textObject) {
        props.textObject.input_parameter_data.forEach(p => {
          p.interConfigIsNull = interConfigIsNull[p.interConfigIsNull];
          p.interConfigDataType = interConfigDataType[p.interConfigDataType];
          data.value.push(p);
        });
      } else {
        async function InterfaceDetailSelect_way() {
          await InterfaceDetailSelect(interMsgId.value).then(res => {
            res.data.data.requestParameters.forEach(p => {
              p.interConfigIsNull = interConfigIsNull[p.interConfigIsNull];
              p.interConfigDataType = interConfigDataType[p.interConfigDataType];
              data.value.push(p);
            });
          });
        }
        InterfaceDetailSelect_way();
      }
    },
  );

  const data = ref([] as any); //输入参数
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
      if (data.value[i].interConfigPlace != 'header') {
        obj[data.value[i].interConfigName] = data.value[i].testValue;
      }
    }
    if (interfaceMsgs.value.interMsgRequest == 'POST') {
      for (let i in data.value) {
        if (data.value[i].interConfigPlace != 'header') {
          obj[data.value[i].interConfigName] = data.value[i].testValue;
          testData.value.requestURL = requestUrl.value;
        }
        if (data.value[i].interConfigPlace == 'header') {
          testData.value.requestURL = requestUrl.value + '/' + data.value[i].testValue;
        }
      }
      testData.value.requestBody = null as any;
    }
    if (interfaceMsgs.value.interMsgRequest == 'GET') {
      for (let i in data.value) {
        if (data.value[i].interConfigPlace != 'header') {
          obj[data.value[i].interConfigName] = data.value[i].testValue;
          testData.value.requestURL = requestUrl.value;
        }
        if (data.value[i].interConfigPlace == 'header') {
          testData.value.requestURL = requestUrl.value + '/' + data.value[i].testValue;
        }
      }
    }
    testData.value.inputParam = obj;
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
    testData.value.requestMethod = interfaceMsgs.value.interMsgRequest;
  });

  interface DelayLoading {
    delay: number;
  }
  const iconLoading = ref<boolean | DelayLoading>(false);
  async function faceTest() {
    iconLoading.value = { delay: 1000 };
    setTimeout(() => {
      iconLoading.value = false;
    }, 400);
    await InterfaceTestc(testData.value).then(res => {
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
  //关闭抽屉
  const onClose = () => {
    data.value = [];
    showVisible.value = false;
    emit('closeDrawer');
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
