<template>
  <a-table :data-source="data" :columns="columns" :pagination="false" :row-selection="rowSelection" :row-key="Record_selection"> </a-table>
</template>
<script lang="ts" setup>
  import emitter from '@/utils/bus';
  import { ref } from 'vue';
  const props = defineProps({
    datatable: {
      type: Array,
      default: () => {
        return [];
      },
    },
  });
  //返回绑定的id
  const Record_selection = (dataSource: any) => {
    return dataSource.configureId;
  };
  watch(
    () => props.datatable,
    () => {
      Selectall_invert.value = [];
      data.value = props.datatable;
    },
    { deep: true },
  );
  const Code_table = ref<any>([]);
  // 全选/反选
  const Selectall_invert = ref<any>([]);
  const data = ref<any>();
  watch(
    () => Selectall_invert.value,
    () => {
      Code_table.value = [];
      data.value.forEach((item: any) => {
        if (Selectall_invert.value.indexOf(item.configureId) != -1) {
          Code_table.value.push(item.configureId);
        }
      });
    },
    { deep: true },
  );

  const columns = [
    {
      title: '编码取值',
      dataIndex: 'configureId',
    },
    {
      title: '编码名称',
      dataIndex: 'configureName',
    },
    {
      title: '编码含义',
      dataIndex: 'configureMean',
    },
  ];
  emitter.on('trigger', () => {
    emitter.emit('code_table', Code_table.value);
  });
  const rowSelection = computed(() => {
    return {
      checkStrictly: false,
      selectedRowKeys: Selectall_invert,
      onChange: (selectedRows: any) => {
        Selectall_invert.value = selectedRows;
      },
    };
  });
</script>
<style lang="less" scoped>
  .highlight {
    padding: 0px;
    background-color: rgb(255, 192, 105);
  }
</style>
