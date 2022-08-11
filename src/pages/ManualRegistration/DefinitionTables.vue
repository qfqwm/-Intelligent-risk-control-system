<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div class="Input_parameter_table">
    <!--表格头部 -->
    <div class="border_title"
      ><span class="span">{{ props.table_object.title }}</span>
      <div>
        <a-button v-if="props.table_object.title !== '输入参数'" class="editable-add-btn" :style="{ marginBottom: '8px', marginRight: '18px' }" size="big" @click="Josn_to">Json导入</a-button>
        <a-button class="editable-add-btn" style="margin-bottom: 8px" type="primary" size="big" @click="handleAdd">新增参数</a-button></div
      >
    </div>
    <a-table bordered :data-source="table_data" :columns="props.table_object.columns" :pagination="false">
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
              v-model:value="record[column.dataIndex]"
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
              <a @click="cancel(record.key)">取消</a>
              <a v-if="record.leixing == 'Int' || record.leixing == 'String'" @click="showcode(record)">码值定义</a>
              <Definition />
            </span>
            <span v-else>
              <a @click="edit(record.key)">编辑</a>
              <a-popconfirm title="Sure to cancel?" @confirm="onDelete(record.key)">
                <a>删除</a>
              </a-popconfirm>
            </span>
            <span>
              <a v-if="record.leixing == 'Object' || record.leixing == 'Array'" @click="add_subordinate(record)">添加下级</a>
            </span>
          </div>
        </template>
      </template>
    </a-table>
  </div>
</template>
<script lang="ts" setup>
  import { reactive } from 'vue';
  import type { UnwrapRef } from 'vue';
  import { message } from 'ant-design-vue';
  import { cloneDeep } from 'lodash-es';
  import Definition from './component/Definition.vue';
  import emitter from '@/utils/bus';
  // 接收参数
  type Props = {
    // eslint-disable-next-line vue/prop-name-casing
    table_object: any;
  };
  const props = defineProps<Props>();
  const table_data = ref(props.table_object.dataSource);
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

  // 表单验证
  const getFildStatus = (key: any, dataIndex: string) => {
    const data = Verificationprompt.filter((item: { key: any }) => key === item.key)[0];
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

  const validatePrime = (content: string | null | undefined) => {
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
  const handleChange = (value: any, key: string, column_dataIndex: string | number) => {
    console.log(Verificationprompt, 'dasdsadas');

    // 判断是否是验证字段，如不是，直接return退出
    if (Required.value.indexOf(column_dataIndex) == -1) return;
    const newData = table_data.value;
    const target = steamroller(newData).filter((item: { key: any }) => item.key === key)[0];
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
  // 将多维数组拉平方法
  const steamroller = (arr: any[]) => {
    let newArr = [] as any;
    arr.forEach((element: any) => {
      newArr.push(element);
      if (element.children) {
        newArr.push.apply(newArr, steamroller(element.children));
      } else {
      }
    });
    return newArr;
  };

  const editableData: UnwrapRef<Record<string, any>> = reactive({});

  // /递归删除指定对象
  const recursivefilter = (arr: any[], value: string) => {
    return arr.filter((item: { key: any; children: string | any[] }) => {
      if (item.key === value) {
        return false;
      }
      if (item.children && item.children.length > 0) {
        item.children = recursivefilter(item.children, value);
      }
      return true;
    });
  };
  // 删除
  const onDelete = (key: string) => {
    recursivefilter(table_data.value, key);
  };
  //   编辑
  const edit = (key: string) => {
    editableData[key] = cloneDeep(steamroller(table_data.value).filter((item: { key: string }) => key === item.key)[0]);
  };
  //   取消
  const cancel = (key: string) => {
    delete editableData[key];
  };

  //   保存
  const save = (key: string) => {
    // 记录下标
    let object = steamroller(table_data.value).filter((item: { key: string }) => key === item.key)[0];
    for (let i = 0; i < Required.value.length; i++) {
      handleChange(object[Required.value[i]], key, Required.value[i]);
      // 改变值，触发监听事件，渲染出错误提示
      let dataSource_change: any = object[Required.value[i]];
      object[Required.value[i]] = null;
      object[Required.value[i]] = dataSource_change;
    }
    let Verificationprompt_index = Verificationprompt.findIndex((item: { key: string }) => item.key === key);
    let array_Verificationprompt = [...Object.values(Verificationprompt[Verificationprompt_index])] as any;
    let flag = true;
    for (let i = 0; i < array_Verificationprompt.length; i++) {
      if (array_Verificationprompt[i].validateStatus && array_Verificationprompt[i].validateStatus == 'error') {
        flag = !flag;
        return message.error('请填写完整的信息！');
      }
    }
    // 判断本行数据书否存在提示错误，如不存在直接保存
    if (flag) {
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
    table_data.value.push(newData);
    key_length++;
    edit((key_length - 1).toString());
  };
  // 添加下一级
  const add_subordinate = (record: any) => {
    const newData = {
      key: '',
    } as any;
    props.table_object.columns.forEach((item: any) => {
      newData[item.dataIndex] = '';
      if (select.value.includes(item.dataIndex)) newData[item.dataIndex] = undefined;
    });
    if (newData.operation) delete newData.operation;
    // 如果存在children字段
    if (record.children && record.children != undefined && record.children.length != 0) {
      // 用-进行分割，对最后一位数字进行加1处理
      let arr_last = record.children[record.children.length - 1].key.split('-');
      arr_last[arr_last.length - 1] = (parseInt(arr_last[arr_last.length - 1]) + 1).toString();
      newData.key = arr_last.join('-');
      record.children.push(newData);
    }
    // 不存在children字段
    else {
      newData.key = record.key + '-0';
      let address = record;
      address.children = [newData];
    }
    edit(newData.key);
  };

  // Josn导入
  const Josn_to = () => {
    emitter.emit('Josn');
  };

  const visible = ref<boolean>(false);
  //码值定义模态框开关
  const showcode = (record: any) => {
    const sddsq = reactive({
      record: record,
      visible: visible,
    });
    emitter.emit('Sendchildsq', sddsq);
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
