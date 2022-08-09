<template>
  <div class="all">
    <!-- 左边资产目录区域 -->
    <DataAssetCatalog />
    <!-- 右边数据展示区域 -->
    <div class="right">
      <!-- 搜索区域 -->
      <a-form :model="Search" name="search" autocomplete="off" :style="{ display: 'flex', justifyContent: 'space-between', minWidth: '1290px' }">
        <a-form-item label="标准状态" name="standardType">
          <a-select v-model:value.trim="Search.assetType" :options="standardType_areas" :style="{ minWidth: '100px' }" />
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
        <div class="left1">
          <a-button type="primary" size="small" @click="ALLonChangecode(1)">批量发布</a-button>
          <a-button type="primary" size="small" @click="ALLonChangecode(2)">批量停用</a-button>
        </div>
        <div class="right1">
          <!-- 抽屉区域 -->
          <a-button type="primary" @click="showDrawer('add', {})"> 新增资产表 </a-button>
          <FiveButtons />
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
            <a href="#" @click.prevent="showcode(record)">{{ record.chineseName }}</a>
          </template>
          <template v-if="column.dataIndex === 'englishName'">
            <a href="#" @click.prevent="showcode(record)">{{ record.englishName }}</a>
          </template>
          <template v-if="column.dataIndex === 'operation'">
            <!-- 未发布显示按钮 -->
            <div v-if="record.assetType == '未发布'">
              <a-popconfirm v-if="dataSource.length" title="请确认否发布该码表?" @confirm="onChangecode(record.assetId, 0)">
                <a-button type="primary" size="small">发布</a-button>
              </a-popconfirm>
              <a-button type="primary" size="small" @click="showDrawer('edit', record)">编辑</a-button>
              <a-popconfirm v-if="dataSource.length" title="请确认是否删除该码表?" @confirm="onDelete(record.assetId)">
                <a-button type="primary" size="small">删除</a-button>
              </a-popconfirm>
            </div>
            <!-- 已发布显示按钮 -->
            <div v-if="record.assetType == '已发布'">
              <a-popconfirm v-if="dataSource.length" title="请确认否停用该码表?" @confirm="onChangecode(record.assetId, 1)">
                <a-button type="primary" size="small">停用</a-button>
              </a-popconfirm>
            </div>
            <!-- 已停用显示按钮 -->
            <div v-if="record.assetType == '已停用'">
              <a-popconfirm v-if="dataSource.length" title="请确认否发布该码表?" @confirm="onChangecode(record.assetId, 0)">
                <a-button type="primary" size="small">发布</a-button>
              </a-popconfirm>
              <a-button type="primary" size="small" @click="showDrawer('edit', record)">编辑</a-button>
            </div>
          </template>
        </template>
      </a-table>
      <AssetDetails />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { message } from 'ant-design-vue';
  import type { Ref } from 'vue';
  import { deleteAsset, SelectDataAsset, SelectDirectory, OnChange1 } from '@/api/test/index';
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  import _, { filter, keys } from 'lodash';
  import FiveButtons from './component/index.vue';
  import DataAssetCatalog from './component/DataAssetCatalog.vue';
  import AssetDetails from './component/assetDetails.vue';
  import emitter from '@/utils/bus';
  // import check from './component/assetDetails.vue';

  // 搜索区域
  interface Search {
    chineseName: string;
    englishName: string;
    assetType: string;
    directoryId: string;
  }
  const Search = reactive<Search>({
    chineseName: '',
    englishName: '',
    assetType: '',
    directoryId: '',
  });
  const standardType_areas = [
    { label: '未发布', value: '0' },
    { label: '已发布', value: '1' },
    { label: '已停用', value: '2' },
  ];

  const treeData = ref<any>([]);
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
    emitter.emit('sendchild', sdd);
  };

  const showcode = (record: any) => {
    const sdds = reactive({
      record: record,
    });
    emitter.emit('sendchilds', sdds);
  };

  emitter.on('send', () => {
    selectCodeTable_way();
  });

  emitter.on('sendf', val => {
    Search.directoryId = val;
    selectCodeTable_way();
  });

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
    SelectDataAsset(Search).then(function (res: any) {
      console.log(res);
      if (res.data.msg !== '返回成功') return (dataSource.value = []);
      dataSource.value = res.data.data;
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
  // 重置

  const Reset = () => {
    Search.chineseName = '';
    Search.englishName = '';
    Search.assetType = '';
    Search.directoryId = '';
    const sdsd = ref({
      keys: [],
    });
    emitter.emit('reset', sdsd.value);
    selectCodeTable_way();
  };
  // 查询按钮
  const query = () => {
    selectCodeTable_way();
  };

  //删除按钮  √
  const onDelete = codeId => {
    deleteAsset(codeId).then(function (res: any) {
      console.log(res);
      dataSource.value = dataSource.value.filter((item: any) => item.assetId !== codeId);
    });
  };

  // 全选/反选
  const Selectall_invert = ref([]);
  const rowSelection = ref({
    checkStrictly: false,
    onChange: (selectedRows: any) => {
      Selectall_invert.value = selectedRows;
      console.log(selectedRows);
    },
  });
  // 批量操作
  const ALLonChangecode = (state: number) => {
    if (state === 1) {
      state = 0;
      let length = Selectall_invert.value.length;
      for (let i = 0; i < length; i++) {
        let temp: any = dataSource.value.find((element: any) => element.assetId === Selectall_invert.value[i]);
        if (temp.codeType === '已发布') {
          return message.error('已发布状态不可在进行发布');
        }
      }
    }
    if (state === 2) {
      state = 1;
      for (let i = 0; i < Selectall_invert.value.length; i++) {
        let temp: any = dataSource.value.find((element: any) => element.assetId === Selectall_invert.value[i]);
        if (temp.codeType == '未发布') return message.error('停用失败，存在未发布的码表！');
      }
      let length = Selectall_invert.value.length;
      for (let i = 0; i < length; i++) {
        let temp: any = dataSource.value.find((element: any) => element.assetId === Selectall_invert.value[i]);
        if (temp.codeType === '已停用') {
          return message.error('已停用状态不可在进行停用');
        }
      }
    }
    // let list = Selectall_invert.value;
    let change_array: any = {
      statusType: state,
      assetList: Selectall_invert.value,
    };
    if (change_array.length == 0) return message.error('请选择码表进行操作!');
    OnChange1(change_array).then(function (res: any) {
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
  const onChangecode = (assetId: number, state: number) => {
    let object_array = {
      statusType: state,
      assetList: [assetId],
    };
    OnChange1(object_array).then(function (res: any) {
      console.log(res, 'czc');

      if (res.data.code == 100200) {
        // 有时间前端进行改进 关于重新请求
        message.success('更新成功!');
        selectCodeTable_way();
      }
    });
  };
</script>

<style lang="less" scoped>
  @import './style.less';
</style>
