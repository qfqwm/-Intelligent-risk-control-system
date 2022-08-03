<template>
  <!-- 编辑栏 -->
  <a-drawer :title="edit_add_title" :width="720" :visible="editvisible" :body-style="{ paddingBottom: '80px', paddingLeft: '0' }" :footer-style="{ textAlign: 'right' }" @close="add_edit_false">
    <div v-for="(item, index) in a_input" :key="index" class="edit_drawer">
      <span
        ><span>{{ item.span }}</span
        >{{ item.name }}</span
      >
      <a-input v-model:value.trim="add_edit_object[item.value]" :placeholder="item.placeholder" />
    </div>
    <div v-for="(item, index) in a_select" :key="index" class="edit_drawer">
      <span
        ><span>{{ item.span }}</span
        >{{ item.name }}</span
      >
      <a-select v-model:value="add_edit_object[item.value]" show-search placeholder="请输入来源机构" style="width: 100%" :options="all_select[item.options]" :filter-option="filterOption"></a-select>
    </div>
    <!-- int类型 -->
    <div v-show="add_edit_object.dataType === '1'" class="int_type">
      <div class="edit_drawer"
        ><span>取值范围：</span>
        <div style="width: 100%" class="num_rang">
          <a-input v-model:value.number="add_edit_object.dataMin" placeholder="请输入最小值" style="width: 45%" />----
          <a-input v-model:value.number="add_edit_object.dataMax" placeholder="请输入最大值" style="width: 45%" />
        </div>
      </div>
    </div>
    <!-- float类型 -->
    <div v-show="add_edit_object.dataType === '2'" class="int_type">
      <div class="edit_drawer"
        ><span>数据精度：</span>
        <a-input v-model:value="add_edit_object.dataPrecision" placeholder="请输入数据精度" />
      </div>
      <div class="edit_drawer"
        ><span>取值范围：</span>
        <div style="width: 100%" class="num_rang">
          <a-input v-model:value.number="add_edit_object.dataMin" placeholder="请输入最小值" style="width: 45%" />----
          <a-input v-model:value.number="add_edit_object.dataMax" placeholder="请输入最大值" style="width: 45%" />
        </div>
      </div>
    </div>
    <!-- enum类型 -->
    <div v-show="add_edit_object.dataType === '3'" class="int_type">
      <div class="edit_drawer"
        ><span><span>*</span>枚举范围：</span>
        <a-select v-model:value="add_edit_object.enumRange" show-search placeholder="请输入枚举范围" style="width: 100%" :options="all_select.GetEnum" :filter-option="filterOption"> </a-select>
      </div>
    </div>
    <!-- string类型 -->
    <div v-show="add_edit_object.dataType === '4'" class="int_type">
      <div class="edit_drawer"
        ><span>数据长度：</span>
        <a-input v-model:value="add_edit_object.dataLength" placeholder="Basic usage" />
      </div>
    </div>
    <!-- 默认值 -->
    <div v-show="add_edit_object.dataType !== ''" class="int_type">
      <div class="edit_drawer"
        ><span>默认值：</span>
        <a-input v-model:value.trim="add_edit_object.dataPrecision" placeholder="Basic usage" />
      </div>
    </div>
    <!-- 底部按钮 -->
    <div class="edit_drawer_bottom">
      <a-button size="big" @click="add_edit_false">取消</a-button>
      <a-button type="primary" size="big" @click="add_edit_couse">确定</a-button>
    </div>
  </a-drawer>
</template>

<script lang="ts" setup>
  import { SelectProps, message } from 'ant-design-vue';
  import { GetEnum_List, Lookup, AddStandard, UpdateStandard } from '@/api/test/index';
  // import { log } from 'console';
  // 接收参数
  type Props = {
    // eslint-disable-next-line vue/prop-name-casing
    add_edit_type: string;
    // eslint-disable-next-line vue/prop-name-casing
    add_edit_standardId: string;
    // eslint-disable-next-line vue/prop-name-casing
    showDrawer_number: number;
  };
  const props = defineProps<Props>();
  watch(
    () => props.showDrawer_number,
    () => {
      showDrawer(props.add_edit_type, props.add_edit_standardId);
    },
  );
  const editvisible = ref<boolean>(false);
  const edit_add_title = ref<string>('');
  // 定义传递新增、编辑对象
  const add_edit_object = ref({
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
  // 定义input框
  const a_input = ref([
    {
      span: '*',
      name: '中文名称：',
      value: 'chineseName',
      placeholder: '请输入中文名称',
    },
    {
      span: '*',
      name: '英文名称：',
      value: 'englishName',
      placeholder: '请输入英文名称',
    },
    {
      span: '',
      name: '标准说明：',
      value: 'standardExplain',
      placeholder: '请输入标准说明',
    },
  ]);
  // 定义select框
  const a_select = ref([
    {
      span: '*',
      name: '来源机构：',
      value: 'sourceAgencies',
      placeholder: '请输入英文名称',
      options: 'Source_institution',
    },
    {
      span: '*',
      name: '是否可为空：',
      value: 'isNull',
      placeholder: '请输入英文名称',
      options: 'Judge_null',
    },
    {
      span: '*',
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
    add_edit_object.value.chineseName = '';
    add_edit_object.value.englishName = '';
    add_edit_object.value.sourceAgencies = '';
    add_edit_object.value.dataDefault = '';
    add_edit_object.value.standardExplain = '';
    add_edit_object.value.dataType = '';
    add_edit_object.value.isNull = '';
    add_edit_object.value.enumRange = null;
    add_edit_object.value.dataPrecision = null;
    add_edit_object.value.dataLength = null;
    add_edit_object.value.dataMin = null;
    add_edit_object.value.dataMax = null;
  };

  // 记录存储的数据
  const data_storage_edit = reactive({ standardType: '', standardId: '', china: '', english: '' });

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
          // data_storage_edit.china = res.data.data.chineseName;
          // data_storage_edit.english = res.data.data.englishName;
          // 删除多余字段
          delete res.data.data.codeNameSplice;
          delete res.data.data.codeId;
          delete res.data.data.codeName;
          delete res.data.data.creatTime;
          delete res.data.data.del;
          delete res.data.data.updateTime;
          delete res.data.data.dataRange;
          delete res.data.data.standardId;
          delete res.data.data.standardType;
          add_edit_object.value = res.data.data;
          // 处理后端数据，将数字型变为字符串型
          add_edit_object.value.isNull = add_edit_object.value.isNull.toString();
          add_edit_object.value.dataType = add_edit_object.value.dataType.toString();
        }
      });
    }
  };

  // 确定按钮——向后端发送数据进行新增、编辑标准
  const add_edit_couse = () => {
    // let dataType = '';
    // let dataMin: null | string = null;
    // let dataMax: null | string = null;
    // let enumRange: null | string = null;
    // let dataPrecision: null | string = null;
    // let dataLength: null | string = null;
    // 判断是否为空
    // if (add_edit_object.value.chineseName == '' || null) return message.error('中文名称为空！');
    // if (add_edit_object.value.englishName== '' || null) return message.error('英文名称为空！');
    // if (add_edit_object.value.sourceAgencies == '' || null) return message.error('请选择来源机构!');
    // if (add_edit_object.value.dataType == '' || null) return message.error('请选择数据类型!');
    // if (add_edit_object.value.isNull== '' || null) return message.error('请选择数据是否为空!');
    // 正则判断
    // if (morechinese_Name.value.indexOf(add_edit_chineseName.value) !== -1) {
    //   if (edit_add_title.value == '编辑标准') {
    //     if (add_edit_chineseName.value != data_storage.china) return message.error('中文名称重复！');
    //   } else return message.error('中文名称重复！');
    // }
    // if (moreenglish_Name.value.indexOf(add_edit_englishName.value) !== -1) {
    //   if (edit_add_title.value == '编辑标准') {
    //     if (add_edit_englishName.value != data_storage.english) return message.error('英文名称重复！');
    //   } else return message.error('英文名称重复！');
    // }
    if (edit_add_title.value == '新增标准') {
      // if (dataType == '1') {
      //   object.dataMin = add_edit_dataMin.value;
      //   object.dataMax = add_edit_dataMax.value;
      //   if ((object.dataMax == '' || object.dataMax == null) && (object.dataMin == '' || object.dataMin == null)) {
      //   } else if (
      //     isString(object.dataMax) ||
      //     isString(object.dataMin) ||
      //     !(object.dataMax > object.dataMin && object.dataMin <= 999 && object.dataMin >= 0 && object.dataMax <= 999 && object.dataMax >= 0)
      //   )
      //     return message.error('请输入正确的取值范围!');
      // }

      // if (dataType == '2') {
      //   object.dataMin = add_edit_dataMin.value;
      //   object.dataMax = add_edit_dataMax.value;
      //   if ((object.dataMax == '' || object.dataMax == null) && (object.dataMin == '' || object.dataMin == null)) {
      //   } else if (
      //     isString(object.dataMax) ||
      //     isString(object.dataMin) ||
      //     !(object.dataMax > object.dataMin && object.dataMin <= 999 && object.dataMin >= 0 && object.dataMax <= 999 && object.dataMax >= 0)
      //   )
      //     return message.error('请输入正确的取值范围!');
      //   object.dataPrecision = add_edit_dataPrecision.value;
      // }
      // if (dataType == '3') {
      //   object.enumRange = add_edit_enumRange.value;
      //   if (add_edit_enumRange.value == '' || null) return message.error('请选择枚举范围!');
      // }
      // if (dataType == '4') {
      //   object.dataLength = add_edit_dataLength.value;
      // }
      AddStandard(add_edit_object.value).then(function (res) {
        console.log(res);
        // if (res.data.msg == 'chineseName只支持中文及英文大小写') return message.error('中文只支持中文及英文大小写！');
        // if (res.data.msg == 'englishName只支持英文大小写、数字及下划线且只能是英文开头') return message.error('英文名称只支持英文大小写、数字及下划线且只能是英文开头！');
        // if (res.data.msg == 'englishName为1到30字符') return message.error('英文名称为1到30字符');
        // if (res.data.msg == 'chineseName为1到30字符') return message.error('中文名称为1到30字符');
        if (res.data.msg == '新增成功') {
          message.success('新增成功！');
        }
      });
    }
    if (edit_add_title.value == '编辑标准') {
      let object = {
        ...add_edit_object.value,
      } as any;
      object.standardId = data_storage_edit.standardId;
      object.standardType = data_storage_edit.standardType;
      // if (dataType == '1') {
      //   object.dataMin = add_edit_dataMin.value;
      //   object.dataMax = add_edit_dataMax.value;
      //   if ((object.dataMax == '' || object.dataMax == null) && (object.dataMin == '' || object.dataMin == null)) {
      //   } else if (
      //     isString(object.dataMax) ||
      //     isString(object.dataMin) ||
      //     !(object.dataMax > object.dataMin && object.dataMin <= 999 && object.dataMin >= 0 && object.dataMax <= 999 && object.dataMax >= 0)
      //   )
      //     return message.error('请输入正确的取值范围!');
      // }
      // if (dataType == '2') {
      //   object.dataMin = add_edit_dataMin.value;
      //   object.dataMax = add_edit_dataMax.value;
      //   if ((object.dataMax == '' || object.dataMax == null) && (object.dataMin == '' || object.dataMin == null)) {
      //   } else if (
      //     isString(object.dataMax) ||
      //     isString(object.dataMin) ||
      //     !(object.dataMax > object.dataMin && object.dataMin <= 999 && object.dataMin >= 0 && object.dataMax <= 999 && object.dataMax >= 0)
      //   )
      //     return message.error('请输入正确的取值范围!');
      //   object.dataPrecision = add_edit_dataPrecision.value;
      // }
      // if (dataType == '3') {
      //   object.enumRange = add_edit_enumRange.value;
      //   if (add_edit_enumRange.value == '' || null) return message.error('请选择枚举范围!');
      // }
      // if (dataType == '4') {
      //   object.dataLength = add_edit_dataLength.value;
      // }
      UpdateStandard(object).then(function (res) {
        console.log(res);
        if (res.data.msg == '返回成功') {
          message.success('编辑成功！');
        }
      });
    }
    editvisible.value = false;
    empty();
  };
  // 取消按钮，清空数据
  const add_edit_false = () => {
    empty();
    editvisible.value = false;
  };
</script>

<style scoped lang="less">
  // 编辑页面
  .edit_drawer {
    display: flex;
    margin-bottom: 10px;
    margin-left: 20px;

    span {
      margin-right: 5px;
      width: 140px;
      font-size: 15px;
      text-align: right;
      line-height: 32px;

      span {
        color: red;
      }
    }
  }

  .edit_drawer_bottom {
    position: absolute;
    bottom: 0;
    display: flex;
    justify-content: right;
    border-top: 1px gray solid;
    width: 100%;
    height: 50px;

    button {
      margin: auto 10px;
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
