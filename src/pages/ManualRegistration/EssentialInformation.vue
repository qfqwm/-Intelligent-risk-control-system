<template>
  <a-form id="Information" :model="Information" :label-col="{ span: 10 }" :wrapper-col="{ span: 16 }" autocomplete="off" @finish="commit_form">
    <!-- 基本信息 -->
    <div class="Messageheader">基本信息：</div>
    <a-form-item label="接口分类" name="interDirId" :rules="rules.classification">
      <a-form-item-rest>
        <a-tree-select
          v-model:value="Information.interDirId"
          show-search
          style="width: 45%"
          allow-clear
          tree-default-expand-all
          placeholder="请选择"
          :tree-data="select_all.Interface_classification"
          :field-names="fieldNames"
        >
        </a-tree-select>
      </a-form-item-rest>
    </a-form-item>
    <a-form-item label="接口名称" name="interMsgName" :rules="rules.Interface_name">
      <a-input v-model:value.trim="Information.interMsgName" placeholder="请输入" style="width: 45%" />
    </a-form-item>
    <a-form-item label="接口来源" name="interMsgSource" :rules="rules.Interface_source">
      <a-select v-model:value="Information.interMsgSource" placeholder="请选择" show-search style="width: 45%" :options="select_all.Interface_source" :filter-option="filterOption"> </a-select>
    </a-form-item>
    <a-form-item label="接口描述" name="interMsgDescribe">
      <a-textarea v-model:value.trim="Information.interMsgDescribe" style="width: 45%" placeholder="请输入" />
    </a-form-item>
    <!-- API参数 -->
    <div class="Messageheader">API参数:</div>
    <a-form-item label="接口协议" name="interMsgApiProtocol" :rules="rules.Interface_agreement">
      <a-select v-model:value.trim="Information.interMsgApiProtocol" placeholder="请选择" show-search style="width: 45%" :options="select_all.Interface_agreement" :filter-option="filterOption">
      </a-select>
    </a-form-item>
    <a-form-item label="IP端口" name="interMsgIp" :rules="rules.Interface_port">
      <a-input v-model:value.trim="Information.interMsgIp" placeholder="请输入" style="width: 45%" />
    </a-form-item>
    <a-form-item label="Path" name="interMsgApiUrl" :rules="rules.Interface_path">
      <a-input v-model:value.trim="Information.interMsgApiUrl" placeholder="请输入" style="width: 45%" />
    </a-form-item>
    <a-form-item label="请求方式" name="interMsgRequest" :rules="rules.Interface_request">
      <a-select v-model:value.trim="Information.interMsgRequest" placeholder="请选择" show-search style="width: 45%" :options="select_all.Request_mode" :filter-option="filterOption"> </a-select>
    </a-form-item>
    <a-form-item label="超时时间" name="interMsgOvertime" :rules="rules.Timeout">
      <a-input v-model:value.number="Information.interMsgOvertime" placeholder="请输入" style="width: 45%" />
    </a-form-item>
  </a-form>
</template>
<script lang="ts" setup>
  import emitter from '@/utils/bus';
  import { InterfaceSelectDirectory } from '@/api/test/index';
  import { reactive } from 'vue';

  // 定义基本信息
  const Information = reactive({
    interDirId: '',
    interMsgName: '',
    interMsgSource: undefined,
    interMsgDescribe: '',
    interMsgApiProtocol: undefined,
    interMsgIp: '',
    interMsgApiUrl: '',
    interMsgRequest: undefined,
    interMsgOvertime: '',
  }) as any;
  // 定义下拉框选项
  const filterOption = (input: string, option: any) => {
    return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };
  const select_all = reactive({
    Interface_classification: [],
    Interface_source: [
      { value: 0, label: '数据服务' },
      { value: 1, label: '指标管理' },
      { value: 2, label: '决策引擎' },
    ],
    Interface_agreement: [
      { value: 'HTTP', label: 'HTTP' },
      { value: 'HTTPS', label: 'HTTPS' },
    ],
    Request_mode: [
      { value: 'GET', label: 'GET' },
      { value: 'POST', label: 'POST' },
    ],
  });
  InterfaceSelectDirectory().then(res => {
    select_all.Interface_classification = res.data.data;
    convertData(select_all.Interface_classification);
  });
  const fieldNames = {
    children: 'children',
    title: 'interDirName',
    key: 'interDirId',
    value: 'interDirId',
  };
  const convertData = (treeData: any[]) => {
    treeData.forEach(item => {
      item.title = item.interDirName;
      item.value = item.interDirId;
      if (item.children) {
        convertData(item.children);
      }
    });
  };
  // 定义rules规则
  const rules = reactive({
    classification: [{ required: true, message: '请选择接口分类' }],
    Interface_name: [{ required: true, message: '请输入接口名称' }],
    Interface_source: [{ required: true, message: '请选择接口来源' }],
    Interface_agreement: [{ required: true, message: '请选择接口协议' }],
    Interface_port: [
      { required: true, message: '请输入IP端口' },
      {
        pattern: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
        message: '端口号不符合规定',
        trigger: 'blur',
      },
    ],
    Interface_path: [{ required: true, message: '请输入Path路径' }],
    Interface_request: [{ required: true, message: '请选择请求方式' }],
    Timeout: [
      { required: true, message: '请输入超时时间' },
      { pattern: /[1-9]\d*$/, message: '超时时间不符合规定', trigger: 'blur' },
    ],
  });
  //传递信息，表单通过验证，通过改变数量，向组件传递已通过验证的信息
  const commit_form_num = ref<number>(0);
  const commit_form = () => {
    commit_form_num.value++;
    emitter.emit('commit_form_num', commit_form_num.value);
    emitter.emit('object_form', Information);
  };
  // 接收信息
  emitter.on('Basic_information', (e: any) => {
    Object.keys(Information).forEach(item => {
      Information[item] = e[item];
    });
  });
  // 保存并退出,传送表格数据
  emitter.on('keep', () => {
    emitter.emit('object_form', Information);
  });
</script>
<style scoped lang="less">
  .Messageheader {
    position: relative;
    margin-top: 20px;
    margin-top: 50px;
    margin-bottom: 20px;
    padding-left: 37%;
    font-size: 20px;
    font-weight: 700;
    color: #666;
    line-height: 20px;
  }

  .Messageheader:after {
    position: absolute;
    top: 2px;
    left: 36%;
    width: 3px;
    height: 15px;
    background: #0079fe;
    content: '';
  }
</style>
