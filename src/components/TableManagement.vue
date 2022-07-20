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
    <a-button class="query">查询</a-button>
    123
  </div>
  <!-- 五个按钮区域 -->
  <div class="button">
    <div class="left">
      <a-button type="primary" size="small">批量发布</a-button>
      <a-button type="primary" size="small">批量停用</a-button>
    </div>
    <div class="right">
      <a-button type="primary" size="small">码表模板下载</a-button>
      <a-button type="primary" size="small">码表导入</a-button>
      <a-button type="primary" size="small" @click="codetable('add', {})">新增码表</a-button>
    </div>
  </div>
  <!-- 表格区域 -->
  <a-table bordered :data-source="dataSource" :columns="columns" :row-selection="rowSelection">
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'id'">
        <a href="#" @click.prevent="showcode">{{ record.id }}</a>
      </template>
      <template v-if="column.dataIndex === 'operation'">
        <!-- 未发布显示按钮 -->
        <div v-if="record.state == '未发布'">
          <a-popconfirm v-if="dataSource.length" title="请确认否发布该码表?" @confirm="onDelete(record.key)">
            <a-button type="primary" size="small">发布</a-button>
          </a-popconfirm>
          <a-button type="primary" size="small" @click="codetable('edit', record)">编辑</a-button>
          <a-popconfirm v-if="dataSource.length" title="请确认是否删除该码表?" @confirm="onDelete(record.key)">
            <a-button type="primary" size="small">删除</a-button>
          </a-popconfirm>
        </div>
        <!-- 已发布显示按钮 -->
        <div v-if="record.state == '已发布'">
          <a-popconfirm v-if="dataSource.length" title="请确认否发布该码表?" @confirm="onDelete(record.key)">
            <a-button type="primary" size="small">停用</a-button>
          </a-popconfirm>
        </div>
        <!-- 已停用显示按钮 -->
        <div v-if="record.state == '已停用'">
          <a-popconfirm v-if="dataSource.length" title="请确认否发布该码表?" @confirm="onDelete(record.key)">
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
      码表名称： <input type="text" placeholder="请输入标准中文数名称" /><br /><br />
      码表说明： <textarea id="" name="" placeholder="请输入标准说明"></textarea> <br /><br />
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
        <tbody>
          <tr>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td><a href="#" @click.prevent="editcodeconfigure">编辑</a> | <a href="#" @click.prevent="">删除</a></td>
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
          <div class="content"> 编码名称：<input type="text" placeholder="请输入编码名称" /> 编码含义：<textarea id="" name="" placeholder="请输入编码含义"></textarea></div>
          <div class="bottom">
            <a-button size="small" @click="canceladdcodeconfigure">取消</a-button>
            <a-button type="primary" size="small" @click="confirmaddcodeconfigure">确认</a-button>
          </div>
        </div>
        <!-- 编辑 -->
        <div v-show="show.editincode" class="codediv">
          <h4>编辑编码配置</h4>
          <hr />
          <div class="content"> 编码名称：<input type="text" placeholder="请输入编码名称" /> 编码含义：<textarea id="" name="" placeholder="请输入编码含义"></textarea></div>
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
      <h2>人员性别码表（MZB00001）</h2>
      <table class="PersonnelGendertable">
        <thead>
          <tr>
            <th>码值取值</th>
            <th>码值名称</th>
            <th>码值含义</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>1</td>
            <td>1</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script lang="ts">
  import { computed, defineComponent, reactive, ref } from 'vue';
  import type { Ref, UnwrapRef } from 'vue';
  interface DataItem {
    key: string;
    id: string;
    name: string;
    explain: string;
    state: string;
    time: string;
  }
  export default defineComponent({
    setup() {
      // 表格
      const columns = [
        {
          title: '码表编号',
          dataIndex: 'id',
          width: '15%',
        },
        {
          title: '码表名称',
          dataIndex: 'name',
        },
        {
          title: '码表说明',
          dataIndex: 'explain',
          width: '520px',
        },
        {
          title: '码表状态',
          dataIndex: 'state',
        },
        {
          title: '更新时间',
          dataIndex: 'time',
        },
        {
          title: '操作',
          dataIndex: 'operation',
          width: '220px',
        },
      ];
      const dataSource: Ref<DataItem[]> = ref([
        {
          key: '0',
          id: 'MZB00001',
          name: '111',
          explain: '222',
          state: '未发布',
          time: '32',
        },
        {
          key: '1',
          id: 'MZB00002',
          name: '111',
          explain: '222',
          state: '未发布',
          time: '32',
        },
        {
          key: '2',
          id: 'MZB00003',
          name: '111',
          explain: '222',
          state: '已停用',
          time: '32',
        },
        {
          key: '3',
          id: 'MZB00004',
          name: '111',
          explain: '222',
          state: '已发布',
          time: '32',
        },
      ]);
      const count = computed(() => dataSource.value.length + 1);
      const editableData: UnwrapRef<Record<string, DataItem>> = reactive({});
      const onDelete = (key: string) => {
        dataSource.value = dataSource.value.filter(item => item.key !== key);
      };
      // 判断弹框显示隐藏
      const show = reactive({ outmask: false, addcode: false, inmask: false, addincode: false, editincode: false, PersonnelGender: false });
      const change_add_edit = ref<boolean>(true);
      // 新增码表按钮
      const codetable = (type: string, codetable: object) => {
        show.outmask = true;
        show.addcode = true;
        if (type == 'add') {
          change_add_edit.value = true;
        }
        if (type == 'edit') {
          change_add_edit.value = false;
        }
      };
      // 取消新增码表弹框
      const canceltable = () => {
        show.outmask = false;
        show.addcode = false;
      };
      // 确定新增码表弹框
      const confirmtable = () => {
        show.outmask = false;
        show.addcode = false;
      };
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
      };
      // 编码配置编辑
      const editcodeconfigure = () => {
        show.inmask = true;
        show.editincode = true;
      };
      // 取消编辑编码配置添加按钮
      const canceleditcodeconfigure = () => {
        show.inmask = false;
        show.editincode = false;
      };
      // 确定编辑编码配置添加按钮
      const confirmeditcodeconfigure = () => {
        show.inmask = false;
        show.editincode = false;
      };
      // 人员性别编码弹框
      const showcode = () => {
        show.outmask = true;
        show.PersonnelGender = true;
      };
      // 关闭人员性别编码弹框
      const closePersonnelGender = () => {
        show.outmask = false;
        show.PersonnelGender = false;
      };
      // 搜索功能
      const Codetablestatus = ref<string>('');
      const Codetablename = ref<string>('');
      // 重置
      const Reset = () => {
        Codetablestatus.value = '';
        Codetablename.value = '';
      };
      // 全选/反选
      const rowSelection = ref({
        checkStrictly: false,
        onChange: (selectedRowKeys: (string | number)[], selectedRows: DataItem[]) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows, '111111111');
        },
      });
      return {
        columns,
        onDelete,
        dataSource,
        editableData,
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
</style>
