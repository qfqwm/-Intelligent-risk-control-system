<template>
  <!-- 搜索区域 -->
  <a-form :model="Search" name="search" autocomplete="off" :style="{ display: 'flex', justifyContent: 'space-between', minWidth: '1290px' }">
    <a-form-item label="来源机构" name="sourceAgencies">
      <a-select v-model:value.trim="Search.sourceAgencies" :options="standardType_sourceAgencies" :style="{ minWidth: '130px' }" />
    </a-form-item>
    <a-form-item label="标准状态" name="standardType">
      <a-select v-model:value.trim="Search.standardType" :options="standardType_areas" :style="{ minWidth: '100px' }" />
    </a-form-item>
    <a-form-item label="标准编号" name="standardId">
      <a-input v-model:value.trim="Search.standardId" />
    </a-form-item>
    <a-form-item label="中文名称：" name="chineseName">
      <a-input v-model:value.trim="Search.chineseName" />
    </a-form-item>
    <a-form-item label="英文名称：" name="englishName">
      <a-input v-model:value.trim="Search.englishName" />
    </a-form-item>
    <a-form-item>
      <a-button class="Reset" :style="{ marginRight: '10px' }" @click="Reset">重置</a-button>
      <a-button class="query" @click="query">查询</a-button>
    </a-form-item>
  </a-form>
  <!-- 五个按钮区域 -->
  <div class="button">
    <div class="left">
      <a-button type="primary" size="small" @click="ALLChangeup">批量发布</a-button>
      <a-button type="primary" size="small" @click="ALLChangestop">批量停用</a-button>
    </div>
    <div class="right">
      <a-button type="primary" size="small">导入模板下载</a-button>
      <a-button type="primary" size="small">标准导入</a-button>
      <a-button type="primary" size="small" @click="showDrawer('add', null)">新增标准</a-button>
    </div>
  </div>
  <!-- 表格区域 -->
  <a-table :data-source="dataSource" :columns="columns" :row-selection="rowSelection" :style="{ width: '100%', minWidth: '1290px' }" :pagination="pagination" :row-key="Record_selection">
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'codeId'">
        <a href="#" @click.prevent="showModal(record.standardId)">{{ record.standardId }}</a>
      </template>
      <template v-if="column.dataIndex === 'operation'">
        <!-- 未发布显示按钮 -->
        <div v-if="record.standardType == '未发布'">
          <a-popconfirm v-if="dataSource.length" title="请确认否发布该标准?" @confirm="release(record.standardId)">
            <a-button type="primary" size="small">发布</a-button>
          </a-popconfirm>
          <a-button type="primary" size="small" @click="showDrawer('edit', record.standardId)">编辑</a-button>
          <a-popconfirm v-if="dataSource.length" title="请确认否删除该标准?" @confirm="delete_code(record.standardId)">
            <a-button type="primary" size="small">删除</a-button>
          </a-popconfirm>
        </div>
        <!-- 已发布显示按钮 -->
        <div v-if="record.standardType == '已发布'">
          <a-popconfirm v-if="dataSource.length" title="请确认否停用该标准?" @confirm="Deactivate(record.standardId)">
            <a-button type="primary" size="small">停用</a-button>
          </a-popconfirm>
        </div>
        <!-- 已停用显示按钮 -->
        <div v-if="record.standardType == '已停用'">
          <a-popconfirm v-if="dataSource.length" title="请确认否发布该标准?" @confirm="release(record.standardId)">
            <a-button type="primary" size="small">发布</a-button>
          </a-popconfirm>
          <a-button type="primary" size="small" @click="showDrawer('edit', record.standardId)">编辑</a-button>
        </div>
      </template>
    </template>
  </a-table>
  <!-- 新增/编辑组件 -->
  <AddEditVue :add_edit_type="add_edit_type" :add-edit-standard-id="add_edit_standardId" :show-drawer-number="showDrawer_number"> </AddEditVue>
  <!-- 显示详情组件 -->
  <DisplayDetails :to-standard-id="to_standardId" :details_number="details_number"> </DisplayDetails>
</template>

<script lang="ts" setup>
  import { message } from 'ant-design-vue';
  import { Catalog, PublishStandard, Delete_Standard, BlockStandard } from '@/api/test/index';
  import AddEditVue from './component/AddEdit';
  import DisplayDetails from './component/DisplayDetails';
  import { ref, reactive } from 'vue';
  import type { Ref } from 'vue';
  interface DataItem {
    chineseName: string;
    creatTime: string;
    dataDefault: string;
    dataLength: any;
    dataMax: string;
    dataMin: string;
    dataPrecision: any;
    dataRange: string;
    dataType: string;
    del: number;
    englishName: string;
    enumRange: any;
    isNull: string;
    sourceAgencies: string;
    standardExplain: string;
    standardId: string;
    standardType: string;
    updateTime: string;
  }
  // 搜索区域
  interface Search {
    standardId: string;
    chineseName: string;
    englishName: string;
    standardType: string;
    sourceAgencies: string;
  }
  const Search = reactive<Search>({
    standardId: '',
    chineseName: '',
    englishName: '',
    standardType: '',
    sourceAgencies: '',
  });
  const standardType_areas = [
    // 未发布查询出全部数据
    { label: '未发布', value: '0' },
    { label: '已发布', value: '1' },
    { label: '已停用', value: '2' },
  ];
  const standardType_sourceAgencies = [
    { label: '数宜信', value: '数宜信' },
    { label: '哈哈哈', value: '哈哈哈' },
  ];
  // 表格分页区
  const pagination = {
    pageSizeOptions: ['10', '15', '18', '20'],
    showTotal: (total: any) => `共 ${total} 条`,
    showSizeChanger: true,
    defaultPageSize: 20,
    buildOptionText: (size: any) => {
      return Number(size.value) + ' 项' + '/' + '页';
    },
  };
  const Record_selection = (dataSource: any) => {
    return dataSource.standardId;
  };

  // 新增-编辑
  const add_edit_type = ref<string>('');
  const add_edit_standardId = ref<string>('');
  // 定义调用次数
  const showDrawer_number = ref<number>(0);
  const showDrawer = (type: string, standardId: any) => {
    add_edit_type.value = type;
    add_edit_standardId.value = standardId;
    showDrawer_number.value++;
  };

  // 记录数据全部中、英文名
  const morechinese_Name = ref<any>([]);
  const moreenglish_Name = ref<any>([]);

  // 请求表格标准数据
  const dataSource: Ref<DataItem[]> = ref([]);
  const Getdata = function () {
    Catalog(Search).then(function (res) {
      dataSource.value = res.data.data;
      let chinesemorename = [] as any;
      let englishmorename = [] as any;
      for (let i = 0; i < dataSource.value.length; i++) {
        chinesemorename.push(res.data.data[i].chineseName);
        englishmorename.push(res.data.data[i].englishName);
      }
      // 提出数据中所有中文、英文名称
      morechinese_Name.value = [...new Set(chinesemorename)];
      moreenglish_Name.value = [...new Set(englishmorename)];
      dataSource.value.forEach((item: any) => {
        if (item.standardType == 0) {
          item.standardType = '未发布';
        }
        if (item.standardType == 1) {
          item.standardType = '已发布';
        }
        if (item.standardType == 2) {
          item.standardType = '已停用';
        }
        if (item.dataType == 1) {
          item.dataType = 'Int';
        }
        if (item.dataType == 2) {
          item.dataType = 'Float';
        }
        if (item.dataType == 3) {
          item.dataType = 'Enum';
        }
        if (item.dataType == 4) {
          item.dataType = 'String';
        }
      });
    });
  };
  // 表格头部
  const columns = [
    {
      title: '标准编号',
      dataIndex: 'codeId',
      width: '9%',
      ellipsis: true,
    },
    {
      title: '中文名称',
      dataIndex: 'chineseName',
      width: '9%',
      ellipsis: true,
    },
    {
      title: '英文名称',
      dataIndex: 'englishName',
      width: '12%',
      ellipsis: true,
    },
    {
      title: '标准说明',
      dataIndex: 'standardExplain',
      width: '18%',
      ellipsis: true,
    },
    {
      title: '来源机构',
      dataIndex: 'sourceAgencies',
      width: '8%',
      ellipsis: true,
    },
    {
      title: '数据类型',
      dataIndex: 'dataType',
      width: '8%',
      ellipsis: true,
    },
    {
      title: '标准状态',
      dataIndex: 'standardType',
      width: '8%',
      ellipsis: true,
    },
    {
      title: '更新日期',
      dataIndex: 'updateTime',
      width: '12%',
      ellipsis: true,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: '180px',
    },
  ];

  // 查询功能
  Getdata();
  const Reset = () => {
    Search.sourceAgencies = '';
    Search.standardType = '';
    Search.standardId = '';
    Search.chineseName = '';
    Search.englishName = '';
  };
  const query = () => {
    Getdata();
  };
  // 发布
  const release = (id: string) => {
    let arr = [id];
    PublishStandard(arr).then(function (res) {
      if (res.data.msg == '返回成功') {
        message.success('状态修改成功');
      }
      query();
    });
  };
  // 删除
  const delete_code = (id: string) => {
    Delete_Standard(id).then(function (res) {
      if (res.data.msg == '返回成功') {
        message.success('状态修改成功');
      }
      query();
    });
  };
  // 停用
  const Deactivate = (id: string) => {
    let arr = [id];
    BlockStandard(arr).then(function (res) {
      if (res.data.msg == '返回成功') {
        message.success('状态修改成功');
      }
      query();
    });
  };
  // 批量操作
  const Selectall_invert = ref([]);
  const rowSelection = ref({
    checkStrictly: false,
    onChange: (selectedRows: any) => {
      Selectall_invert.value = selectedRows;
    },
  });
  const ALLChangeup = () => {
    let arr = [];
    Selectall_invert.value.forEach(item => {
      arr.push(item);
    });
    PublishStandard(arr).then(function (res) {
      if (res.data.msg == '存在已发布数据，请重新勾选数据') return message.error('已经发布的标准不能在发送哟');
      if (res.data.msg == '返回成功') {
        message.success('状态修改成功');
      }
      query();
    });
  };
  const ALLChangestop = () => {
    let arr = [];
    Selectall_invert.value.forEach(item => {
      arr.push(item);
    });
    BlockStandard(arr).then(function (res) {
      if (res.data.msg == '存在已停用数据或未发布数据，请重新勾选数据') return message.error('已经停用的标准不能在发送哟，或则存在未发布的数据');
      if (res.data.msg == '返回成功') {
        message.success('状态修改成功');
      }
      query();
    });
  };
  // 显示详情
  const details_number = ref<number>(0);
  const to_standardId = ref('');
  const showModal = (standardId: string) => {
    details_number.value++;
    to_standardId.value = standardId;
  };
</script>
<style lang="less" scoped>
  @import './style.less';
</style>
