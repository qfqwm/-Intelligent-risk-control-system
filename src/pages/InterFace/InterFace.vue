<!-- eslint-disable vue/v-on-event-hyphenation -->
<template>
  <div class="all">
    <!-- 左边资产目录区域 -->
    <InterfaceClassification></InterfaceClassification>
    <!-- 右边数据展示区域 -->
    <div class="right">
      <!-- 搜索区域 -->
      <a-form ref="formRef" name="custom-validation" :model="formState" v-bind="layout" style="display: flex">
        <a-form-item name="area" label="接口来源" style="width: 460px">
          <a-select v-model:value.trim="formState.interMsgSource" :options="areas" />
        </a-form-item>
        <a-form-item name="area" label="API状态" style="width: 460px">
          <a-select v-model:value.trim="formState.interMsgApiType" :options="areas1" />
        </a-form-item>
        <a-form-item has-feedback label="接口名称:" name="checkPass" style="width: 460px">
          <a-input v-model:value="formState.interMsgName" type="text" autocomplete="off" />
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 14, offset: 4 }" style="display: flex; justify-content: end; width: 28%">
          <a-button html-type="submit" @click="reset">重置</a-button>
          <a-button style="margin-left: 10px" type="primary" @click="query">查询</a-button>
        </a-form-item>
      </a-form>
      <!-- 批量和新增按钮栏 -->
      <div style="display: flex; justify-content: end">
        <a-button type="primary" :disabled="!hasSelected1" @click="ALLonChangecode(0)"> 批量发布 </a-button>
        <a-button type="primary" :disabled="!hasSelected2" style="margin-left: 15px" @click="ALLonChangecode(1)"> 批量停用 </a-button>
        <a-button type="primary" style="margin-left: 15px"> 批量分类 </a-button>
        <a-button type="primary" style="margin-left: 15px" @click="router_link"> 人工注册 </a-button>
      </div>
      <!-- 表格区域 -->
      <a-table
        :data-source="dataSource"
        :columns="columns1"
        :row-selection="{ onChange: onSelectChange }"
        :row-key="(dataSource: any) => { return dataSource.interMsgId }"
        :pagination="{
          pageSizeOptions: ['10', '15', '18', '20'],
          showTotal: (total: any) => `共 ${total} 条`,
          showSizeChanger: true,
          defaultPageSize: 10,
          buildOptionText: (size: any) => {
            return Number(size.value) + ' 项' + '/' + '页'
          },
          onChange: (current, pageSize) => {
            current = current;
            pageSize = pageSize;
          }
        }"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'interMsgName'">
            <router-link to="/InterfaceDetail" @click.prevent="showcode(record.interMsgId)">{{ record.interMsgName }} </router-link>
          </template>
          <template v-if="column.dataIndex === 'operation'">
            <!-- 状态按钮 -->
            <div>
              <a-button type="primary" size="small" @click="showTestDrawer(record)">接口测试</a-button>
              <a-popconfirm v-if="dataSource.length" title="请确认否发布该码表?" @confirm="onChangecode(record.interMsgId, 0)">
                <a-button v-if="record.interMsgApiType != '已发布'" type="primary" size="small">发布</a-button>
              </a-popconfirm>
              <a-popconfirm v-if="dataSource.length" title="请确认否停用该码表?" @confirm="onChangecode(record.interMsgId, 1)">
                <a-button v-if="record.interMsgApiType == '已发布'" type="primary" size="small">停用</a-button>
              </a-popconfirm>
              <a-button type="primary" size="small" @click="showDrawer('edit', record)">编辑</a-button>
              <a-popconfirm v-if="dataSource.length" title="请确认是否删除该码表?" @confirm="onDelete(record.interMsgId)">
                <a-button v-if="record.interMsgApiType == '未发布'" type="primary" size="small">删除</a-button>
              </a-popconfirm>
            </div>
          </template>
        </template>
      </a-table>
      <!-- 接口测试抽屉 -->
      <InterfaceTest></InterfaceTest>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import InterfaceTest from '@/pages/InterFace/component/InterfaceTest.vue';
  import InterfaceClassification from './component/InterfaceClassification.vue';
  import type { FormInstance } from 'ant-design-vue';
  import { ref, reactive } from 'vue';
  import { message } from 'ant-design-vue';
  import type { Ref } from 'vue';
  import { SelectCodeConfigure, SelectDirectory, queryIntfc, postDeactivation, delIntfc } from '@/api/test/index';
  import emitter from '@/utils/bus';
  import { useRouter } from 'vue-router';
  import { List } from 'lodash';
  const router = useRouter();

  //查询区域
  interface FormState {
    interMsgSource: string;
    interMsgApiType: string;
    interMsgName: string;
    interDirId: string;
  }
  const formRef = ref<FormInstance>();
  const formState = reactive<FormState>({
    interMsgSource: '',
    interMsgApiType: '',
    interMsgName: '',
    interDirId: '',
  });
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 },
  };

  const areas = [
    { label: '数据服务', value: '0' },
    { label: '指标管理', value: '1' },
    { label: '决策引擎', value: '2' },
  ];
  const areas1 = [
    { label: '未发布', value: '0' },
    { label: '已发布', value: '1' },
    { label: '已停用', value: '2' },
  ];

  const treeData = ref<any[]>([]);
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
    console.log(11111222, sdd.record);

    // Add();
    emitter.emit('sendchild', sdd);
  };

  // 搜索功能
  const interMsgSource = ref<string>('');
  const interMsgApiType = ref<string>('');
  const interMsgName = ref<string>('');

  emitter.on('sendf', val => {
    formState.interDirId = val;
    selectCodeTable_way();
  });
  //表格
  const columns1 = [
    {
      title: '接口名称',
      dataIndex: 'interMsgName',
      width: '13%',
    },
    {
      title: '接口描述',
      dataIndex: 'interMsgDescribe',
      width: '13%',
    },
    {
      title: '接口分类',
      dataIndex: 'interDirId',
      width: '13%',
    },
    {
      title: '接口来源',
      dataIndex: 'interMsgSource',
    },
    {
      title: 'API状态',
      dataIndex: 'interMsgApiType',
    },
    {
      title: '更新时间',
      dataIndex: 'interMsgUpdateTime',
      key: 'interMsgUpdateTime',
      //排序方法
      sorter: (a, b) => {
        let aTime = new Date(a.interMsgUpdateTime).getTime();
        let bTime = new Date(b.interMsgUpdateTime).getTime();

        return aTime - bTime;
      },
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: '23%',
    },
  ];

  const dataSource: Ref<DataItem[]> = ref([]);
  //调用接口加载表格
  const selectCodeTable_way = () => {
    let object = {
      page: 1,
      size: 30,
    };
    enum interMsgApiType {
      未发布,
      已发布,
      已停用,
    }
    enum interMsgSource {
      数据服务 = 0,
      指标管理,
      决策引擎,
    }

    let object1 = { ...object, ...formState };
    // console.log(object1);
    queryIntfc(object1).then(function (res: any) {
      console.log(res.data.data);

      if (res.data.msg !== '返回成功') return (dataSource.value = []);
      dataSource.value = res.data.data.interfaceMsgList;
      console.log(dataSource.value);
      dataSource.value.forEach((item: any) => {
        item.interMsgApiType = interMsgApiType[item.interMsgApiType];
        item.interMsgSource = interMsgSource[item.interMsgSource];
      });
      total.value = dataSource.value.length;
    });
  };
  selectCodeTable_way();

  // 查询按钮
  const query = () => {
    selectCodeTable_way();
  };

  // 重置按钮
  const reset = () => {
    formState.interMsgSource = '';
    formState.interMsgApiType = '';
    formState.interMsgName = '';
    formState.interDirId = '';
    selectCodeTable_way();
    console.log(paginationdata, 'ye');
    paginationdata = 1;
    console.log(paginationdata, 'ye1');
  };
  //删除
  const onDelete = (code: string) => {
    delIntfc(code).then(function (res: any) {
      // if (res.data.msg == '删除成功') {
      dataSource.value = dataSource.value.filter((item: any) => item.interMsgId !== code);
      // }
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
    // console.log(codeId);

    router.push({
      path: '/InterfaceDetail',
      query: { interMsgId: codeId },
    });
    show.outmask = true;
    show.PersonnelGender = true;
  };

  //按钮禁用
  let reslist = ref<any>([]);
  const state = reactive<{ selectedRowKeys: [] }>({
    selectedRowKeys: [], // Check here to configure the default column
  });
  const isRepeat = () => {
    const hash = {};
    for (let i = 0; i < reslist.value.length; i += 1) {
      if (hash[reslist[i]]) {
        return false;
      }
      // 不存在该元素，则赋值为true，可以赋任意值，相应的修改if判断条件即可
      hash[reslist[i]] = true;
    }
    return true;
  };
  const hasSelected1 = computed(() => {
    let someResult1 = reslist.value.every(item => item === '未发布' || item === '已停用');
    if (state.selectedRowKeys.length > 0 && isRepeat() && someResult1) {
      return true;
    } else {
      return false;
    }
  });
  const hasSelected2 = computed(() => {
    let someResult2 = reslist.value.every(item => item === '已发布');
    if (state.selectedRowKeys.length > 0 && someResult2) {
      console.log(state.selectedRowKeys.length);
      return true;
    } else {
      return false;
    }
  });

  // 全选/反选
  const Selectall_invert = ref([]);
  const onSelectChange = (selectedRowKeys: any, record) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    Selectall_invert.value = selectedRowKeys;
    state.selectedRowKeys = selectedRowKeys;
    console.log(record);
    reslist.value = record.map(item => {
      return item.interMsgApiType;
    });
  };

  // const rowSelection = ref({
  //   checkStrictly: false,
  //   onChange: (selectedRows: any, record) => {
  //     Selectall_invert.value = selectedRows;
  //      console.log(selectedRows,'key');
  //      console.log(record,'数据');
  //   },
  //   getCheckboxProps:(record)=>{
  //     console.log(record);
  //     prop:{
  //          disabled: true

  //     }
  //   }

  // });

  // 批量操作 √
  const ALLonChangecode = (state: number) => {
    // let list = Selectall_invert.value;
    const change_array: any = {
      statusType: state,
      interfaceMsgList: Selectall_invert.value,
    };

    postDeactivation(change_array).then(function (res: any) {
      if (res.data.code == 100200) {
        message.success('更新成功!');
        selectCodeTable_way();
      } else return message.error('更新失败！');
    });
  };
  // 分页
  let paginationdata;
  const handleTableChange = pagination => {
    paginationdata = pagination.current;
    console.log(paginationdata, '分页数据');
  };
  // const pageSizeRef = ref(20);
  const total = ref(dataSource.value.length);
  // 改变编码状态 √
  const onChangecode = (interMsgId: number, state: number) => {
    let object_array = {
      statusType: state,
      interfaceMsgList: [interMsgId],
    };
    postDeactivation(object_array).then(function (res: any) {
      if (res.data.code == 100200) {
        // 有时间前端进行改进 关于重新请求
        message.success('更新成功!');
        selectCodeTable_way();
      }
    });
  };
  //接口测试抽屉
  const showTestDrawer = (record: any) => {
    // console.log(333, record);
    emitter.emit('interfaceTest', record);
  };
  // 人工注册跳转
  const router_link = () => {
    router.push({ name: 'manualregistration' });
  };
</script>

<style lang="less" scoped>
  @import './css/style.less';
</style>
