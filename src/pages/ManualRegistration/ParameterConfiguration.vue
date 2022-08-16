<template>
  <DefinitionTables :table_object="input_parameter_object"></DefinitionTables>
  <DefinitionTables v-if="object_form_information.Interface_request === 'POST'" :table_object="quest_body_object"></DefinitionTables>
  <DefinitionTables :table_object="return_parameter_object"></DefinitionTables>
  <JosnTo></JosnTo>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import type { Ref } from 'vue';
  import emitter from '@/utils/bus';
  import DefinitionTables from './DefinitionTables.vue';
  import JosnTo from './JosnTo.vue';
  interface input_parameter_DataItem {
    name: string;
    weizhi: string;
    leixing: string;
    bitian: string;
    moren: string;
    miaoshu: string;
  }
  interface quest_body_DataItem {
    name: string;
    leixing: string;
    bitian: string;
    moren: string;
    miaoshu: string;
    shuoming: string;
  }
  interface return_parameter_DataItem {
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
      type: 'input',
      className: 'form-table-heard',
      quired: true,
    },
    {
      title: '参数位置',
      dataIndex: 'weizhi',
      width: '180px',
      type: 'select',
      className: 'form-table-heard',
      quired: true,
    },
    {
      title: '数据类型',
      dataIndex: 'leixing',
      type: 'select',
      width: '180px',
      className: 'form-table-heard',
      quired: true,
    },
    {
      title: '是否必填',
      dataIndex: 'bitian',
      type: 'select',
      width: '120px',
      className: 'form-table-heard',
      quired: true,
    },
    {
      title: '默认值',
      dataIndex: 'moren',
      type: 'input',
      width: '150px',
    },
    {
      title: '参数描述',
      type: 'input',
      dataIndex: 'miaoshu',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: '250px',
    },
  ];

  const weizhi = [
    { label: 'Query', value: 'Query' },
    { label: 'Header', value: 'Header' },
  ];
  const Simple_type = [
    { label: 'String', value: 'String' },
    { label: 'Int', value: 'Int' },
    { label: 'Float', value: 'Float' },
  ];
  const bitian = [
    { label: '是', value: '是' },
    { label: '否', value: '否' },
  ];
  const select_parameter_options = ref({
    weizhi: weizhi,
    leixing: Simple_type,
    bitian: bitian,
  });
  const input_parameter_data: Ref<input_parameter_DataItem[]> = ref([
    {
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
    options: select_parameter_options,
  });
  // 请求Body表格
  const quest_body_columns = [
    {
      title: '参数名称',
      dataIndex: 'name',
      width: '16%',
      quired: true,
      type: 'input',
      className: 'form-table-heard',
    },
    {
      title: '数据类型',
      dataIndex: 'leixing',
      width: '16%',
      type: 'select',
      quired: true,
      className: 'form-table-heard',
    },
    {
      title: '是否必填',
      dataIndex: 'bitian',
      width: '12%',
      type: 'select',
      quired: true,
      className: 'form-table-heard',
    },
    {
      title: '默认值',
      dataIndex: 'moren',
      width: '15%',
      type: 'input',
    },
    {
      title: '	参数说明',
      dataIndex: 'shuoming',
      width: '20%',
      type: 'input',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      minWidth: '200px',
      width: '20%',
    },
  ];
  const quest_body_data: Ref<quest_body_DataItem[]> = ref([
    {
      name: 'string',
      leixing: 'string',
      bitian: 'string',
      moren: 'string',
      miaoshu: 'string',
      shuoming: 'string',
    },
  ]);
  const Complex_type = [
    { label: 'String', value: 'String' },
    { label: 'Int', value: 'Int' },
    { label: 'Float', value: 'Float' },
    { label: 'Object', value: 'Object' },
    { label: 'Array', value: 'Array' },
  ];
  const quest_body_options = ref({
    leixing: Complex_type,
    bitian: bitian,
  });

  const quest_body_object = ref({
    title: '请求Body',
    columns: quest_body_columns,
    dataSource: quest_body_data,
    options: quest_body_options,
  });
  //返回参数表格
  const return_parameter_columns = [
    {
      title: '参数名称',
      dataIndex: 'name',
      width: '25%',
      type: 'input',
      quired: true,
      className: 'form-table-heard',
    },
    {
      title: '数据类型',
      dataIndex: 'leixing',
      width: '25%',
      type: 'select',
      quired: true,
      className: 'form-table-heard',
    },
    {
      title: '参数说明',
      dataIndex: 'shuoming',
      type: 'input',
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
      name: 'Edward King 0',
      leixing: 'aaaaaaaaaaaaaa',
      shuoming: '12312',
      children: [
        {
          name: 'Edward King 1',
          leixing: 'aaaaaaaaaaaaaa',
          shuoming: '12312',
          children: [
            {
              name: 'Edward King 2',
              leixing: 'aaaaaaaaaaaaaa',
              shuoming: '12312',
            },
          ],
        },
      ],
    },
  ]);

  const return_parameter_options = ref({
    leixing: Complex_type,
  });
  const return_parameter_object = ref({
    title: '返回参数',
    columns: return_parameter_columns,
    dataSource: return_parameter_data,
    options: return_parameter_options,
  });
</script>
<style lang="less" scoped></style>
