<template>
  <div class="all">
    <!-- 左边资产目录区域 -->
    <InterfaceClassification></InterfaceClassification>
    <!-- 右边数据展示区域 -->
    <div class="right">
      <!-- 搜索区域 -->
      <a-form
        ref="formRef"
        name="custom-validation"
        :model="formState"
        :rules="rules"
        v-bind="layout"
        style="display: flex"
        @finish="handleFinish"
        @validate="handleValidate"
        @finishFailed="handleFinishFailed"
      >
        <a-form-item name="area" label="接口来源" :rules="[{ message: 'Missing area' }]" style="width: 41%">
          <a-select :options="areas" />
        </a-form-item>
        <a-form-item name="area" label="API状态" :rules="[{ message: 'Missing area' }]" style="width: 41%">
          <a-select :options="areas" />
        </a-form-item>
        <a-form-item has-feedback label="接口名称:" name="checkPass" style="width: 41%">
          <a-input v-model:value="formState.checkPass" type="text" autocomplete="off" />
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 14, offset: 4 }" style="display: flex; justify-content: end; width: 28%">
          <a-button html-type="submit" @click="reset">重置</a-button>
          <a-button style="margin-left: 10px" type="primary" @click="query">查询</a-button>
        </a-form-item>
      </a-form>
      <div style="display: flex; justify-content: end">
        <a-button type="dark"> 批量发布 </a-button>
        <a-button type="dark" style="margin-left: 15px"> 批量停用 </a-button>
        <a-button type="dark" style="margin-left: 15px"> 批量分类 </a-button>
        <a-button type="primary" style="margin-left: 15px"> 人工注册 </a-button>
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
            <router-link to="/InterfaceDetail" @click.prevent="showcode(record.chineseName)">{{ record.chineseName }}</router-link>
          </template>
          <template v-if="column.dataIndex === 'operation'">
            <!-- 未发布显示按钮 -->
            <div v-if="record.assetType == '未发布'">
              <a-button type="primary" size="small" @click="showTestDrawer(record)">接口测试</a-button>
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
              <a-button type="primary" size="small" @click="showTestDrawer(record)">接口测试</a-button>
              <a-popconfirm v-if="dataSource.length" title="请确认否发布该码表?" @confirm="onChangecode(record.codeId, '2')">
                <a-button type="primary" size="small">停用</a-button>
              </a-popconfirm>
            </div>
            <!-- 已停用显示按钮 -->
            <div v-if="record.assetType == '已停用'">
              <a-button type="primary" size="small" @click="showTestDrawer(record)">接口测试</a-button>
              <a-popconfirm v-if="dataSource.length" title="请确认否发布该码表?" @confirm="onChangecode(record.codeId, '1')">
                <a-button type="primary" size="small">发布</a-button>
              </a-popconfirm>
              <a-button type="primary" size="small" @click="showDrawer('edit', record)">编辑</a-button>
            </div>
          </template>
        </template>
      </a-table>
      //
      <InterfaceTest></InterfaceTest>
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
  import InterfaceClassification from '@/pages/Interface/component/InterfaceClassification.vue';
  import InterfaceTest from '@/pages/Interface/component/InterfaceTest.vue';
  import type { Rule } from 'ant-design-vue/es/form';
  import type { FormInstance } from 'ant-design-vue';
  import { ref, reactive } from 'vue';
  import { message } from 'ant-design-vue';
  import type { Ref } from 'vue';
  import { OnChange, DeleteCode, SelectCodeConfigure, SelectDataAsset, SelectDirectory } from '@/api/test/index';
  import emitter from '@/utils/bus';
  interface FormState {
    pass: string;
    checkPass: string;
    age: number | undefined;
  }
  const formRef = ref<FormInstance>();
  const formState = reactive<FormState>({
    pass: '',
    checkPass: '',
    age: undefined,
  });
  let checkAge = async (_rule: Rule, value: number) => {
    if (!value) {
      return Promise.reject('Please input the age');
    }
    if (!Number.isInteger(value)) {
      return Promise.reject('Please input digits');
    } else {
      if (value < 18) {
        return Promise.reject('Age must be greater than 18');
      } else {
        return Promise.resolve();
      }
    }
  };
  let validatePass = async (_rule: Rule, value: string) => {
    if (value === '') {
      return Promise.reject('Please input the password');
    } else {
      if (formState.checkPass !== '') {
        formRef.value.validateFields('checkPass');
      }
      return Promise.resolve();
    }
  };
  let validatePass2 = async (_rule: Rule, value: string) => {
    if (value === '') {
      return Promise.reject('Please input the password again');
    } else if (value !== formState.pass) {
      return Promise.reject("Two inputs don't match!");
    } else {
      return Promise.resolve();
    }
  };

  const rules: Record<string, Rule[]> = {
    pass: [{ required: true, validator: validatePass, trigger: 'change' }],
    checkPass: [{ validator: validatePass2, trigger: 'change' }],
    age: [{ validator: checkAge, trigger: 'change' }],
  };
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 },
  };
  const handleFinish = (values: FormState) => {
    console.log(values, formState);
  };
  const handleFinishFailed = (errors: any) => {
    console.log(errors);
  };
  const handleValidate = (...args: any[]) => {
    console.log(args);
  };

  const areas = [
    { label: 'Beijing', value: 'Beijing' },
    { label: 'Shanghai', value: 'Shanghai' },
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
  const Codetablestatus = ref<string>('');
  const Codetablename = ref<string>('');
  const Codetablename1 = ref<string>('');
  // 表格
  const columns = [
    {
      title: '接口名称',
      dataIndex: 'chineseName',
      width: '13%',
    },
    {
      title: '接口描述',
      dataIndex: 'englishName',
      width: '13%',
    },
    {
      title: '接口分类',
      dataIndex: 'assetExplain',
      width: '13%',
    },
    {
      title: '接口来源',
      dataIndex: 'assetExplain',
    },
    {
      title: 'API状态',
      dataIndex: 'assetType',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: '23%',
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
  const reset = () => {
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
  //接口测试抽屉
  const showTestDrawer = (record: any) => {
    console.log(record);

    emitter.emit('interfaceTest', visible.value);
  };
</script>

<style lang="less" scoped>
  @import './css/style.less';
</style>
