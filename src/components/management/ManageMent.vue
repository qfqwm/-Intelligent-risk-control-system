<template>
  <div class="all">
    <div class="left">
      <div class="left_title">
        <span>数据资产表目录</span>
        <PlusCircleOutlined @click="stairAdd" />
      </div>
      <div class="left_search">
        <a-input-search v-model:value="search" placeholder="按资产表名称或目录名称查询" enter-button @search="onSearch" />
      </div>
      <div class="left_menu">
         <a-tree
          v-model:selectedKeys="selectedKeys"
          :expanded-keys="expandedKeys"
          :tree-data="treeData"
          style="background-color: #eee;"
          @expand="handleExpand"
        >
          <template #title="{ title, key }">
            <span v-if="key === '0-0-1-0'" style="color: #1890ff">{{ title }}</span>
            <template v-else>{{ title }}</template> 
            <span>
              <PlusCircleOutlined @click="add" />
              <MinusCircleOutlined @click="remove" />
              <EditOutlined @click="edit" />
            </span>
          </template>
        </a-tree>
      </div>
      <!-- 数据资产表目录新增目录弹框 -->
      <a-modal
        v-model:visible="stair_add"
        title="新增一级目录"
        ok-text="确认"
        cancel-text="取消"
        style="text-align: center"
        width="24rem"
        :ok-button-props="{ style: { marginRight: '6rem' } }"
        @ok="handleOkStairAdd"
      >
        <p class="tk"><span>*</span>目录名称：<input v-model="addStair" type="text" /></p>
        <!-- <template slot="footer" style="margin: 0 auto;">
        </template> -->
      </a-modal>
      <!-- 数据资产表目录新增下级目录弹框 -->
      <a-modal
        v-model:visible="visible_add"
        title="新增下级目录"
        ok-text="确认"
        cancel-text="取消"
        style="text-align: center"
        width="24rem"
        :ok-button-props="{ style: { marginRight: '6rem' } }"
        @ok="handleOkAdd"
      >
        <p class="tk"><span>*</span>目录名称：<input v-model="addSecond" type="text" /></p>
      </a-modal>
      <!-- 数据资产表目录编辑目录弹框 -->
      <a-modal
        v-model:visible="visible_edit"
        title="编辑目录"
        ok-text="确认"
        cancel-text="取消"
        style="text-align: center"
        width="24rem"
        :ok-button-props="{ style: { marginRight: '6rem' } }"
        @ok="handleOkEdit"
      >
        <p class="tk"><span>*</span>目录名称：<input v-model="editSecond" type="text" /></p>
      </a-modal>
    </div>

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
        :row-key="(dataSource: any) => { return dataSource.codeId }"
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
  import { ref, watch, createVNode, computed, reactive } from 'vue';
  import { Modal, message } from 'ant-design-vue';
  import type { Ref } from 'vue';
  import { selectCodeTable, OnChange, DeleteCode, SelectCodeConfigure } from '@/api/test/index';
  import type { Rule } from 'ant-design-vue/es/form';
  import { PlusCircleOutlined, MinusCircleOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import { InsertDirectory, SelectDirectory } from '@/api/test/index';
  import type { TreeProps } from 'ant-design-vue';
  import _, { filter } from 'lodash';

  //数据资产表目录按表名称或目录名称查询
  const search = ref<string>('');
  const onSearch = (searchValue: string) => {
    console.log(searchValue);
    // console.log(search.value);
  };

  const treeData: TreeProps['treeData'] = [
    {
      title: '工商司法',
      key: '0-0',
      children: [
        {
          title: '企业基本信息',
          key: '0-0-0',
          children: [
            { title: '企业文化', key: '0-0-0-0' },
            { title: '企业职员', key: '0-0-0-1' },
          ],
        },
        {
          title: '企业详细信息',
          key: '0-0-1',
          children: [{title: '高层领导', key: '0-0-1-0' }],
        },
      ],
    },
    {
      title: '企业资产',
      key: '1-0',
      children: [
        {
          title: '工商司法',
          key: '1-0-0',
        },
        {
          title: '税务信息',
          key: '2-0-1',
        },
      ],
    },
  ];
  const expandedKeys = ref<string[]>([]);
  const selectedKeys = ref<string[]>([]);
  const checkedKeys = ref<string[]>([]);
  watch(expandedKeys, () => {
    console.log('expandedKeys', expandedKeys.value);
  });
  watch(selectedKeys, () => {
    console.log('selectedKeys', selectedKeys.value);
  });
  watch(checkedKeys, () => {
    console.log('checkedKeys', checkedKeys.value);
  });
  const handleExpand = (keys: string[], { expanded, node }) => {
    const tempKeys = ((node.parent ? node.parent.children : treeData) || []).map(
      ({ key }) => key,
    );
    console.log(keys);
    
    if (expanded) {
      expandedKeys.value = _.difference(keys, tempKeys).concat(node.key);
    } else {
      expandedKeys.value = keys;
    }
  };

  const insertDirectory = ref([
    {
      parentId: 'sub1',
      directoryName: '启信宝数据',
    },
  ]);
  const data1 = ref([
    {
      key: '',
      title: '',
      children:[]
    },
  ]);

  //数据资产表目录新增目录
  const stair_add = ref<boolean>(false);
  const addStair =ref<string>('')
  const stairAdd = (() => {
    stair_add.value = true;
    addStair.value = ''
  })
  const handleOkStairAdd = () => {
    stair_add.value = false;
    console.log(addStair.value);
    
    data1.value[0].key = (treeData.length+1) + '-0'
    data1.value[0].title = addStair.value
    console.log(data1.value[0]);
    
    treeData.push(data1.value[0])
    // InsertDirectory(insertDirectory).then((res) => {
    //   console.log(res.data.data);
    // })
  };
  //数据资产表目录新增下级目录
  const visible_add = ref<boolean>(false);
  const addSecond = ref<string>();
  const add = () => {
    visible_add.value = true;
    addSecond.value = '';
  };
  const handleOkAdd = () => {
    visible_add.value = false;
    console.log(addSecond.value);
    console.log(selectedKeys.value);

  };
  //数据资产表目录删除
  const remove = () => {
    Modal.confirm({
      title: '请确认是否删除该目录',
      icon: createVNode(ExclamationCircleOutlined),
      okText: '是',
      cancelText: '否',
      onOk() {
        console.log('是');
      },
      onCancel() {
        console.log('否');
      },
    });
  };
  //数据资产表目录编辑
  const visible_edit = ref<boolean>(false);
  const editSecond = ref<string>();
  const edit = () => {
    visible_edit.value = true;
    editSecond.value = '';
  };
  const handleOkEdit = () => {
    visible_edit.value = false;
    console.log(editSecond.value);
    console.log(selectedKeys.value);

  };

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
