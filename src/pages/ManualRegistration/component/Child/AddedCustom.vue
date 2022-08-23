<template>
  <a-table bordered :data-source="dataSource" :columns="columns" :pagination="false">
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'delete'">
        <a-popconfirm v-if="dataSource.length" title="是否删除?" @confirm="onDelete(record.configureId)">
          <a>删除</a>
        </a-popconfirm>
      </template>
    </template>
  </a-table>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import emitter from '@/utils/bus';
  import { selectCodeConfigById } from '@/api/test/index';
  const props = defineProps({
    recorddatasourceindex: {
      type: Array,
      default: () => {
        return [];
      },
    },
    visibleswith: {
      type: Boolean,
    },
  });
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
    {
      title: '操作',
      dataIndex: 'delete',
    },
  ];
  const dataSource_index = ref<any>([]);

  watch(
    () => props.visibleswith,
    () => {
      if (props.visibleswith == true) {
        (function () {
          dataSource_index.value = null;
          dataSource_index.value = props.recorddatasourceindex;
        })();
      }
    },
    { immediate: true },
  );

  watch(
    () => props.recorddatasourceindex,
    () => {
      dataSource_index.value = props.recorddatasourceindex;
      let duplicate_removal = new Set(dataSource_index.value);
      dataSource_index.value = Array.from(duplicate_removal);
    },
    { deep: true, immediate: true },
  );
  emitter.on('code_table', (e: any) => {
    dataSource_index.value.push(...e);
    let duplicate_removal = new Set(dataSource_index.value);
    dataSource_index.value = Array.from(duplicate_removal);
    emitter.emit('dataSource_index', dataSource_index.value);
  });
  const dataSource = ref<any>([]);
  // 调用接口请求数据，加载表格
  watch(
    () => dataSource_index.value,
    () => {
      selectCodeConfigById({ configureIds: dataSource_index.value }).then(function (res) {
        if (res.data.msg == '返回成功') {
          dataSource.value = res.data.data;
        } else {
          dataSource.value = [];
        }
      });
    },
    { deep: true, immediate: true },
  );

  // 删除
  const onDelete = (id: any) => {
    dataSource_index.value = dataSource_index.value.filter(item => {
      return item != id;
    });
    emitter.emit('dataSource_index', dataSource_index.value);
  };
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
