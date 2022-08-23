<template>
  <!-- 搜索区域 -->
  <div class="all">
    <div class="search">
      <!-- 搜索区域 -->
      <a-form :model="Search" name="search" autocomplete="off" :style="{ display: 'flex', justifyContent: 'space-around', Width: '100%' }">
        <a-form-item label="标准状态" name="databaseState">
          <a-select v-model:value.trim="Search.databaseState" :options="standardType_areas" :style="{ minWidth: '100px' }" />
        </a-form-item>
        <a-form-item label="数据库名称" name="driverName">
          <a-input v-model:value.trim="Search.sourceName" />
        </a-form-item>
        <a-form-item>
          <a-button class="Reset" :style="{ marginRight: '10px' }" @click="Reset">重置</a-button>
          <a-button class="query" @click="query">查询</a-button>
        </a-form-item>
      </a-form>
    </div>
    <div class="right">
      <div>数据列表</div>
      <a-button type="primary" @click="showDrawer('add', {})">新增数据源</a-button>
    </div>
    <AddDataSrc></AddDataSrc>
  </div>

  <!-- 表格区域 -->
  <a-table :data-source="dataSource" :columns="columns" :pagination="paginationOpt">
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'operation'">
        <!-- 未发布显示按钮 -->
        <div v-if="record.databaseState == '未发布'">
          <a-button type="primary" size="small" @click="Connectivity(record)">连通测试</a-button>
          <a-popconfirm v-if="dataSource.length" title="请确认否发布该码表?" @confirm="change('publish', record)">
            <a-button type="primary" size="small">发布</a-button>
          </a-popconfirm>
          <a-button type="primary" size="small" @click="showDrawer('edit', record)">编辑</a-button>
          <a-popconfirm v-if="dataSource.length" title="请确认是否删除该码表?" @confirm="del(record)">
            <a-button type="primary" size="small">删除</a-button>
          </a-popconfirm>
        </div>
        <!-- 已发布显示按钮 -->
        <div v-if="record.databaseState == '已发布'">
          <a-button type="primary" size="small" @click="Connectivity(record)">连通测试</a-button>
          <a-popconfirm v-if="dataSource.length" title="请确认否停用该码表?" @confirm="change('Deactivate', record)">
            <a-button type="primary" size="small">停用</a-button>
          </a-popconfirm>
        </div>
        <!-- 已停用显示按钮 -->
        <div v-if="record.databaseState == '已停用'">
          <a-button type="primary" size="small" @click="Connectivity(record)">连通测试</a-button>
          <a-popconfirm v-if="dataSource.length" title="请确认否发布该码表?" @confirm="change('publish', record)">
            <a-button type="primary" size="small">发布</a-button>
          </a-popconfirm>
          <a-button type="primary" size="small" @click="showDrawer('edit', record)">编辑</a-button>
        </div>
      </template>
    </template>
  </a-table>
</template>
<script lang="ts" setup>
  import { QueryAdministration, ModifyBatabase, ConnectivityTest, DeleteDatabase } from '@/api/test/index';
  import { ref } from 'vue';
  import type { Ref } from 'vue';
  import AddDataSrc from './component/addDataSrc.vue';
  import emitter from '@/utils/bus';
  import { message } from 'ant-design-vue';
  emitter.on('send', () => {
    show();
  });

  const forms = ref();
  emitter.on('sendchildod', (t: any) => {
    forms.value = t.form;
    Connectivity(forms.value);
  });

  // 搜索区域
  interface Search {
    sourceName: string;
    databaseState: string;
    pageNum: string;
    pageSize: string;
  }
  const Search = reactive<Search>({
    databaseState: '',
    sourceName: '',
    pageNum: '',
    pageSize: '',
  });
  const standardType_areas = [
    // 未发布查询出全部数据
    { label: '未发布', value: '0' },
    { label: '已发布', value: '1' },
    { label: '已停用', value: '2' },
  ];

  interface DataItem {
    countId: any;
    current: number;
    maxLimit: any;
    optimizeCountSql: any;
    orders: [];
    pages: number;
    records: [];
    searchCount: any;
    size: number;
    total: number;
  }

  //页面数据展示
  const dataSource: Ref<DataItem[]> = ref([]);
  const show = function () {
    Search.pageNum = paginationOpt.defaultCurrent as any;
    Search.pageSize = paginationOpt.defaultPageSize as any;
    QueryAdministration(Search).then(function (res) {
      console.log(res.data.data, 'dsad');
      dataSource.value = res.data.data.records;
      dataSource.value.forEach((item: any) => {
        if (item.databaseState == 0) {
          item.databaseState = '未发布';
        }
        if (item.databaseState == 1) {
          item.databaseState = '已发布';
        }
        if (item.databaseState == 2) {
          item.databaseState = '已停用';
        }
      });
      paginationOpt.total = res.data.data.total;
    });
  };

  // 分页
  const paginationOpt = reactive({
    defaultCurrent: 1, // 默认当前页数
    defaultPageSize: 20, // 默认当前页显示数据的大小
    total: 0, // 总数，必须先有
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: ['5', '10', '15', '20'],
    showTotal: (total: any) => `共 ${total} 条`, // 显示总数
    onShowSizeChange: (current: any, pageSize: number) => {
      paginationOpt.defaultCurrent = current;
      paginationOpt.defaultPageSize = pageSize;
      Search.pageNum = current;
      Search.pageSize = pageSize as any;
      show(); //显示列表的接口名称
    },
    // 改变每页数量时更新显示
    onChange: (current: any, size: any) => {
      paginationOpt.defaultCurrent = current;
      paginationOpt.defaultPageSize = size;
      Search.pageNum = current;
      Search.pageSize = size;
      show();
    },
  });

  const columns = [
    {
      title: '数据源名称',
      dataIndex: 'sourceName',
      width: '10%',
    },
    {
      title: '数据库类型',
      dataIndex: 'databaseType',
      width: '10%',
    },
    {
      title: '数据源描述',
      dataIndex: 'sourceDescription',
      width: '15%',
    },
    {
      title: '连接信息',
      dataIndex: 'connectMessage',
      width: '15%',
    },
    {
      title: '应用状态',
      dataIndex: 'databaseState',
      width: '10%',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      width: '15%',
      key: 'updateTime',
      //排序方法
      sorter: (a, b) => {
        let aTime = new Date(a.updateTime).getTime();
        let bTime = new Date(b.updateTime).getTime();
        return aTime - bTime;
      },
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: '20%',
    },
  ];

  //抽屉开关
  const visible = ref<boolean>(false);

  //事件总线（数据传给子组件）
  const showDrawer = (type: string, record: any) => {
    const sdd = reactive({
      type: type,
      record: record,
      visible: visible,
    });
    emitter.emit('sendchild', sdd);
  };

  show();
  // 重置
  const Reset = () => {
    Search.sourceName = '';
    Search.databaseState = '';
    show();
  };
  // 查询按钮
  const query = () => {
    show();
  };

  //改变状态需要的数据
  const changestatus = reactive({
    statusType: '',
    databaseList: [],
  });

  //封装改变状态的方法
  const method = (record: any) => {
    changestatus.databaseList = [];
    changestatus.databaseList.push(record.databaseId);
    ModifyBatabase(changestatus).then(function (res) {
      if (res.data.code == 100200) {
        message.success('更新成功!');
        show();
      } else return message.error('更新失败！');
    });
  };

  //改变状态
  const change = (type: string, record: any) => {
    console.log(record.databaseId);
    if (type == 'publish') {
      changestatus.statusType = '0';
      method(record);
    }
    if (type == 'Deactivate') {
      changestatus.statusType = '1';
      method(record);
    }
  };

  const datas = reactive({
    databaseType: '',
    sourceName: '',
    sourceDescription: '',
    connectMessage: '',
    driverName: '',
    username: '',
    password: '',
  });

  //连通测试
  const Connectivity = (record: any) => {
    // console.log(record);
    Object.keys(datas).forEach(function (key) {
      datas[key] = record[key];
    });
    ConnectivityTest(datas).then(function (res) {
      if (res.data.code == 100200) {
        message.success(res.data.msg);
        show();
      } else return message.error(res.data.msg);
    });
  };

  //删除
  const del = (record: any) => {
    DeleteDatabase(record.databaseId).then(function (res) {
      if (res.data.code == 100200) {
        message.success(res.data.msg);
        show();
      } else return message.error(res.data.msg);
    });
  };
</script>

<style lang="less" scoped>
  @import './style.less';
</style>
