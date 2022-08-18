<!-- eslint-disable vue/v-on-event-hyphenation -->
<template>
  <!-- 搜索区域 -->
  <a-form :model="Search" name="search" autocomplete="off" :style="{ display: 'flex', justifyContent: 'space-around', minWidth: '100%' }">
    <a-form-item label="来源机构" name="sourceAgencies">
      <a-select v-model:value.trim="Search.sourceAgencies" :options="standardType_sourceAgencies" :style="{ minWidth: '130px' }" placeholder="请选择" />
    </a-form-item>
    <a-form-item label="标准状态" name="standardType">
      <a-select v-model:value.trim="Search.standardType" :options="standardType_areas" :style="{ minWidth: '100px' }" placeholder="请选择" />
    </a-form-item>
    <a-form-item label="标准编号" name="standardId">
      <a-input v-model:value.trim="Search.standardId" placeholder="请输入" />
    </a-form-item>
    <a-form-item label="中文名称：" name="chineseName">
      <a-input v-model:value.trim="Search.chineseName" placeholder="请输入" />
    </a-form-item>
    <a-form-item label="英文名称：" name="englishName">
      <a-input v-model:value.trim="Search.englishName" placeholder="请输入" />
    </a-form-item>
    <a-form-item>
      <a-button class="Reset" :style="{ marginRight: '10px' }" @click="Reset">重置</a-button>
      <a-button class="query" @click="query">查询</a-button>
    </a-form-item>
  </a-form>
  <!-- 五个按钮区域 -->
  <div class="button">
    <div class="left">
      <a-button type="primary" :disabled="PublishBatch" size="small" @click="updateStandardType(Selectall_invert, '1')">批量发布</a-button>
      <a-button type="primary" :disabled="DeactivateBatch" size="small" @click="updateStandardType(Selectall_invert, '2')">批量停用</a-button>
    </div>
    <div class="right">
      <a-button type="primary" size="small">导入模板下载</a-button>
      <a-button type="primary" size="small">标准导入</a-button>
      <a-button type="primary" size="small" @click="showDrawer('add')">新增标准</a-button>
    </div>
  </div>
  <!-- 表格区域 -->
  <a-table :data-source="dataSource" :columns="columns" :row-selection="rowSelection" :style="{ width: '100%' }" :pagination="pagination" :row-key="Record_selection">
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'codeId'">
        <a href="#" @click.prevent="showModal(record.standardId)">{{ record.standardId }}</a>
      </template>
      <template v-if="column.dataIndex === 'operation'">
        <!-- 未发布显示按钮 -->
        <div v-if="record.standardType == '未发布'">
          <a-popconfirm v-if="dataSource.length" title="请确认否发布该标准?" @confirm="updateStandardType(record.standardId, '1')">
            <a-button type="primary" size="small">发布</a-button>
          </a-popconfirm>
          <a-button type="primary" size="small" @click="showDrawer('edit', record.standardId)">编辑</a-button>
          <a-popconfirm v-if="dataSource.length" title="请确认否删除该标准?" @confirm="delete_code(record.standardId)">
            <a-button type="primary" size="small">删除</a-button>
          </a-popconfirm>
        </div>
        <!-- 已发布显示按钮 -->
        <div v-if="record.standardType == '已发布'">
          <a-popconfirm v-if="dataSource.length" title="请确认否停用该标准?" @confirm="updateStandardType(record.standardId, '2')">
            <a-button type="primary" size="small">停用</a-button>
          </a-popconfirm>
        </div>
        <!-- 已停用显示按钮 -->
        <div v-if="record.standardType == '已停用'">
          <a-popconfirm v-if="dataSource.length" title="请确认否发布该标准?" @confirm="updateStandardType(record.standardId, '1')">
            <a-button type="primary" size="small">发布</a-button>
          </a-popconfirm>
          <a-button type="primary" size="small" @click="showDrawer('edit', record.standardId)">编辑</a-button>
        </div>
      </template>
    </template>
  </a-table>
  <!-- 新增/编辑组件 -->
  <AddEditVue :add_edit_type="add_edit_type" :add_edit_standardid="add_edit_standardId" :show_drawer_number="showDrawer_number" @Getdata="Getdata()"> </AddEditVue>
  <!-- 显示详情组件 -->
  <DisplayDetails :to_standardid="to_standardId" :details_number="details_number"> </DisplayDetails>
</template>

<script lang="ts" setup>
  import { message } from 'ant-design-vue';
  import { Catalog, Delete_Standard, update_StandardType } from '@/api/test/index';
  import AddEditVue from './component/AddEdit.vue';
  import DisplayDetails from './component/DisplayDetails.vue';
  import { ref, reactive } from 'vue';
  import type { Ref } from 'vue';

  // 定义后端数据字段类型
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
    standardType: string | undefined;
    sourceAgencies: string | undefined;
  }
  const Search = reactive<Search>({
    standardId: '',
    chineseName: '',
    englishName: '',
    standardType: undefined,
    sourceAgencies: undefined,
  });
  const standardType_areas = [
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
  //返回绑定的id
  const Record_selection = (dataSource: any) => {
    return dataSource.standardId;
  };

  // 新增-编辑
  const add_edit_type = ref<string>('');
  const add_edit_standardId = ref<string | undefined>('');
  // 定义调用次数
  const showDrawer_number = ref<number>(0);
  const showDrawer = (type: string, standardId?: any) => {
    add_edit_type.value = type;
    add_edit_standardId.value = standardId;
    showDrawer_number.value++;
  };

  // 请求表格标准数据
  const dataSource: Ref<DataItem[]> = ref([]);
  const Getdata = function () {
    Catalog(Search).then(function (res) {
      dataSource.value = res.data.data;

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
      key: 'updateTime',
      //排序方法
      sorter: (a: { updateTime: string | number | Date }, b: { updateTime: string | number | Date }) => {
        let aTime = new Date(a.updateTime).getTime();
        let bTime = new Date(b.updateTime).getTime();
        return aTime - bTime;
      },
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: '180px',
    },
  ];

  // 查询功能
  Getdata();
  //重置
  const Reset = () => {
    Object.keys(Search).forEach((item: any) => {
      Search[item] = '';
    });
    Search.sourceAgencies = undefined;
    Search.standardType = undefined;
    Getdata();
  };
  //查询
  const query = () => {
    Getdata();
  };
  // 删除
  const delete_code = (id: string) => {
    Delete_Standard(id).then(function (res) {
      if (res.data.msg == '返回成功') {
        message.success('状态修改成功');
      } else return message.error(res.data.msg);
      query();
    });
  };

  //批量按钮操作
  const PublishBatch = ref<boolean>(true); //发布按钮禁用
  const DeactivateBatch = ref<boolean>(true); //停用按钮禁用
  // 批量操作
  const Selectall_invert = ref([]);
  const FilterData = ref([]) as any; //通过id过滤获取数据，做按钮禁用条件
  const rowSelection = computed(() => {
    return {
      checkStrictly: false,
      selectedRowKeys: Selectall_invert,
      onChange: (selectedRows: any) => {
        Selectall_invert.value = selectedRows;
        FilterData.value = [];
        dataSource.value.forEach((item: any) => {
          if (selectedRows.indexOf(item.standardId) !== -1) {
            FilterData.value.push(item.standardType);
          }
        });

        if (
          FilterData.value.findIndex(item => {
            return item === '已发布';
          }) != -1
        ) {
          PublishBatch.value = true;
        } else {
          PublishBatch.value = false;
        }
        if (
          FilterData.value.findIndex(item => {
            return item === '未发布' || item === '已停用';
          }) != -1
        ) {
          DeactivateBatch.value = true;
        } else {
          DeactivateBatch.value = false;
        }
      },
    };
  });
  // 更新状态
  const updateStandardType = (id: any, mode: string) => {
    let arr: any = [];
    if (typeof id === 'string') {
      arr.push(id);
    } else {
      arr = [...id];
    }
    const updateStandardType_object = {
      statusType: mode,
      dataStandardList: arr,
    };
    update_StandardType(updateStandardType_object).then(function (res) {
      if (res.data.msg == '返回成功') {
        message.success('状态修改成功');
        if (typeof id === 'object') Selectall_invert.value = [];
        query();
      } else message.error(res.data.msg);
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
