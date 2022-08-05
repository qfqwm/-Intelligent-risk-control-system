<!-- eslint-disable vue/no-template-shadow -->
<template>
  <div>
    <a-drawer title="数据资产表基础信息" :width="1500" :visible="visible" :body-style="{ backgroundColor: '#F1F1F1' }" :footer-style="{ textAlign: 'right' }" @close="onClose">
      <!-- 数据资产表基础信息区域 -->
      <div style="margin-top: -15px; background-color: white">
        <span style="margin-left: 10px; font-size: 18px; line-height: 40px">数据资产表基础信息</span>
        <hr />
        <a-form ref="formRef" :model="datas" layout="vertical" style="margin-left: 50px">
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="＊中文名称：" name="＊中文名称：">
                <a-input v-model:value="datas.chineseName" placeholder="请输入数据资产表名称" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="＊英文名称：" name="＊英文名称：">
                <a-input v-model:value="datas.englishName" placeholder="请输入数据资产表名称" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="资产表描述：" name="资产表描述：">
                <a-textarea v-model:value="datas.assetExplain" :rows="4" placeholder="请输入资产表描述" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="＊所属目录：" name="＊所属目录：" class="xia">
                <a-form ref="formRef" name="dynamic_form_nest_item" :model="dynamicValidateForm">
                  <div style="overflow-y: scroll; border: 1px solid #eee; padding: 5px; width: 470px; min-height: 50px; max-height: 110px">
                    <!-- <a-tree-select
                      v-model:value="dynamicValidateForm.chineseName[0]"
                      show-search
                      style="width: 415px"
                      allow-clear
                      tree-default-expand-all
                      placeholder="请选择所属目录"
                      :tree-data="treeData"
                      :field-names="fieldNames"
                      @click="convertData(treeData)"
                      @change="adddata"
                    >
                      <template #title="{ value: directoryId, title: name }">
                        <b v-if="directoryId === '11'" style="color: #08c">{{ name }}</b>
                        <template v-else>{{ name }}</template>
                      </template>
                    </a-tree-select> -->
                    {{ dynamicValidateForm.sights }}-{{ dynamicValidateForm.chineseName }}
                    <a-space v-for="(sight, i) in dynamicValidateForm.sights" :key="sight.id" style="display: flex; margin-bottom: 8px" align="baseline">
                      <a-form-item>
                        <a-tree-select
                          v-model:value="dynamicValidateForm.chineseName[i]"
                          show-search
                          style="width: 415px"
                          allow-clear
                          tree-default-expand-all
                          placeholder="请选择所属目录"
                          :tree-data="treeData"
                          :field-names="fieldNames"
                          @click="convertData(treeData)"
                          @change="adddata"
                        >
                          <template #title="{ value: directoryId, title: name }">
                            <b v-if="directoryId === '11'" style="color: #08c">{{ name }}</b>
                            <template v-else>{{ name }}</template>
                          </template>
                        </a-tree-select>
                      </a-form-item>
                      <MinusCircleOutlined @click="removeSight(sight)" />
                    </a-space>
                  </div>
                  <a-form-item>
                    <a-button type="dashed" block style="margin-top: 30px; border: 1px solid blue; border-style: dashed; width: 470px; color: blue" @click="addSight">
                      <PlusOutlined />
                      添加一行
                    </a-button>
                  </a-form-item>
                </a-form>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <!-- 字段配置区域 -->
      <div style="display: flex; margin-top: 10px; background-color: white; flex-direction: row; flex-wrap: wrap">
        <div style="margin-left: 10px; padding-top: 10px; width: 100px; font-size: 18px">＊字段配置</div>
        <a-button class="editable-add-btn" style="margin-top: -30px; margin-bottom: 8px; margin-left: 1330px" @click="handleAdd1">添加字段 </a-button>
        <a-table bordered :data-source="dataSource1" :columns="columns1" style="margin-left: 10px; width: 1400px" :scroll="{ y: 170 }" :pagination="false">
          <template #bodyCell="{ column, text, record }">
            <template v-if="['name', 'age', 'address'].includes(column.dataIndex)">
              <div>
                <a-input v-if="editableData1[record.key1]" v-model:value="editableData1[record.key1][column.dataIndex]" style="margin: -5px 0" placeholder="请输入" />
                <template v-else>
                  {{ text }}
                </template>
              </div>
            </template>
            <template v-if="['address1'].includes(column.dataIndex)">
              <div>
                <a-select v-if="editableData1[record.key1]" v-model:value="editableData1[record.key1][column.dataIndex]" style="width: 520px" show-search :options="Mapping"></a-select>
                <template v-else>
                  {{ text }}
                </template>
              </div>
            </template>
            <template v-else-if="column.dataIndex === 'operation'">
              <div class="editable-row-operations">
                <span v-if="editableData1[record.key1]">
                  <a-typography-link @click="save1(record.key1)">保存</a-typography-link>
                  <a-typography-link style="margin-left: 10px" @click="cancel1(record.key1)">取消 </a-typography-link>
                </span>
                <span v-else>
                  <a @click="edit1(record.key1)">编辑</a>
                  <a style="margin-left: 10px" @click="onDelete1(record.key1)">删除</a>
                </span>
              </div>
            </template>
          </template>
        </a-table>
      </div>

      <!-- 底部区域 -->
      <template #footer>
        <a-space>
          <a-button @click="onClose">取消</a-button>
          <a-button type="primary" @click="sure">确定</a-button>
        </a-space>
      </template>
    </a-drawer>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, Ref, ref, UnwrapRef } from 'vue';
  import { AssetSheet, QueryBasic, StandardMapping } from '@/api/test/index';
  import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons-vue';
  import type { FormInstance } from 'ant-design-vue';
  import emitter from '@/utils/bus';
  import { cloneDeep } from 'lodash';
  //   import type { TreeSelectProps } from 'ant-design-vue';

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
    console.log(treeData, 'asddad');
    showDrawer(type, record);
  });

  const fieldNames = {
    children: 'children',
    title: 'name',
    key: 'directoryId',
    value: 'directoryId',
  };

  const convertData = (treeData: any[]) => {
    treeData.forEach(item => {
      item.title = item.name;
      item.value = item.directoryId;
      if (item.children) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        convertData(item.children);
      }
    });
  };

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

  const formRef = ref<FormInstance>();
  const dynamicValidateForm = ref<{ sights: Sights[]; chineseName: ['']; directoryId: Sights1[] }>({
    sights: [],
    chineseName: [''],
    directoryId: [],
  });

  const onClose = () => {
    visible.value = false;
  };

  const removeSight = (item: Sights) => {
    console.log(item);
    let index = dynamicValidateForm.value.sights.indexOf(item);
    if (index !== -1) {
      dynamicValidateForm.value.sights.splice(index, 1);
    }
  };

  //字段添加
  const Mapping = ref([]);
  const length = ref('');
  // const standard_id = ref('');
  const handleAdd1 = () => {
    StandardMapping().then(function (res) {
      length.value = res.data.data.length;
      // standard_id.value = res.data.data.standard_id
      Mapping.value = [...Array(length.value)].map((_, i) => ({ value: res.data.data[i].dataRange }));
      // standard_id.value = [...Array(length.value)].map((_, i) => ({ value: res.data.data[i].standard_id }));
    });
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

  //   const datas1 = ref({
  //     chineseName: '',
  //     englishName: '',
  //     assetId: '',
  //   });

  //添加一行
  const addSight = () => {
    dynamicValidateForm.value.sights.push({
      id: 'i' + Date.now(),
    });
    dynamicValidateForm.value.chineseName.push('');
  };

  //选择目录改变事件
  const adddata = () => {
    dynamicValidateForm.value.directoryId = [];
    // console.log(dynamicValidateForm.chineseName);
    // dynamicValidateForm.value.chineseName[''] = [];
    for (let i = 0; i < dynamicValidateForm.value.sights.length; i++) {
      console.log(dynamicValidateForm.value.chineseName, 'cz');
      dynamicValidateForm.value.directoryId.push({
        directoryId: dynamicValidateForm.value.chineseName[i],
      });
    }
    console.log(dynamicValidateForm.value, 'as');
  };

  //确认新增数据资产表
  const sure = () => {
    datas.assetDirectory = dynamicValidateForm.value.directoryId;
    datas.dataAssetField = dataSource2.value;
    console.log(datas);

    AssetSheet(datas).then(function (res) {
      console.log(res.data.msg);
      console.log(res);
      if (res.data.msg == '返回成功') {
        location.reload();
      } else {
        alert(res.data.msg);
      }
    });
  };

  // 判断正则表达以编码名是否重复

  const columns1 = [
    {
      title: '字段英文名称',
      dataIndex: 'name',
      width: '15%',
    },
    {
      title: '字段中文名称',
      dataIndex: 'age',
      width: '15%',
    },
    {
      title: '字段说明',
      dataIndex: 'address',
      width: '20%',
    },
    {
      title: '标准映射',
      dataIndex: 'address1',
      width: '40%',
    },
    {
      title: '操作',
      dataIndex: 'operation',
    },
  ];

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

  const save1 = (key1: string) => {
    Object.assign(dataSource1.value.filter(item => key1 === item.key1)[0], editableData1[key1]);
    delete editableData1[key1];
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
  };
  const onDelete1 = (key1: string) => {
    dataSource1.value = dataSource1.value.filter(item => item.key1 !== key1);
  };
  const cancel1 = (key1: string) => {
    delete editableData1[key1];
    onDelete1(key1);
  };

  const add1 = ref();
  const showDrawer = (type: string, record: any) => {
    if (type == 'add') {
      datas.chineseName = '';
      datas.englishName = '';
      datas.assetExplain = '';
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
        console.log(res);
        // datas = res.data.data
        // Object.keys(datas).forEach(item => )
        datas.chineseName = res.data.data.chineseName;
        datas.englishName = res.data.data.englishName;
        datas.assetExplain = res.data.data.assetExplain;
        dynamicValidateForm.value.chineseName.shift();
        for (let i = 0; i < res.data.data.directoryNames.length; i++) {
          let aa = res.data.data.directoryIds[i].split('/').slice(-1).toString();
          dynamicValidateForm.value.sights.push({
            id: 'i' + Date.now(),
          });
          dynamicValidateForm.value.chineseName.push(aa);
        }

        for (let i = 0; i < res.data.data.updateAssetFieldVos.length; i++) {
          dataSource1.value.push({
            name: res.data.data.updateAssetFieldVos[i].englishName,
            age: res.data.data.updateAssetFieldVos[i].chineseName,
            address1: res.data.data.updateAssetFieldVos[i].standNames,
            key1: res.data.data.updateAssetFieldVos[i].fieldId,
            address: res.data.data.updateAssetFieldVos[i].standardId,
          });
        }
      });
      handleAdd1();
      // console.log(22);
      // EditData1(datas1).then(function(res){
      //   console.log(res);
      // })
      dynamicValidateForm.value = {
        // sights: [{ id: '0' }],
        sights: [],
        chineseName: [''],
        directoryId: [],
      };
      dataSource1.value = [];
    }
  };
</script>

<style lang="less" scoped>
  @import '../style.less';
</style>
