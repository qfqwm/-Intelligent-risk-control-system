<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div class="Input_parameter_table">
    <!--表格头部 -->
    <div class="border_title"
      ><span class="span">{{ props.table_object.title }}</span>
      <div>
        <a-button
          v-if="props.table_object.title !== '输入参数'"
          class="editable-add-btn"
          :style="{ marginBottom: '8px', marginRight: '18px' }"
          size="big"
          @click="Josn_to(props.table_object.title, table_data)"
          >Json导入</a-button
        >
        <a-button class="editable-add-btn" style="margin-bottom: 8px" type="primary" size="big" @click="handleAdd">新增参数</a-button></div
      >
    </div>
    <a-table bordered :data-source="table_data" :columns="props.table_object.columns" :pagination="false">
      <template #bodyCell="{ column, text, record }">
        <!-- input框 -->
        <template v-if="input.includes(column.dataIndex)">
          <a-form-item
            v-if="editableData[record.key]"
            has-feedback
            :name="column.dataIndex"
            :validate-status="getFildStatus(record.key, column.dataIndex).validateStatus"
            :help="getFildStatus(record.key, column.dataIndex).errorMsg"
          >
            <a-input v-model:value.trim="record[column.dataIndex]" style="margin: -5px 0" placeholder="请输入" @change="handleChange(record[column.dataIndex], record.key, column.dataIndex, record)" />
          </a-form-item>
          <template v-else>
            {{ text }}
          </template>
        </template>
        <!-- select框 -->
        <template v-if="select.includes(column.dataIndex)">
          <a-form-item
            v-if="editableData[record.key]"
            has-feedback
            :validate-status="getFildStatus(record.key, column.dataIndex).validateStatus"
            :help="getFildStatus(record.key, column.dataIndex).errorMsg"
          >
            <a-select
              v-model:value="record[column.dataIndex]"
              :options="props.table_object.options[column.dataIndex]"
              :filter-option="filterOption"
              style="width: 100%"
              placeholder="请选择"
              @change="handleChange(record[column.dataIndex], record.key, column.dataIndex, record)"
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
              <a @click="save(record)">保存</a>
              <a @click="cancel(record.key)">取消</a>
              <a v-if="record.leixing == 'Int' || record.leixing == 'String'" @click="showcode(record)">码值定义</a>
              <a v-if="record.leixing == 'Object' || record.leixing == 'Array'" @click="add_subordinate(record)">添加下级</a>
              <Definition />
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
    </a-table>
  </div>
</template>
<script lang="ts" setup>
  import { reactive } from 'vue';
  import type { UnwrapRef } from 'vue';
  import { message } from 'ant-design-vue';
  import { cloneDeep, last } from 'lodash-es';
  import Definition from './component/Definition.vue';
  import emitter from '@/utils/bus';

  // 接收参数
  type Props = {
    // eslint-disable-next-line vue/prop-name-casing
    table_object: any;
  };
  const props = defineProps<Props>();
  const filterOption = (input: string, option: any) => {
    return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };
  const add_data_id = (val, front: string) => {
    return val.forEach((item, index) => {
      item.key = front + index;
      front = item.key + '-';
      if (item.children) {
        add_data_id(item.children, front);
      }
    });
  };
  const table_data = ref(props.table_object.dataSource);
  add_data_id(table_data.value, '');
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
    const data = Verificationprompt.filter(item => key === item.key)[0];
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
        validateStatus: '',
      };
    }
  };

  const validatePrime = (content, column_dataIndex, key) => {
    if (content == '' || content == undefined || content == null) {
      return {
        validateStatus: 'error',
        errorMsg: '此项为必填项',
      };
    }
    if (column_dataIndex == 'name') {
      let char_length = key.lastIndexOf('-');
      const father_str = key.substring(0, char_length);
      const Is_it_the_same_name = steamroller(table_data.value).findIndex(item => {
        return ((item.key.substring(0, item.key.lastIndexOf('-')) === father_str) as boolean) && ((item.key !== key) as boolean) && ((item[column_dataIndex] === content) as boolean);
      });
      if (Is_it_the_same_name !== -1) {
        return {
          validateStatus: 'error',
          errorMsg: '参数名称重复',
        };
      }
    }
    return {
      validateStatus: 'success',
      errorMsg: '',
    };
  };

  // 将多维数组拉平方法
  const steamroller = arr => {
    let newArr = [] as any;
    arr.forEach((element: any) => {
      newArr.push(element);
      if (element.children) {
        newArr.push.apply(newArr, steamroller(element.children));
      }
    });
    return newArr;
  };
  // 记录切换数据类型时的children
  const children_object = [] as any;
  // 验证提示
  const Verificationprompt = [] as any;
  const handleChange = (value, key, column_dataIndex, record) => {
    // 监听select数据类型框的变化，如果不为Object类型和Array类型，则清空子集
    if (column_dataIndex === 'leixing') {
      if (['Array', 'Object'].indexOf(value) === -1) {
        if (record.children) {
          let children_object_index = Object.values(children_object).findIndex((item: any) => {
            return item.key === key;
          });
          if (children_object_index == -1) {
            children_object.push({
              key: key,
              children: record.children,
            });
          } else {
            children_object[children_object_index].children = record.children;
          }
          delete record.children;
          // 删除编辑对象中内容
          let string_length = key.length;
          Object.keys(editableData).forEach((item: any) => {
            if (item.length > key.length && item.substr(0, string_length) == key) {
              delete editableData[item];
            }
          });
        }
      } else {
        let children_object_index = Object.values(children_object).findIndex((item: any) => {
          return item.key === key;
        });
        if (children_object_index != -1) {
          record.children = children_object[children_object_index].children;
        }
      }
    }
    // 判断是否是验证字段，如不是，直接return退出
    if (Required.value.indexOf(column_dataIndex) == -1) return;

    const newData = table_data.value;
    const target = steamroller(newData).filter((item: any) => item.key === key)[0];
    if (target) {
      const { errorMsg, validateStatus } = validatePrime(value, column_dataIndex, key);
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

  // /递归删除指定对象
  const recursivefilter = (arr, value) => {
    return arr.filter(item => {
      if (item.key === value) {
        if (!item.children || item.children.length == 0) return false;
        else {
          message.error('存在子集，无法删除');
        }
      }
      if (item.children && item.children.length > 0) {
        item.children = recursivefilter(item.children, value);
      }
      return true;
    });
  };
  // 递归点击取消，删除新增列表
  const cancel_delete = (val, key) => {
    return val.forEach((item, index) => {
      if (item.key == key) {
        return (val[index].children = []);
      } else {
        if (item.children && item.children.length !== 0) {
          cancel_edit(item.children, key);
        }
      }
    });
  };
  // 递归检查是否含有空的children字段
  const check_null = val => {
    return val.forEach(item => {
      if (item.children && item.children.length == 0) {
        delete item.children;
      } else {
        if (item.children && item.children.length !== 0) {
          check_null(item.children);
        }
      }
    });
  };
  // 删除
  const onDelete = (key: string) => {
    // 删除存储的children
    let old_table_length = steamroller(table_data.value).length;
    if (table_data.value.findIndex(item => item.key == key) == -1) {
      // 删除表格类容
      recursivefilter(table_data.value, key);
      check_null(table_data.value);
    } else {
      if (table_data.value[table_data.value.findIndex(item => item.key == key)].children && table_data.value[table_data.value.findIndex(item => item.key == key)].children.length !== 0)
        message.error('存在子集，无法删除');
      else table_data.value = table_data.value.filter(item => item.key !== key);
    }
    let new_table_length = steamroller(table_data.value).length;
    if (old_table_length !== new_table_length) {
      let string_length = key.length;
      children_object.filter(item => {
        return item.key.substr(0, string_length) != key;
      });
    }
  };
  //   编辑
  const editableData: UnwrapRef<Record<string, any>> = reactive({});
  const edit = (key: string) => {
    editableData[key] = cloneDeep(steamroller(table_data.value).filter(item => key === item.key)[0]);
  };

  // 取消递归方法
  const cancel_edit = (val, key) => {
    return val.forEach((item, index) => {
      if (item.key == key) {
        return (val[index] = editableData[key]);
      } else {
        if (item.children && item.children.length !== 0) {
          cancel_edit(item.children, key);
        }
      }
    });
  };
  // 取消按钮
  const cancel = (key: string) => {
    // 判断是否为新增的数据
    if (
      steamroller(table_data.value)[steamroller(table_data.value).findIndex(item => item.key == key)].newlyadded &&
      steamroller(table_data.value)[steamroller(table_data.value).findIndex(item => item.key == key)].newlyadded == true
    ) {
      let string_length = key.length;
      let string_arr = [] as any;
      steamroller(table_data.value).forEach(item => {
        if (key == item.key.substr(0, string_length)) {
          string_arr.push(item.key);
        }
      });
      cancel_delete(table_data.value, key);
      onDelete(key);
      string_arr.forEach(item => {
        if (editableData[item]) delete editableData[item];
      });
    }
    cancel_edit(table_data.value, key);
    delete editableData[key];
  };

  //   保存
  const save = (record: any) => {
    // 记录下标
    let object = steamroller(table_data.value).filter(item => record.key === item.key)[0];
    for (let i = 0; i < Required.value.length; i++) {
      handleChange(object[Required.value[i]], record.key, Required.value[i], record);
      // 改变值，触发监听事件，渲染出错误提示
      let dataSource_change: any = object[Required.value[i]];
      object[Required.value[i]] = null;
      object[Required.value[i]] = dataSource_change;
    }
    let Verificationprompt_index = Verificationprompt.findIndex(item => item.key === record.key);
    let array_Verificationprompt = [...Object.values(Verificationprompt[Verificationprompt_index])] as any;
    let flag = true;
    for (let i = 0; i < array_Verificationprompt.length; i++) {
      if (array_Verificationprompt[i].validateStatus && array_Verificationprompt[i].validateStatus == 'error') {
        flag = !flag;
        return message.error('请填写完整的信息！');
      }
    }
    if (record.newlyadded) record.newlyadded = false;
    // 判断本行数据书否存在提示错误，如不存在直接保存
    if (flag) {
      delete editableData[record.key];
    }
  };
  // 添加表格区域
  // 记录key值，保证插入不冲突
  let key_length = props.table_object.dataSource.length as number;
  const handleAdd = () => {
    const newData = {
      key: key_length.toString(),
      newlyadded: true,
    } as any;
    props.table_object.columns.forEach((item: any) => {
      if (item.dataIndex !== 'operation') newData[item.dataIndex] = '';
      if (select.value.includes(item.dataIndex)) newData[item.dataIndex] = undefined;
    });
    table_data.value.push(newData);
    key_length++;
    edit((key_length - 1).toString());
  };
  // 添加下一级
  const add_subordinate = (record: any) => {
    const newData = {
      key: '',
      newlyadded: true,
    } as any;
    props.table_object.columns.forEach((item: any) => {
      if (item.dataIndex !== 'operation') newData[item.dataIndex] = '';
      if (select.value.includes(item.dataIndex)) newData[item.dataIndex] = undefined;
    });

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
  const Josn_to = (name: string, data: any) => {
    let same_name: string[] = [];
    data.forEach(item => same_name.push(item.name as string));
    let Josn_to_object = {
      Josn_to_same_name: same_name,
      Josn_to_name: name,
    };
    emitter.emit('Josn', Josn_to_object);
  };
  // 接收json数据
  // 递归为childre添加key值
  const add_children_key = arr => {
    arr.forEach(item => {
      if (item.children) {
        item.children.forEach((children_item, index) => {
          children_item.key = item.key + '-' + index;
        });
        add_children_key(item.children);
      }
    });
  };
  emitter.on(props.table_object.title, (e: any) => {
    // 为传过来的json参数，添加key值
    let last_key = parseInt(table_data.value[table_data.value.length - 1].key) + 1;
    e.forEach((item, index) => {
      item.key = (last_key + index).toString();
    });
    add_children_key(e);
    table_data.value.push(...e);
  });
  // 保存并退出
  emitter.on('keep', () => {
    emitter.emit('data_' + props.table_object.title, table_data.value);
  });

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

  .ant-table-wrapper > div > div > div > div > div > table > tbody > tr > td > div {
    height: 32px;
  }
  // 表格头部小红星
  ::v-deep(th.form-table-heard:before) {
    left: 5px;
    font-size: 20px;
    color: red !important;
    content: '*' !important;
  }
</style>
