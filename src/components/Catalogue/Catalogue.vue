<template>
  <!-- 搜索区域 -->
  <div class="search">
    <span>来源机构：</span>
    <select v-model="sourceAgencies">
      <option value="数宜信">数宜信</option>
      <option value="" selected style="display: none">请选择</option>
    </select>
    <span>标准状态：</span>
    <select v-model="standardType">
      <option value="未发布">未发布</option>
      <option value="已发布">已发布</option>
      <option value="已停用">已停用</option>
      <option value="" selected style="display: none">请选择</option>
    </select>
    <span>标准编号：</span><input v-model.trim="standardId" type="text" placeholder="请输入标准编号" /> <span>中文名称：</span
    ><input v-model.trim="chineseName" type="text" placeholder="请输入中文名称" /> <span>英文名称：</span><input v-model.trim="englishName" type="text" placeholder="请输入英文名称" />
    <a-button class="Reset" @click="Reset">重置</a-button>
    <a-button class="query">查询</a-button>
  </div>
  <!-- 五个按钮区域 -->
  <div class="button">
    <div class="left">
      <a-button type="primary" size="small">批量发布</a-button>
      <a-button type="primary" size="small">批量停用</a-button>
    </div>
    <div class="right">
      <a-button type="primary" size="small">导入模板下载</a-button>
      <a-button type="primary" size="small">标准导入</a-button>
      <a-button type="primary" size="small" @click="showDrawer">新增标准</a-button>
    </div>
  </div>
  <!-- 表格区域 -->
  <a-table
    :data-source="dataSource"
    :columns="columns"
    :row-selection="rowSelection"
    :pagination="{
    pageSizeOptions: ['10', '15', '18', '20'], showTotal: (total: any) => `共 ${total} 条`,
    showSizeChanger: true,
    defaultPageSize: 20,
    buildOptionText: (size: any) => {
      return Number(size.value) + ' 项' + '/' + '页'
    }
  }"
    :row-key="(dataSource: any) => { return dataSource.standardId }"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'codeId'">
        <a href="#" @click.prevent="showModal(record.standardId)">{{ record.standardId }}</a>
      </template>
      <template v-if="column.dataIndex === 'operation'">
        <!-- 未发布显示按钮 -->
        <div v-if="record.standardType == '未发布'">
          <a-popconfirm v-if="dataSource.length" title="请确认否发布该码表?">
            <a-button type="primary" size="small">发布</a-button>
          </a-popconfirm>
          <a-button type="primary" size="small" @click="showDrawer">编辑</a-button>
          <a-popconfirm v-if="dataSource.length" title="请确认是否删除该码表?">
            <a-button type="primary" size="small">删除</a-button>
          </a-popconfirm>
        </div>
        <!-- 已发布显示按钮 -->
        <div v-if="record.standardType == '已发布'">
          <a-popconfirm v-if="dataSource.length" title="请确认否发布该码表?">
            <a-button type="primary" size="small">停用</a-button>
          </a-popconfirm>
        </div>
        <!-- 已停用显示按钮 -->
        <div v-if="record.standardType == '已停用'">
          <a-popconfirm v-if="dataSource.length" title="请确认否发布该码表?">
            <a-button type="primary" size="small">发布</a-button>
          </a-popconfirm>
          <a-button type="primary" size="small" @click="showDrawer">编辑</a-button>
        </div>
      </template>
    </template>
  </a-table>
  <!-- 编辑栏 -->
  <a-drawer title="编辑标准" :width="720" :visible="editvisible" :body-style="{ paddingBottom: '80px', paddingLeft: '0' }" :footer-style="{ textAlign: 'right' }" @close="onClose">
    <div class="edit_drawer"
      ><span><span>*</span>中文名称：</span>
      <a-input placeholder="Basic usage" />
    </div>
    <div class="edit_drawer"
      ><span><span>*</span>英文名称：</span>
      <a-input placeholder="Basic usage" />
    </div>
    <div class="edit_drawer"
      ><span>标准说明：</span>
      <a-input placeholder="Basic usage" />
    </div>
    <div class="edit_drawer"
      ><span><span>*</span>来源机构：</span>
      <a-select v-model:value="select_Source_institution" show-search placeholder="Select a person" style="width: 100%" :options="Source_institution" :filter-option="filterOption"></a-select>
    </div>
    <div class="edit_drawer"
      ><span><span>*</span>是否可为空：</span>
      <a-select v-model:value="select_Judge_null" show-search placeholder="Select a person" style="width: 100%" :options="Judge_null" :filter-option="filterOption"></a-select>
    </div>
    <div class="edit_drawer"
      ><span><span>*</span>数据类型：</span>
      <a-select v-model:value="select_data_type" show-search placeholder="Select a person" style="width: 100%" :options="data_type" :filter-option="filterOption"></a-select>
    </div>
    <!-- int类型 -->
    <div v-show="select_data_type === 'Int'" class="int_type">
      <div class="edit_drawer"
        ><span>取值范围：</span>
        <div style="width: 100%" class="num_rang">
          <a-input placeholder="Basic usage" style="width: 45%" />----
          <a-input placeholder="Basic usage" style="width: 45%" />
        </div>
      </div>
      <div class="edit_drawer"
        ><span>默认值：</span>
        <a-input placeholder="Basic usage" />
      </div>
    </div>
    <!-- enum类型 -->
    <div v-show="select_data_type === 'Enum'" class="int_type">
      <div class="edit_drawer"
        ><span><span>*</span>枚举范围：</span>
        <a-select v-model:value="select_Judge_null" show-search placeholder="Select a person" style="width: 100%" :options="Judge_null" :filter-option="filterOption"></a-select>
      </div>
      <div class="edit_drawer"
        ><span>默认值：</span>
        <a-input placeholder="Basic usage" />
      </div>
    </div>
    <!-- float类型 -->
    <div v-show="select_data_type === 'Float'" class="int_type">
      <div class="edit_drawer"
        ><span>数据精度：</span>
        <a-input placeholder="Basic usage" />
      </div>
      <div class="edit_drawer"
        ><span>取值范围：</span>
        <div style="width: 100%" class="num_rang">
          <a-input placeholder="Basic usage" style="width: 45%" />----
          <a-input placeholder="Basic usage" style="width: 45%" />
        </div>
      </div>
      <div class="edit_drawer"
        ><span>默认值：</span>
        <a-input placeholder="Basic usage" />
      </div>
    </div>
    <!-- string类型 -->
    <div v-show="select_data_type === 'String'" class="int_type">
      <div class="edit_drawer"
        ><span>数据长度：</span>
        <a-input placeholder="Basic usage" />
      </div>
      <div class="edit_drawer"
        ><span>默认值：</span>
        <a-input placeholder="Basic usage" />
      </div>
    </div>
    <!-- 底部按钮 -->
    <div class="edit_drawer_bottom">
      <a-button size="big">取消</a-button>
      <a-button type="primary" size="big">确定</a-button>
    </div>
  </a-drawer>
  <!-- 显示详情 -->

  <div>
    <a-modal v-model:visible="Detailsvisible" :title="Detailed.chineseName + '(' + Detailed.standardId + ')'">
      <span> 标准编号：</span>{{ Detailed.standardId }}<br />
      <span> 中文名称：</span>{{ Detailed.chineseName }}<br />
      <span> 英文名称：</span>{{ Detailed.englishName }}<br />
      <span> 标准说明：</span>{{ Detailed.standardExplain }}<br />
      <span> 来源机构：</span>{{ Detailed.sourceAgencies }}<br />
      <span> 是否为空：</span>{{ Detailed.isNull }}<br />
      <span> 数据类型：</span>{{ Detailed.dataType }}<br />
      <!-- int -->
      <div v-show="Detailed.dataType == 'Int'">
        <span> 取值范围：</span>{{ Detailed.dataMin }}~{{ Detailed.dataMax }}<br />
        <span> 默认值：</span>{{ Detailed.dataDefault }}<br />
      </div>
      <!-- float -->
      <div v-show="Detailed.dataType == 'Float'">
        <span> 数据精度：</span>{{ Detailed.dataPrecision }}<br />
        <span> 取值范围：</span>{{ Detailed.dataMin }}~{{ Detailed.dataMax }}<br />
        <span> 默认值：</span>{{ Detailed.dataDefault }}<br />
      </div>
      <!-- enum -->
      <div v-show="Detailed.dataType == 'Enum'">
        <span> 枚举范围精度：</span>{{ Detailed.enumRange }}<br />
        <span> 默认值：</span>{{ Detailed.dataDefault }}<br />
      </div>
      <!-- string -->
      <div v-show="Detailed.dataType == 'String'">
        <span> 数据长度：</span>{{ Detailed.dataLength }}<br />
        <span> 默认值：</span>{{ Detailed.dataDefault }}<br />
      </div>
      <template #footer>
        <a-button @click="handleCancel">关闭</a-button>
      </template>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
  import type { SelectProps } from 'ant-design-vue';
  import { Catalog, Lookup } from '@/api/test/index';
  import { ref, onMounted } from 'vue';
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

  onMounted(() => {
    show();
  });

  //页面数据展示
  const dataSource: Ref<DataItem[]> = ref([]);
  const show = function () {
    Catalog().then(function (res) {
      console.log(res);
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

  const columns = [
    {
      title: '标准编号',
      dataIndex: 'codeId',
      width: '9%',
    },
    {
      title: '中文名称',
      dataIndex: 'chineseName',
      width: '9%',
    },
    {
      title: '英文名称',
      dataIndex: 'englishName',
      width: '12%',
    },
    {
      title: '标准说明',
      dataIndex: 'standardExplain',
      width: '18%',
    },
    {
      title: '来源机构',
      dataIndex: 'sourceAgencies',
      width: '8%',
    },
    {
      title: '数据类型',
      dataIndex: 'dataType',
      width: '8%',
    },
    {
      title: '标准状态',
      dataIndex: 'standardType',
      width: '8%',
    },
    {
      title: '更新日期',
      dataIndex: 'updateTime',
      width: '12%',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: '14%',
    },
  ];

  // const form = reactive({
  //   name: '',
  //   url: '',
  //   owner: '',
  //   type: '',
  //   approver: '',
  //   dateTime: null,
  //   description: '',
  // });
  const editvisible = ref<boolean>(false);

  const showDrawer = () => {
    editvisible.value = true;
  };

  const onClose = () => {
    editvisible.value = false;
  };
  const Selectall_invert = ref([]);
  const rowSelection = ref({
    checkStrictly: false,
    onChange: (selectedRows: any) => {
      Selectall_invert.value = selectedRows;
    },
  });
  // 编辑页面
  // 下拉菜单
  // 数据类型
  const data_type = ref<SelectProps['options']>([
    { value: 'Int', label: 'Int' },
    { value: 'Enum', label: 'Enum' },
    { value: 'Float', label: 'Float' },
    { value: 'String', label: 'String' },
  ]);
  const select_data_type = ref<string>();
  //是否可为空
  const Judge_null = ref<SelectProps['options']>([
    { value: '可为空', label: '可为空' },
    { value: '不可为空', label: '不可为空' },
  ]);
  const select_Judge_null = ref<string>();
  // 来源机构
  const Source_institution = ref<SelectProps['options']>([{ value: '哈哈哈', label: '哈哈哈' }]);
  const select_Source_institution = ref<string>();
  const filterOption = (input: string, option: any) => {
    return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };
  // 显示详情
  const Detailsvisible = ref<boolean>(false);
  const Detailed = reactive({
    chineseName: '',
    standardId: '',
    englishName: '',
    standardExplain: '',
    sourceAgencies: '',
    isNull: '',
    dataType: '',
    dataPrecision: '',
    dataDefault: '',
    dataMin: '',
    dataMax: '',
    enumRange: '',
    dataLength: '',
  });
  const showModal = (standardId: string) => {
    Detailsvisible.value = true;
    Lookup(standardId).then(function (res) {
      Detailed.standardId = res.data.data.standardId;
      Detailed.chineseName = res.data.data.chineseName;
      Detailed.englishName = res.data.data.englishName;
      Detailed.standardExplain = res.data.data.standardExplain;
      Detailed.sourceAgencies = res.data.data.sourceAgencies;
      Detailed.isNull = res.data.data.isNull;
      Detailed.dataType = res.data.data.dataType;
      Detailed.dataPrecision = res.data.data.dataPrecision;
      Detailed.dataDefault = res.data.data.dataDefault;
      Detailed.dataMin = res.data.data.dataMin;
      Detailed.dataMax = res.data.data.dataMax;
      Detailed.enumRange = res.data.data.enumRange;
      Detailed.dataLength = res.data.data.dataLength;
      if (Detailed.dataType == '1') {
        Detailed.dataType = 'Int';
      }
      if (Detailed.dataType == '2') {
        Detailed.dataType = 'Float';
      }
      if (Detailed.dataType == '3') {
        Detailed.dataType = 'Enum';
      }
      if (Detailed.dataType == '4') {
        Detailed.dataType = 'String';
      }
      if (Detailed.isNull == '0') {
        Detailed.isNull = '可为空';
      }
      if (Detailed.isNull == '1') {
        Detailed.isNull = '不可为空';
      }
    });
  };
  const handleCancel = () => {
    Detailsvisible.value = false;
  };

  // 查询功能
  const sourceAgencies = ref<string>('');
  const standardType = ref<string>('');
  const standardId = ref<string>('');
  const chineseName = ref<string>('');
  const englishName = ref<string>('');
  const Reset = () => {
    sourceAgencies.value = '';
    standardType.value = '';
    standardId.value = '';
    chineseName.value = '';
    englishName.value = '';
  };
  // const query=()=>{}
</script>

<style lang="less" scoped>
  @import './style.less';
</style>
