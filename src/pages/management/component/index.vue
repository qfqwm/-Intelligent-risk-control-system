<!-- eslint-disable vue/v-on-event-hyphenation -->
<!-- eslint-disable vue/no-lone-template -->
<!-- eslint-disable vue/no-template-shadow -->
<template>
  <div>
    <a-form id="hhh" ref="edit_and_Form" :model="datas" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" autocomplete="off" @finish="sure">
      <a-drawer title="数据资产表基础信息" :width="800" :visible="visible" :body-style="{ backgroundColor: '#F1F1F1' }" :footer-style="{ textAlign: 'right', marginLeft: '77%' }" @close="onClose">
        <!-- <a-form :model="datas" layout="vertical" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" autocomplete="off" @finish="sure"> -->
        <!-- 数据资产表基础信息区域 -->
        <div style="background-color: white">
          <span style="margin-left: 10px; font-size: 18px; line-height: 40px">数据资产表基础信息</span>
          <hr />
          <div style="margin-left: -13%">
            <a-row :gutter="16">
              <a-col :span="20">
                <a-form-item label="中文名称：" name="chineseName" :rules="rules.chineseName">
                  <a-input v-model:value="datas.chineseName" placeholder="请输入数据资产表名称" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="16">
              <a-col :span="20">
                <a-form-item label="英文名称：" name="englishName" :rules="rules.englishName">
                  <a-input v-model:value="datas.englishName" placeholder="请输入数据资产表名称" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="16">
              <a-col :span="20">
                <a-form-item label="资产表描述：" name="资产表描述：">
                  <a-textarea v-model:value="datas.assetExplain" :rows="2" placeholder="请输入资产表描述" />
                </a-form-item>
              </a-col>
            </a-row>
            <DirectoryBelongVue :tree_data="treeData" :dynamic_validate_form="dynamicValidateForm" @sonDataName="getdata" />
          </div>
        </div>
        <!-- 字段配置区域 -->
        <FieldConfigVue ref="getChildList" :mapping="Mapping" :parent_date="dataSource1" @sonDataNames="getconfig" @titles="titles()" />
        <!-- 底部区域 -->
        <template #footer>
          <a-form-item>
            <a-space>
              <a-button @click="onClose">取消</a-button>
              <a-button type="primary" html-type="submit" form="hhh">确定</a-button>
            </a-space>
          </a-form-item>
        </template>
      </a-drawer>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, Ref, ref, UnwrapRef } from 'vue';
  import { AssetSheet, QueryBasic, EditData1, StandardMapping } from '@/api/test/index';
  import { message } from 'ant-design-vue';
  import emitter from '@/utils/bus';
  import DirectoryBelongVue from './DirectoryBelong.vue';
  import FieldConfigVue from './FieldConfig.vue';

  //定义表单验证规则
  const rules = ref({
    chineseName: [
      { required: true, message: '请输入中文名称' },
      {
        pattern: /^[a-zA-Z\u4e00-\u9fa5]+$/,
        message: '中文名称只支持中文及英文大小写',
        trigger: 'blur',
      },
      {
        max: 30,
        message: '长度不能大于30个字符',
        trigger: 'blur',
      },
    ],
    englishName: [
      { required: true, message: '请输入英文名称' },
      {
        pattern: /^[a-z][a-z0-9_]*$/g,
        message: '英文名称只支持英文大小写、数字及下划线且只能英文小写开头',
        trigger: 'blur',
      },
      {
        max: 30,
        message: '长度不能大于30个字符',
        trigger: 'blur',
      },
    ],
  });

  const getdata = (value: { sights: { id: string }[]; chineseName: ['']; directoryId: { directoryId: string }[] }) => {
    dynamicValidateForm.value = value;
  };

  const getconfig = (t: any) => {
    dataSource1.value = t.dataSource1;
    dataSource2.value = t.dataSource2;
    Object.keys(editableData1).map(key => {
      editableData1[key] = t.editableData1[key];
    });
  };

  const datas = reactive<{ chineseName: string; englishName: string; assetExplain: string; assetDirectory: Sights1[]; dataAssetField: Sights2[] }>({
    chineseName: '',
    englishName: '',
    assetExplain: '',
    assetDirectory: [],
    dataAssetField: [],
  });
  const visible = ref();
  const treeData = ref([]);
  let type = '';
  let record: any = {};
  emitter.on('sendchild', (t: any) => {
    visible.value = t.visible;
    treeData.value = t.treeData;
    type = t.type;
    record = t.record;
    showDrawer(type, record);
  });

  interface Sights {
    id: string;
  }

  interface Sights1 {
    directoryId: string;
  }

  interface Sights2 {
    chineseName: string;
    englishName: string;
    fieldExplain: string;
    standardId: string;
  }

  const dynamicValidateForm = ref<{ sights: Sights[]; chineseName: ['']; directoryId: Sights1[] }>({
    sights: [],
    chineseName: [''],
    directoryId: [],
  });

  const onClose = () => {
    Object.keys(editableData1).map(key => {
      delete editableData1[key];
    });
    visible.value = false;
  };

  const titles = () => {
    StandardMapping().then(function (res) {
      length.value = res.data.data.length;
      Mapping.value = [...Array(length.value)].map((_, i) => ({ value: res.data.data[i].standardName })) as any;
    });
  };

  //字段添加
  const Mapping = ref([]);
  const length = ref('');

  interface Sights4 {
    directoryId: string;
  }

  interface Sights5 {
    chineseName: string;
    englishName: string;
    standardId: string;
    fieldExplain: string;
  }

  const datas1 = reactive<{ chineseName: string; englishName: string; assetExplain: string; assetId: string; assetDirectory: Sights4[]; dataAssetField: Sights5[] }>({
    chineseName: '',
    englishName: '',
    assetExplain: '',
    assetId: '',
    dataAssetField: [],
    assetDirectory: [],
  });

  const assetId = ref('');

  //确认新增数据资产表
  const sure = () => {
    if (type == 'add') {
      datas.assetDirectory = dynamicValidateForm.value.directoryId;
      datas.dataAssetField = dataSource2.value;
      AssetSheet(datas).then(function (res) {
        if (res.data.code == 100200) {
          emitter.emit('send');
          return message.success(res.data.msg);
        } else return message.error(res.data.msg);
      });
      visible.value = false;
    }
    if (type == 'edit') {
      Object.keys(datas1).forEach(function (key) {
        datas1[key] = datas[key];
      });
      datas1.assetId = assetId.value;
      datas1.assetDirectory = dynamicValidateForm.value.directoryId;
      datas1.dataAssetField = [];
      for (let i = 0; i < dataSource1.value.length; i++) {
        let a = dataSource1.value[i].address1.split('-');
        datas1.dataAssetField.push({
          chineseName: dataSource1.value[i].age,
          englishName: dataSource1.value[i].name,
          standardId: a[0],
          fieldExplain: dataSource1.value[i].address,
        });
      }
      EditData1(datas1).then(function (res) {
        if (res.data.code == 100200) {
          emitter.emit('send');
          return message.success(res.data.msg);
        } else return message.error(res.data.msg);
      });
      visible.value = false;
    }
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
  const editableData1: UnwrapRef<Record<string, DataItem1>> = reactive({});

  //抽屉开关
  const add1 = ref();
  const showDrawer = (type: string, record: any) => {
    if (type == 'add') {
      Object.keys(datas).forEach(function (key) {
        datas[key] = '';
      });
      dynamicValidateForm.value = {
        sights: [{ id: '0' }],
        chineseName: [''],
        directoryId: [],
      };
      dataSource1.value = [];
      visible.value = true;
    }
    if (type == 'edit') {
      add1.value = { chineseName: record.chineseName };
      visible.value = true;
      QueryBasic(add1.value).then(function (res) {
        Object.keys(datas).forEach(function (key) {
          datas[key] = res.data.data.dataAsset[key];
        });
        assetId.value = res.data.data.dataAsset.assetId;
        dynamicValidateForm.value.chineseName.shift();
        for (let i = 0; i < res.data.data.directoryIds.length; i++) {
          let aa = res.data.data.directoryIds[i].split('/').slice(-1).toString();
          dynamicValidateForm.value.sights.push({
            id: 'i' + Date.now(),
          });
          dynamicValidateForm.value.chineseName.push(aa);
          dynamicValidateForm.value.directoryId.push({
            directoryId: aa,
          });
        }
        for (let i = 0; i < res.data.data.assetFieldList.length; i++) {
          dataSource1.value.push({
            name: res.data.data.assetFieldList[i].englishName,
            age: res.data.data.assetFieldList[i].chineseName,
            address1: res.data.data.assetFieldList[i].dataStandardNames,
            key1: res.data.data.assetFieldList[i].fieldId,
            address: res.data.data.assetFieldList[i].fieldExplain,
          });
        }
      });
      titles();
      Object.keys(editableData1).map(key => {
        delete editableData1[key];
      });
      dynamicValidateForm.value = {
        sights: [],
        chineseName: [''],
        directoryId: [],
      };
      dataSource1.value = [];
    }
  };

  //监听模态框状态，清空表单错误提示
  const edit_and_Form = ref<any>(null);
  //监听模态框的变化，进入新增/编辑模态框清空表单验证的错误提示
  watch(
    () => visible.value,
    newval => {
      if (newval) {
        try {
          return edit_and_Form.value.resetFields();
        } catch (e) {}
      }
    },
  );
</script>
<style lang="less" scoped>
  @import '../style.less';
</style>
