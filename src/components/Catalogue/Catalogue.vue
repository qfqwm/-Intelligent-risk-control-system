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
  <a-table
    :data-source="dataSource"
    :columns="columns"
    :row-selection="rowSelection"
    style="width: 100%"
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
  <!-- 编辑栏 -->
  <a-drawer :title="edit_add_title" :width="720" :visible="editvisible" :body-style="{ paddingBottom: '80px', paddingLeft: '0' }" :footer-style="{ textAlign: 'right' }" @close="add_edit_false">
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
        <a-select v-model:value="add_edit_enumRange" show-search placeholder="Select a person" style="width: 100%" :options="GetEnum" :filter-option="filterOption"> </a-select>
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
        <span> 枚举范围精度：</span><a href="#" @click.prevent="show_Enum_Modal(Detailed.codeId, Detailed.codeNameSplice)">{{ Detailed.codeName }}</a
        ><br />
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
  <!-- Enum 枚举类型弹框 -->
  <div>
    <a-modal v-model:visible="Enum_visible" :title="Enum_title + '(详情)'">
      <a-table :columns="Enum_column" :data-source="Enum_data" :scroll="{ y: 100 }" :pagination="false" />
      <template #footer>
        <a-button @click="Enum_handleCancel">关闭</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { message, SelectProps } from 'ant-design-vue';
  import { Catalog, AddStandard, Lookup, UpdateStandard, PublishStandard, Delete_Standard, BlockStandard, GetEnum_List, Select_ConfigureInfoById } from '@/api/test/index';
  import { ref, computed, reactive } from 'vue';
  import type { Ref } from 'vue';
  import { object } from 'vue-types';
  import { log } from 'console';
  import { isString } from 'lodash';
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
  interface enum_DataItem {
    configureId: null | string;
    codeId: null | string;
    configureValue: string;
    configureName: string;
    configureMean: string;
    configureType: null | string;
  }
  //页面数据展示
  const dataSource: Ref<DataItem[]> = ref([]);
  const Enum_data: Ref<enum_DataItem[]> = ref([]);
  const morechinese_Name = ref<any>([]);
  const moreenglish_Name = ref<any>([]);
  const edit_add_title = ref<string>('');
  const show = function (query_object: any) {
    if (query_object) {
      object = query_object;
    }
    Catalog(object).then(function (res) {
      dataSource.value = res.data.data;
      let chinesemorename = [] as any;
      let englishmorename = [] as any;
      for (let i = 0; i < dataSource.value.length; i++) {
        chinesemorename.push(res.data.data[i].chineseName);
        englishmorename.push(res.data.data[i].englishName);
      }
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

  const GetEnum = ref<SelectProps['options']>([]);

  const Selectall_invert = ref([]);
  const rowSelection = ref({
    checkStrictly: false,
    onChange: (selectedRows: any) => {
      Selectall_invert.value = selectedRows;
    },
  });
  // 编辑页面
  // 下拉菜单

  const select_data_type = ref<string>();

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
    codeName: '',
    codeNameSplice: '',
    codeId: '',
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
      Detailed.codeName = res.data.data.codeName;
      Detailed.codeNameSplice = res.data.data.codeNameSplice;
      Detailed.codeId = res.data.data.codeId;
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
  const Enum_handleCancel = () => {
    Enum_visible.value = false;
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
  const add_edit_dataMin = ref<string | null | number>('');
  const add_edit_dataMax = ref<string | null | number>('');
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
    let dataMin: any | string = null;
    let dataMax: any | string = null;
    let enumRange: any | string = null;
    let dataPrecision: any | string = null;
    let dataLength: any | string = null;
    // 判断是否为空
    if (add_edit_chineseName.value == '' || null) return message.error('中文名称为空！');
    if (add_edit_englishName.value == '' || null) return message.error('英文名称为空！');
    if (add_edit_sourceAgencies.value == '' || null) return message.error('请选择来源机构!');
    if (dataType == '' || null) return message.error('请选择数据类型!');
    if (add_edit_isNull.value == '' || null) return message.error('请选择数据是否为空!');
    // 正则判断
    if (morechinese_Name.value.indexOf(add_edit_chineseName.value) !== -1) {
      if (edit_add_title.value == '编辑标准') {
        if (add_edit_chineseName.value != data_storage.china) return message.error('中文名称重复！');
      } else return message.error('中文名称重复！');
    }
    if (moreenglish_Name.value.indexOf(add_edit_englishName.value) !== -1) {
      if (edit_add_title.value == '编辑标准') {
        if (add_edit_englishName.value != data_storage.english) return message.error('英文名称重复！');
      } else return message.error('英文名称重复！');
    }
    if (edit_add_title.value == '新增标准') {
      let object = {
        chineseName: add_edit_chineseName.value,
        englishName: add_edit_englishName.value,
        sourceAgencies: add_edit_sourceAgencies.value,
        isNull: add_edit_isNull.value == '可为空' ? '0' : '1',
        dataType: dataType,
        standardExplain: add_edit_standardExplain.value,
        dataMin: dataMin,
        dataMax: dataMax,
        enumRange: enumRange,
        dataDefault: add_edit_dataDefault.value,
        dataPrecision: dataPrecision,
        dataLength: dataLength,
      };
      if (dataType == '1') {
        object.dataMin = add_edit_dataMin.value;
        object.dataMax = add_edit_dataMax.value;
        if ((object.dataMax == '' || object.dataMax == null) && (object.dataMin == '' || object.dataMin == null)) {
        } else if (
          isString(object.dataMax) ||
          isString(object.dataMin) ||
          !(object.dataMax > object.dataMin && object.dataMin <= 999 && object.dataMin >= 0 && object.dataMax <= 999 && object.dataMax >= 0)
        )
          return message.error('请输入正确的取值范围!');
      }
      if (dataType == '2') {
        object.dataMin = add_edit_dataMin.value;
        object.dataMax = add_edit_dataMax.value;
        if ((object.dataMax == '' || object.dataMax == null) && (object.dataMin == '' || object.dataMin == null)) {
        } else if (
          isString(object.dataMax) ||
          isString(object.dataMin) ||
          !(object.dataMax > object.dataMin && object.dataMin <= 999 && object.dataMin >= 0 && object.dataMax <= 999 && object.dataMax >= 0)
        )
          return message.error('请输入正确的取值范围!');
        object.dataPrecision = add_edit_dataPrecision.value;
      }
      if (dataType == '3') {
        object.enumRange = add_edit_enumRange.value;
        if (add_edit_enumRange.value == '' || null) return message.error('请选择枚举范围!');
      }
      if (dataType == '4') {
        object.dataLength = add_edit_dataLength.value;
      }
      AddStandard(object).then(function (res) {
        console.log(res);
        if (res.data.msg == 'chineseName只支持中文及英文大小写') return message.error('中文只支持中文及英文大小写！');
        if (res.data.msg == 'englishName只支持英文大小写、数字及下划线且只能是英文开头') return message.error('英文名称只支持英文大小写、数字及下划线且只能是英文开头！');
        if (res.data.msg == 'englishName为1到30字符') return message.error('英文名称为1到30字符');
        if (res.data.msg == 'chineseName为1到30字符') return message.error('中文名称为1到30字符');
        if (res.data.msg == '新增成功') {
          message.success('新增成功！');
          query();
        }
      });
    }
    if (edit_add_title.value == '编辑标准') {
      let object = {
        standardId: data_storage.standardId,
        chineseName: add_edit_chineseName.value,
        englishName: add_edit_englishName.value,
        sourceAgencies: add_edit_sourceAgencies.value,
        dataType: dataType,
        isNull: add_edit_isNull.value == '可为空' ? '0' : '1',
        dataDefault: add_edit_dataDefault.value,
        standardType: data_storage.standardType,
        standardExplain: add_edit_standardExplain.value,
        dataMin: dataMin,
        dataPrecision: dataPrecision,
        dataLength: dataLength,
        dataMax: dataMax,
        enumRange: enumRange,
      };
      if (dataType == '1') {
        object.dataMin = add_edit_dataMin.value;
        object.dataMax = add_edit_dataMax.value;
        if ((object.dataMax == '' || object.dataMax == null) && (object.dataMin == '' || object.dataMin == null)) {
        } else if (
          isString(object.dataMax) ||
          isString(object.dataMin) ||
          !(object.dataMax > object.dataMin && object.dataMin <= 999 && object.dataMin >= 0 && object.dataMax <= 999 && object.dataMax >= 0)
        )
          return message.error('请输入正确的取值范围!');
      }
      if (dataType == '2') {
        object.dataMin = add_edit_dataMin.value;
        object.dataMax = add_edit_dataMax.value;
        if ((object.dataMax == '' || object.dataMax == null) && (object.dataMin == '' || object.dataMin == null)) {
        } else if (
          isString(object.dataMax) ||
          isString(object.dataMin) ||
          !(object.dataMax > object.dataMin && object.dataMin <= 999 && object.dataMin >= 0 && object.dataMax <= 999 && object.dataMax >= 0)
        )
          return message.error('请输入正确的取值范围!');
        object.dataPrecision = add_edit_dataPrecision.value;
      }
      if (dataType == '3') {
        object.enumRange = add_edit_enumRange.value;
        if (add_edit_enumRange.value == '' || null) return message.error('请选择枚举范围!');
      }
      if (dataType == '4') {
        object.dataLength = add_edit_dataLength.value;
      }
      UpdateStandard(object).then(function (res) {
        console.log(res);
        if (res.data.msg == '返回成功') {
          message.success('编辑成功！');
          query();
        }
      });
    }

    editvisible.value = false;
    empty();
  };
  // 取消按钮
  const add_edit_false = () => {
    empty();
    editvisible.value = false;
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
  // 枚举类型弹框
  const Enum_title = ref<string>('');
  const Enum_visible = ref<boolean>(false);
  const show_Enum_Modal = (codeId: string, codeNameSplice: string) => {
    Enum_visible.value = true;
    Enum_title.value = codeNameSplice;
    Select_ConfigureInfoById(codeId).then(function (res) {
      if (res.data.msg == '查询成功') Enum_data.value = res.data.data;
    });
  };
  const Enum_column = [
    {
      title: '码值取值',
      dataIndex: 'configureValue',
      width: 90,
    },
    {
      title: '码值名称',
      dataIndex: 'configureName',
      width: 150,
    },
    {
      title: '码值含义',
      dataIndex: 'configureMean',
    },
  ];
</script>

<style lang="less" scoped>
  @import './style.less';
</style>
