<template>
  <!-- 搜索区域 -->
  <div class="search">
    <span>来源机构：</span>
    <select>
      <option value="数宜信">数宜信</option>
      <option value="" selected></option>
    </select>
    <span>标准状态：</span>
    <select>
      <option value="未发布">未发布</option>
      <option value="已发布">已发布</option>
      <option value="已停用">已停用</option>
      <option value="" selected></option>
    </select>
    <span>标准编号：</span><input type="text" /> <span>中文名称：</span><input type="text" /> <span>英文名称：</span><input type="text" />
    <a-button class="Reset">重置</a-button>
    <a-button class="query">查询</a-button>
  </div>
  <!-- 五个按钮区域 -->
  <div class="button">
    <div class="left">
      <a-button type="primary" size="small">批量发布</a-button>
      <a-button type="primary" size="small">批量停用</a-button>
    </div>
    <div class="right">
      <a-button type="primary" size="small">码表模板下载</a-button>
      <a-button type="primary" size="small">码表导入</a-button>
      <a-button type="primary" size="small">新增码表</a-button>
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
    :row-key="(dataSource: any) => { return dataSource.codeId }"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'codeId'">
        <a href="#" @click.prevent="showModal">{{ record.codeId }}</a>
      </template>
      <template v-if="column.dataIndex === 'operation'">
        <!-- 未发布显示按钮 -->
        <div v-if="record.operation == '未发布'">
          <a-popconfirm v-if="dataSource.length" title="请确认否发布该码表?">
            <a-button type="primary" size="small">发布</a-button>
          </a-popconfirm>
          <a-button type="primary" size="small" @click="showDrawer">编辑</a-button>
          <a-popconfirm v-if="dataSource.length" title="请确认是否删除该码表?">
            <a-button type="primary" size="small">删除</a-button>
          </a-popconfirm>
        </div>
        <!-- 已发布显示按钮 -->
        <div v-if="record.operation == '已发布'">
          <a-popconfirm v-if="dataSource.length" title="请确认否发布该码表?">
            <a-button type="primary" size="small">停用</a-button>
          </a-popconfirm>
        </div>
        <!-- 已停用显示按钮 -->
        <div v-if="record.operation == '已停用'">
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
  <template>
    <div>
      <a-modal v-model:visible="Detailsvisible" title="Basic Modal">
        <template #footer>
          <a-button @click="handleCancel">关闭</a-button>
        </template>
      </a-modal>
    </div>
  </template>
</template>

<script lang="ts" setup>
  import type { SelectProps } from 'ant-design-vue';
  import { ref } from 'vue';
  import type { Ref } from 'vue';
  // interface DataItem {
  //     key: string;
  //     codeId: string;
  //     codeName: string;
  //     codeExplain: string;
  //     codeType: any;
  //     codeUpdatetime: string;
  //     codeCreattime: string;
  //     allCodeTable: object;
  //   }
  const columns = [
    {
      title: '标准编号',
      dataIndex: 'codeId',
      width: '9%',
    },
    {
      title: '中文名称',
      dataIndex: 'Chinesename',
      width: '9%',
    },
    {
      title: '英文名称',
      dataIndex: 'Englishname',
      width: '12%',
    },
    {
      title: '标准说明',
      dataIndex: 'Standarddescription',
      width: '20%',
    },
    {
      title: '来源机构',
      dataIndex: 'Sourceinstitution',
      width: '8%',
    },
    {
      title: '数据类型',
      dataIndex: 'datatype',
      width: '8%',
    },
    {
      title: '标准状态',
      dataIndex: 'Standardstatus',
      width: '8%',
    },
    {
      title: '更新日期',
      dataIndex: 'Updatedate',
      width: '12%',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: '14%',
    },
  ];
  // const dataSource: Ref<DataItem[]> = ref([
  // ]);
  const dataSource = ref([
    {
      codeId: 1132312321,
      Chinesename: 'dferfregtrghtyhyt',
      Englishname: 'dewferfgregregregregerger',
      Standarddescription: 'asdasdsadasdghasjdhasuidhsiu',
      operation: '已发布',
      Updatedate: '2022--11-11 20:20:20',
    },
    {
      codeId: 1132312321,
      Chinesename: 'dferfregtrghtyhyt',
      Englishname: 'dewferfgregregregregerger',
      Standarddescription: 'asdasdsadasdghasjdhasuidhsiu',
      operation: '已停用',
    },
    {
      codeId: 1132312321,
      Chinesename: 'dferfregtrghtyhyt',
      Englishname: 'dewferfgregregregregerger',
      Standarddescription: 'asdasdsadasdghasjdhasuidhsiu',
      operation: '未发布',
    },
    {
      codeId: 1132312321,
      Chinesename: 'dferfregtrghtyhyt',
      Englishname: 'dewferfgregregregregerger',
      Standarddescription: 'asdasdsadasdghasjdhasuidhsiu',
      operation: '已停用',
    },
    {
      codeId: 1132312321,
      Chinesename: 'dferfregtrghtyhyt',
      Englishname: 'dewferfgregregregregerger',
      Standarddescription: 'asdasdsadasdghasjdhasuidhsiu',
      operation: '已停用',
    },
    {
      codeId: 1132312321,
      Chinesename: 'dferfregtrghtyhyt',
      Englishname: 'dewferfgregregregregerger',
      Standarddescription: 'asdasdsadasdghasjdhasuidhsiu',
      operation: '已停用',
    },
    {
      codeId: 1132312321,
      Chinesename: 'dferfregtrghtyhyt',
      Englishname: 'dewferfgregregregregerger',
      Standarddescription: 'asdasdsadasdghasjdhasuidhsiu',
      operation: '已停用',
    },
    {
      codeId: 1132312321,
      Chinesename: 'dferfregtrghtyhyt',
      Englishname: 'dewferfgregregregregerger',
      Standarddescription: 'asdasdsadasdghasjdhasuidhsiu',
      operation: '已停用',
    },
    {
      codeId: 1132312321,
      Chinesename: 'dferfregtrghtyhyt',
      Englishname: 'dewferfgregregregregerger',
      Standarddescription: 'asdasdsadasdghasjdhasuidhsiu',
      operation: '已停用',
    },
    {
      codeId: 1132312321,
      Chinesename: 'dferfregtrghtyhyt',
      Englishname: 'dewferfgregregregregerger',
      Standarddescription: 'asdasdsadasdghasjdhasuidhsiu',
      operation: '已停用',
    },
    {
      codeId: 1132312321,
      Chinesename: 'dferfregtrghtyhyt',
      Englishname: 'dewferfgregregregregerger',
      Standarddescription: 'asdasdsadasdghasjdhasuidhsiu',
      operation: '已停用',
    },
    {
      codeId: 1132312321,
      Chinesename: 'dferfregtrghtyhyt',
      Englishname: 'dewferfgregregregregerger',
      Standarddescription: 'asdasdsadasdghasjdhasuidhsiu',
      operation: '已停用',
    },
    {
      codeId: 1132312321,
      Chinesename: 'dferfregtrghtyhyt',
      Englishname: 'dewferfgregregregregerger',
      Standarddescription: 'asdasdsadasdghasjdhasuidhsiu',
      operation: '已停用',
    },
    {
      codeId: 1132312321,
      Chinesename: 'dferfregtrghtyhyt',
      Englishname: 'dewferfgregregregregerger',
      Standarddescription: 'asdasdsadasdghasjdhasuidhsiu',
      operation: '已停用',
    },
    {
      codeId: 1132312321,
      Chinesename: 'dferfregtrghtyhyt',
      Englishname: 'dewferfgregregregregerger',
      Standarddescription: 'asdasdsadasdghasjdhasuidhsiu',
      operation: '已停用',
    },
    {
      codeId: 1132312321,
      Chinesename: 'dferfregtrghtyhyt',
      Englishname: 'dewferfgregregregregerger',
      Standarddescription: 'asdasdsadasdghasjdhasuidhsiu',
      operation: '已停用',
    },
    {
      codeId: 1132312321,
      Chinesename: 'dferfregtrghtyhyt',
      Englishname: 'dewferfgregregregregerger',
      Standarddescription: 'asdasdsadasdghasjdhasuidhsiu',
      operation: '已停用',
    },
    {
      codeId: 1132312321,
      Chinesename: 'dferfregtrghtyhyt',
      Englishname: 'dewferfgregregregregerger',
      Standarddescription: 'asdasdsadasdghasjdhasuidhsiu',
      operation: '已停用',
    },
    {
      codeId: 1132312321,
      Chinesename: 'dferfregtrghtyhyt',
      Englishname: 'dewferfgregregregregerger',
      Standarddescription: 'asdasdsadasdghasjdhasuidhsiu',
      operation: '已停用',
    },
    {
      codeId: 1132312321,
      Chinesename: 'dferfregtrghtyhyt',
      Englishname: 'dewferfgregregregregerger',
      Standarddescription: 'asdasdsadasdghasjdhasuidhsiu',
      operation: '已停用',
    },
    {
      codeId: 1132312321,
      Chinesename: 'dferfregtrghtyhyt',
      Englishname: 'dewferfgregregregregerger',
      Standarddescription: 'asdasdsadasdghasjdhasuidhsiu',
      operation: '已停用',
    },
  ]);
  //
  const form = reactive({
    name: '',
    url: '',
    owner: '',
    type: '',
    approver: '',
    dateTime: null,
    description: '',
  });
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
  // 分页
  const pageSizeRef = ref(20);
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
  const showModal = () => {
    Detailsvisible.value = true;
  };
  const handleCancel = () => {
    Detailsvisible.value = false;
  };
</script>

<style lang="less" scoped>
  @import './style.less';
</style>
