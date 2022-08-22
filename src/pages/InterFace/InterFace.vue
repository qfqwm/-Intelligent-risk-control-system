<!-- eslint-disable vue/v-on-event-hyphenation -->
<template>
  <div class="all">
    <!-- 左边资产目录区域 -->
    <InterfaceClassification></InterfaceClassification>
    <!-- 右边数据展示区域 -->
    <div class="right">
      <!-- 搜索区域 -->
      <a-form ref="formRef" name="custom-validation" :model="formState" :style="{ display: 'flex', justifyContent: 'space-around', Width: '100%' }">
        <a-form-item name="area" label="接口来源">
          <a-select v-model:value.trim="formState.interMsgSource" :options="areas" :style="{ minWidth: '100px' }" />
        </a-form-item>
        <a-form-item name="area" label="API状态">
          <a-select v-model:value.trim="formState.interMsgApiType" :options="areas1" :style="{ minWidth: '100px' }" />
        </a-form-item>
        <a-form-item has-feedback label="接口名称:" name="checkPass">
          <a-input v-model:value="formState.interMsgName" type="text" autocomplete="off" />
        </a-form-item>
        <a-form-item>
          <a-button html-type="submit" @click="reset">重置</a-button>
          <a-button style="margin-left: 10px" type="primary" @click="query">查询</a-button>
        </a-form-item>
      </a-form>
      <!-- 五个按钮区域 -->
      <div class="button">
        <div class="left1">
          <a-button type="primary" :disabled="!hasSelected1" size="small" @click="onChangecode(Selectall_invert, 0)"> 批量发布 </a-button>
          <a-button type="primary" :disabled="!hasSelected2" size="small" style="margin-left: 15px" @click="onChangecode(Selectall_invert, 1)"> 批量停用 </a-button>
          <a-button type="primary" :disabled="!batch" size="small" @click="batchClassification"> 批量分类 </a-button>
          <BatchClassificationVue />
        </div>
        <div class="right1">
          <!-- 抽屉区域 -->
          <a-button type="primary" size="small" style="margin-left: 15px" @click="router_link('zc')"> 人工注册 </a-button>
        </div>
      </div>

      <!-- 表格区域 -->
      <a-table
        :data-source="dataSource"
        :columns="columns1"
        :row-selection="rowSelection"
        :row-key="(dataSource: any) => { return dataSource.interMsgId }"
        :pagination="{
       
          pageSizeOptions: ['10', '15', '18', '20'],
          showTotal: (total: any) => `共 ${total} 条`,
          showSizeChanger: true,
          defaultPageSize: 20,
          buildOptionText: (size: any) => {
            return Number(size.value) + ' 项' + '/' + '页'
          },
          onShowSizeChange : (current, pageSize) => {
            return current
           
        
          }

        }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'interMsgName'">
            <router-link to="/InterfaceDetail" @click.prevent="showcode(record.interMsgId)">{{ record.interMsgName }}</router-link>
          </template>
          <template v-if="column.dataIndex === 'operation'">
            <!-- 未发布显示按钮 -->
            <div v-if="record.interMsgApiType == '未发布'">
              <a-button type="primary" size="small" @click="showTestDrawer(record)">接口测试</a-button>
              <a-popconfirm v-if="dataSource.length" title="请确认否发布该码表?" @confirm="onChangecode(record.interMsgId, 0)">
                <a-button type="primary" size="small">发布</a-button>
              </a-popconfirm>
              <a-button type="primary" size="small" @click="router_link(record.interMsgId)">编辑</a-button>
              <a-popconfirm v-if="dataSource.length" title="请确认是否删除该码表?" @confirm="onDelete(record.interMsgId)">
                <a-button type="primary" size="small">删除</a-button>
              </a-popconfirm>
            </div>
            <!-- 已发布显示按钮 -->
            <div v-if="record.interMsgApiType == '已发布'">
              <a-button type="primary" size="small" @click="showTestDrawer(record)">接口测试</a-button>
              <a-popconfirm v-if="dataSource.length" title="请确认否停用该码表?" @confirm="onChangecode(record.interMsgId, 1)">
                <a-button type="primary" size="small">停用</a-button>
              </a-popconfirm>
            </div>
            <!-- 已停用显示按钮 -->
            <div v-if="record.interMsgApiType == '已停用'">
              <a-button type="primary" size="small" @click="showTestDrawer(record)">接口测试</a-button>
              <a-popconfirm v-if="dataSource.length" title="请确认否发布该码表?" @confirm="onChangecode(record.interMsgId, 0)">
                <a-button type="primary" size="small">发布</a-button>
              </a-popconfirm>
              <a-button type="primary" size="small" @click="router_link(record.interMsgId)">编辑</a-button>
            </div>
          </template>
        </template>
      </a-table>
      <!-- 接口测试抽屉 -->
      <InterfaceTest :show-interface-test="showInterfaceTest" :show-visible="showVisible" @closeDrawer="closedrawer"></InterfaceTest>
      <!-- <InterfaceTest></InterfaceTest> -->
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
  import InterfaceTest from '@/pages/InterFace/component/InterfaceTest.vue';
  import InterfaceClassification from './component/InterfaceClassification.vue';
  import type { FormInstance } from 'ant-design-vue';
  import BatchClassificationVue from './component/BatchClassification.vue';
  import { ref, reactive } from 'vue';
  import { message } from 'ant-design-vue';
  import type { Ref } from 'vue';
  import { SelectCodeConfigure, SelectDirectory, queryIntfc, postDeactivation, delIntfc } from '@/api/test/index';
  import emitter from '@/utils/bus';
  import { useRouter } from 'vue-router';
  const router = useRouter();

  //查询区域
  interface FormState {
    interMsgSource: string;
    interMsgApiType: string;
    interMsgName: string;
    interDirId: string;
  }
  const formRef = ref<FormInstance>();
  const formState = reactive<FormState>({
    interMsgSource: '',
    interMsgApiType: '',
    interMsgName: '',
    interDirId: '',
  });
  // const layout = {
  //   labelCol: { span: 4 },
  //   wrapperCol: { span: 14 },
  // };

  const areas = [
    { label: '数据服务', value: '0' },
    { label: '指标管理', value: '1' },
    { label: '决策引擎', value: '2' },
  ];
  const areas1 = [
    { label: '未发布', value: '0' },
    { label: '已发布', value: '1' },
    { label: '已停用', value: '2' },
  ];

  const treeData = ref<any[]>([]);
  SelectDirectory().then(res => {
    treeData.value = res.data.data;
  });

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

  // 搜索功能
  const interMsgSource = ref<string>('');
  const interMsgApiType = ref<string>('');
  // const interMsgName = ref<string>('');

  emitter.on('sendf', val => {
    formState.interDirId = val as any;
    selectCodeTable_way();
  });

  //批量按钮操作
  // const batch = ref<boolean>(false);

  //表格
  const columns1 = [
    {
      title: '接口名称',
      dataIndex: 'interMsgName',
      width: '13%',
    },
    {
      title: '接口描述',
      dataIndex: 'interMsgDescribe',
      width: '13%',
    },
    {
      title: '接口分类',
      dataIndex: 'interDirId',
      width: '13%',
    },
    {
      title: '接口来源',
      dataIndex: 'interMsgSource',
    },
    {
      title: 'API状态',
      dataIndex: 'interMsgApiType',
    },
    {
      title: '更新时间',
      dataIndex: 'interMsgUpdateTime',
      key: 'interMsgUpdateTime',
      //排序方法
      sorter: (a, b) => {
        let aTime = new Date(a.interMsgUpdateTime).getTime();
        let bTime = new Date(b.interMsgUpdateTime).getTime();
        return aTime - bTime;
      },
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: '23%',
    },
  ];

  const dataSource: Ref<DataItem[]> = ref([]);
  //调用接口加载表格
  const selectCodeTable_way = () => {
    let object = {
      page: 1,
      size: 100,
    };
    enum interMsgApiType {
      未发布,
      已发布,
      已停用,
    }
    enum interMsgSource {
      数据服务 = 0,
      指标管理,
      决策引擎,
    }
    let object1 = { ...object, ...formState };
    // console.log(object1);
    queryIntfc(object1).then(function (res: any) {
      console.log(res.data.data);
      if (res.data.msg !== '返回成功') return (dataSource.value = []);
      dataSource.value = res.data.data.interfaceMsgList;
      // console.log(dataSource.value);
      dataSource.value.forEach((item: any) => {
        item.interMsgApiType = interMsgApiType[item.interMsgApiType];
        item.interMsgSource = interMsgSource[item.interMsgSource];
      });
      total.value = dataSource.value.length;
    });
  };
  selectCodeTable_way();

  // 查询按钮
  const query = () => {
    selectCodeTable_way();
  };
  // 重置按钮
  const reset = () => {
    formState.interMsgSource = '';
    formState.interMsgApiType = '';
    formState.interMsgName = '';
    formState.interDirId = '';
    selectCodeTable_way();
  };
  //删除
  const onDelete = (code: string) => {
    delIntfc(code).then(function (res: any) {
      // if (res.data.msg == '删除成功') {
      dataSource.value = dataSource.value.filter((item: any) => item.interMsgId !== code);
      // }
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
    // console.log(codeId);

    router.push({
      path: '/InterfaceDetail',
      query: { interMsgId: codeId },
    });
    show.outmask = true;
    show.PersonnelGender = true;
  };
  // 关闭人员性别编码弹框
  const closePersonnelGender = () => {
    show.outmask = false;
    show.PersonnelGender = false;
  };

  //按钮禁用
  let reslist = ref<any>([]);

  const hasSelected1 = computed(() => {
    if (reslist.value.every(item => item == '未发布' || item == '已停用') && Selectall_invert.value.length > 0) {
      return true;
    } else {
      return false;
    }
  });
  const hasSelected2 = computed(() => {
    if (Selectall_invert.value.length > 0 && reslist.value.every(item => item === '已发布')) {
      return true;
    } else {
      return false;
    }
  });
  const batch = computed(() => {
    if (Selectall_invert.value.length > 0 && reslist.value.every(item => item === '未发布')) {
      return true;
    } else {
      return false;
    }
  });

  // 全选/反选
  const Selectall_invert = ref([]);
  const batchData = ref();
  const rowSelection = ref({
    checkStrictly: false,
    selectedRowKeys: Selectall_invert,
    onChange: (selectedRowKeys: any, record) => {
      batchData.value = record;
      Selectall_invert.value = selectedRowKeys;
      reslist.value = record.map(item => {
        return item.interMsgApiType;
      });
    },
  });
  // 分页
  // const pageSizeRef = ref(20);
  const total = ref(dataSource.value.length);

  // 改变编码状态 √
  const onChangecode = (interMsgId: any, state: number) => {
    let Arr: any = [];
    if (typeof interMsgId === 'number') {
      Arr.push(interMsgId);
    } else {
      Arr = [...interMsgId];
    }

    let object_array = {
      statusType: state,
      interfaceMsgList: Arr,
    };
    postDeactivation(object_array).then(function (res: any) {
      console.log(res, 'czc');

      if (res.data.code == 100200) {
        // 有时间前端进行改进 关于重新请求
        message.success('更新成功!');
        if (typeof interMsgId === 'object') Selectall_invert.value = [];
        selectCodeTable_way();
      } else message.error(res.data.msg);
    });
  };
  //接口测试抽屉
  const showVisible = ref<boolean>(false);
  const showInterfaceTest = ref();
  const showTestDrawer = (record: any) => {
    console.log(record, 'record');

    showVisible.value = true;
    showInterfaceTest.value = record;
  };
  const closedrawer = () => {
    showVisible.value = false;
  };
  //批量分类
  const visible2 = ref<boolean>(false);
  const batchClassification = () => {
    for (let p in batchData.value) {
      if (batchData.value[p].interMsgApiType != '未发布') {
        message.error('只有未发布的接口才能进行批量分类');
        visible2.value = false;
        break;
      } else {
        visible2.value = true;
      }
    }
    const data = reactive({
      visible: visible2.value,
      batchData: batchData.value,
    });
    emitter.emit('batchclass', data);
  };
  // 人工注册跳转
  const router_link = (id?: any) => {
    router.push({ name: 'manualregistration', query: { mode: id } });
  };
</script>

<style lang="less" scoped>
  @import './css/style.less';
</style>
