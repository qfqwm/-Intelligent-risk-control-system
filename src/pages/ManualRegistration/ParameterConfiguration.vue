<template>
  <DefinitionTables :table_object="input_parameter_object" @editabledata_state="input_parameter_changeeditabledata" @recordindex="change_record_index"></DefinitionTables>
  <div v-show="object_form_information.interMsgRequest === 'POST'"
    ><DefinitionTables :table_object="quest_body_object" @editabledata_state="quest_body_changeeditabledata" @recordindex="change_record_index"></DefinitionTables
  ></div>
  <DefinitionTables :table_object="return_parameter_object" @editabledata_state="return_parameter_changeeditabledata" @recordindex="change_record_index"></DefinitionTables>
  <JosnTo></JosnTo>
  <Definition :recorddatasourceindex="record_dataSource_index" />
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import type { Ref } from 'vue';
  import emitter from '@/utils/bus';
  import DefinitionTables from './DefinitionTables.vue';
  import Definition from './component/Definition.vue';
  import JosnTo from './JosnTo.vue';
  const emits = defineEmits(['editabledata']);
  type Props = {
    // eslint-disable-next-line vue/prop-name-casing
    parameter_configuration: any;
  };
  const props = defineProps<Props>();
  watch(
    () => props.parameter_configuration,
    () => {
      input_parameter_object.value.dataSource = props.parameter_configuration.requestParameters;
      quest_body_object.value.dataSource = props.parameter_configuration.requestBodys;
      return_parameter_object.value.dataSource = props.parameter_configuration.backParameters;
    },
  );
  interface input_parameter_DataItem {
    interConfigName: string;
    interConfigPlace: string;
    interConfigDataType: string;
    interConfigIsNull: string;
    interConfigDefault: string;
    interConfigDescribe: string;
    configureId: any;
  }
  interface quest_body_DataItem {
    interConfigName: string;
    interConfigDataType: string;
    interConfigIsNull: string;
    interConfigDefault: string;
    interConfigDescribe: string;
    configureId: any;
  }
  interface return_parameter_DataItem {
    interConfigName: string;
    interConfigDataType: string;
    interConfigDescribe: string;
    configureId: any;
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
      dataIndex: 'interConfigName',
      width: '180px',
      type: 'input',
      className: 'form-table-heard',
      quired: true,
    },
    {
      title: '参数位置',
      dataIndex: 'interConfigPlace',
      width: '180px',
      type: 'select',
      className: 'form-table-heard',
      quired: true,
    },
    {
      title: '数据类型',
      dataIndex: 'interConfigDataType',
      type: 'select',
      width: '180px',
      className: 'form-table-heard',
      quired: true,
    },
    {
      title: '是否必填',
      dataIndex: 'interConfigIsNull',
      type: 'select',
      width: '120px',
      className: 'form-table-heard',
      quired: true,
    },
    {
      title: '默认值',
      dataIndex: 'interConfigDefault',
      type: 'input',
      width: '150px',
    },
    {
      title: '参数描述',
      type: 'input',
      dataIndex: 'interConfigDescribe',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: '250px',
    },
  ];

  const Place = [
    { label: 'Query', value: 'Query' },
    { label: 'Header', value: 'Header' },
  ];
  const Simple_type = [
    { label: 'String', value: '2' },
    { label: 'Int', value: '3' },
    { label: 'Float', value: '4' },
  ];
  const Required = [
    { label: '是', value: '1' },
    { label: '否', value: '0' },
  ];
  const select_parameter_options = ref({
    interConfigPlace: Place,
    interConfigDataType: Simple_type,
    interConfigIsNull: Required,
  });
  const input_parameter_data: Ref<input_parameter_DataItem[]> = ref([]);

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
      dataIndex: 'interConfigName',
      width: '16%',
      quired: true,
      type: 'input',
      className: 'form-table-heard',
    },
    {
      title: '数据类型',
      dataIndex: 'interConfigDataType',
      width: '16%',
      type: 'select',
      quired: true,
      className: 'form-table-heard',
    },
    {
      title: '是否必填',
      dataIndex: 'interConfigIsNull',
      width: '12%',
      type: 'select',
      quired: true,
      className: 'form-table-heard',
    },
    {
      title: '默认值',
      dataIndex: 'interConfigDefault',
      width: '15%',
      type: 'input',
    },
    {
      title: '	参数说明',
      dataIndex: 'interConfigDescribe',
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
  const quest_body_data: Ref<quest_body_DataItem[]> = ref([]);
  const Complex_type = [
    { label: 'String', value: '2' },
    { label: 'Int', value: '3' },
    { label: 'Float', value: '4' },
    { label: 'Object', value: '0' },
    { label: 'Array', value: '1' },
  ];
  const quest_body_options = ref({
    interConfigDataType: Complex_type,
    interConfigIsNull: Required,
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
      dataIndex: 'interConfigName',
      width: '25%',
      type: 'input',
      quired: true,
      className: 'form-table-heard',
    },
    {
      title: '数据类型',
      dataIndex: 'interConfigDataType',
      width: '25%',
      type: 'select',
      quired: true,
      className: 'form-table-heard',
    },
    {
      title: '参数说明',
      dataIndex: 'interConfigDescribe',
      type: 'input',
      width: '25%',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: '25%',
    },
  ];
  const return_parameter_data: Ref<return_parameter_DataItem[]> = ref([]);
  const return_parameter_options = ref({
    interConfigDataType: Complex_type,
  });
  const return_parameter_object = ref({
    title: '返回参数',
    columns: return_parameter_columns,
    dataSource: return_parameter_data,
    options: return_parameter_options,
  });
  const editabledata = reactive({
    input_parameter: true,
    quest_body: true,
    return_parameter: true,
  });
  const input_parameter_changeeditabledata = e => {
    editabledata.input_parameter = e;
  };
  const quest_body_changeeditabledata = e => {
    editabledata.quest_body = e;
  };
  const return_parameter_changeeditabledata = e => {
    editabledata.return_parameter = e;
  };
  watch(
    () => editabledata,
    () => {
      emits('editabledata', editabledata);
    },
    { deep: true },
  );
  const record_dataSource_index = ref([]);
  const change_record_index = e => {
    record_dataSource_index.value = e;
  };
</script>
<style lang="less" scoped></style>
