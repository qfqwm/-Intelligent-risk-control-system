<template>
  <!-- 搜索区域 -->
  <div class="search">
    <span>码表状态：</span>
    <select v-model="Codetablestatus">
      <option value="未发布">未发布</option>
      <option value="已发布">已发布</option>
      <option value="已停用">已停用</option>
      <option value="" selected></option>
    </select>
    <span>码表名称：</span><input v-model="Codetablename" type="text" />
    <a-button class="Reset" @click="Reset">重置</a-button>
    <a-button class="query" @click="query">查询</a-button>
  </div>
  <!-- 五个按钮区域 -->
  <div class="button">
    <div class="left">
      <a-button type="primary" size="small" @click="ALLonChangecode('1')">批量发布</a-button>
      <a-button type="primary" size="small" @click="ALLonChangecode('2')">批量停用</a-button>
    </div>
    <div class="right">
      <a-button type="primary" size="small" @click="downexecel()">码表模板下载</a-button>
      <a-button type="primary" size="small" @click="importexe()">码表导入</a-button>
      <form action="/" method="get" enctype="multipart/form-data">
        <input ref="uploadInput" type="file" style="display: none" name="icon" @change="dealfilechange" />
      </form>
      <a-button type="primary" size="small" @click="codetable('add', {})">新增码表</a-button>
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
        <a href="#" @click.prevent="showcode(record.codeId)">{{ record.codeId }}</a>
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
  <!-- 蒙版区域 -->
  <div v-show="show.outmask" class="mask">
    <!-- 新增/编辑码表 -->
    <div v-show="show.addcode" class="add">
      <h3 v-if="change_add_edit">新增码表</h3>
      <h3 v-else>编辑码表</h3>
      <hr /><br />
      码表名称： <input v-model="addoreditcodename" type="text" placeholder="请输入标准中文数名称" /><br />
      <div class="tips"><span v-if="judge.Formaterror" class="tip1">请输入标准中文数名称</span><span v-else-if="judge.Rename" v-show="false" class="tip2">码表名字重复</span><br v-else /></div>
      码表说明： <textarea v-model="addoreditcodeexplain" placeholder="请输入标准说明"></textarea> <br /><br />
      <hr />
      编码配置：<a-button type="primary" size="small" class="addcode" @click="addcodeconfigure">添加</a-button>
      <!-- 编码配置表格 -->
      <table class="codetable">
        <thead>
          <tr>
            <th>码值取值</th>
            <th>码值名称</th>
            <th>码值含义</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody v-if="codepztable[0].configureName != ''">
          <tr v-for="(item, index) in codepztable" :key="index">
            <td>{{ index + 1 < 10 ? '0' + (index + 1) : index }}</td>
            <td>{{ item.configureName }}</td>
            <td>{{ item.configureMean }}</td>
            <td><a href="#" @click.prevent="editcodeconfigure(index)">编辑</a> | <a href="#" @click.prevent="deletecodeconfigure(index)">删除</a></td>
          </tr>
        </tbody>
      </table>
      <!-- 新增编码弹框的取消、确定按钮 -->
      <div class="bottom">
        <a-button size="big" @click="canceltable">取消</a-button>
        <a-button type="primary" size="big" @click="confirmtable">确认</a-button>
      </div>
      <!-- 添加/编辑弹框 -->
      <div v-show="show.inmask" class="PopupMask">
        <!-- 添加 -->
        <div v-if="show.addincode" class="codediv">
          <h4>添加编码配置</h4>
          <hr />
          <div class="content">
            编码名称：<input v-model="addcodename" type="text" placeholder="请输入编码名称" /> 编码含义：<textarea v-model="addcodemeaning" placeholder="请输入编码含义"></textarea>
          </div>
          <div class="bottom">
            <a-button size="small" @click="canceladdcodeconfigure">取消</a-button>
            <a-button type="primary" size="small" @click="confirmaddcodeconfigure">确认</a-button>
          </div>
        </div>
        <!-- 编辑 -->
        <div v-show="show.editincode" class="codediv">
          <h4>编辑编码配置</h4>
          <hr />
          <div class="content">
            编码名称：<input v-model="editincode_name" type="text" placeholder="请输入编码名称" /> 编码含义：<textarea v-model="editincode_meaning" placeholder="请输入编码含义"></textarea>
          </div>
          <div class="bottom">
            <a-button size="small" @click="canceleditcodeconfigure">取消</a-button>
            <a-button type="primary" size="small" @click="confirmeditcodeconfigure">确认</a-button>
          </div>
        </div>
      </div>
    </div>
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
</template>
<script lang="ts" setup>
  import { computed, reactive, ref } from 'vue';
  import type { Ref } from 'vue';
  import { selectCodeTable, AddCodeTable, OnChange, DeleteCode, SelectCodeConfigure, UpdateCode, down, importExcel } from '@/api/test/index';
  import { message } from 'ant-design-vue';
  import { object } from 'vue-types';
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

  // 搜索功能
  const Codetablestatus = ref<string>('');
  const Codetablename = ref<string>('');
  // 表格
  const columns = [
    {
      title: '码表编号',
      dataIndex: 'codeId',
      width: '15%',
    },
    {
      title: '码表名称',
      dataIndex: 'codeName',
    },
    {
      title: '码表说明',
      dataIndex: 'codeExplain',
      width: '520px',
    },
    {
      title: '码表状态',
      dataIndex: 'codeType',
    },
    {
      title: '更新时间',
      dataIndex: 'codeUpdatetime',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: '220px',
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
  const change_add_edit = ref<boolean>(true);
  // 新增码表按钮
  const codeId = ref();
  const codetable = (type: string, codetable: any) => {
    show.outmask = true;
    show.addcode = true;
    codepztable.value = [{ configureName: '', configureMean: '', configureValue: '' }];
    addoreditcodename.value = '';
    addoreditcodeexplain.value = '';
    if (type == 'add') {
      change_add_edit.value = true;
    }
    if (type == 'edit') {
      name.value = codetable.codeName;
      codeId.value = codetable.codeId;
      change_add_edit.value = false;
      addoreditcodename.value = codetable.codeName;
      addoreditcodeexplain.value = codetable.codeExplain;
      SelectCodeConfigure(codetable.codeId).then(function (res: any) {
        if (res.data.msg == '获取成功') {
          codepztable.value = res.data.data;
        }
      });
    }
  };
  // 取消新增码表弹框
  const canceltable = () => {
    show.outmask = false;
    show.addcode = false;
  };
  // 确定新增码表弹框
  const confirmtable = () => {
    let object = {
      codeName: addoreditcodename.value,
      codeExplain: addoreditcodeexplain.value,
      codeConfigureList: codepztable.value,
    };
    if (codepztable.value[0].configureName == '') {
      object.codeConfigureList = [];
    }

    if (change_add_edit.value) {
      console.log(object);

      AddCodeTable(object).then(function (res: any) {
        if (res.data.msg == '有重复值，请检查后重新输入') return message.error('码表名字重复');
        if (res.data.msg == '新增码表成功') {
          message.success('码表新增成功！');
          selectCodeTable_way();
        } else {
          message.error('请输入正确的编码名称');
        }
      });
    } else {
      let object = {
        codeName: addoreditcodename.value,
        codeExplain: addoreditcodeexplain.value,
        codeConfigureList: codepztable.value,
        codeId: codeId.value,
        codeType2: '0',
      };
      object.codeConfigureList = object.codeConfigureList.filter((item: any) => item.configureType != 0);
      if (addoreditcodename.value == name.value) {
        object.codeType2 = '0';
      } else {
        object.codeType2 = '1';
      }
      UpdateCode(object).then(function (res: any) {
        if (res.data.msg == '有重复，检查后重新输入') return message.error('码表名字重复!');
        if (res.data.msg == '更新成功') {
          selectCodeTable_way();
          message.success('码表更新成功！');
        } else {
          message.error('请输入正确的码表名称!');
        }
      });
    }
    show.outmask = false;
    show.addcode = false;
  };
  const name = ref<string>('');
  // 新增编码配置添加按钮
  const addcodeconfigure = () => {
    show.inmask = true;
    show.addincode = true;
  };
  // 取消新增编码配置添加按钮
  const canceladdcodeconfigure = () => {
    show.inmask = false;
    show.addincode = false;
  };
  // 确定新增编码配置添加按钮
  const confirmaddcodeconfigure = () => {
    show.inmask = false;
    show.addincode = false;
    let checkname = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
    if (!checkname.test(addcodename.value)) return message.error('请输入正确的码值名称');
    let morename = [];
    for (let i = 0; i < codepztable.value.length; i++) {
      morename.push(codepztable.value[i].configureName);
    }
    morename = [...new Set(morename)];
    if (morename.indexOf(addcodename.value) !== -1) return message.error('码值名字重复');
    if (change_add_edit.value) {
      if (codepztable.value[0].configureName == '') {
        codepztable.value[0] = { configureName: addcodename.value, configureMean: addcodemeaning.value, configureValue: '01' };
      } else {
        codepztable.value.push({ configureName: addcodename.value, configureMean: addcodemeaning.value, configureValue: '0' + (codepztable.value.length + 1) });
      }
    } else {
      let length = codepztable.value.length;
      if (codepztable.value[0].configureName == '') {
        codepztable.value[0] = {
          configureValue: length < 10 ? '0' + (length + 1) : length + 1 + '',
          codeId: codeId.value,
          configureType: 2,
          configureName: addcodename.value,
          configureMean: addcodemeaning.value,
        };
      } else {
        codepztable.value.push({
          configureValue: length < 0 ? '0' + (length + 1) : length + 1 + '',
          codeId: codeId.value,
          configureType: 2,
          configureName: addcodename.value,
          configureMean: addcodemeaning.value,
        });
      }
    }
    addcodename.value = '';
    addcodemeaning.value = '';
  };
  // 编码配置编辑
  const editincode_name = ref('');
  const editincode_meaning = ref('');
  const edittablecodepz = ref<any>();
  // 记录下标
  const edit_index = ref<number>(0);
  const editcodeconfigure = (index: any) => {
    show.inmask = true;
    show.editincode = true;
    edit_index.value = index;
    // 新增的页面
    if (change_add_edit.value) {
      editincode_name.value = codepztable.value[index].configureName;
      editincode_meaning.value = codepztable.value[index].configureMean;
    }
    // 编辑页面
    else {
      editincode_name.value = codepztable.value[index].configureName;
      editincode_meaning.value = codepztable.value[index].configureMean;
    }
  };
  // 删除码表配置
  const deletecodeconfigure = (index: any) => {
    // 新增的页面
    if (change_add_edit.value) {
      if (codepztable.value.length == 1) return (codepztable.value = [{ configureName: '', configureMean: '', configureValue: '' }]);
      codepztable.value.splice(index, 1);
    }
    // 编辑页面
    else {
      if (codepztable.value[index].configureType == 2) return codepztable.value.splice(index, 1);
      codepztable.value[index] = {
        configureType: 1,
        configureId: codepztable.value[index].configureId,
      };
    }
  };
  // 取消编辑编码配置添加按钮
  const canceleditcodeconfigure = () => {
    show.inmask = false;
    show.editincode = false;
  };
  // 确定编辑编码配置添加按钮
  const confirmeditcodeconfigure = () => {
    let checkname = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
    if (!checkname.test(editincode_name.value)) return message.error('请输入正确的码值名称');
    let morename = [];
    console.log(codepztable.value);
    for (let i = 0; i < codepztable.value.length; i++) {
      morename.push(codepztable.value[i].configureName);
    }
    morename = [...new Set(morename)];
    if (morename.indexOf(editincode_name.value) !== -1) return message.error('码值名字重复');

    codepztable.value[edit_index.value].configureName = editincode_name.value;
    codepztable.value[edit_index.value].configureMean = editincode_meaning.value;
    if (!change_add_edit.value) {
      codepztable.value[edit_index.value].configureType = 3;
    }
    show.inmask = false;
    show.editincode = false;
  };
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

  //模板导入

  const uploadInput = ref<HTMLElement | null>(null);
  const dealfilechange = (e: Event) => {
    const input = e.target as HTMLInputElement;
    let files = input.files;
    if (files) {
      console.log(files[0]);
    }
    let forms = new FormData();
    //下面的file是后端要求的key

    importExcel(forms).then(function (res: any) {
      console.log(res);
    });
  };

  const importexe = () => {
    console.log(uploadInput.value);

    let oBtn = uploadInput.value as HTMLInputElement;
    oBtn.click();

    // importExcel(uploadInput.value).then(function (res: any) {
    //   console.log(res);
    // });
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

  const addoreditcodename = ref('');
  const addoreditcodeexplain = ref('');
  // 编码配置
  const addcodename = ref('');
  const addcodemeaning = ref('');
  // 创建编码配置表格
  const codepztable = ref<any>([{ configureName: '', configureMean: '', configureValue: '' }]);
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
  @import './tablemannagement_style.less';
</style>
