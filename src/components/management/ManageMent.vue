<template>
  <div class="all">
    <!-- 左边资产目录区域 -->
    <DataAssetCatalog></DataAssetCatalog>
    <!-- 右边数据展示区域 -->
    <div class="right">
      <!-- 搜索区域 -->
      <div class="search">
        <span>数据资产表状态：</span>
        <select v-model="Codetablestatus">
          <option value="未发布">未发布</option>
          <option value="已发布">已发布</option>
          <option value="已停用">已停用</option>
          <option value="" selected></option>
        </select>
        <span>中文名称：</span><input v-model="Codetablename" type="text" /> <span>英文名称：</span><input v-model="Codetablename1" type="text" />
        <a-button class="Reset" @click="Reset">重置</a-button>
        <a-button class="query" @click="query">查询</a-button>
      </div>
      <!-- 五个按钮区域 -->
      <div class="button">
        <div class="left1">
          <a-button type="primary" size="small" @click="ALLonChangecode('1')">批量发布</a-button>
          <a-button type="primary" size="small" @click="ALLonChangecode('2')">批量停用</a-button>
        </div>
        <div class="right1">
          <!-- 抽屉区域 -->
          <a-button type="primary" @click="showDrawer('add', {})"> 新增资产表 </a-button>
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
                          <a-tree-select
                            v-model:value="dynamicValidateForm.chineseName[0]"
                            show-search
                            style="width: 415px"
                            allow-clear
                            tree-default-expand-all
                            placeholder="请选择所属目录"
                            :tree-data="treeData1"
                          >
                          </a-tree-select>
                          <a-space
                            v-for="(sight, i) in dynamicValidateForm.sights"
                            :key="sight.id"
                            v-model:value="dynamicValidateForm.chineseName[i + 1]"
                            style="display: flex; margin-bottom: 8px"
                            align="baseline"
                          >
                            <a-form-item>
                              <a-tree-select show-search style="width: 415px" allow-clear tree-default-expand-all placeholder="请选择所属目录" :tree-data="treeData1" @change="asd(i)"> </a-tree-select>
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
              <a-button class="editable-add-btn" style="margin-top: -30px; margin-bottom: 8px; margin-left: 1330px" @click="handleAdd1">添加字段</a-button>
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
      </div>
      <!-- 表格区域 -->
      <a-table
        :data-source="dataSource"
        :columns="columns"
        :row-selection="rowSelection"
        :row-key="(dataSource: any) => { return dataSource.assetId }"
        :pagination="{
          pageSizeOptions: ['10', '15', '18', '20'], showTotal: (total: any) => `共 ${total} 条`,
          showSizeChanger: true,
          defaultPageSize: 20,
          buildOptionText: (size: any) => {
            return Number(size.value) + ' 项' + '/' + '页'
          }
        }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'chineseName'">
            <a href="#" @click.prevent="showcode(record.chineseName)">{{ record.chineseName }}</a>
          </template>
          <template v-if="column.dataIndex === 'englishName'">
            <a href="#" @click.prevent="showcode(record.englishName)">{{ record.englishName }}</a>
          </template>
          <template v-if="column.dataIndex === 'operation'">
            <!-- 未发布显示按钮 -->
            <div v-if="record.assetType == '未发布'">
              <a-popconfirm v-if="dataSource.length" title="请确认否发布该码表?" @confirm="onChangecode(record.codeId, '1')">
                <a-button type="primary" size="small">发布</a-button>
              </a-popconfirm>
              <a-button type="primary" size="small" @click="showDrawer('edit', record)">编辑</a-button>
              <a-popconfirm v-if="dataSource.length" title="请确认是否删除该码表?" @confirm="onDelete(record.codeId)">
                <a-button type="primary" size="small">删除</a-button>
              </a-popconfirm>
            </div>
            <!-- 已发布显示按钮 -->
            <div v-if="record.assetType == '已发布'">
              <a-popconfirm v-if="dataSource.length" title="请确认否发布该码表?" @confirm="onChangecode(record.codeId, '2')">
                <a-button type="primary" size="small">停用</a-button>
              </a-popconfirm>
            </div>
            <!-- 已停用显示按钮 -->
            <div v-if="record.assetType == '已停用'">
              <a-popconfirm v-if="dataSource.length" title="请确认否发布该码表?" @confirm="onChangecode(record.codeId, '1')">
                <a-button type="primary" size="small">发布</a-button>
              </a-popconfirm>
              <a-button type="primary" size="small" @click="showDrawer('edit', record)">编辑</a-button>
            </div>
          </template>
        </template>
      </a-table>
      <!-- 蒙版区域 -->
      <div v-show="show.outmask" class="mask">
        <!-- 企业信息基本表 -->
        <div v-show="show.PersonnelGender" class="PersonnelGender">
          <div class="basemess">
            <h1><a href="#" class="close" @click.prevent="closePersonnelGender"> X</a></h1>
            <h2>企业基本信息表</h2>
            <h3>基本信息</h3><br />
            <span class="label"> 中文名称：</span> {{ personnelcodetable.codename }} <br />
            <span class="label"> 英文名称：</span> <br />
            <h4>数据资产表描述：</h4>
            <span class="label"> 所属目录：</span>
          </div>
          <h3>字段信息</h3><br />
          <table class="PersonnelGendertable">
            <thead>
              <tr>
                <th>字段英文名称</th>
                <th>字段中文名称</th>
                <th>字段说明</th>
                <th>标准映射</th>
                <th>数据类型</th>
                <th>数据长度</th>
                <th>数据精度</th>
                <th>默认值</th>
                <th>取值范围</th>
                <th>枚举范围</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in personnelcodetable.CodeConfigure" :key="index">
                <td>{{ index + 1 < 10 ? '0' + (index + 1) : index }}</td>
                <td>{{ item.configureName }}</td>
                <td>{{ item.configureMean }}</td>
                <td>{{ item.configureName }}</td>
                <td>{{ item.configureMean }}</td>
                <td>{{ item.configureName }}</td>
                <td>{{ item.configureMean }}</td>
                <td>{{ item.configureName }}</td>
                <td>{{ item.configureMean }}</td>
                <td>{{ item.configureMean }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import DataAssetCatalog from '@/pages/management/component/DataAssetCatalog.vue';
  import { ref, watch, computed, reactive } from 'vue';
  import type { FormInstance } from 'ant-design-vue';
  import { message } from 'ant-design-vue';
  import type { Ref, UnwrapRef } from 'vue';
  import { OnChange, DeleteCode, SelectCodeConfigure, SelectDataAsset, AssetSheet, QueryBasic } from '@/api/test/index';
  import { StandardMapping } from '@/api/test/index';
  import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons-vue';
  import { cloneDeep } from 'lodash-es';

  components: {
    DataAssetCatalog;
  }
  const datas = reactive<{ chineseName: string; englishName: string; assetExplain: string; assetDirectory: Sights1[]; dataAssetField: Sights2[] }>({
    chineseName: '',
    englishName: '',
    assetExplain: '',
    assetDirectory: [],
    dataAssetField: [],
  });

  watch(
    () => datas.chineseName,
    () => datas.englishName,
  );

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

  interface Sights {
    id: string;
  }

  interface Sights1 {
    directoryId: string;
  }

  // interface Sights3 {
  //   chineseName: string
  // }

  interface Sights2 {
    chineseName: string;
    englishName: string;
    fieldExplain: string;
    standardId: string;
  }

  const formRef = ref<FormInstance>();
  const dynamicValidateForm = ref<{ sights: Sights[]; chineseName: []; directoryId: Sights1[] }>({
    sights: [],
    chineseName: [],
    directoryId: [],
  });
  // watch(
  //   () => {
  //     dynamicValidateForm.chineseName = [];
  //   },
  //   () => {
  //     dynamicValidateForm.sights = [];
  //   },
  // );
  const removeSight = (item: Sights) => {
    let index = dynamicValidateForm.value.sights.indexOf(item);
    if (index !== -1) {
      dynamicValidateForm.value.sights.splice(index, 1);
    }
  };

  // const asd1 =(i)=>{
  //   dynamicValidateForm.value.chineseName = [i]
  // }

  const tet = ref<number>();
  const asd = (i: number) => {
    tet.value = i + 1;
    dynamicValidateForm.value.chineseName.push(dynamicValidateForm.value.chineseName[tet.value]);
    console.log(dynamicValidateForm.value.chineseName[tet.value], 'asd');
  };

  //有问题
  const addSight = () => {
    dynamicValidateForm.value.sights.push({
      id: 'i' + Date.now(),
    });
    // console.log(dynamicValidateForm.chineseName);
    for (let i = 0; i < dynamicValidateForm.value.sights.length; i++) {
      console.log(dynamicValidateForm.value.chineseName, 'cz');

      dynamicValidateForm.value.directoryId.push({
        directoryId: dynamicValidateForm.value.chineseName[i],
      });
    }
    console.log(dynamicValidateForm.value);
  };

  interface DataItem {
    key: string;
    codeId: string;
    codeName: string;
    codeExplain: string;
    codeType: any;
    codeUpdatetime: string;
    codeCreattime: string;
    allCodeTable: object;
  }

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

  const visible = ref<boolean>(false);
  const add1 = ref();
  const sss = ref('');
  const showDrawer = (type: string, record: any) => {
    if (type == 'add') {
      datas.chineseName = '';
      datas.englishName = '';
      datas.assetExplain = '';
      // dynamicValidateForm.value = ''
      visible.value = true;
      // console.log(11);
    }
    if (type == 'edit') {
      add1.value = { chineseName: record.chineseName };
      visible.value = true;
      QueryBasic(add1.value).then(function (res) {
        console.log(res);
        sss.value = res.data.data;
        console.log(sss.value);
      });
      datas.chineseName = record.chineseName;
      datas.englishName = record.englishName;
      datas.assetExplain = record.assetExplain;
      // dynamicValidateForm.value = sss.value
      // console.log(22);
      // EditData1(datas1).then(function(res){
      //   console.log(res);
      // })
    }
  };

  const onClose = () => {
    visible.value = false;
  };

  // 搜索功能
  const Codetablestatus = ref<string>('');
  const Codetablename = ref<string>('');
  const Codetablename1 = ref<string>('');
  // 表格
  const columns = [
    {
      title: '数据资产表中文名称',
      dataIndex: 'chineseName',
      width: '13%',
    },
    {
      title: '数据资产表英文名称',
      dataIndex: 'englishName',
      width: '13%',
    },
    {
      title: '数据资产表描述',
      dataIndex: 'assetExplain',
      width: '30%',
    },
    {
      title: '发布状态',
      dataIndex: 'assetType',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: '17%',
    },
  ];
  const dataSource: Ref<DataItem[]> = ref([]);
  // 调用接口加载表格
  const selectCodeTable_way = () => {
    let state = '';
    if (Codetablestatus.value == '未发布') state = '0';
    if (Codetablestatus.value == '已发布') state = '1';
    if (Codetablestatus.value == '已停用') state = '2';
    let object = {
      assetType: state,
      chineseName: Codetablename.value,
      englishName: Codetablename1.value,
    };
    SelectDataAsset(object).then(function (res: any) {
      console.log(res);

      if (res.data.msg !== '返回成功') return (dataSource.value = []);
      dataSource.value = res.data.data;
      console.log(dataSource.value);

      dataSource.value.forEach((item: any) => {
        if (item.assetType == 0) {
          item.assetType = '未发布';
        }
        if (item.assetType == 1) {
          item.assetType = '已发布';
        }
        if (item.assetType == 2) {
          item.assetType = '已停用';
        }
      });
      total.value = dataSource.value.length;
    });
  };
  selectCodeTable_way();
  // 查询按钮
  const query = () => {
    selectCodeTable_way();
  };
  const onDelete = (code: string) => {
    DeleteCode(code).then(function (res: any) {
      if (res.data.msg == '删除成功') {
        dataSource.value = dataSource.value.filter((item: any) => item.codeId !== code);
      }
    });
  };
  // 判断弹框显示隐藏
  const show = reactive({ outmask: false, addcode: false, inmask: false, addincode: false, editincode: false, PersonnelGender: false });

  // 人员性别编码弹框
  const personnelcodetable = ref({
    codename: '',
    CodeConfigure: [
      {
        configureName: '',
        configureMean: '',
      },
    ],
  });
  const showcode = (codeId: string) => {
    personnelcodetable.value = {
      codename: codeId,
      CodeConfigure: [],
    };

    SelectCodeConfigure(codeId).then(function (res: any) {
      if (res.data.msg == '获取成功') {
        personnelcodetable.value.CodeConfigure = res.data.data;
      }
    });
    show.outmask = true;
    show.PersonnelGender = true;
  };
  // 关闭人员性别编码弹框
  const closePersonnelGender = () => {
    show.outmask = false;
    show.PersonnelGender = false;
  };
  // 重置
  const Reset = () => {
    Codetablestatus.value = '';
    Codetablename.value = '';
    Codetablename1.value = '';
    selectCodeTable_way();
  };
  // 全选/反选
  const Selectall_invert = ref([]);
  const rowSelection = ref({
    checkStrictly: false,
    onChange: (selectedRows: any) => {
      Selectall_invert.value = selectedRows;
    },
  });
  // 批量操作
  const ALLonChangecode = (state: string) => {
    if (state === '1') {
      let length = Selectall_invert.value.length;
      for (let i = 0; i < length; i++) {
        let temp: any = dataSource.value.find((element: any) => element.codeId === Selectall_invert.value[i]);
        if (temp.codeType === '已发布') {
          return message.error('已发布状态不可在进行发布');
        }
      }
    }
    if (state === '2') {
      for (let i = 0; i < Selectall_invert.value.length; i++) {
        let temp: any = dataSource.value.find((element: any) => element.codeId === Selectall_invert.value[i]);
        if (temp.codeType == '未发布') return message.error('停用失败，存在未发布的码表！');
      }
      let length = Selectall_invert.value.length;
      for (let i = 0; i < length; i++) {
        let temp: any = dataSource.value.find((element: any) => element.codeId === Selectall_invert.value[i]);
        if (temp.codeType === '已停用') {
          return message.error('已停用状态不可在进行停用');
        }
      }
    }
    let change_array: any = [];
    Selectall_invert.value.forEach(item => {
      change_array.push({
        codeId: item,
        codeType: state,
      });
    });
    if (change_array.length == 0) return message.error('请选择码表进行操作!');
    OnChange(change_array).then(function (res: any) {
      if (res.data.msg == '更新成功') {
        message.success('更新成功!');
        selectCodeTable_way();
      } else return message.error('更新失败！');
    });
  };
  // 分页
  const total = ref(dataSource.value.length);

  // 改变编码状态
  const onChangecode = (codeId: any, state: string) => {
    let object_array = [
      {
        codeId: codeId,
        codeType: state,
      },
    ];
    OnChange(object_array).then(function (res: any) {
      if (res.data.msg == '更新成功') {
        // 有时间前端进行改进 关于重新请求
        message.success('更新成功!');
        selectCodeTable_way();
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
    console.log(dataSource2.value);
  };
  const onDelete1 = (key1: string) => {
    dataSource1.value = dataSource1.value.filter(item => item.key1 !== key1);
  };
  const cancel1 = (key1: string) => {
    delete editableData1[key1];
    onDelete1(key1);
  };

  const Mapping = ref([]);
  const length = ref('');
  const standard_id = ref('');
  const handleAdd1 = () => {
    StandardMapping().then(function (res) {
      // console.log(res.data.data);
      length.value = res.data.data.length;
      // standard_id.value = res.data.data.standard_id
      Mapping.value = [...Array(length.value)].map((_, i) => ({ value: res.data.data[i].dataRange }));
      standard_id.value = [...Array(length.value)].map((_, i) => ({ value: res.data.data[i].standard_id }));
      // for (let i = 0; i < res.data.data.length; i++) {
      //   // Mapping.value.substr(0,6)
      //   console.log(Mapping.value.splice(7,10));

      // }
      // console.log(Mapping.value);
      // console.log(standard_id.value);
      // console.log(length.value);
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
</script>

<style lang="less" scoped>
  @import './style.less';
</style>
