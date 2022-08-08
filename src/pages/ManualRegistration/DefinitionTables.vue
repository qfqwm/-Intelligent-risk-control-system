<template>
  <div class="Input_parameter_table">
    <!--表格头部 -->
    <div class="border_title"
      ><span class="span">{{ props.table_object.title }}</span
      ><a-button class="editable-add-btn" style="margin-bottom: 8px" type="primary" size="big" @click="handleAdd">新增参数</a-button></div
    >
    <a-table bordered :data-source="dataSource" :columns="columns" :pagination="false">
      <template #bodyCell="{ column, text, record }">
        <template v-if="props.table_object.input.includes(column.dataIndex)">
          <div>
            <a-input v-if="editableData[record.key]" v-model:value="editableData[record.key][column.dataIndex]" style="margin: -5px 0" placeholder="请输入" />
            <template v-else>
              {{ text }}
            </template>
          </div>
        </template>
        <template v-if="props.table_object.select.includes(column.dataIndex)">
          <div>
            <a-select
              v-if="editableData[record.key]"
              v-model:value="editableData[record.key][column.dataIndex]"
              :options="props.table_object.options[column.dataIndex]"
              :filter-option="filterOption"
              style="width: 100%"
              placeholder="请选择"
            >
            </a-select>
            <template v-else>
              {{ text }}
            </template>
          </div>
        </template>
        <template v-else-if="column.dataIndex === 'operation'">
          <div class="editable-row-operations">
            <span v-if="editableData[record.key]">
              <a-typography-link @click="save(record.key)">保存</a-typography-link>
              <a @click="cancel(record.key)">取消</a>
            </span>
            <span v-else>
              <a @click="edit(record.key)">编辑</a>
              <a-popconfirm title="Sure to cancel?" @confirm="onDelete(record.key)">
                <a>删除</a>
              </a-popconfirm>
            </span>
          </div>
        </template>
      </template>
    </a-table></div
  >
</template>
<script lang="ts" setup>
  import { reactive } from 'vue';
  import type { UnwrapRef } from 'vue';
  import { cloneDeep } from 'lodash-es';
  // 接收参数
  type Props = {
    // eslint-disable-next-line vue/prop-name-casing
    table_object: any;
  };
  const props = defineProps<Props>();
  const dataSource = ref(props.table_object.dataSource);
  const columns = ref(props.table_object.columns);
  const filterOption = (input: string, option: any) => {
    return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  const editableData: UnwrapRef<Record<string, DataItem>> = reactive({});
  // 删除
  const onDelete = (key: string) => {
    dataSource.value = dataSource.value.filter(item => item.key !== key);
    console.log(props.table_object);
  };
  //   编辑
  const edit = (key: string) => {
    editableData[key] = cloneDeep(dataSource.value.filter(item => key === item.key)[0]);
  };
  //   取消
  const cancel = (key: string) => {
    delete editableData[key];
  };
  //   保存
  const save = (key: string) => {
    Object.assign(dataSource.value.filter(item => key === item.key)[0], editableData[key]);
    delete editableData[key];
  };
  // 添加表格区域
  const handleAdd = () => {
    const newData = {
      key: dataSource.value.length.toString(),
    } as any;
    props.table_object.columns.forEach((item: any) => {
      newData[item.dataIndex] = '';
      if (props.table_object.select.includes(item.dataIndex)) newData[item.dataIndex] = undefined;
    });
    if (newData.operation) delete newData.operation;
    dataSource.value.push(newData);
    edit((dataSource.value.length - 1).toString());
  };
</script>
<style lang="less" scoped>
  .Input_parameter_table {
    margin: 10px auto;
    margin-bottom: 50px;
    padding: 20px;
    width: 90%;
    background: #fff;

    .border_title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;

      .span {
        padding-left: 10px;
        font-size: 20px;
        color: #666;
        line-height: 48px;
      }
    }

    .editable-row-operations {
      a {
        padding: 0 10px;
        font-size: 16px;
      }
    }
  }

  #app > section > section > section > main > div.body_edit_add > div > div.border_title > button {
    margin-bottom: 0 !important;
  }
  // 表格样式
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

    .editable-add-btn {
      margin-bottom: 8px;
    }
  }

  .editable-cell:hover .editable-cell-icon {
    display: inline-block;
  }
</style>
