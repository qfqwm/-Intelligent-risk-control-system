<template>
  <div class="all">
    <div class="left">数据资产管理</div>
    <div class="right">
      <!-- 搜索区域 -->
      <div class="search">
        <span>数据资产表状态：</span>
        <select v-model="Codetablestatus">
          <option value="未发布">未发布</option>
          <option value="已发布">已发布</option>
          <option value="已停用">已停用</option>
          <option value="" selected></option>
        </select>
        <span>中文名称：</span><input v-model="Codetablename" type="text" /> <span>英文名称：</span><input v-model="Codetablename" type="text" />
        <a-button class="Reset" @click="Reset">重置</a-button>
        <a-button class="query" @click="query">查询</a-button>
      </div>
      <!-- 五个按钮区域 -->
      <div class="button">
        <div class="left1">
          <a-button type="primary" size="small" @click="ALLonChangecode('1')">批量发布</a-button>
          <a-button type="primary" size="small" @click="ALLonChangecode('2')">批量停用</a-button>
        </div>
        <div class="right1">
          <!-- <a-button type="primary" size="small">
            <router-link to="addassets">新增资产表</router-link>
          </a-button> -->

          <!-- 抽屉区域 -->
          <a-button type="primary" @click="showDrawer"> 新增资产表 </a-button>
          <a-drawer title="数据资产表基础信息" :width="1000" :visible="visible" :body-style="{ paddingBottom: '80px' }" :footer-style="{ textAlign: 'right' }" @close="onClose">
            <a-form :model="form" :rules="rules" layout="vertical">
              <a-row :gutter="16">
                <a-col :span="12">
                  <a-form-item label="＊中文名称：" name="＊中文名称：">
                    <a-input v-model:value="form.name" placeholder="请输入数据资产表名称" />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="＊英文名称：" name="＊英文名称：">
                    <a-input v-model:value="form.url" placeholder="请输入数据资产表名称" />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="16">
                <a-col :span="24">
                  <a-form-item label="资产表描述：" name="资产表描述：">
                    <a-textarea v-model:value="form.description" :rows="4" placeholder="请输入资产表描述" />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row :gutter="16">
                <a-col :span="24">
                  <a-form-item label="＊所属目录：" name="＊所属目录：" class="xia">
                    <a-input v-model:value="form.description" :rows="4" placeholder="请输入资产表描述" />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
            <template #footer>
              <a-space>
                <a-button @click="onClose">取消</a-button>
                <a-button type="primary" @click="onClose">确定</a-button>
              </a-space>
            </template>
          </a-drawer>
        </div>
      </div>
      <!-- 表格区域 -->
      <a-table
        :data-source="dataSource"
        :columns="columns"
        :row-selection="rowSelection"
        :pagination="{ pageSize: pageSizeRef, current: current }"
        :row-key="(dataSource: any) => { return dataSource.codeId }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'codeId'">
            <a href="#" @click.prevent="showcode(record.codeId)">{{ record.codeId }}</a>
          </template>
          <template v-if="column.dataIndex === 'operation'">
            <!-- 未发布显示按钮 -->
            <div v-if="record.codeType == '未发布'">
              <a-popconfirm v-if="dataSource.length" title="请确认否发布该码表?" @confirm="onChangecode(record.codeId, '1')">
                <a-button type="primary" size="small">发布</a-button>
              </a-popconfirm>
              <a-button type="primary" size="small">编辑</a-button>
              <a-popconfirm v-if="dataSource.length" title="请确认是否删除该码表?" @confirm="onDelete(record.codeId)">
                <a-button type="primary" size="small">删除</a-button>
              </a-popconfirm>
            </div>
            <!-- 已发布显示按钮 -->
            <div v-if="record.codeType == '已发布'">
              <a-popconfirm v-if="dataSource.length" title="请确认否发布该码表?" @confirm="onChangecode(record.codeId, '2')">
                <a-button type="primary" size="small">停用</a-button>
              </a-popconfirm>
            </div>
            <!-- 已停用显示按钮 -->
            <div v-if="record.codeType == '已停用'">
              <a-popconfirm v-if="dataSource.length" title="请确认否发布该码表?" @confirm="onChangecode(record.codeId, '1')">
                <a-button type="primary" size="small">发布</a-button>
              </a-popconfirm>
              <a-button type="primary" size="small">编辑</a-button>
            </div>
          </template>
        </template>
      </a-table>
      <!-- 分页 -->
      <a-pagination v-model:current="current" v-model:page-size="pageSizeRef" :page-size-options="pageSizeOptions" :total="total" show-size-changer @showSizeChange="onShowSizeChange">
        <template #buildOptionText="props">
          <span v-if="props.value !== '50'">{{ props.value }}条/页</span>
          <span v-else>全部</span>
        </template>
      </a-pagination>
      <!-- 蒙版区域 -->
      <div v-show="show.outmask" class="mask">
        <!-- 人员性别码表 -->
        <div v-show="show.PersonnelGender" class="PersonnelGender">
          <h1><a href="#" class="close" @click.prevent="closePersonnelGender"> X</a></h1>
          <h2>人员性别码表（{{ personnelcodetable.codename }}）</h2>
          <table class="PersonnelGendertable">
            <thead>
              <tr>
                <th>码值取值</th>
                <th>码值名称</th>
                <th>码值含义</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in personnelcodetable.CodeConfigure" :key="index">
                <td>{{ index + 1 < 10 ? '0' + (index + 1) : index }}</td>
                <td>{{ item.configureName }}</td>
                <td>{{ item.configureMean }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, defineComponent, reactive, ref } from 'vue';
  import type { Ref } from 'vue';
  import { selectCodeTable, AddCodeTable, OnChange, DeleteCode, SelectCodeConfigure, UpdateCode } from '@/api/test/index';
  import { message } from 'ant-design-vue';
  import type { Rule } from 'ant-design-vue/es/form';
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

  const form = reactive({
    name: '',
    url: '',
    owner: '',
    type: '',
    approver: '',
    dateTime: null,
    description: '',
  });

  const rules: Record<string, Rule[]> = {
    name: [{ required: true, message: 'Please enter user name' }],
    url: [{ required: true, message: 'please enter url' }],
    owner: [{ required: true, message: 'Please select an owner' }],
    type: [{ required: true, message: 'Please choose the type' }],
    approver: [{ required: true, message: 'Please choose the approver' }],
    dateTime: [{ required: true, message: 'Please choose the dateTime', type: 'object' }],
    description: [{ required: true, message: 'Please enter url description' }],
  };

  const visible = ref<boolean>(false);

  const showDrawer = () => {
    visible.value = true;
  };

  const onClose = () => {
    visible.value = false;
  };

  // 搜索功能
  const Codetablestatus = ref<string>('');
  const Codetablename = ref<string>('');
  // 表格
  const columns = [
    {
      title: '数据资产表中文名称',
      dataIndex: 'codeId',
      width: '13%',
    },
    {
      title: '数据资产表英文名称',
      dataIndex: 'codeName',
      width: '13%',
    },
    {
      title: '数据资产表描述',
      dataIndex: 'codeExplain',
      width: '30%',
    },
    {
      title: '发布状态',
      dataIndex: 'codeType',
    },
    {
      title: '更新时间',
      dataIndex: 'codeUpdatetime',
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
    let state = '';
    if (Codetablestatus.value == '未发布') state = '0';
    if (Codetablestatus.value == '已发布') state = '1';
    if (Codetablestatus.value == '已停用') state = '2';
    let object = {
      codeType: state,
      codeName: Codetablename.value,
    };
    selectCodeTable(object).then(function (res: any) {
      if (res.data.msg !== '获取成功') return (dataSource.value = []);
      dataSource.value = res.data.data;
      dataSource.value.forEach((item: any) => {
        if (item.codeType == 0) {
          item.codeType = '未发布';
        }
        if (item.codeType == 1) {
          item.codeType = '已发布';
        }
        if (item.codeType == 2) {
          item.codeType = '已停用';
        }
      });
      total.value = dataSource.value.length;
    });
  };
  selectCodeTable_way();
  // 查询按钮
  const query = () => {
    selectCodeTable_way();
  };
  const count = computed(() => dataSource.value.length + 1);
  const onDelete = (code: string) => {
    DeleteCode(code).then(function (res: any) {
      if (res.data.msg == '删除成功') {
        dataSource.value = dataSource.value.filter((item: any) => item.codeId !== code);
      }
    });
  };
  // 判断弹框显示隐藏
  const show = reactive({ outmask: false, addcode: false, inmask: false, addincode: false, editincode: false, PersonnelGender: false });

  // 人员性别编码弹框
  const personnelcodetable = ref({
    codename: '',
    CodeConfigure: [
      {
        configureName: '',
        configureMean: '',
      },
    ],
  });
  const showcode = (codeId: string) => {
    personnelcodetable.value = {
      codename: codeId,
      CodeConfigure: [],
    };

    SelectCodeConfigure(codeId).then(function (res: any) {
      if (res.data.msg == '获取成功') {
        personnelcodetable.value.CodeConfigure = res.data.data;
      }
    });
    show.outmask = true;
    show.PersonnelGender = true;
  };
  // 关闭人员性别编码弹框
  const closePersonnelGender = () => {
    show.outmask = false;
    show.PersonnelGender = false;
  };
  // 重置
  const Reset = () => {
    Codetablestatus.value = '';
    Codetablename.value = '';
    selectCodeTable_way();
  };
  // 全选/反选
  const Selectall_invert = ref([]);
  const rowSelection = ref({
    checkStrictly: false,
    onChange: (selectedRows: any) => {
      Selectall_invert.value = selectedRows;
    },
  });
  // 批量操作
  const ALLonChangecode = (state: string) => {
    if (state === '1') {
      let length = Selectall_invert.value.length;
      for (let i = 0; i < length; i++) {
        let temp: any = dataSource.value.find((element: any) => element.codeId === Selectall_invert.value[i]);
        if (temp.codeType === '已发布') {
          return message.error('已发布状态不可在进行发布');
        }
      }
    }
    if (state === '2') {
      for (let i = 0; i < Selectall_invert.value.length; i++) {
        let temp: any = dataSource.value.find((element: any) => element.codeId === Selectall_invert.value[i]);
        if (temp.codeType == '未发布') return message.error('停用失败，存在未发布的码表！');
      }
      let length = Selectall_invert.value.length;
      for (let i = 0; i < length; i++) {
        let temp: any = dataSource.value.find((element: any) => element.codeId === Selectall_invert.value[i]);
        if (temp.codeType === '已停用') {
          return message.error('已停用状态不可在进行停用');
        }
      }
    }
    let change_array: any = [];
    Selectall_invert.value.forEach(item => {
      change_array.push({
        codeId: item,
        codeType: state,
      });
    });
    if (change_array.length == 0) return message.error('请选择码表进行操作!');
    OnChange(change_array).then(function (res: any) {
      if (res.data.msg == '更新成功') {
        message.success('更新成功!');
        selectCodeTable_way();
      } else return message.error('更新失败！');
    });
  };
  // 分页
  const pageSizeOptions = ref<string[]>(['10', '15', '18', '20']);
  const current = ref(1);
  const pageSizeRef = ref(20);
  const total = ref(dataSource.value.length);
  const onShowSizeChange = (current: number, pageSize: number) => {
    pageSizeRef.value = pageSize;
    selectCodeTable_way();
  };

  // 改变编码状态
  const onChangecode = (codeId: any, state: string) => {
    let object_array = [
      {
        codeId: codeId,
        codeType: state,
      },
    ];
    OnChange(object_array).then(function (res: any) {
      if (res.data.msg == '更新成功') {
        // 有时间前端进行改进 关于重新请求
        message.success('更新成功!');
        selectCodeTable_way();
      }
    });
  };
  // 判断正则表达以编码名是否重复
  const judge = reactive({ Formaterror: false, Rename: false });
</script>

<style lang="less" scoped>
  @import './style.less';
</style>
