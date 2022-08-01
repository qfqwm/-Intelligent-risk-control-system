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
    <a-button class="query" @click="query">查询</a-button>
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
        <a href="#" @click.prevent="showModal">{{ record.standardId }}</a>
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
  <a-drawer title="编辑标准" :width="720" :visible="editvisible" :body-style="{ paddingBottom: '80px', paddingLeft: '0' }" :footer-style="{ textAlign: 'right' }" @close="add_edit_false">
    <div class="edit_drawer"
      ><span><span>*</span>中文名称：</span>
      <a-input v-model:value.trim="add_edit_chineseName" placeholder="Basic usage" />
    </div>
    <div class="edit_drawer"
      ><span><span>*</span>英文名称：</span>
      <a-input v-model:value.trim="add_edit_englishName" placeholder="请输入英文名称" />
    </div>
    <div class="edit_drawer"
      ><span>标准说明：</span>
      <a-input v-model:value.trim="add_edit_standardExplain" placeholder="Basic usage" />
    </div>
    <div class="edit_drawer"
      ><span><span>*</span>来源机构：</span>
      <a-select v-model:value="add_edit_sourceAgencies" show-search placeholder="Select a person" style="width: 100%" :options="Source_institution" :filter-option="filterOption"></a-select>
    </div>
    <div class="edit_drawer"
      ><span><span>*</span>是否可为空：</span>
      <a-select v-model:value="add_edit_isNull" show-search placeholder="Select a person" style="width: 100%" :options="Judge_null" :filter-option="filterOption"></a-select>
    </div>
    <div class="edit_drawer"
      ><span><span>*</span>数据类型：</span>
      <a-select v-model:value="add_edit_dataType" show-search placeholder="Select a person" style="width: 100%" :options="data_type" :filter-option="filterOption"></a-select>
    </div>
    <!-- int类型 -->
    <div v-show="add_edit_dataType === 'Int'" class="int_type">
      <div class="edit_drawer"
        ><span>取值范围：</span>
        <div style="width: 100%" class="num_rang">
          <a-input v-model:value.number="add_edit_dataMin" placeholder="Basic usage" style="width: 45%" />----
          <a-input v-model:value.number="add_edit_dataMax" placeholder="Basic usage" style="width: 45%" />
        </div>
      </div>
      <div class="edit_drawer"
        ><span>默认值：</span>
        <a-input v-model:value.trim="add_edit_dataDefault" placeholder="Basic usage" />
      </div>
    </div>
    <!-- enum类型 -->
    <div v-show="add_edit_dataType === 'Enum'" class="int_type">
      <div class="edit_drawer"
        ><span><span>*</span>枚举范围：</span>
        <a-select
          v-model:value="select_Judge_null"
          v-model="add_edit_enumRange"
          show-search
          placeholder="Select a person"
          style="width: 100%"
          :options="Judge_null"
          :filter-option="filterOption"
        ></a-select>
      </div>
      <div class="edit_drawer"
        ><span>默认值：</span>
        <a-input v-model:value="add_edit_dataDefault" placeholder="请输入默认值" />
      </div>
    </div>
    <!-- float类型 -->
    <div v-show="add_edit_dataType === 'Float'" class="int_type">
      <div class="edit_drawer"
        ><span>数据精度：</span>
        <a-input v-model:value="add_edit_dataPrecision" placeholder="Basic usage" />
      </div>
      <div class="edit_drawer"
        ><span>取值范围：</span>
        <div style="width: 100%" class="num_rang">
          <a-input v-model:value.number="add_edit_dataMin" placeholder="Basic usage" style="width: 45%" />----
          <a-input v-model:value.number="add_edit_dataMax" placeholder="Basic usage" style="width: 45%" />
        </div>
      </div>
      <div class="edit_drawer"
        ><span>默认值：</span>
        <a-input v-model:value.trim="add_edit_dataDefault" placeholder="Basic usage" />
      </div>
    </div>
    <!-- string类型 -->
    <div v-show="add_edit_dataType === 'String'" class="int_type">
      <div class="edit_drawer"
        ><span>数据长度：</span>
        <a-input v-model:value="add_edit_dataLength" placeholder="Basic usage" />
      </div>
      <div class="edit_drawer"
        ><span>默认值：</span>
        <a-input v-model:value.trim="add_edit_dataPrecision" placeholder="Basic usage" />
      </div>
    </div>
    <!-- 底部按钮 -->
    <div class="edit_drawer_bottom">
      <a-button size="big" @click="add_edit_false">取消</a-button>
      <a-button type="primary" size="big" @click="add_edit_couse">确定</a-button>
    </div>
  </a-drawer>
  <!-- 显示详情 -->

  <div>
    <a-modal v-model:visible="Detailsvisible" title="Basic Modal">
      <span> 标准编号：</span>dasdasdasdwq<br />
      <span> 中文名称：</span>dasdasdasdwq<br />
      <span> 英文名称：</span>dasdasdasdwq<br />
      <span> 标准说明：</span>dasdasdasdwq<br />
      <span> 来源机构：</span>dasdasdasdwq<br />
      <span> 是否为空：</span>dasdasdasdwq<br />
      <span> 数据类型：</span>dasdasdasdwq<br />
      <!-- int -->
      <div v-show="true">
        <span> 取值范围：</span>dasdasdasdwq<br />
        <span> 默认值：</span>dasdasdasdwq<br />
      </div>
      <!-- float -->
      <div v-show="true">
        <span> 数据精度：</span>dasdasdasdwq<br />
        <span> 取值范围：</span>dasdasdasdwq<br />
        <span> 默认值：</span>dasdasdasdwq<br />
      </div>
      <!-- enum -->
      <div v-show="true">
        <span> 枚举范围精度：</span>dasdasdasdwq<br />
        <span> 默认值：</span>dasdasdasdwq<br />
      </div>
      <!-- string -->
      <div v-show="true">
        <span> 数据长度：</span>dasdasdasdwq<br />
        <span> 默认值：</span>dasdasdasdwq<br />
      </div>
      <template #footer>
        <a-button @click="handleCancel">关闭</a-button>
      </template>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
  import { message, SelectProps } from 'ant-design-vue';
  import { Catalog, AddStandard } from '@/api/test/index';
  import { ref } from 'vue';
  import type { Ref } from 'vue';
  import { object } from 'vue-types';
  import { log } from 'console';
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
  //页面数据展示
  const dataSource: Ref<DataItem[]> = ref([]);
  const show = function (query_object: any) {
    let object = {
      englishName: '',
      standardId: '',
      sourceAgencies: '',
      standardType: '',
      chineseName: '',
    };
    if (query_object) {
      object = query_object;
    }
    Catalog(object).then(function (res) {
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
      width: '20%',
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

  const editvisible = ref<boolean>(false);

  const showDrawer = () => {
    editvisible.value = true;
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
  const showModal = () => {
    Detailsvisible.value = true;
  };
  const handleCancel = () => {
    Detailsvisible.value = false;
  };

  // 查询功能
  show(null);
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
  const query = () => {
    let object = {
      englishName: englishName.value,
      standardId: standardId.value,
      sourceAgencies: sourceAgencies.value,
      standardType: standardType.value,
      chineseName: chineseName.value,
    };
    show(object);
  };
  // 新增编辑标准
  const add_edit_chineseName = ref('');
  const add_edit_englishName = ref('');
  const add_edit_sourceAgencies = ref('');
  const add_edit_dataType = ref('');
  const add_edit_isNull = ref('');
  const add_edit_enumRange = ref<string | null>('');
  const add_edit_dataDefault = ref('');
  const add_edit_dataPrecision = ref<string | null>('');
  const add_edit_dataLength = ref<string | null>('');
  const add_edit_standardExplain = ref('');
  const add_edit_dataMin = ref<string | null>('');
  const add_edit_dataMax = ref<string | null>('');
  // 清空数据
  const empty = () => {
    add_edit_chineseName.value = '';
    add_edit_englishName.value = '';
    add_edit_sourceAgencies.value = '';
    add_edit_dataType.value = '';
    add_edit_isNull.value = '';
    add_edit_enumRange.value = null;
    add_edit_dataDefault.value = '';
    add_edit_dataPrecision.value = null;
    add_edit_dataLength.value = null;
    add_edit_standardExplain.value = '';
    add_edit_dataMin.value = null;
    add_edit_dataMax.value = null;
  };
  // 确定按钮
  const add_edit_couse = () => {
    let dataType = '';
    switch (add_edit_dataType.value) {
      case 'Int':
        dataType = '1';
        break;
      case 'Float':
        dataType = '2';
        break;
      case 'Enum':
        dataType = '3';
        break;
      case 'String':
        dataType = '4';
        break;
      default:
        break;
    }

    let object = {
      chineseName: add_edit_chineseName.value,
      englishName: add_edit_englishName.value,
      sourceAgencies: add_edit_sourceAgencies.value,
      isNull: add_edit_isNull.value == '可为空' ? '0' : '1',
      dataType: dataType,
      standardExplain: add_edit_standardExplain.value,
      // "dataMin":<any>null,
      // "dataMax":<any>null,
      // "enumRange":<any>null,
      // "dataDefault":add_edit_dataDefault.value,
      // "dataPrecision":<any>null,
      // "dataLength":<any>null ,
    };

    if (dataType == '1') {
      object.dataMin = add_edit_dataMin.value;
      object.dataMax = add_edit_dataMax.value;
    }
    if (dataType == '2') {
      object.dataMin = add_edit_dataMin.value;
      object.dataMax = add_edit_dataMax.value;
      object.dataPrecision = add_edit_dataPrecision.value;
    }
    if (dataType == '3') {
      object.enumRange = add_edit_enumRange.value;
      if (add_edit_enumRange.value == '' || null) return message.error('请选择枚举范围!');
    }
    if (dataType == '4') {
      object.dataLength = add_edit_dataLength.value;
    }
    // 判断是否为空
    if (object.chineseName == '' || null) return message.error('中文名称为空！');
    if (object.englishName == '' || null) return message.error('英文名称为空！');
    if (object.sourceAgencies == '' || null) return message.error('请选择来源机构!');
    if (object.dataType == '' || null) return message.error('请选择数据类型!');
    if (object.isNull == '' || null) return message.error('请选择数据是否为空!');
    AddStandard(object).then(function (res) {
      console.log(res);
    });
    editvisible.value = false;
    empty();
  };
  // 取消按钮
  const add_edit_false = () => {
    empty();
    editvisible.value = false;
  };
</script>

<style lang="less" scoped>
  @import './style.less';
</style>
