<template>
  <div class="head">
    <a-steps :percent="60" :current="step_index" class="hend_titile">
      <a-step v-for="(item, index) in hend_titile" :key="index" :title="item.title" />
    </a-steps>
  </div>
  <div class="body_edit_add">
    <EssentialInformation v-show="step_index === 0"></EssentialInformation> <div v-show="step_index === 1"><ParameterConfiguration></ParameterConfiguration></div>
  </div>
  <div class="bottom">
    <!-- 底部按钮区域 -->
    <div class="button"
      ><a-button v-if="step_index === 1" size="big">测试</a-button> <a-button v-if="step_index !== 0" size="big" @click="step_up">上一步</a-button><a-button @click="cancel">取消</a-button
      ><a-button v-if="step_index === 0 || step_index === 1" size="big" @click="keep">保存并退出</a-button>
      <a-button v-if="step_index === 0" type="primary" size="big" form="Information" html-type="submit">下一步</a-button></div
    >
  </div>
</template>
<script lang="ts" setup>
  import EssentialInformation from './EssentialInformation.vue';
  import ParameterConfiguration from './ParameterConfiguration.vue';
  import { InterfaceDetailSelect, insertInterMsg } from '@/api/test/index';
  import emitter from '@/utils/bus';
  import { useRouter, useRoute } from 'vue-router';
  import { selectMaxConfig } from '@/api/test/index';
  const router = useRouter();
  const hend_titile = ref([
    {
      title: '基本信息',
    },
    {
      title: '参数配置',
    },
  ]);
  // 记录当前进度
  const step_index = ref<number>(0);
  // 上一把按钮方法step_up
  const step_up = () => {
    step_index.value--;
  };
  // 下一步按钮方法
  const step_down = () => {
    selectMaxConfig().then(function (res) {
      console.log(res.data.data);
    });
    let object = {} as any;
    Object.keys(Basic_information).forEach(item => {
      object[item] = Basic_information[item];
    });
    // 新增
    object.interMsgApiType = '0';
    let object_insertInterMsg = { interfaceMsg: object };
    insertInterMsg(object_insertInterMsg).then(function (res) {
      console.log(res.data.data);
    });
    step_index.value++;
  };
  // 取消按钮
  const cancel = () => {
    router.go(-1);
  };
  // 接收基本信息表单提交次数--判断表单提交是否通过验证
  const commitform_num = ref();
  emitter.on('commit_form_num', commit_form_num => {
    commitform_num.value = commit_form_num;
  });
  watch(
    () => commitform_num.value,
    () => {
      step_down();
    },
  );
  const keep = () => {
    emitter.emit('keep');
  };
  // 定义函数，处理参数配置的数据
  const change_data = val => {
    return val.forEach(item => {
      if (item.key) delete item.key;
      if (item.newlyadded) delete item.newlyadded;
      if (item.children && item.children.length === 0) delete item.children;
      if (item.children && item.children.length !== 0) change_data(item.children);
    });
  };

  //接收参数配置的数据
  const input_parameter_data = ref();
  emitter.on('data_输入参数', e => {
    const to_e = e;
    change_data(to_e);
    input_parameter_data.value = to_e;
  });
  const quest_body_data = ref();
  emitter.on('data_请求Body', e => {
    change_data(e);
    quest_body_data.value = e;
  });
  const return_parameter_data = ref();
  emitter.on('data_返回参数', e => {
    change_data(e);
    return_parameter_data.value = e;
  });

  // 基本信息内容
  const Basic_information = reactive({
    interDirId: '',
    interMsgName: '',
    interMsgSource: undefined,
    interMsgDescribe: '',
    interMsgApiProtocol: undefined,
    interMsgIp: '',
    interMsgApiUrl: '',
    interMsgRequest: undefined,
    interMsgOvertime: '',
  });
  // 接收路由传参
  const Route = useRoute();
  if (Route.query.mode !== 'zc') {
    InterfaceDetailSelect(Route.query.mode as any).then(function (res) {
      if (res.data.msg == '返回成功') {
        Object.keys(Basic_information).forEach(item => {
          Basic_information[item] = res.data.data.interfaceMsgs[item];
        });
        emitter.emit('Basic_information', Basic_information);
      }
    });
  }
</script>
<style lang="less" scoped>
  .head {
    display: flex;
    align-items: center;
    height: 60px;
    background: #f0f2f5;

    .hend_titile {
      margin: 10px auto;
      width: 30%;
    }
  }

  .body_edit_add {
    margin-top: 30px;
    border-top: 1px #f0f2f5 solid;
    padding-bottom: 10px;
    min-height: 670px;
    background: #f0f2f5;
  }

  .bottom {
    position: fixed;
    bottom: 0;
    left: -1%;
    z-index: 3;
    width: 105%;
    height: 60px;
    background: #ffffff;
    box-shadow: 0 -2px 1px gray;

    .button {
      position: absolute;
      right: 5%;

      button {
        margin: 15px 5px;
      }
    }
  }
</style>
