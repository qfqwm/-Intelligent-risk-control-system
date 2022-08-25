<template>
  <div class="all">
    <!-- 左边资产目录区域 -->
    <DataAssetCatalog />
    <!-- 右边数据展示区域 -->
    <div class="right">
      <!-- 搜索区域 -->
      <a-form :model="Search" name="search" autocomplete="off" :style="{ display: 'flex', justifyContent: 'space-around', Width: '100%' }">
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
          <a-button type="primary" size="small" :disabled="PublishBatch" @click="ALLonChangecode(1)">批量发布</a-button>
          <a-button type="primary" size="small" :disabled="DeactivateBatch" @click="ALLonChangecode(2)">批量停用</a-button>
        </div>
        <div class="right1">
          <!-- 抽屉区域 -->
          <a-button type="primary" size="small" @click="showDrawer('add', {})"> 新增资产表 </a-button>
          <FiveButtons />
        </div>
      </div>

      <!-- 表格区域 -->
      <a-table :data-source="dataSource" :columns="columns" :row-selection="rowSelection" :row-key="(dataSource: any) => { return dataSource.assetId }" :pagination="pagination">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'chineseName'">
            <a href="#" @click.prevent="showcode('chinese', record)">{{ record.chineseName }}</a>
          </template>
          <template v-if="column.dataIndex === 'englishName'">
            <a href="#" @click.prevent="showcode('english', record)">{{ record.englishName }}</a>
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

  interface DataItem {
    key: string;
    assetId: string;
    chineseName: string;
    englishName: string;
    assetType: any;
    creatTime: string;
    updateTime: string;
    allCodeTable: object;
  }
  interface Search {
    chineseName: string;
    englishName: string;
    assetType: string;
    directoryId: string;
    pageNum: number;
    pageSize: number;
  }

  // 搜索区域
  const Search = reactive<Search>({
    chineseName: '',
    englishName: '',
    assetType: '',
    directoryId: '',
    pageNum: 1,
    pageSize: 20,
  });
  const standardType_areas = [
    { label: '未发布', value: '0' },
    { label: '已发布', value: '1' },
    { label: '已停用', value: '2' },
  ];
  //从后端获取资产目录表的数据
  const treeData = ref<any>([]);
  SelectDirectory().then(res => {
    treeData.value = res.data.data;
  });
  //抽屉开关按钮
  const visible = ref<boolean>(false);
  //点击事件，用事件总线将数据传给子组件，打开抽屉
  const showDrawer = (type: string, record: any) => {
    const sdd = reactive({
      type: type,
      record: record,
      visible: visible,
      treeData: treeData,
    });
    emitter.emit('sendchild', sdd);
  };
  //查看详情，传数据给子组件
  const showcode = (type: any, record: any) => {
    const sdds = reactive({
      type: type,
      record: record,
    });
    emitter.emit('sendchilds', sdds);
  };
  //新增编辑页面调用主页面的方法
  emitter.on('send', () => {
    selectCodeTable_way();
  });
  //点击资产目录表目录进行页面数据查询
  emitter.on('sendf', val => {
    Search.directoryId = val as any;
    selectCodeTable_way();
  });
  // 表格
  const columns = [
    {
      title: '数据资产表中文名称',
      dataIndex: 'chineseName',
      ellipsis: true,
    },
    {
      title: '数据资产表英文名称',
      dataIndex: 'englishName',
      ellipsis: true,
    },
    {
      title: '数据资产表描述',
      dataIndex: 'assetExplain',
      ellipsis: true,
    },
    {
      title: '发布状态',
      dataIndex: 'assetType',
      ellipsis: true,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
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
      ellipsis: true,
    },
  ];

  const dataSource: Ref<DataItem[]> = ref([]);
  // 调用接口加载表格
  const selectCodeTable_way = () => {
    SelectDataAsset(Search).then(function (res: any) {
      if (res.data.code !== 100200) return (dataSource.value = []);
      dataSource.value = res.data.data.list;
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
      total.value = res.data.data.total;
    });
  };

  // 表格分页区
  const total = ref<number>();
  const current = ref<number>();
  const pageSize = ref<number>(20);
  const pagination = computed(() => ({
    total: total.value, //数据总和
    current: current.value, //当前页数
    pageSize: pageSize.value, //每页条数
    showTotal: (total: any) => `总共 ${total} 项`,
    pageSizeOptions: ['5', '10', '15', '20'],
    showSizeChanger: true,
    showQuickJumper: true,
    buildOptionText: (size: any) => {
      return Number(size.value) + ' 项/页';
    },
    onChange: (cur: any, size: any) => {
      current.value = cur;
      pageSize.value = size;
      Search.pageNum = cur;
      Search.pageSize = size;
      selectCodeTable_way();
    },
  }));

  selectCodeTable_way();
  // 重置
  const Reset = () => {
    Search.chineseName = '';
    Search.englishName = '';
    Search.assetType = '';
    Search.directoryId = '';
    //点击重置，将资产目录表的高亮显示取消（事件总线传值）
    const sdsd = ref({
      keys: [],
    });
    emitter.emit('reset', sdsd.value);
    Search.pageNum = 1;
    current.value = 1;
    selectCodeTable_way();
  };
  // 查询按钮
  const query = () => {
    Search.pageNum = 1;
    current.value = 1;
    selectCodeTable_way();
  };

  //删除按钮  √
  const onDelete = (codeId: any) => {
    deleteAsset(codeId).then(function (res: any) {
      if (res.data.code == 100200) {
        dataSource.value = dataSource.value.filter((item: any) => item.assetId !== codeId);
        return message.success('删除成功');
      } else return message.error('删除失败');
    });
  };

  //批量按钮操作
  const PublishBatch = ref<boolean>(true); //发布按钮禁用
  const DeactivateBatch = ref<boolean>(true); //停用按钮禁用

  // 全选/反选
  const Selectall_invert = ref([]);
  const FilterData = ref([]); //通过id过滤获取数据，做按钮禁用条件
  const rowSelection = computed(() => {
    return {
      checkStrictly: false,
      selectedRowKeys: Selectall_invert,
      onChange: (selectedRows: any) => {
        FilterData.value = [];
        selectedRows.forEach((id: any) => {
          FilterData.value.push(dataSource.value.filter((item: any) => item.assetId == id)[0].assetType);
        });
        Selectall_invert.value = selectedRows;
        //多选进行批量操作
        if (Selectall_invert.value != ('' as any)) {
          PublishBatch.value = false;
          DeactivateBatch.value = false;
        } else {
          PublishBatch.value = true;
          DeactivateBatch.value = true;
        }

        FilterData.value.forEach((item: any) => {
          if (item == '已发布') {
            PublishBatch.value = true;
          }
          return;
        });
        FilterData.value.forEach((item: any) => {
          if (item == '未发布' || item == '已停用') {
            DeactivateBatch.value = true;
          }
          return;
        });
      },
    };
  });
  // 批量操作
  const ALLonChangecode = (state: number) => {
    if (state === 1) {
      state = 0;
      let length = Selectall_invert.value.length;
      for (let i = 0; i < length; i++) {
        let temp: any = dataSource.value.find((element: any) => element.assetId === Selectall_invert.value[i]);
        if (temp.assetType === '已发布') {
          return message.error('已发布状态不可在进行发布');
        }
      }
    }
    if (state === 2) {
      state = 1;
      for (let i = 0; i < Selectall_invert.value.length; i++) {
        let temp: any = dataSource.value.find((element: any) => element.assetId === Selectall_invert.value[i]);
        if (temp.assetType == '未发布') return message.error('停用失败，存在未发布的码表！');
      }
      let length = Selectall_invert.value.length;
      for (let i = 0; i < length; i++) {
        let temp: any = dataSource.value.find((element: any) => element.assetId === Selectall_invert.value[i]);
        if (temp.assetType === '已停用') {
          return message.error('已停用状态不可在进行停用');
        }
      }
    }
    let change_array: any = {
      statusType: state,
      assetList: Selectall_invert.value,
    };
    if (change_array.length == 0) return message.error('请选择码表进行操作!');
    OnChange1(change_array).then(function (res: any) {
      if (res.data.code == 100200) {
        message.success('更新成功!');
        //批量操作后取消勾选框的勾选
        Selectall_invert.value = [];
        rowSelection.value.onChange(Selectall_invert.value);
        selectCodeTable_way();
      } else return message.error('更新失败！');
    });
  };

  // 改变编码状态 √
  const onChangecode = (assetId: number, state: number) => {
    let object_array = {
      statusType: state,
      assetList: [assetId],
    };
    OnChange1(object_array).then(function (res: any) {
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
