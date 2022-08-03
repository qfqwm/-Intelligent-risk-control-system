<template>
  <div class="all">
    <!-- 左边资产目录区域 -->
    <div class="left">
      <div class="left_title">
        <span>数据资产表目录</span>
        <PlusCircleOutlined @click="stairAdd" />
      </div>
      <div class="left_search">
        <a-input-search v-model:value="search" placeholder="按资产表名称或目录名称查询" enter-button @search="onSearch" />
      </div>
      <div class="left_menu">
        <a-tree v-model:selectedKeys="selectedKeys" :expanded-keys="expandedKeys" :tree-data="treeData" style="background-color: #eee" @expand="handleExpand">
          <template #title="{ name, directoryId }">
            <span v-if="directoryId === '11'" style="color: #1890ff">{{ name }}</span>
            <template v-else>{{ name }}</template>
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
    <!-- 右边数据展示区域 -->
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
        <span>中文名称：</span><input v-model="Codetablename" type="text" /> <span>英文名称：</span><input v-model="Codetablename1" type="text" />
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
            <a href="#" @click.prevent="showcode(record.chineseName)">{{ record.chineseName }}</a>
          </template>
          <template v-if="column.dataIndex === 'englishName'">
            <a href="#" @click.prevent="showcode(record.englishName)">{{ record.englishName }}</a>
          </template>
          <template v-if="column.dataIndex === 'operation'">
            <!-- 未发布显示按钮 -->
            <div v-if="record.assetType == '未发布'">
              <a-popconfirm v-if="dataSource.length" title="请确认否发布该码表?" @confirm="onChangecode(record.codeId, '1')">
                <a-button type="primary" size="small">发布</a-button>
              </a-popconfirm>
              <a-button type="primary" size="small" @click="showDrawer('edit', record)">编辑</a-button>
              <a-popconfirm v-if="dataSource.length" title="请确认是否删除该码表?" @confirm="onDelete(record.codeId)">
                <a-button type="primary" size="small">删除</a-button>
              </a-popconfirm>
            </div>
            <!-- 已发布显示按钮 -->
            <div v-if="record.assetType == '已发布'">
              <a-popconfirm v-if="dataSource.length" title="请确认否发布该码表?" @confirm="onChangecode(record.codeId, '2')">
                <a-button type="primary" size="small">停用</a-button>
              </a-popconfirm>
            </div>
            <!-- 已停用显示按钮 -->
            <div v-if="record.assetType == '已停用'">
              <a-popconfirm v-if="dataSource.length" title="请确认否发布该码表?" @confirm="onChangecode(record.codeId, '1')">
                <a-button type="primary" size="small">发布</a-button>
              </a-popconfirm>
              <a-button type="primary" size="small" @click="showDrawer('edit', record)">编辑</a-button>
            </div>
          </template>
        </template>
      </a-table>
      <!-- 蒙版区域 -->
      <div v-show="show.outmask" class="mask">
        <!-- 企业信息基本表 -->
        <div v-show="show.PersonnelGender" class="PersonnelGender">
          <div class="basemess">
            <h1><a href="#" class="close" @click.prevent="closePersonnelGender"> X</a></h1>
            <h2>企业基本信息表</h2>
            <h3>基本信息</h3><br />
            <span class="label"> 中文名称：</span> {{ personnelcodetable.codename }} <br />
            <span class="label"> 英文名称：</span> <br />
            <h4>数据资产表描述：</h4>
            <span class="label"> 所属目录：</span>
          </div>
          <h3>字段信息</h3><br />
          <table class="PersonnelGendertable">
            <thead>
              <tr>
                <th>字段英文名称</th>
                <th>字段中文名称</th>
                <th>字段说明</th>
                <th>标准映射</th>
                <th>数据类型</th>
                <th>数据长度</th>
                <th>数据精度</th>
                <th>默认值</th>
                <th>取值范围</th>
                <th>枚举范围</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in personnelcodetable.CodeConfigure" :key="index">
                <td>{{ index + 1 < 10 ? '0' + (index + 1) : index }}</td>
                <td>{{ item.configureName }}</td>
                <td>{{ item.configureMean }}</td>
                <td>{{ item.configureName }}</td>
                <td>{{ item.configureMean }}</td>
                <td>{{ item.configureName }}</td>
                <td>{{ item.configureMean }}</td>
                <td>{{ item.configureName }}</td>
                <td>{{ item.configureMean }}</td>
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
  import { ref, watch, createVNode, reactive } from 'vue';
  // import type { MenuProps, FormInstance, TreeSelectProps, TreeProps, SelectProps } from 'ant-design-vue';
  import { Modal, message } from 'ant-design-vue';
  import type { Ref } from 'vue';
  import { OnChange, DeleteCode, SelectCodeConfigure, SelectDataAsset, DeleteDirectory, UpdateDirectoryName, InsertDirectory, SelectDirectory } from '@/api/test/index';
  // import type { Rule } from 'ant-design-vue/es/form';
  import _ from 'lodash';
  import { PlusCircleOutlined, MinusCircleOutlined, ExclamationCircleOutlined, EditOutlined } from '@ant-design/icons-vue';
  // import { cloneDeep } from 'lodash-es';
  // import { object } from 'vue-types';
  import FiveButtons from './component/index.vue';
  import emitter from '@/utils/bus';

  //数据资产目录展示
  // interface treeData {
  //   title: string;
  //   key: string;
  //   children: childrens[];
  // }
  // interface treeData1 {
  //   title: string;
  //   value: string;
  //   children: childrens3[];
  // }

  const search = ref<string>('');
  const treeData = ref<any[]>([]);
  // const treeData1 = ref<any[]>([]);
  SelectDirectory().then(res => {
    treeData.value = res.data.data;
  });

  //数据资产表目录按表名称或目录名称查询
  const expandedKeys = ref<string[]>([]);
  const selectedKeys = ref<string[]>([]);
  const checkedKeys = ref<string[]>([]);
  watch(expandedKeys, () => {
    console.log('expandedKeys', expandedKeys.value);
  });
  const aa = ref();
  watch(selectedKeys, () => {
    console.log('selectedKeys', selectedKeys.value);
    aa.value = selectedKeys.value;
  });
  watch(checkedKeys, () => {
    console.log('checkedKeys', checkedKeys.value);
  });

  const handleExpand = (keys: string[], { expanded, node }) => {
    // expandedKeys = keys
    console.log(keys, expanded, node);
    const tempKeys = ((node.children ? node.children : treeData) || []).map(({ key }) => key);
    if (expanded) {
      expandedKeys.value = _.difference(keys, tempKeys).concat(node.key);
    } else {
      expandedKeys.value = [];
    }
  };
  // 点击搜索进行模糊筛选
  const searchStr = ref('');
  const backupsExpandedKeys: any[] = [];
  const onSearch = () => {
    searchStr.value = search.value;
    if (searchStr.value === '') {
      expandedKeys.value = [];
    } else {
      expandedKeys.value = [];
      const candidateKeysList = getkeyList(searchStr.value, treeData.value, []);
      candidateKeysList.forEach(item => {
        const key = getParentKey(item, treeData.value);
        if (key && !backupsExpandedKeys.some(item => item === key)) {
          backupsExpandedKeys.push(key);
        }
      });
      // let aa1 = backupsExpandedKeys;
      for (let i = 0; i < backupsExpandedKeys.length; i++) {
        getAllParentKey(backupsExpandedKeys[i], treeData.value);
      }
      expandedKeys.value = backupsExpandedKeys.slice();
    }
  };

  // 获取节点中含有value的所有key集合
  const getkeyList = (value, tree, keyList) => {
    let a = tree.length;
    for (let i = 0; i < a; i++) {
      const node = tree[i];
      if (node.title.indexOf(value) > -1) {
        keyList.push(node.key);
      }
      if (node.children) {
        getkeyList(value, node.children, keyList);
      }
    }
    return keyList;
  };
  // // 该递归主要用于获取key的父亲节点的key值
  const getParentKey = (key, tree) => {
    let parentKey;
    let temp;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some(item => item.key === key)) {
          parentKey = node.key;
        } else if ((temp = getParentKey(key, node.children))) {
          parentKey = temp;
        }
      }
    }
    return parentKey;
  };
  // // 获取该节点的所有祖先节点
  const getAllParentKey = (key, tree) => {
    let parentKey;
    if (key) {
      parentKey = getParentKey(key, tree);
      if (parentKey) {
        if (!backupsExpandedKeys.some(item => item === parentKey)) {
          backupsExpandedKeys.push(parentKey);
        }
        getAllParentKey(parentKey, tree);
      }
    }
  };

  //数据资产表目录新增目录
  interface AddData {
    directoryName: string;
    parentId: string;
  }
  const AddData = ref({
    parentId: '',
    directoryName: '',
  });
  const stair_add = ref<boolean>(false);
  const addStair = ref<string>('');
  const stairAdd = () => {
    stair_add.value = true;
    addStair.value = '';
  };
  const handleOkStairAdd = () => {
    stair_add.value = false;
    AddData.value.parentId = '0';
    AddData.value.directoryName = addStair.value;
    console.log(AddData.value);
    InsertDirectory(AddData.value).then(() => {
      console.log(11);
    });
  };

  //数据资产表目录新增下级目录
  const visible_add = ref<boolean>(false);
  const addSecond = ref();
  const add = () => {
    visible_add.value = true;
    addSecond.value = '';
  };
  const handleOkAdd = () => {
    visible_add.value = false;
    AddData.value.parentId = aa.value[0];
    AddData.value.directoryName = addSecond.value;
    InsertDirectory(AddData.value).then(() => {
      console.log(11);
    });
  };

  //数据资产表目录删除
  const remove = () => {
    Modal.confirm({
      title: '请确认是否删除该目录',
      icon: createVNode(ExclamationCircleOutlined),
      okText: '是',
      cancelText: '否',
      onOk() {
        console.log('是', typeof aa.value[0]);
        DeleteDirectory(aa.value[0]).then(() => {
          console.log(11);
        });
      },
      onCancel() {
        console.log('否');
      },
    });
  };

  //数据资产表目录编辑
  const EditData = ref({
    directoryId: '',
    directoryName: '',
  });
  const visible_edit = ref<boolean>(false);
  const editSecond = ref();
  const edit = () => {
    visible_edit.value = true;
    editSecond.value = '';
  };
  const handleOkEdit = () => {
    visible_edit.value = false;
    EditData.value.directoryId = aa.value[0];
    EditData.value.directoryName = editSecond.value;
    UpdateDirectoryName(EditData.value).then(() => {
      console.log(11);
    });
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

  const visible = ref<boolean>(false);

  const showDrawer = (type: string, record: any) => {
    const sdd = reactive({
      type: type,
      record: record,
      visible: visible,
      treeData: treeData,
    });
    // Add();
    emitter.emit('sendchild', sdd);
  };

  // 搜索功能
  const Codetablestatus = ref<string>('');
  const Codetablename = ref<string>('');
  const Codetablename1 = ref<string>('');
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
    let state = '';
    if (Codetablestatus.value == '未发布') state = '0';
    if (Codetablestatus.value == '已发布') state = '1';
    if (Codetablestatus.value == '已停用') state = '2';
    let object = {
      assetType: state,
      chineseName: Codetablename.value,
      englishName: Codetablename1.value,
    };
    SelectDataAsset(object).then(function (res: any) {
      console.log(res);

      if (res.data.msg !== '返回成功') return (dataSource.value = []);
      dataSource.value = res.data.data;
      console.log(dataSource.value);

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
  // 查询按钮
  const query = () => {
    selectCodeTable_way();
  };
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
    Codetablename1.value = '';
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
  // const pageSizeRef = ref(20);
  const total = ref(dataSource.value.length);

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

  // const ttt = reactive({
  //   visible: visible,
  //   treeData: treeData,
  // });

  // const Add = () => {
  //   emitter.emit('sendchild', ttt);
  // };
</script>

<style lang="less" scoped>
  @import './style.less';
</style>
