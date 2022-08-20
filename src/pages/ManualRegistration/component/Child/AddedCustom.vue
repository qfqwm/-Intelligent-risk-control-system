<template>
  <a-table bordered :data-source="dataSource" :columns="columns" :pagination="false"> </a-table>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import emitter from '@/utils/bus';
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
  const dataSource = ref<any>([]);
  const dataSource_index = ref<any>([]);
  emitter.on('code_table', (e: any) => {
    dataSource.value.push(...e);
    let duplicate_removal = new Set(dataSource.value);
    dataSource.value = Array.from(duplicate_removal);
    dataSource_index.value = [];
    dataSource.value.forEach(item => {
      dataSource_index.value.push(item.configureId);
    });
  });
  // 记录recode地址，改变他的configureId值
  let change_record: any = null;
  emitter.on('change_record', (e: any) => {
    change_record = e;
  });
  emitter.on('notice', () => {
    change_record.configureId = dataSource_index.value;
  });
</script>
<style lang="less" scoped>
  .editable-cell {
    position: relative;

    .editable-cell-input-wrapper,
    .editable-cell-text-wrapper {
      padding-right: 24px;
    }

    .editable-cell-text-wrapper {
      padding: 5px 24px 5px 5px;
    }

    .editable-cell-icon,
    .editable-cell-icon-check {
      position: absolute;
      right: 0;
      width: 20px;
      cursor: pointer;
    }

    .editable-cell-icon {
      display: none;
      margin-top: 4px;
    }

    .editable-cell-icon-check {
      line-height: 28px;
    }

    .editable-cell-icon:hover,
    .editable-cell-icon-check:hover {
      color: #108ee9;
    }
  }

  .editable-cell:hover .editable-cell-icon {
    display: inline-block;
  }
</style>
