<template>
  <!-- 搜索区域 -->
  <div class="all">
    <div class="search">
      <!-- 搜索区域 -->
      <a-form :model="Search" name="search" autocomplete="off" :style="{ display: 'flex', justifyContent: 'space-between', minWidth: '1290px' }">
        <a-form-item label="标准状态" name="standardType">
          <a-select v-model:value.trim="Search.standardType" :options="standardType_areas" :style="{ minWidth: '100px' }" />
        </a-form-item>
        <a-form-item label="数据库名称" name="standardId">
          <a-input v-model:value.trim="Search.standardId" />
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
  <a-table
    :data-source="dataSource"
    :columns="columns"
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
      <template v-if="column.dataIndex === 'operation'">
        <!-- 未发布显示按钮 -->
        <div v-if="record.databaseState == '未发布'">
          <a-button type="primary" size="small">连通测试</a-button>
          <a-popconfirm v-if="dataSource.length" title="请确认否发布该码表?">
            <a-button type="primary" size="small">发布</a-button>
          </a-popconfirm>
          <a-button type="primary" size="small" @click="showDrawer('edit', record)">编辑</a-button>
          <a-popconfirm v-if="dataSource.length" title="请确认是否删除该码表?">
            <a-button type="primary" size="small">删除</a-button>
          </a-popconfirm>
        </div>
        <!-- 已发布显示按钮 -->
        <div v-if="record.databaseState == '已发布'">
          <a-button type="primary" size="small">连通测试</a-button>
          <a-popconfirm v-if="dataSource.length" title="请确认否发布该码表?">
            <a-button type="primary" size="small">停用</a-button>
          </a-popconfirm>
        </div>
        <!-- 已停用显示按钮 -->
        <div v-if="record.databaseState == '已停用'">
          <a-button type="primary" size="small">连通测试</a-button>
          <a-popconfirm v-if="dataSource.length" title="请确认否发布该码表?">
            <a-button type="primary" size="small">发布</a-button>
          </a-popconfirm>
          <a-button type="primary" size="small" @click="showDrawer('edit', record)">编辑</a-button>
        </div>
      </template>
    </template>
  </a-table>
</template>
<script lang="ts" setup>
  import { QueryAdministration } from '@/api/test/index';
  import { ref } from 'vue';
  import type { Ref } from 'vue';
  import AddDataSrc from './component/addDataSrc.vue';
  import emitter from '@/utils/bus';

  // 搜索区域
  interface Search {
    standardType: string;
    standardId: string;
  }
  const Search = reactive<Search>({
    standardType: '',
    standardId: '',
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
    });
  };

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

      sorter: {
        compare: (a: any, b: any) => a.updateTime - b.updateTime,
        multiple: 1,
      },
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: '20%',
    },
  ];

  const visible = ref<boolean>(false);

  const showDrawer = (type: string, record: any) => {
    const sdd = reactive({
      type: type,
      record: record,
      visible: visible,
    });
    // Add();
    emitter.emit('sendchild', sdd);
  };

  show();
  // 重置
  const Reset = () => {
    Search.standardId = '';
    Search.standardType = '';
    show();
  };
  // 查询按钮
  const query = () => {
    show();
  };
</script>

<style lang="less" scoped>
  @import './style.less';
</style>
