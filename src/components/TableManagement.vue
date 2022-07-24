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
      <a-button type="primary" size="small">码表模板下载</a-button>
      <a-button type="primary" size="small">码表导入</a-button>
      <a-button type="primary" size="small" @click="codetable('add', {})">新增码表</a-button>
    </div>
  </div>
  <!-- 表格区域 -->
  <a-table
    :data-source="dataSource"
    :columns="columns"
    :row-selection="rowSelection"
    :pagination="{ pageSize: pageSize, current: current }"
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
  <!-- 分页 -->
  <a-pagination v-model:current="current" v-model:page-size="pageSize" :page-size-options="pageSizeOptions" :total="total" show-size-changer @showSizeChange="onShowSizeChange">
    <template #buildOptionText="props">
      <span v-if="props.value !== '50'">{{ props.value }}条/页</span>
      <span v-else>全部</span>
    </template>
  </a-pagination>
  <!-- 蒙版区域 -->
  <div v-show="show.outmask" class="mask">
    <!-- 新增/编辑码表 -->
    <div v-show="show.addcode" class="add">
      <h3 v-if="change_add_edit">新增码表</h3>
      <h3 v-else>编辑码表</h3>
      <hr /><br />
      码表名称： <input v-model="addoreditcodename" type="text" placeholder="请输入标准中文数名称" @blur="Judgmentrule" /><br />
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
<script lang="ts">
  import { computed, defineComponent, reactive, ref } from 'vue';
  import type { Ref, UnwrapRef } from 'vue';
  import { selectCodeTable, AddCodeTable, OnChange, DeleteCode, SelectCodeConfigure, UpdateCode } from '@/api/test/index';
  import { log } from 'console';
  import { object, string } from 'vue-types';
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
  export default defineComponent({
    setup() {
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
            dataSource.value = dataSource.value.filter(item => item.codeId !== code);
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
              console.log(res.data);
              codepztable.value = res.data.data;
              console.log(codepztable.value);
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
        if (change_add_edit.value) {
          AddCodeTable(object).then(function (res: any) {
            if (res.data.msg == '新增码表成功') {
              alert('码表新增成功！');
              selectCodeTable_way();
            } else {
              alert('码表新增失败！');
            }
          });
        } else {
          let object = {
            codeName: addoreditcodename.value,
            codeExplain: addoreditcodeexplain.value,
            codeConfigureList: codepztable.value,
            codeType2: '0',
          };
          object.codeConfigureList = object.codeConfigureList.filter((item: any) => item.configureType != 0);
          if (addoreditcodename.value == name.value) {
            object.codeType2 = '0';
          } else {
            object.codeType2 = '1';
          }
          console.log(object, '11111');
          UpdateCode(object).then(function (res: any) {
            console.log(res);
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
        codepztable.value[edit_index.value].configureName = editincode_name.value;
        codepztable.value[edit_index.value].configureMean = editincode_meaning.value;
        if (!change_add_edit.value) {
          codepztable.value[edit_index.value].configureType = 3;
        }
        console.log(codepztable.value);
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
          console.log();

          Selectall_invert.value = selectedRows;
        },
      });
      // 批量操作
      const ALLonChangecode = (state: string) => {
        let change_array: any = [];
        Selectall_invert.value.forEach(item => {
          change_array.push({
            codeId: item,
            codeType: state,
          });
        });
        if (change_array.length == 0) return alert('请选择码表进行操作!');
        OnChange(change_array).then(function (res: any) {
          if (res.data.msg == '更新成功') {
            // 有时间前端进行改进 关于重新请求
            selectCodeTable_way();
          } else return alert('更新失败！');
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
            selectCodeTable_way();
          }
        });
      };
      // 判断正则表达以编码名是否重复
      const Judgmentrule = () => {
        let reg = /^[\\u4e00-\\u9fa5a-zA-Z]+$/;
        if (reg.test(addoreditcodename.value)) return (judge.Formaterror = true);
        else judge.Formaterror = false;
        let allname: any = [];
        dataSource.value.forEach((item: any) => {
          allname.push(item.codeName);
        });
        allname = [...new Set(allname)];
        // if (allname.indexOf(addoreditcodename.value) === -1) {
        //   return judge.Rename = false
        // }
        // else {
        //   if (change_add_edit.value) {
        //     return judge.Rename = true
        //   }
        //   else {
        //     if (name.value == addoreditcodename.value) {
        //       judge.Rename = false
        //     }
        //     else {
        //       judge.Rename = true
        //     }
        //   }
        // }
      };
      const judge = reactive({ Formaterror: false, Rename: false });
      return {
        columns,
        onDelete,
        dataSource,
        count,
        show,
        codetable,
        canceltable,
        confirmtable,
        addcodeconfigure,
        canceladdcodeconfigure,
        confirmaddcodeconfigure,
        editcodeconfigure,
        canceleditcodeconfigure,
        confirmeditcodeconfigure,
        showcode,
        closePersonnelGender,
        Codetablestatus,
        Codetablename,
        Reset,
        rowSelection,
        change_add_edit,
        // 分页
        pageSizeOptions,
        current,
        pageSize: pageSizeRef,
        total,
        onShowSizeChange,
        // 按钮
        query,
        addoreditcodename,
        addoreditcodeexplain,
        addcodename,
        addcodemeaning,
        codepztable,
        Selectall_invert,
        onChangecode,
        ALLonChangecode,
        personnelcodetable,
        editincode_name,
        editincode_meaning,
        edit_index,
        deletecodeconfigure,
        edittablecodepz,
        codeId,
        name,
        Judgmentrule,
        selectCodeTable_way,
        judge,
      };
    },
  });
</script>
<style lang="less">
  // 搜索区域
  .search {
    margin: 0 auto;
    width: 601px;

    select {
      margin-right: 20px;
      width: 100px;
      height: 28px;
    }

    button {
      margin-left: 10px;
    }

    .Reset {
      border-color: #379dd4;
      border-radius: 5px;
    }

    .query {
      border-radius: 5px;
      color: white;
      background: #379dd4;
    }
  }

  // 第二行按钮区
  .button {
    display: flex;
    justify-content: space-between;

    .left {
      button {
        border-color: #d7d7d7;
        background: #d7d7d7;
      }

      button:hover {
        background: #379dd4;
      }
    }

    .right {
      button {
        background: #379dd4;
      }
    }

    button {
      margin: 5px;
      border-radius: 5px;
    }
  }

  // 表格
  .editable-cell {
    position: relative;

    .editable-cell-input-wrapper,
    .editable-cell-text-wrapper {
      padding-right: 24px;
    }

    .editable-cell-text-wrapper {
      padding: 5px 24px 5px 5px;
    }

    .editable-cell-icon,
    .editable-cell-icon-check {
      position: absolute;
      right: 0;
      width: 20px;
      cursor: pointer;
    }

    .editable-cell-icon {
      display: none;
      margin-top: 4px;
    }

    .editable-cell-icon-check {
      line-height: 28px;
    }

    .editable-cell-icon:hover,
    .editable-cell-icon-check:hover {
      color: #108ee9;
    }

    .editable-add-btn {
      margin-bottom: 8px;
    }
  }

  .editable-cell:hover .editable-cell-icon {
    display: inline-block;
  }

  .ant-table-tbody {
    tr {
      td {
        padding: 3px 16px !important;
      }
    }
  }

  tbody tr {
    button {
      margin: 0 5px;
    }

    .ant-btn-primary {
      border-radius: 10px;
      background: #379dd4;
    }
  }

  // 蒙版
  .mask {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    width: 100%;
    height: 100%;
    opacity: 1;

    // 新增编码弹框
    .add {
      position: relative;
      top: 50%;
      left: 50%;
      border: 1px #797979 solid;
      padding-right: 20px;
      padding-left: 20px;
      width: 550px;
      height: 626px;
      background: white;
      transform: translate(-50%, -50%);

      h3 {
        padding-top: 5px;
        text-align: center;
      }

      input {
        padding-left: 10px;
        width: 400px;
      }

      textarea {
        border: 2px black solid;
        padding-left: 10px;
        width: 400px;
        height: 100px;
        resize: none;
        vertical-align: top;
      }

      .addcode {
        float: right;
      }

      // 新增编码弹框表格
      .codetable {
        margin-top: 10px;
        width: 100%;
        text-align: center;

        thead {
          tr {
            th:nth-of-type(1) {
              width: 60px;
            }

            th:nth-of-type(2) {
              width: 100px;
            }

            th:nth-of-type(3) {
              width: 250px;
            }

            th {
              border: 1px black solid;
            }
          }
        }
      }

      tbody {
        tr {
          td {
            border: 1px black solid;

            a:hover {
              color: red;
            }
          }
        }
      }
    }

    .bottom {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translate(-50%);

      button {
        margin: 10px;
      }
    }

    .PopupMask {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 3;
      width: 100%;
      height: 100%;
      opacity: 1;

      .codediv {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 410px;
        height: 300px;
        background: #797979;
        transform: translate(-50%, -50%);

        h4 {
          padding: 5px 0;
          font-weight: 700;
          text-align: center;
          color: #108ee9;
        }

        .content {
          padding: 5px;
        }
      }
    }

    // 人员性别码表弹框
    .PersonnelGender {
      position: absolute;
      top: 50%;
      left: 50%;
      border: 2px gray solid;
      width: 600px;
      background: white;
      transform: translate(-50%, -50%);

      h1 {
        margin-right: 10px;
        text-align: right;

        .close {
          font-size: 25px;
        }
      }

      h2 {
        font-size: 15px;
        text-align: center;
      }

      .PersonnelGendertable {
        margin: 10px auto;
        margin-bottom: 30px;
        width: 90%;
        text-align: center;

        thead {
          tr {
            th:nth-of-type(1) {
              width: 60px;
            }

            th:nth-of-type(2) {
              width: 100px;
            }

            th:nth-of-type(3) {
              width: 250px;
            }

            th {
              border: 1px black solid;
            }
          }
        }

        tbody {
          tr {
            td {
              border: 1px black solid;
            }
          }
        }
      }
    }
  }

  // 隐藏table表带的分页
  #app > section > section > section > main > div.ant-table-wrapper > div > div > ul {
    display: none;
  }

  // 分页
  .ant-pagination {
    position: absolute;
    bottom: 5px;
    left: 50%;
    text-align: center;
    transform: translateX(-50%);
  }

  .tips {
    text-align: center;
    color: red;
  }
</style>

function codeName(codeType: any, string: any, codeName: any, string: any) { throw new Error('Function not implemented.'); }
