<!-- eslint-disable vue/v-on-event-hyphenation -->
<template>
  <div class="all">
    <!-- 左边资产目录区域 -->
    <InterfaceClassification></InterfaceClassification>
    <!-- 右边数据展示区域 -->
    <div class="right">
      <!-- 搜索区域 -->
      <a-form ref="formRef" name="custom-validation" :model="formState" v-bind="layout" style="display: flex">
        <a-form-item name="area" label="接口来源" style="width: 460px">
          <a-select v-model:value.trim="formState.interMsgSource" :options="areas" />
        </a-form-item>
        <a-form-item name="area" label="API状态" style="width: 460px">
          <a-select v-model:value.trim="formState.interMsgApiType" :options="areas1" />
        </a-form-item>
        <a-form-item has-feedback label="接口名称:" name="checkPass" style="width: 460px">
          <a-input v-model:value="formState.interMsgName" type="text" autocomplete="off" />
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 14, offset: 4 }" style="display: flex; justify-content: end; width: 28%">
          <a-button html-type="submit" @click="reset">重置</a-button>
          <a-button style="margin-left: 10px" type="primary" @click="query">查询</a-button>
        </a-form-item>
      </a-form>
      <div style="display: flex; justify-content: end">
        <a-button type="dark" @click="ALLonChangecode(1)"> 批量发布 </a-button>
        <a-button type="dark" style="margin-left: 15px" @click="ALLonChangecode(2)"> 批量停用 </a-button>
        <a-button type="dark" style="margin-left: 15px"> 批量分类 </a-button>
        <a-button type="primary" style="margin-left: 15px" @click="router_link"> 人工注册 </a-button>
      </div>
      <!-- 表格区域 -->
      <a-table
        :data-source="dataSource"
        :columns="columns1"
        :row-selection="rowSelection"
        :row-key="(dataSource: any) => { return dataSource.interMsgId }"
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
          <template v-if="column.dataIndex === 'interMsgName'">
            <router-link to="/InterfaceDetail" @click.prevent="showcode(record.assetId)">{{ record.interMsgName }}</router-link>
            <a href="#" @click.prevent="showcode(record.interMsgName)">{{ record.interMsgName }}</a>
          </template>
          <template v-if="column.dataIndex === 'operation'">
            <!-- 未发布显示按钮 -->
            <div v-if="record.interMsgApiType == '未发布'">
              <a-button type="primary" size="small" @click="showTestDrawer(record)">接口测试</a-button>
              <a-popconfirm v-if="dataSource.length" title="请确认否发布该码表?" @confirm="onChangecode(record.interMsgId, 0)">
                <a-button type="primary" size="small">发布</a-button>
              </a-popconfirm>
              <a-button type="primary" size="small" @click="showDrawer('edit', record)">编辑</a-button>
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
              <a-button type="primary" size="small" @click="showDrawer('edit', record)">编辑</a-button>
            </div>
          </template>
        </template>
      </a-table>
      <!-- 接口测试抽屉 -->
      <InterfaceTest></InterfaceTest>
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
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 },
  };

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

  const visible = ref<boolean>(false);

  const showDrawer = (type: string, record: any) => {
    const sdd = reactive({
      type: type,
      record: record,
      visible: visible,
      treeData: treeData,
    });
    console.log(11111222, sdd.record);

    // Add();
    emitter.emit('sendchild', sdd);
  };

  // 搜索功能
  const interMsgSource = ref<string>('');
  const interMsgApiType = ref<string>('');
  const interMsgName = ref<string>('');

  emitter.on('sendf', val => {
    formState.interDirId = val;
    selectCodeTable_way();
  });
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
    let state = '';
    if (interMsgApiType.value == '未发布') state = '0';
    if (interMsgApiType.value == '已发布') state = '1';
    if (interMsgApiType.value == '已停用') state = '2';
    let Source = '';
    if (interMsgSource.value == '数据服务') Source = '0';
    if (interMsgSource.value == '指标管理') Source = '1';
    if (interMsgSource.value == '决策引擎') Source = '2';

    let object = {
      page: 1,
      size: 7,
    };
    let object1 = { ...object, ...formState };
    console.log(object1);
    queryIntfc(object1).then(function (res: any) {
      console.log(res);

      if (res.data.msg !== '返回成功') return (dataSource.value = []);
      dataSource.value = res.data.data.interfaceMsgList;
      console.log(dataSource.value);
      dataSource.value.forEach((item: any) => {
        if (item.interMsgApiType == 0) {
          item.interMsgApiType = '未发布';
        }
        if (item.interMsgApiType == 1) {
          item.interMsgApiType = '已发布';
        }
        if (item.interMsgApiType == 2) {
          item.interMsgApiType = '已停用';
        }
        if (item.interMsgSource == 0) {
          item.interMsgSource = '数据服务';
        }
        if (item.interMsgSource == 1) {
          item.interMsgSource = '指标管理';
        }
        if (item.interMsgSource == 2) {
          item.interMsgSource = '决策引擎';
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
      if (res.data.msg == '删除成功') {
        dataSource.value = dataSource.value.filter((item: any) => item.interMsgId !== code);
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
    console.log(codeId);

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

  // 全选/反选
  const Selectall_invert = ref([]);
  const rowSelection = ref({
    checkStrictly: false,
    onChange: (selectedRows: any, record) => {
      Selectall_invert.value = selectedRows;
    },
  });
  // 批量操作
  const ALLonChangecode = (state: number) => {
    if (state === 1) {
      state = 0;
      let length = Selectall_invert.value.length;
      for (let i = 0; i < length; i++) {
        let temp: any = dataSource.value.find((element: any) => element.interMsgId === Selectall_invert.value[i]);
        if (temp.codeType === '已发布') {
          return message.error('已发布状态不可在进行发布');
        }
      }
    }
    if (state === 2) {
      state = 1;
      for (let i = 0; i < Selectall_invert.value.length; i++) {
        let temp: any = dataSource.value.find((element: any) => element.interMsgId === Selectall_invert.value[i]);
        if (temp.codeType == '未发布') return message.error('停用失败，存在未发布的码表！');
      }
      let length = Selectall_invert.value.length;
      for (let i = 0; i < length; i++) {
        let temp: any = dataSource.value.find((element: any) => element.interMsgId === Selectall_invert.value[i]);
        if (temp.codeType === '已停用') {
          return message.error('已停用状态不可在进行停用');
        }
      }
    }
    // let list = Selectall_invert.value;
    let change_array: any = {
      statusType: state,
      interfaceMsgList: Selectall_invert.value,
    };
    if (change_array.length == 0) return message.error('请选择码表进行操作!');
    postDeactivation(change_array).then(function (res: any) {
      console.log(res);
      console.log(change_array);

      if (res.data.code == 100200) {
        message.success('更新成功!');
        selectCodeTable_way();
      } else return message.error('更新失败！');
    });
  };
  // 分页
  // const pageSizeRef = ref(20);
  const total = ref(dataSource.value.length);

  // 改变编码状态 √
  const onChangecode = (interMsgId: number, state: number) => {
    let object_array = {
      statusType: state,
      interfaceMsgList: [interMsgId],
    };
    postDeactivation(object_array).then(function (res: any) {
      console.log(res, 'czc');

      if (res.data.code == 100200) {
        // 有时间前端进行改进 关于重新请求
        message.success('更新成功!');
        selectCodeTable_way();
      }
    });
  };
  //接口测试抽屉
  const showTestDrawer = (record: any) => {
    console.log(333, record);
    // emitter.emit('interfaceTest', record);
  };
  // 人工注册跳转
  const router_link = () => {
    router.push({ name: 'manualregistration' });
  };
</script>

<style lang="less" scoped>
  @import './css/style.less';
</style>
