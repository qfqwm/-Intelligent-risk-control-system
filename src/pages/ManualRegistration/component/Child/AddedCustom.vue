<!-- eslint-disable vue/v-on-event-hyphenation -->
<template>
  <a-table bordered :data-source="dataSource" :columns="columns" :pagination="false">
    <template #bodyCell="{ column, text, record }">
      <template v-if="['name', 'age', 'address'].includes(column.dataIndex)">
        <div class="editable-cell">
          <div v-if="editableData[record.key]">
            <a-input v-model:value="editableData[record.key].name" placeholder="请输入" @pressEnter="save(record.key)" />
            <!-- <check-outlined class="editable-cell-icon-check" @click="save(record.key)" /> -->
          </div>
          <div v-else>
            {{ text || ' ' }}
            <!-- <edit-outlined class="editable-cell-icon" @click="edit(record.key)" /> -->
          </div>
        </div>
      </template>
      <template v-else-if="column.dataIndex === 'operation'">
        <div class="editable-row-operations">
          <a-form-item>
            <span v-if="editableData[record.key]">
              <a-typography-link @click="save(record.key)">保存</a-typography-link>
              <a-typography-link style="margin-left: 10px" @click="cancel(record.key)">取消 </a-typography-link>
            </span>
            <span v-else>
              <a @click="edit(record.key)">编辑</a>
              <a style="margin-left: 10px" @click="onDelete(record.key)">删除</a>
            </span>
          </a-form-item>
        </div>
      </template>
    </template>
  </a-table>
</template>
<script lang="ts" setup>
  import { computed, reactive, ref } from 'vue';
  import type { Ref, UnwrapRef } from 'vue';
  //   import { CheckOutlined, EditOutlined } from '@ant-design/icons-vue';
  import { cloneDeep } from 'lodash-es';
  import emitter from '@/utils/bus';

  emitter.on('sendSon', () => {
    handleAdd();
  });

  interface DataItem {
    key: string;
    name: string;
    age: number;
    address: string;
  }
  const columns = [
    {
      title: '码值取值',
      dataIndex: 'name',
      width: '25%',
    },
    {
      title: '码值名称',
      dataIndex: 'age',
      width: '25%',
    },
    {
      title: '码值含义',
      dataIndex: 'address',
      width: '30%',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: '20%',
    },
  ];
  const dataSource: Ref<DataItem[]> = ref([]);
  const count = computed(() => dataSource.value.length + 1);
  const editableData: UnwrapRef<Record<string, DataItem>> = reactive({});

  const edit = (key: string) => {
    editableData[key] = cloneDeep(dataSource.value.filter(item => key === item.key)[0]);
  };
  const save = (key: string) => {
    Object.assign(dataSource.value.filter(item => key === item.key)[0], editableData[key]);
    delete editableData[key];
  };

  const onDelete = (key: string) => {
    dataSource.value = dataSource.value.filter(item => item.key !== key);
  };

  const cancel = (key: string) => {
    delete editableData[key];
    onDelete(key);
  };
  const handleAdd = () => {
    const newData = {
      key: `${count.value}`,
      name: ``,
      age: ``,
      address: ``,
    };
    dataSource.value.push(newData);
    edit(dataSource.value.length.toString());
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
