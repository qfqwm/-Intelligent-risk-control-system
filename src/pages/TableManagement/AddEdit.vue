<template>
  <!-- 蒙版区域 -->
  <div v-show="show.outmask" class="mask">
    <!-- 新增/编辑码表 -->
    <div v-show="show.addcode" class="add">
      <h3 v-if="change_add_edit">新增码表</h3>
      <h3 v-else>编辑码表</h3>
      <hr /><br />
      <div>码表名称： <input v-model="code_add_edit_table.codeName" type="text" placeholder="请输入标准中文数名称" /></div><br />
      <div> 码表说明： <textarea v-model="code_add_edit_table.codeExplain" placeholder="请输入标准说明"></textarea></div>
      <hr />
      编码配置：<a-button type="primary" size="small" class="addcode" @click="add_edit_codeconfigure(null)">添加</a-button>
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
          <tr v-for="(item, index) in code_add_edit_table.codeConfigureList" :key="index">
            <td>{{ index + 1 < 10 ? '0' + (index + 1) : index }}</td>
            <td>{{ item.configureName }}</td>
            <td>{{ item.configureMean }}</td>
            <td><a href="#" @click.prevent="add_edit_codeconfigure(index)">编辑</a> | <a href="#" @click.prevent="deletecodeconfigure(index)">删除</a></td>
          </tr>
        </tbody>
      </table>
      <!-- 新增编码弹框的取消、确定按钮 -->
      <div class="bottom">
        <a-button size="big" @click="canceltable">取消</a-button>
        <a-button type="primary" size="big" @click="confirmtable">确认</a-button>
      </div>
      <CodingConfiguration
        :index_num="index_num"
        :record_index="record_index"
        :change_add_edit="change_add_edit"
        :code_configure_list="code_add_edit_table.codeConfigureList"
        :record_object="props.record_object"
        @codepztable="get_codepztable"
      ></CodingConfiguration>
    </div>
    <!-- 人员性别码表 -->
    <div v-show="show.PersonnelGender" class="PersonnelGender">
      <h1><a href="#" class="close" @click.prevent="closePersonnelGender"> X</a></h1>
      <h2>人员性别码表（{{ props.code_details.details_name }}）</h2>
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
  import { message } from 'ant-design-vue';
  import CodingConfiguration from '@/pages/TableManagement/CodingConfiguration.vue';
  import { AddCodeTable, SelectCodeConfigure, UpdateCode } from '@/api/test/index';
  const emits = defineEmits(['get-data']);
  // 接收参数
  type Props = {
    // eslint-disable-next-line vue/prop-name-casing
    add_edit_type: string;
    // eslint-disable-next-line vue/prop-name-casing
    record_object: any;
    // eslint-disable-next-line vue/prop-name-casing
    show_drawer_number: number;
    // eslint-disable-next-line vue/prop-name-casing
    showcode_num: number;
    // eslint-disable-next-line vue/prop-name-casing
    code_details: any;
  };
  const props = defineProps<Props>();
  // 判断弹框显示隐藏
  const show = reactive({ outmask: false, addcode: false, PersonnelGender: false });
  watch(
    () => props.show_drawer_number,
    () => {
      codetable(props.add_edit_type, props.record_object);
    },
  );

  watch(
    () => props.showcode_num,
    () => {
      showcode(props.code_details.showcode_id);
    },
  );

  const change_add_edit = ref<boolean>(true);
  const code_add_edit_table = ref<any>({
    codeName: '',
    codeExplain: '',
    codeConfigureList: [],
  });
  const codetable = (type: string, codetable: any) => {
    show.outmask = true;
    show.addcode = true;
    if (type == 'add') {
      change_add_edit.value = true;
      code_add_edit_table.value.codeName = '';
      code_add_edit_table.value.codeExplain = '';
      code_add_edit_table.value.codeConfigureList = [];
    }
    if (type == 'edit') {
      change_add_edit.value = false;
      code_add_edit_table.value.codeName = codetable.codeName;
      code_add_edit_table.value.codeExplain = codetable.codeExplain;
      SelectCodeConfigure(codetable.codeId).then(function (res: any) {
        if (res.data.code == 100200) {
          console.log(res.data.data);
          code_add_edit_table.value.codeConfigureList = res.data.data;
        }
      });
    }
  };

  const record_index = ref<any>();
  const index_num = ref<number>(0);
  const add_edit_codeconfigure = (index: any) => {
    record_index.value = index;
    index_num.value++;
  };
  const get_codepztable = (e: never[]) => {
    code_add_edit_table.value.codeConfigureList = e;
  };
  // 取消新增码表弹框
  const canceltable = () => {
    show.outmask = false;
    show.addcode = false;
  };
  // 确定新增码表弹框
  const confirmtable = () => {
    // change_add_edit.value=ture 表示新增
    if (change_add_edit.value) {
      console.log(code_add_edit_table.value, 'kkad');
      // debugger;
      AddCodeTable(code_add_edit_table.value).then(function (res: any) {
        if (res.data.msg == '有重复值，请检查后重新输入') return message.error('码表名字重复');
        if (res.data.msg == '新增码表成功') {
          message.success('码表新增成功！');
          emits('get-data');
        } else {
          message.error('请输入正确的编码名称');
        }
      });
    } else {
      if (code_add_edit_table.value.codeName == props.record_object.codeName) {
        code_add_edit_table.value.codeType2 = '0';
      } else {
        code_add_edit_table.value.codeType2 = '1';
      }
      code_add_edit_table.value.codeId = props.record_object.codeId;
      code_add_edit_table.value.codeConfigureList = code_add_edit_table.value.codeConfigureList.filter((item: any) => {
        return item.configureType != 0;
      });
      console.log(code_add_edit_table.value, 123);
      UpdateCode(code_add_edit_table.value).then(function (res: any) {
        if (res.data.msg == '有重复，检查后重新输入') return message.error('码表名字重复!');
        if (res.data.msg == '更新成功') {
          message.success('码表更新成功！');
          emits('get-data');
        } else {
          message.error('请输入正确的码表名称!');
        }
      });
    }
    show.outmask = false;
    show.addcode = false;
  };

  // 删除码表配置
  const deletecodeconfigure = (index: any) => {
    // 新增的页面
    if (change_add_edit.value) {
      return code_add_edit_table.value.codeConfigureList.splice(index, 1);
    }
    // 编辑页面
    else {
      if (code_add_edit_table.value.codeConfigureList[index].configureType == 2) return code_add_edit_table.value.codeConfigureList.splice(index, 1);
      else {
        delete code_add_edit_table.value.codeConfigureList[index].codeId;
        delete code_add_edit_table.value.codeConfigureList[index].configureMean;
        delete code_add_edit_table.value.codeConfigureList[index].configureName;
        delete code_add_edit_table.value.codeConfigureList[index].configureValue;
        code_add_edit_table.value.codeConfigureList[index].configureType = 1;
      }
    }
  };

  // 编码编号详情显示
  // 人员性别编码弹框
  const personnelcodetable = ref<any>({});
  const showcode = (codeId: string) => {
    SelectCodeConfigure(codeId).then(function (res: any) {
      console.log(res);

      if (res.data.code == 100200) {
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
</script>
<style lang="less" scoped>
  @import './css/AddEdit.less';
</style>
