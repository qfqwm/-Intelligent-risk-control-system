<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div class="Input_parameter_table">
    <!--表格头部 -->
    <div class="border_title"
      ><span class="span">{{ props.table_object.title }}</span
      ><a-button class="editable-add-btn" style="margin-bottom: 8px" type="primary" size="big" @click="handleAdd">新增参数</a-button></div
    >
    <a-table bordered :data-source="props.table_object.dataSource" :columns="props.table_object.columns" :pagination="false">
      <template #bodyCell="{ column, text, record }">
        <!-- input框 -->
        <template v-if="input.includes(column.dataIndex)">
          <a-form-item
            v-if="editableData[record.key]"
            :name="column.dataIndex"
            :validate-status="getFildStatus(record.key, column.dataIndex).validateStatus"
            :help="getFildStatus(record.key, column.dataIndex).errorMsg"
          >
            <a-input v-model:value="record[column.dataIndex]" style="margin: -5px 0" placeholder="请输入" @change="handleChange(record[column.dataIndex], record.key, column.dataIndex)" />
          </a-form-item>
          <template v-else>
            {{ text }}
          </template>
        </template>
        <!-- select框 -->
        <template v-if="select.includes(column.dataIndex)">
          <a-form-item v-if="editableData[record.key]" :validate-status="getFildStatus(record.key, column.dataIndex).validateStatus" :help="getFildStatus(record.key, column.dataIndex).errorMsg">
            <a-select
              v-model:value="props.table_object.dataSource[record.key][column.dataIndex]"
              :options="props.table_object.options[column.dataIndex]"
              :filter-option="filterOption"
              style="width: 100%"
              placeholder="请选择"
              @change="handleChange(record[column.dataIndex], record.key, column.dataIndex)"
            >
            </a-select>
          </a-form-item>
          <template v-else>
            {{ text }}
          </template>
        </template>
        <!-- 操作区域 -->
        <template v-if="column.dataIndex === 'operation'">
          <div class="editable-row-operations">
            <span v-if="editableData[record.key]">
              <a @click="save(record.key)">保存</a>
              <!-- <button html-type="submit" :form="props.table_object.title + 'from_' + record.key">保存</button> -->
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
  // 查找input框/select框/必填参数
  const input = ref<any>([]);
  const select = ref<any>([]);
  const Required = ref<any>([]);
  props.table_object.columns.forEach((item: any) => {
    if (item.type && item.type === 'input') {
      input.value.push(item.dataIndex);
    }
    if (item.type && item.type === 'select') {
      select.value.push(item.dataIndex);
    }
    if (item.quired && item.quired === true) {
      Required.value.push(item.dataIndex);
    }
  });
  const getFildStatus = (key: any, dataIndex: string) => {
    const data = Verificationprompt.filter(item => key === item.key)[0];
    console.log(key, dataIndex);
    console.log(Required.value.indexOf(dataIndex));
    // 判断是否为必填字段，不是必填字段直接返回成功提示
    if (Required.value.indexOf(dataIndex) == -1)
      return {
        errorMsg: '',
        validateStatus: '',
      };
    if (data) {
      return data[dataIndex];
    } else {
      return {
        errorMsg: '',
        validateStatus: 'success',
      };
    }
  };

  const validatePrime = content => {
    if (content == '' || content == undefined || content == null) {
      return {
        validateStatus: 'error',
        errorMsg: '不能为空',
      };
    } else
      return {
        validateStatus: '',
        errorMsg: '',
      };
  };

  // 验证提示
  const Verificationprompt = [] as any;
  const handleChange = (value, key, column_dataIndex) => {
    // 判断是否是验证字段，如不是，直接return退出
    if (Required.value.indexOf(column_dataIndex) == -1) return;
    const newData = props.table_object.dataSource;
    const target = newData.filter(item => item.key === key)[0];
    if (target) {
      const { errorMsg, validateStatus } = validatePrime(value);
      let flag = true;
      Verificationprompt.forEach((val: any) => {
        // 如果验证列已存在，更改验证列的字段验证信息
        if (val.key == key) {
          flag = false;
          val[column_dataIndex].errorMsg = errorMsg;
          val[column_dataIndex].validateStatus = validateStatus;
        }
      });
      // 如果不存在,插入新的验证列和字段验证信息
      if (flag) {
        let object = {} as any;
        object.key = key;
        Required.value.forEach((item: any) => {
          object[item] = {
            errorMsg: '',
            validateStatus: '',
          };
        });
        object[column_dataIndex].errorMsg = errorMsg;
        object[column_dataIndex].validateStatus = validateStatus;
        Verificationprompt.push({
          ...object,
        });
      }
    }
  };

  const filterOption = (input: string, option: any) => {
    return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  const editableData: UnwrapRef<Record<string, any>> = reactive({});
  // 删除
  const onDelete = (key: string) => {
    // eslint-disable-next-line vue/no-mutating-props
    props.table_object.dataSource = props.table_object.dataSource.filter(item => item.key !== key);
  };
  //   编辑
  const edit = (key: string) => {
    editableData[key] = cloneDeep(props.table_object.dataSource.filter(item => key === item.key)[0]);
  };
  //   取消
  const cancel = (key: string) => {
    delete editableData[key];
  };
  //   保存
  const save = (key: string) => {
    // 记录下标
    let key_index = props.table_object.dataSource.findIndex(item => item.key === key);
    for (let i = 0; i < Required.value.length; i++) {
      handleChange(props.table_object.dataSource[key_index][Required.value[i]], key, Required.value[i]);
      // 改变值，触发监听事件，渲染出错误提示
      let dataSource_change: any = props.table_object.dataSource[key_index][Required.value[i]];
      // eslint-disable-next-line vue/no-mutating-props
      props.table_object.dataSource[key_index][Required.value[i]] = null;
      // eslint-disable-next-line vue/no-mutating-props
      props.table_object.dataSource[key_index][Required.value[i]] = dataSource_change;
    }
    let Verificationprompt_index = Verificationprompt.findIndex(item => item.key === key);
    let array_Verificationprompt = [...Object.values(Verificationprompt[Verificationprompt_index])] as any;
    let flag = true;
    for (let i = 0; i < array_Verificationprompt.length; i++) {
      if (array_Verificationprompt[i].validateStatus && array_Verificationprompt[i].validateStatus == 'error') {
        flag = !flag;
        break;
      }
    }
    // 判断本行数据书否存在提示错误，如不存在直接保存
    if (flag) {
      Object.assign(props.table_object.dataSource.filter(item => key === item.key)[0], props.table_object.dataSource[key]);
      delete editableData[key];
    }
  };
  // 添加表格区域
  // 记录key值，保证插入不冲突
  let key_length = props.table_object.dataSource.length as number;
  const handleAdd = () => {
    const newData = {
      key: key_length.toString(),
    } as any;
    props.table_object.columns.forEach((item: any) => {
      newData[item.dataIndex] = '';
      if (select.value.includes(item.dataIndex)) newData[item.dataIndex] = undefined;
    });
    if (newData.operation) delete newData.operation;
    // eslint-disable-next-line vue/no-mutating-props
    props.table_object.dataSource.push(newData);
    key_length++;
    edit((key_length - 1).toString());
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
