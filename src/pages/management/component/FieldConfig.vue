<template>
  <div style="display: flex; margin-top: 20px; width: 100%; background-color: white; flex-direction: row; flex-wrap: wrap">
    <div style="margin-left: 10px; width: 100px; font-size: 20px">字段配置:</div>
    <a-button class="editable-add-btn" style="margin-top: -3%; margin-bottom: 8px; margin-left: 87%" @click="handleAdd1">添加字段 </a-button>
    <a-table bordered :data-source="dataSource1" :columns="columns1" style="margin-left: 10px; width: 98%" :scroll="{ x: 800, y: 140 }" :pagination="false">
      <template #bodyCell="{ column, text, record }">
        <template v-if="['name', 'age'].includes(column.dataIndex)">
          <a-form-item
            v-if="editableData1[record.key1]"
            has-feedback
            :validate-status="getFildStatus(record.key1, column.dataIndex).validateStatus"
            :help="getFildStatus(record.key1, column.dataIndex).errorMsg"
          >
            <a-input
              v-model:value="record[column.dataIndex]"
              style="margin: -5px 0; width: 100%"
              placeholder="请输入"
              @change="handleChange(record[column.dataIndex], record.key1, column.dataIndex)"
            />
          </a-form-item>
          <template v-else>
            {{ text }}
          </template>
        </template>
        <template v-if="['address'].includes(column.dataIndex)">
          <a-form-item v-if="editableData1[record.key1]" has-feedback>
            <a-input v-model:value="record[column.dataIndex]" style="margin: -5px 0; width: 100%" placeholder="请输入" />
          </a-form-item>
          <template v-else>
            {{ text }}
          </template>
        </template>

        <template v-else-if="['address1'].includes(column.dataIndex)">
          <a-form-item
            v-if="editableData1[record.key1]"
            has-feedback
            name="address1"
            :validate-status="getFildStatus(record.key1, column.dataIndex).validateStatus"
            :help="getFildStatus(record.key1, column.dataIndex).errorMsg"
          >
            <a-select
              v-model:value="record[column.dataIndex]"
              style="width: 100%"
              show-search
              :options="Mapping"
              @change="handleChange(record[column.dataIndex], record.key1, column.dataIndex)"
            ></a-select>
          </a-form-item>
          <template v-else>
            {{ text }}
          </template>
        </template>
        <template v-if="column.dataIndex === 'operation'">
          <div class="editable-row-operations">
            <a-form-item>
              <span v-if="editableData1[record.key1]">
                <a-typography-link @click="save1(record)">保存</a-typography-link>
                <a-typography-link style="margin-left: 10px" @click="cancel1(record.key1)">取消 </a-typography-link>
              </span>
              <span v-else>
                <a @click="edit1(record.key1)">编辑</a>
                <a style="margin-left: 10px" @click="onDelete1(record.key1)">删除</a>
              </span>
            </a-form-item>
          </div>
        </template>
      </template>
    </a-table>
  </div>
</template>
<script lang="ts" setup>
  import { reactive, Ref, ref, UnwrapRef } from 'vue';
  import { cloneDeep } from 'lodash';
  import { message } from 'ant-design-vue';

  // 接收参数
  type Props = {
    // eslint-disable-next-line vue/prop-name-casing
    parent_date: any;
    mapping: any;
  };

  const emits = defineEmits(['titles', 'sonDataNames']);
  const props = defineProps<Props>();

  onMounted(() => {
    dataSource1.value = props.parent_date;
    Mapping.value = props.mapping;
  });
  watch(
    () => props.parent_date,
    val => {
      dataSource1.value = val;
    },
  );
  watch(
    () => props.mapping,
    val => {
      Mapping.value = val;
    },
  );

  //字段添加
  const Mapping = ref([]);
  const handleAdd1 = () => {
    if (JSON.stringify(editableData1) !== '{}') {
      return message.warning('不能同时编辑多行，请保存前一行');
    }
    emits('titles');
    const newData = {
      key1: `${count1.value}`,
      name: ``,
      age: ``,
      address: ``,
      address1: ``,
    };
    dataSource1.value.push(newData);
    edit1(dataSource1.value.length.toString());
  };
  console.log(props.parent_date);

  const columns1 = [
    {
      title: '字段英文名称',
      dataIndex: 'name',
      width: '20%',
    },
    {
      title: '字段中文名称',
      dataIndex: 'age',
      width: '20%',
    },
    {
      title: '字段说明',
      dataIndex: 'address',
      width: '20%',
    },
    {
      title: '标准映射',
      dataIndex: 'address1',
      width: '30%',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: '20%',
    },
  ];

  const PassValue = () => {
    const datas = reactive({
      editableData1: editableData1,
      dataSource1: dataSource1.value,
      dataSource2: dataSource2.value,
    });
    emits('sonDataNames', datas);
  };

  //字段配置删除
  const onDelete1 = (key1: string) => {
    dataSource1.value = dataSource1.value.filter(item => item.key1 !== key1);
    PassValue();
  };
  //字段配置取消
  const cancel1 = (key1: string) => {
    delete editableData1[key1];
    onDelete1(key1);
  };

  interface DataItem1 {
    key1: string;
    name: string;
    age: string;
    address: string;
    address1: string;
  }

  interface DataItem2 {
    chineseName: string;
    englishName: string;
    standardId: string;
    fieldExplain: string;
  }

  const dataSource1: Ref<DataItem1[]> = ref([]);
  const dataSource2: Ref<DataItem2[]> = ref([]);
  const count1 = computed(() => dataSource1.value.length + 1);
  const editableData1: UnwrapRef<Record<string, DataItem1>> = reactive({});

  const edit1 = (key1: string) => {
    editableData1[key1] = cloneDeep(dataSource1.value.filter(item => key1 === item.key1)[0]);
  };

  const save1 = (record: any) => {
    columns1.forEach(item => {
      if (item.dataIndex !== 'operation' && item.dataIndex !== 'address') {
        handleChange(record[item.dataIndex], record.key1, item.dataIndex);
        let dataSource_change: any = record[item.dataIndex];
        record[item.dataIndex] = null;
        record[item.dataIndex] = dataSource_change;
      }
    });
    let Verificationprompt_index = Verificationprompt.findIndex((item: { key: any }) => item.key === record.key1);
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
      delete editableData1[record.key1];
    }
    Object.assign(dataSource1.value.filter(item => record.key1 === item.key1)[0], editableData1[record.key1]);
    dataSource2.value = [];
    for (let i = 0; i < dataSource1.value.length; i++) {
      let a = dataSource1.value[i].address1.split('  ');
      dataSource2.value.push({
        chineseName: dataSource1.value[i].age,
        englishName: dataSource1.value[i].name,
        standardId: a[0],
        fieldExplain: dataSource1.value[i].address,
      });
    }
    PassValue();
  };

  // 表单验证
  const getFildStatus = (key: any, dataIndex: string) => {
    const data = Verificationprompt.filter((item: { key: any }) => {
      return item.key == key;
    })[0];
    if (data) {
      return data[dataIndex];
    } else {
      return {
        errorMsg: '',
        validateStatus: '',
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
        validateStatus: 'success',
        errorMsg: '',
      };
  };
  // 验证提示
  const Verificationprompt = [] as any;
  const handleChange = (value: any, key: any, column_dataIndex: string) => {
    const target = dataSource1.value.filter((item: any) => item.key1 === key)[0];
    if (target) {
      const { errorMsg, validateStatus } = validatePrime(value);
      let flag = true;
      Verificationprompt.forEach((val: any) => {
        // 如果验证列已存在，更改验证列的字段验证信息
        if (val.key == key) {
          flag = false;
          let object = {
            errorMsg: errorMsg,
            validateStatus: validateStatus,
          };
          val[column_dataIndex] = { ...object };
        }
      });
      // 如果不存在,插入新的验证列和字段验证信息
      if (flag) {
        let object = {} as any;
        object.key = key;
        columns1.forEach(item => {
          if (item.dataIndex !== 'operation') {
            object[item.dataIndex] = {
              errorMsg: '',
              validateStatus: '',
            };
          }
        });
        object[column_dataIndex].errorMsg = errorMsg;
        object[column_dataIndex].validateStatus = validateStatus;
        Verificationprompt.push({
          ...object,
        });
      }
    }
  };
</script>
<style lang="less" scoped></style>
