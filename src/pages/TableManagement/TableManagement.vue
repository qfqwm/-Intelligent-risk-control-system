<template>
  <!-- 搜索区域 -->
  <a-form :model="Search" name="search" autocomplete="off" :style="{ display: 'flex', justifyContent: 'space-around', width: '100%' }">
    <a-form-item label="码表状态" name="codeType" :style="{ marginRight: '20px' }">
      <a-select v-model:value.trim="Search.codeType" :options="codeType_areas" :style="{ minWidth: '130px' }" />
    </a-form-item>
    <a-form-item label="码表名称" name="codeName" :style="{ marginRight: '20px' }">
      <a-input v-model:value.trim="Search.codeName" placeholder="请输入码表名称" />
    </a-form-item>
    <a-form-item>
      <a-button class="Reset" :style="{ marginRight: '10px' }" @click="Reset">重置</a-button>
      <a-button class="query" @click="query">查询</a-button>
    </a-form-item>
  </a-form>
  <!-- 五个按钮区域 -->
  <div class="button">
    <div class="left">
      <a-button type="primary" :disabled="batchIssue" size="small" @click="ALLonChangecode('1')">批量发布</a-button>
      <a-button type="primary" :disabled="batchBlockUp" size="small" @click="ALLonChangecode('2')">批量停用</a-button>
    </div>
    <div class="right">
      <a-button type="primary" size="small" @click="downexecel()">码表模板下载</a-button>
      <a-button type="primary" size="small" @click="importexe()">码表导入</a-button>
      <a-button type="primary" size="small" @click="codetable('add', {})">新增码表</a-button>
      <form action="/" method="get" enctype="multipart/form-data">
        <input ref="uploadInput" type="file" style="display: none" name="icon" @change="dealfilechange" />
      </form>
    </div>
  </div>
  <!-- 表格区域 -->
  <a-table :data-source="dataSource" :columns="columns" :row-selection="rowSelection" :pagination="pagination" :row-key="Record_selection">
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'codeId'">
        <a href="#" @click.prevent="showcode(record.codeId, record.codeName)">{{ record.codeId }}</a>
      </template>
      <template v-if="column.dataIndex === 'operation'">
        <!-- 未发布显示按钮 -->
        <div v-if="record.codeType == '未发布'">
          <a-popconfirm v-if="dataSource.length" title="请确认否发布该码表?" @confirm="onChangecode(record.codeId, '1')">
            <a-button type="primary" size="small">发布</a-button>
          </a-popconfirm>
          <a-button type="primary" size="small" @click="codetable('edit', record)">编辑</a-button>
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
          <a-button type="primary" size="small" @click="codetable('edit', record)">编辑</a-button>
        </div>
      </template>
    </template>
  </a-table>
  <AddEdit :add_edit_type="add_edit_type" :record_object="record_object" :show_drawer_number="showDrawer_number" :showcode_num="num_showcode" :code_details="code_details" />
</template>
<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import type { Ref } from 'vue';
  import AddEdit from '@/pages/TableManagement/AddEdit.vue';
  import { selectCodeTable, OnChange, DeleteCode, down, importExcel } from '@/api/test/index';
  import { message } from 'ant-design-vue';
  import emitter from '@/utils/bus';
  interface DataItem {
    key: string;
    codeId: string;
    codeName: string;
    codeExplain: string;
    codeType: number;
    codeUpdatetime: string;
    codeCreattime: string;
    allCodeTable: object;
  }
  interface Search {
    codeType: string;
    codeName: string;
    page: number;
    size: number;
  }
  const Search = reactive<Search>({
    codeType: '',
    codeName: '',
    page: 1,
    size: 20,
  });
  const dataSource: Ref<DataItem[]> = ref([]);
  enum codeType {
    '未发布',
    '已发布',
    '已停用',
  }
  //新增编辑页面调用主页面的方法
  emitter.on('sendcode', () => {
    select_CodeTable();
  });
  const codeType_areas = [
    { label: '未发布', value: '0' },
    { label: '已发布', value: '1' },
    { label: '已停用', value: '2' },
  ];
  const select_CodeTable = () => {
    selectCodeTable(Search).then(function (res: any) {
      if (res.data.code !== 100200) return (dataSource.value = []);
      dataSource.value = res.data.data.nowTable;
      dataSource.value.forEach((item: any) => {
        item.codeType = codeType[item.codeType];
      });
      total.value = res.data.data.total;
      allpage.value = res.data.data.allpage;
    });
  };
  select_CodeTable();
  // 重置
  const Reset = () => {
    Search.codeType = '';
    Search.codeName = '';
    select_CodeTable();
  };
  // 查询
  const query = () => {
    select_CodeTable();
  };
  // 表格分页区
  const total = ref<number>();
  const allpage = ref<number>();
  const pageSize = ref<number>(20);
  const pagination = computed(() => ({
    total: total.value,
    current: allpage.value,
    pageSize: pageSize.value,
    showTotal: (total: any) => `总共 ${total} 项`,
    pageSizeOptions: ['5', '10', '15', '20'],
    showSizeChanger: true,
    showQuickJumper: true,
    buildOptionText: (size: any) => {
      return Number(size.value) + ' 项/页';
    },
    onShowSizeChange: (current: number, size: number) => {
      pageSize.value = size;
      Search.page = current;
      Search.size = size;
      select_CodeTable();
    },
    onChange: (current: number, size: number) => {
      Search.page = current;
      Search.size = size;
      select_CodeTable();
    },
  }));
  const Record_selection = (dataSource: any) => {
    return dataSource.codeId;
  };

  // 表格
  const columns = [
    {
      title: '码表编号',
      dataIndex: 'codeId',
      width: '15%',
      ellipsis: true,
    },
    {
      title: '码表名称',
      dataIndex: 'codeName',
      ellipsis: true,
    },
    {
      title: '码表说明',
      dataIndex: 'codeExplain',
      width: '520px',
      ellipsis: true,
    },
    {
      title: '码表状态',
      dataIndex: 'codeType',
      ellipsis: true,
    },
    {
      title: '更新时间',
      dataIndex: 'codeUpdatetime',
      ellipsis: true,
      key: 'codeUpdatetime',
      //排序方法
      sorter: (a, b) => {
        let aTime = new Date(a.codeUpdatetime).getTime();
        let bTime = new Date(b.codeUpdatetime).getTime();
        return aTime - bTime;
      },
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: '220px',
      ellipsis: true,
    },
  ];
  // 新增/编辑码表
  const add_edit_type = ref<string>('');
  const record_object = ref<any>({});
  // 定义调用次数
  const showDrawer_number = ref<number>(0);
  const codetable = (type: string, record: any) => {
    add_edit_type.value = type;
    record_object.value = record;
    showDrawer_number.value++;
  };
  // 删除码表
  const onDelete = (code: string) => {
    DeleteCode(code).then(function (res: any) {
      if (res.data.code == 100200) {
        dataSource.value = dataSource.value.filter((item: any) => item.codeId !== code);
        return message.success(res.data.data);
      }
    });
  };

  //批量按钮操作
  const batchIssue = ref<boolean>(true);
  const batchBlockUp = ref<boolean>(true);

  // 全选/反选
  const Selectall_invert = ref([]);
  const rowSelection = ref({
    selectedRowKeys: Selectall_invert,
    onChange: (selectedRows: any) => {
      Selectall_invert.value = selectedRows;
      console.log(Selectall_invert.value, 'iisd');

      if (Selectall_invert.value != ('' as any)) {
        batchIssue.value = false;
      }
      if (Selectall_invert.value == ('' as any)) {
        batchIssue.value = true;
      }
    },
    // onChange: (selectedRowKeys, selectedRows) => {
    //   console.log(selectedRowKeys, selectedRows);
    // Selectall_invert.value = selectedRows;
    // selectedRows.forEach(p => {
    //   if (p.codeType == '未发布') {
    //     batchIssue.value = false;
    //   } else {
    //     batchIssue.value = true;
    //   }
    // if (p.codeType == '已发布') {
    //   batchBlockUp.value = false;
    // } else {
    //   batchBlockUp.value = true;
    // }
    // });
    // },
  });
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
        message.success('更新成功!');
        select_CodeTable();
      }
    });
  };
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
        Selectall_invert.value = [];
        message.success('更新成功!');
        select_CodeTable();
      } else return message.error('更新失败！');
    });
  };

  // 详情显示
  const num_showcode = ref<number>(0);
  const code_details = reactive<any>({ showcode_id: '', details_name: '' });
  const showcode = (id: string, name: string) => {
    num_showcode.value++;
    code_details.showcode_id = id;
    code_details.details_name = name;
  };

  //模板下载
  const downexecel = () => {
    down().then(function (res: any) {
      let blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' });
      let downloadElement = document.createElement('a');
      let href = window.URL.createObjectURL(blob); //创建下载的链接
      downloadElement.href = href;
      downloadElement.download = 'xxx.xlsx'; //下载后文件名
      document.body.appendChild(downloadElement);
      downloadElement.click(); //点击下载
      document.body.removeChild(downloadElement); //下载完成移除元素
      window.URL.revokeObjectURL(href); //释放掉blob对象
    });
  };

  const uploadInput = ref<HTMLElement | null>(null);
  const dealfilechange = (e: Event) => {
    const input = e.target as HTMLInputElement;
    let files = input.files;
    if (files) {
      // console.log(files[0]);
    }
    let forms = new FormData();
    //下面的file是后端要求的key
    importExcel(forms).then(function (res: any) {
      // console.log(res);
    });
  };

  const importexe = () => {
    // console.log(uploadInput.value);

    let oBtn = uploadInput.value as HTMLInputElement;
    oBtn.click();
  };
</script>
<style lang="less" scoped>
  @import './tablemannagement_style.less';
</style>
