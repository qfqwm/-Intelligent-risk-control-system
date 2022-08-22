<!-- eslint-disable vue/v-on-event-hyphenation -->
<template>
  <a-form :model="formState" :style="{ padding: '0 0 24px 0' }" @finish="handleFinish" @finishFailed="handleFinishFailed">
    <a-typography-text type="secondary" :style="{ fontSize: '20px' }"
      >接口名称：<a-typography-text>{{ interfaceMsgs.interMsgName }}</a-typography-text></a-typography-text
    >
    <a-row :style="{ height: '32px', color: '#999' }">
      <a-col :span="8"
        >接口分类：<a-typography-text>{{ formState.interDirName }}</a-typography-text>
      </a-col>
      <a-col :span="8"
        >请求协议：<a-typography-text>{{ interfaceMsgs.interMsgApiProtocol }}</a-typography-text>
      </a-col>
      <a-col :span="8"
        >请求方式：<a-typography-text>{{ interfaceMsgs.interMsgRequest }}</a-typography-text>
      </a-col>
    </a-row>
    <a-row :style="{ height: '32px', color: '#999' }">
      <a-col :span="8">支持格式：<a-typography-text>JSON</a-typography-text> </a-col>
      <a-col :span="8"
        >IP端口：<a-typography-text>{{ interfaceMsgs.interMsgIp }}</a-typography-text>
      </a-col>
      <a-col :span="8"></a-col>
    </a-row>
    <a-row :style="{ height: '32px', color: '#999' }">
      <a-col :span="8"
        >Path：<a-typography-text>{{ interfaceMsgs.interMsgApiUrl }}</a-typography-text>
      </a-col>
      <a-col :span="8"></a-col>
      <a-col :span="8"></a-col>
    </a-row>
    <a-row :style="{ height: '32px', color: '#999' }">
      <a-col :span="8"
        >接口描述：<a-typography-text>{{ interfaceMsgs.interMsgDescribe }}</a-typography-text>
      </a-col>
      <a-col :span="8"></a-col>
      <a-col :span="8"></a-col>
    </a-row>
  </a-form>
  <div :style="{ background: '#f0f2f5', margin: '0 -24px', minHeight: '20px' }"></div>
  <a-tabs v-model:activeKey="activeKey2" size="large">
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
  <a-affix :offset-bottom="1" :style="{ display: 'flex', justifyContent: 'end', marginTop: '20px' }">
    <div class="affix">
      <a-button type="primary" @click="back">返回上一页</a-button>
    </div>
  </a-affix>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { InterfaceDetailSelect } from '@/api/test/index';
  //处理路由通过query传的参数
  const route = useRoute();
  let interMsgId;
  if (typeof route.query.interMsgId === 'string') {
    interMsgId = String(parseInt(route.query.interMsgId));
  }
  interface formState {
    interfaceConfigs: InterfaceConfigs;
    interfaceMsgs: interfaceMsgs;
    interDirName: string | undefined;
  }
  interface interfaceMsgs {
    interDirId: number;
    interMsgApiProtocol: string; //请求协议
    interMsgApiType: string; //接口分类
    interMsgApiUrl: string; //Path
    interMsgCreateTime: string;
    interMsgDescribe: string; //接口描述
    interMsgId: number;
    interMsgIp: string; //IP端口
    interMsgName: string;
    interMsgOvertime: number;
    interMsgRequest: string; //请求协议
    interMsgSource: string;
    interMsgUpdateTime: string;
    isDelete: number;
  }
  interface InterfaceConfigs {
    configureId: number;
    interConfigDataType: string;
    interConfigDefault: string;
    interConfigDescribe: string;
    interConfigDistinguish: number;
    interConfigId: number;
    interConfigIsNull: string;
    interConfigName: string;
    interConfigPlace: null;
    interMsgId: number;
    parentId: number;
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
  const formState = ref<formState>({} as any);
  const interfaceMsgs = ref<interfaceMsgs>({} as any);
  const interfaceConfigs = ref<InterfaceConfigs>({} as any);
  const data = ref([] as any);
  const data1 = ref([] as any);
  const data2 = ref([] as any);
  async function InterfaceDetailSelect_way() {
    await InterfaceDetailSelect(interMsgId).then(res => {
      formState.value = res.data.data;
      interfaceMsgs.value = res.data.data.interfaceMsgs;
      //请求参数数据处理
      if (res.data.data.requestParameters != null && res.data.data.requestParameters != []) {
        res.data.data.requestParameters.forEach(p => {
          p.interConfigIsNull = interConfigIsNull[p.interConfigIsNull];
          p.interConfigDataType = interConfigDataType[p.interConfigDataType];
          data.value.push(p);
        });
      }
      //请求Body数据处理
      if (res.data.data.requestBodys != null && res.data.data.requestBodys != []) {
        res.data.data.requestBodys.forEach(p => {
          p.interConfigIsNull = interConfigIsNull[p.interConfigIsNull];
          p.interConfigDataType = interConfigDataType[p.interConfigDataType];
          data1.value.push(p);
        });
      }
      //接口返回参数数据处理
      if (res.data.data.backParameters != null && res.data.data.backParameters != []) {
        res.data.data.backParameters.forEach(p => {
          p.interConfigIsNull = interConfigIsNull[p.interConfigIsNull];
          p.interConfigDataType = interConfigDataType[p.interConfigDataType];
          data2.value.push(p);
        });
      }
      console.log(res.data.data);

      interfaceConfigs.value = res.data.data.interfaceConfigs;
    });
  }
  InterfaceDetailSelect_way();

  const handleFinish = values => {
    console.log(values, formState);
  };
  const handleFinishFailed = () => {
    console.log(11);
  };
  //请求参数，请求body
  const activeKey2 = ref('1');
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
      title: '默认值',
      dataIndex: 'interConfigDefault',
      key: 'interConfigDefault',
      width: '16%',
    },
    {
      title: '说明',
      dataIndex: 'interConfigDescribe',
      key: 'interConfigDescribe',
      width: '18%',
    },
  ];
  //接口返回参数
  const columns2 = [
    {
      title: '参数名称',
      dataIndex: 'interConfigName',
      key: 'interConfigName',
      width: '16%',
    },
    {
      title: '数据类型',
      dataIndex: 'interConfigDataType',
      key: 'interConfigDataType',
      width: '16%',
    },
    {
      title: '参数说明',
      dataIndex: 'interConfigDescribe',
      key: 'interConfigDescribe',
      width: '16%',
    },
  ];
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
  //返回上一页
  const router = useRouter();
  const back = () => {
    router.push({
      path: '/InterFace',
    });
  };
  //返回上一页固钉
</script>
<style scoped lang="less">
  .affix {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    height: 40px;
    background-color: #fff;
  }
</style>
