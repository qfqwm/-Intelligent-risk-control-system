<template>
  <a-form id="Information" :model="Information" :label-col="{ span: 10 }" :wrapper-col="{ span: 16 }" autocomplete="off" @finish="commit_form">
    <!-- 基本信息 -->
    <div class="Messageheader">基本信息：</div>
    <a-form-item label="接口分类" name="classification" :rules="rules.classification">
      <a-select v-model:value="Information.classification" show-search style="width: 45%" :options="select_all.Interface_classification" :filter-option="filterOption" placeholder="请选择"> </a-select>
    </a-form-item>
    <a-form-item label="接口名称" name="Interface_name" :rules="rules.Interface_name">
      <a-input v-model:value.number="Information.Interface_name" placeholder="请输入" style="width: 45%" />
    </a-form-item>
    <a-form-item label="接口来源" name="Interface_source" :rules="rules.Interface_source">
      <a-select v-model:value="Information.Interface_source" placeholder="请选择" show-search style="width: 45%" :options="select_all.Interface_source" :filter-option="filterOption"> </a-select>
    </a-form-item>
    <a-form-item label="接口描述" name="Interface_describe">
      <a-textarea v-model:value="Information.Interface_describe" style="width: 45%" placeholder="请输入" />
    </a-form-item>
    <!-- API参数 -->
    <div class="Messageheader">API参数:</div>
    <a-form-item label="接口协议" name="Interface_agreement" :rules="rules.Interface_agreement">
      <a-select v-model:value="Information.Interface_agreement" placeholder="请选择" show-search style="width: 45%" :options="select_all.Interface_agreement" :filter-option="filterOption"> </a-select>
    </a-form-item>
    <a-form-item label="IP端口" name="Interface_port" :rules="rules.Interface_port">
      <a-input v-model:value.number="Information.Interface_port" placeholder="请输入" style="width: 45%" />
    </a-form-item>
    <a-form-item label="Path" name="Interface_path" :rules="rules.Interface_path">
      <a-input v-model:value.number="Information.Interface_path" placeholder="请输入" style="width: 45%" />
    </a-form-item>
    <a-form-item label="请求方式" name="Interface_request" :rules="rules.Interface_request">
      <a-select v-model:value="Information.Interface_request" placeholder="请选择" show-search style="width: 45%" :options="select_all.Request_mode" :filter-option="filterOption"> </a-select>
    </a-form-item>
    <a-form-item label="超时时间" name="Timeout" :rules="rules.Timeout">
      <a-input v-model:value.number="Information.Timeout" placeholder="请输入" style="width: 45%" />
    </a-form-item>
  </a-form>
</template>
<script lang="ts" setup>
  import emitter from '@/utils/bus';
  import { reactive } from 'vue';
  interface Information {
    classification: string | undefined;
    Interface_name: string | undefined;
    Interface_source: string | undefined;
    Interface_describe: string | undefined;
    Interface_agreement: string | undefined;
    Interface_port: string | undefined;
    Interface_path: string | undefined;
    Interface_request: string | undefined;
    Timeout: string | undefined;
  }
  // 定义基本信息
  const Information = ref<Information>({
    classification: undefined,
    Interface_name: '',
    Interface_source: undefined,
    Interface_describe: '',
    Interface_agreement: undefined,
    Interface_port: '',
    Interface_path: '',
    Interface_request: undefined,
    Timeout: '',
  });
  // 定义下拉框选项
  const filterOption = (input: string, option: any) => {
    return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };
  const select_all = reactive({
    Interface_classification: [
      { value: '哈哈哈', label: '分类' },
      { value: '数宜信', label: '数宜信' },
    ],
    Interface_source: [
      { value: '哈哈哈', label: '来源' },
      { value: '数宜信', label: '数宜信' },
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
  // 定义rules规则
  const rules = reactive({
    classification: [{ required: true, message: '请选择接口分类' }],
    Interface_name: [{ required: true, message: '请输入接口名称' }],
    Interface_source: [{ required: true, message: '请选择接口来源' }],
    Interface_agreement: [{ required: true, message: '请选择接口协议' }],
    Interface_port: [{ required: true, message: '请输入IP端口' }],
    Interface_path: [{ required: true, message: '请输入Path路径' }],
    Interface_request: [{ required: true, message: '请选择请求方式' }],
    Timeout: [{ required: true, message: '请输入超时时间' }],
  });
  //传递信息，表单通过验证，通过改变数量，向组件传递已通过验证的信息
  const commit_form_num = ref<number>(0);
  const commit_form = () => {
    commit_form_num.value++;
    emitter.emit('commit_form_num', commit_form_num.value);
    emitter.emit('object_form', Information.value);
  };
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
