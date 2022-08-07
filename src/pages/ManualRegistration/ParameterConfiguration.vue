<template>
  <DefinitionTables :table_object="input_parameter_object"></DefinitionTables>
  <DefinitionTables v-if="object_form_information.Interface_request === 'POST'" :table_object="quest_body__object"></DefinitionTables>
  <DefinitionTables :table_object="return_parameter__object"></DefinitionTables>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import type { Ref } from 'vue';
  import emitter from '@/utils/bus';
  import DefinitionTables from './DefinitionTables.vue';
  interface input_parameter_DataItem {
    key: string;
    name: string;
    weizhi: string;
    leixing: string;
    bitian: string;
    moren: string;
    miaoshu: string;
  }
  interface quest_body_DataItem {
    key: string;
    name: string;
    leixing: string;
    bitian: string;
    moren: string;
    miaoshu: string;
    shuoming: string;
  }
  interface return_parameter_DataItem {
    key: string;
    name: string;
    leixing: string;
    shuoming: string;
  }
  // 接收基本信息
  const object_form_information = ref({ Interface_request: '' }) as any;
  emitter.on('object_form', objectform => {
    object_form_information.value = objectform;
  });
  // 输入参数表格信息
  const input_parameter_columns = [
    {
      title: '参数名称',
      dataIndex: 'name',
      width: '180px',
    },
    {
      title: '参数位置',
      dataIndex: 'weizhi',
      width: '180px',
    },
    {
      title: '数据类型',
      dataIndex: 'leixing',
      width: '180px',
    },
    {
      title: '是否必填',
      dataIndex: 'bitian',
      width: '120px',
    },
    {
      title: '默认值',
      dataIndex: 'moren',
      width: '150px',
    },
    {
      title: '	参数描述',
      dataIndex: 'miaoshu',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: '200px',
    },
  ];
  const input_parameter_input = ref(['name', 'moren', 'miaoshu']);
  const select_parameter_input = ref(['weizhi', 'leixing', 'bitian']);
  const weizhi = [
    { label: 'Query', value: 'Query' },
    { label: 'Header', value: 'Header' },
  ];
  const select_parameter_options = ref({
    weizhi: weizhi,
  });
  const input_parameter_data: Ref<input_parameter_DataItem[]> = ref([
    {
      key: '0',
      name: 'Edward King 0',
      weizhi: '111',
      leixing: 'London, Park Lane no. 0',
      bitian: '123',
      moren: 'dasd',
      miaoshu: '12312',
    },
  ]);

  const input_parameter_object = ref({
    title: '输入参数',
    columns: input_parameter_columns,
    dataSource: input_parameter_data,
    input: input_parameter_input.value,
    select: select_parameter_input.value,
    options: select_parameter_options,
  });
  // 请求Body表格
  const quest_body_columns = [
    {
      title: '参数名称',
      dataIndex: 'name',
      width: '16%',
    },
    {
      title: '数据类型',
      dataIndex: 'leixing',
      width: '16%',
    },
    {
      title: '是否必填',
      dataIndex: 'bitian',
      width: '12%',
    },
    {
      title: '默认值',
      dataIndex: 'moren',
      width: '15%',
    },
    {
      title: '	参数说明',
      dataIndex: 'shuoming',
      width: '25%',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      minWidth: '200px',
      width: '15%',
    },
  ];
  const quest_body_data: Ref<quest_body_DataItem[]> = ref([
    {
      key: '0',
      name: 'string',
      leixing: 'string',
      bitian: 'string',
      moren: 'string',
      miaoshu: 'string',
      shuoming: 'string',
    },
  ]);
  const input_quest_body = ref(['name', 'moren', 'miaoshu', 'shuoming']);
  const select_quest_body = ref(['leixing', 'bitian']);
  const quest_body__object = ref({
    title: '请求Body',
    columns: quest_body_columns,
    dataSource: quest_body_data,
    input: input_quest_body.value,
    select: select_quest_body.value,
  });
  //返回参数表格
  const return_parameter_columns = [
    {
      title: '参数名称',
      dataIndex: 'name',
      width: '25%',
    },
    {
      title: '数据类型',
      dataIndex: 'leixing',
      width: '25%',
    },
    {
      title: '	参数说明',
      dataIndex: 'shuoming',
      width: '25%',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: '25%',
    },
  ];
  const return_parameter_data: Ref<return_parameter_DataItem[]> = ref([
    {
      key: '0',
      name: 'Edward King 0',
      leixing: 'London, Park Lane no. 0',
      shuoming: '12312',
    },
  ]);
  const input_return_parameter = ref(['name', 'shuoming']);
  const select_return_parameter = ref(['leixing']);
  const return_parameter__object = ref({
    title: '返回参数',
    columns: return_parameter_columns,
    dataSource: return_parameter_data,
    input: input_return_parameter.value,
    select: select_return_parameter.value,
  });
</script>
<style lang="less" scoped></style>
