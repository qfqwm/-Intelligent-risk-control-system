<template>
  <!-- 编辑栏 -->
  <a-form id="form" ref="edit_and_Form" :model="add_edit_object" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" autocomplete="off" @finish="add_edit_couse">
    <a-drawer
      :title="edit_add_title"
      :width="450"
      :visible="editvisible"
      :body-style="{ paddingBottom: '80px', paddingLeft: '0' }"
      :footer-style="{ textAlign: 'right', marginLeft: '46%' }"
      @close="add_edit_false"
    >
      <!-- 遍历input框 -->
      <a-form-item v-for="(item, index) in a_input" :key="index" :label="item.name" :name="item.value" :rules="form_rules[item.value]">
        <a-input v-model:value.trim="add_edit_object[item.value]" :placeholder="item.placeholder" />
      </a-form-item>
      <!-- 遍历select框 -->
      <a-form-item v-for="(item, index) in a_select" :key="index" :label="item.name" :name="item.value" :rules="form_rules[item.value]">
        <a-select v-model:value="add_edit_object[item.value]" placeholder="Please select a country" style="width: 100%" :options="all_select[item.options]" :filter-option="filterOption"></a-select>
      </a-form-item>
      <!-- float类型 -->
      <div v-show="add_edit_object.dataType === '2'" class="int_type">
        <a-form-item label="数据精度：" name="dataPrecision" :rules="form_rules.dataPrecision">
          <div style="width: 100%" class="num_rang">
            <a-input v-model:value.number="add_edit_object.dataPrecision" placeholder="请输入数据精度" />
          </div>
        </a-form-item>
      </div>
      <!-- int类型 -->
      <div v-show="add_edit_object.dataType === '1' || add_edit_object.dataType == '2'">
        <a-form-item label="取值范围：">
          <a-input v-model:value.number="add_edit_object.dataMin" placeholder="请输入最小值" style="width: 45%" /> ---
          <a-input v-model:value.number="add_edit_object.dataMax" placeholder="请输入最大值" style="width: 45%" />
        </a-form-item>
      </div>
      <!-- enum类型 -->
      <div v-if="add_edit_object.dataType === '3'" class="int_type">
        <a-form-item label="枚举范围：" name="enumRange" :rules="form_rules.enumRange">
          <div style="width: 100%" class="num_rang">
            <a-select v-model:value="add_edit_object.enumRange" show-search placeholder="请输入枚举范围" style="width: 100%" :options="all_select.GetEnum" :filter-option="filterOption"> </a-select>
          </div>
        </a-form-item>
      </div>
      <!-- string类型 -->
      <div v-show="add_edit_object.dataType === '4'" class="int_type">
        <a-form-item label="数据长度：" name="dataLength" :rules="form_rules.dataLength">
          <div style="width: 100%" class="num_rang">
            <a-input v-model:value="add_edit_object.dataLength" placeholder="请输入数据长度" />
          </div>
        </a-form-item>
      </div>
      <!-- 默认值 -->
      <div v-show="add_edit_object.dataType !== ''" class="int_type">
        <a-form-item label="默认值：" name="默认值">
          <a-input v-model:value.trim="add_edit_object.dataDefault" placeholder="请输入默认值" />
        </a-form-item>
      </div>
      <!-- 底部按钮 -->
      <template #footer>
        <div class="edit_drawer_bottom">
          <a-form-item>
            <a-button size="big" html-type="cancel" style="margin-right: 20px" @click="add_edit_false">取消</a-button>
            <a-button type="primary" size="big" html-type="submit" form="form">确定</a-button>
          </a-form-item>
        </div>
      </template>
    </a-drawer>
  </a-form>
</template>

<script lang="ts" setup>
  import { SelectProps, message } from 'ant-design-vue';
  import { GetEnum_List, Lookup, AddStandard, UpdateStandard } from '@/api/test/index';
  // 表单验证
  interface add_edit_object_formState {
    chineseName: string;
    englishName: string;
    sourceAgencies: string;
    dataDefault: string;
    standardExplain: string;
    dataType: string;
    isNull: string;
    enumRange: null | string;
    dataPrecision: null | string;
    dataLength: null | string;
    dataMin: null | string;
    dataMax: null | string;
  }
  // 接收参数
  type Props = {
    // eslint-disable-next-line vue/prop-name-casing
    add_edit_type: string;
    // eslint-disable-next-line vue/prop-name-casing
    add_edit_standardid: any;
    // eslint-disable-next-line vue/prop-name-casing
    show_drawer_number: number;
  };
  const emits = defineEmits(['Getdata']);
  const props = defineProps<Props>();
  watch(
    () => props.show_drawer_number,
    () => {
      showDrawer(props.add_edit_type, props.add_edit_standardid);
    },
  );
  //监听模态框状态，清空表单错误提示
  const edit_and_Form = ref<any>(null);
  const editvisible = ref<boolean>(false);
  //监听模态框的变化，进入新增/编辑模态框清空表单验证的错误提示
  watch(
    () => editvisible.value,
    newval => {
      if (newval) {
        try {
          return edit_and_Form._rawValue.resetFields();
        } catch (e) {}
      }
    },
  );
  const edit_add_title = ref<string>('');
  // 定义传递新增、编辑对象
  const add_edit_object = ref<add_edit_object_formState>({
    chineseName: '',
    englishName: '',
    sourceAgencies: '',
    dataDefault: '',
    standardExplain: '',
    dataType: '',
    isNull: '',
    enumRange: null,
    dataPrecision: null,
    dataLength: null,
    dataMin: null,
    dataMax: null,
  });
  // 定义表单规则
  const form_rules = ref({
    chineseName: [{ required: true, message: '请输入中文名称' }],
    englishName: [{ required: true, message: '请输入英文名称' }],
    standardExplain: [{ required: false, message: '' }],
    sourceAgencies: [{ required: true, message: '请选择来源机构' }],
    isNull: [{ required: true, message: '请选择是否为空' }],
    dataType: [{ required: true, message: '请选择数据类型' }],
    dataLength: [{ required: false, message: '' }],
    dataPrecision: [{ required: false, message: '' }],
    range: [{ required: false, message: '' }],
    enumRange: [{ required: true, message: '请选择枚举范围' }],
  });
  // 定义input框
  const a_input = ref([
    {
      name: '中文名称：',
      value: 'chineseName',
      placeholder: '请输入中文名称',
    },
    {
      name: '英文名称：',
      value: 'englishName',
      placeholder: '请输入英文名称',
    },
    {
      name: '标准说明：',
      value: 'standardExplain',
      placeholder: '请输入标准说明',
    },
  ]);
  // 定义select框
  const a_select = ref([
    {
      name: '来源机构：',
      value: 'sourceAgencies',
      placeholder: '请输入英文名称',
      options: 'Source_institution',
    },
    {
      name: '是否可为空：',
      value: 'isNull',
      placeholder: '请输入英文名称',
      options: 'Judge_null',
    },
    {
      name: '数据类型：',
      value: 'dataType',
      placeholder: '请输入英文名称',
      options: 'data_type',
    },
  ]);
  // 来源机构下拉框
  const filterOption = (input: string, option: any) => {
    return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };
  const Source_institution = ref<SelectProps['options']>([
    { value: '哈哈哈', label: '哈哈哈' },
    { value: '数宜信', label: '数宜信' },
  ]);
  //是否可为空下拉框
  const Judge_null = ref<SelectProps['options']>([
    { value: '0', label: '可为空' },
    { value: '1', label: '不可为空' },
  ]);
  // 数据类型下拉框
  const data_type = ref<SelectProps['options']>([
    { value: '1', label: 'Int' },
    { value: '2', label: 'Float' },
    { value: '3', label: 'Enum' },
    { value: '4', label: 'String' },
  ]);
  // 枚举类型下拉框数组
  const GetEnum = ref<SelectProps['options']>([]);
  // 所有下拉框存储
  const all_select = reactive({
    Source_institution: Source_institution,
    Judge_null: Judge_null,
    data_type: data_type,
    GetEnum: GetEnum,
  });

  // 清空传递新增、编辑对象对象
  const empty = () => {
    Object.keys(add_edit_object.value).forEach((item: any) => {
      add_edit_object.value[item] = '';
    });
    add_edit_object.value.enumRange = null;
    add_edit_object.value.dataPrecision = null;
    add_edit_object.value.dataLength = null;
    add_edit_object.value.dataMin = null;
    add_edit_object.value.dataMax = null;
  };

  // 记录存储的数据
  const data_storage_edit = reactive({ standardType: '', standardId: '' });

  // 请求编辑页面数据
  const showDrawer = (type: string, standardId: any) => {
    editvisible.value = true;
    // 请求枚举类型
    GetEnum.value = [];
    GetEnum_List().then(function (res) {
      if (res.data.msg == '返回成功') {
        res.data.data.forEach((item: any) => {
          GetEnum.value?.push({
            value: item.code_id,
            label: item.code_name,
          });
        });
      }
    });
    if (type == 'add') edit_add_title.value = '新增标准';
    if (type == 'edit') {
      edit_add_title.value = '编辑标准';
      Lookup(standardId).then(function (res) {
        if (res.data.msg == '获取成功') {
          // 记录(标准状态、编号)
          data_storage_edit.standardType = res.data.data.standardType;
          data_storage_edit.standardId = standardId;
          Object.keys(add_edit_object.value).forEach(item => {
            add_edit_object.value[item] = res.data.data[item];
          });
          // 处理后端数据，将数字型变为字符串型
          add_edit_object.value.isNull = add_edit_object.value.isNull.toString();
          add_edit_object.value.dataType = add_edit_object.value.dataType.toString();
        }
      });
    }
  };

  // 确定按钮——向后端发送数据进行新增、编辑标准
  const add_edit_couse = () => {
    if (edit_add_title.value == '新增标准') {
      if (add_edit_object.value.dataType !== '1' && add_edit_object.value.dataType !== '2') {
        add_edit_object.value.dataMax = null;
        add_edit_object.value.dataMin = null;
      }
      if (add_edit_object.value.dataType !== '2') {
        add_edit_object.value.dataPrecision = null;
      }
      if (add_edit_object.value.dataType !== '3') {
        add_edit_object.value.enumRange = null;
      }
      if (add_edit_object.value.dataType !== '4') {
        add_edit_object.value.dataLength = null;
      }
      AddStandard(add_edit_object.value).then(function (res) {
        if (res.data.msg == '新增成功') {
          message.success('新增成功！');
          emits('Getdata');
          editvisible.value = false;
          empty();
        } else return message.error('新增失败，' + res.data.msg);
      });
    }
    if (edit_add_title.value == '编辑标准') {
      let object = {
        ...add_edit_object.value,
      } as any;
      object.standardId = data_storage_edit.standardId;
      object.standardType = data_storage_edit.standardType;
      if (object.dataType !== '1' && object.dataType !== '2') {
        object.dataMax = null;
        object.dataMin = null;
      }
      if (object.dataType !== '2') {
        object.dataPrecision = null;
      }
      if (object.dataType !== '3') {
        object.enumRange = null;
      }
      if (object.dataType !== '4') {
        object.dataLength = null;
      }

      UpdateStandard(object).then(function (res) {
        if (res.data.msg == '返回成功') {
          message.success('编辑成功！');
          emits('Getdata');
          editvisible.value = false;
          empty();
        } else return message.error('编辑失败，' + res.data.msg);
      });
    }
  };
  // 取消按钮，清空数据
  const add_edit_false = () => {
    empty();
    editvisible.value = false;
  };
</script>

<style scoped lang="less">
  // 编辑页面底部
  .edit_drawer_bottom {
    position: absolute;
    bottom: 0;
    width: 50%;

    :deep(.ant-col.ant-col-16.ant-form-item-control) {
      max-width: 90%;
    }
  }

  .num_rang {
    line-height: 32px;
    display: flex;
    justify-content: space-between;
  }

  tbody tr {
    button {
      margin: 0 5px;
    }

    .ant-btn-primary {
      border-radius: 10px;
      background: #379dd4;
    }
  }

  .ant-modal-content {
    span {
      display: inline-block;
      width: 110px;
      font-size: 15px;
      text-align: right;
      color: gray;
    }
  }
</style>
