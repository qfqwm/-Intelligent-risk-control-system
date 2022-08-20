<template>
  <div>
    <a-modal v-model:visible="visible" width="1000px" ok-text="确定" cancel-text="取消" title="码表编码配置" @ok="handleOk">
      <a-form :model="AddCodeTable" layout="inline" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" autocomplete="off">
        <div style="margin-bottom: 20px; padding-left: 30px">
          <a-row :gutter="16" style="margin-top: 10px">
            <a-col :span="24">
              <a-form-item style="width: 1000px" label="码表选择：" name="CodeTableSelection">
                <a-select v-model:value="AddCodeTable.CodeTableSelection" placeholder="请选择码表名称" :options="option" :filter-option="filterOption" />
              </a-form-item>
            </a-col>
          </a-row>
        </div>
      </a-form>
      <AddedCodeDataVue :data_table="data_table" />
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
  import emitter from '@/utils/bus';
  import AddedCodeDataVue from './Childs/AddedCodeData.vue';
  import { selectCodeTable, SelectCodeConfigure } from '@/api/test/index';
  const visible = ref();
  emitter.on('Sendchild_add_edit', () => {
    showModal();
  });
  const AddCodeTable = reactive<any>({
    CodeTableSelection: undefined,
  });

  const showModal = () => {
    visible.value = true;
    data_table.value = [];
    AddCodeTable.CodeTableSelection = undefined;
  };
  const filterOption = (input: string, option: any) => {
    return option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };
  // 码表查询
  const Search = {
    codeType: '',
    codeName: '',
    page: 1,
    size: 20,
  };
  const option = ref<any>([]);
  selectCodeTable(Search).then(function (res: any) {
    option.value = [];
    console.log(res.data.data.nowTable);
    res.data.data.nowTable.forEach(item =>
      option.value.push({
        value: item.codeId,
        label: item.codeName,
      }),
    );
  });
  const data_table = ref([]);
  watch(
    () => AddCodeTable.CodeTableSelection,
    () => {
      if (AddCodeTable.CodeTableSelection !== undefined)
        SelectCodeConfigure(AddCodeTable.CodeTableSelection).then(function (res: any) {
          if (res.data.code == 100200) {
            data_table.value = res.data.data;
          }
        });
    },
  );

  const handleOk = () => {
    emitter.emit('trigger');
    visible.value = false;
  };
</script>
<style lang="less" scoped>
  .button {
    margin-bottom: 10px;

    button {
      margin-left: 20px;
    }
  }
</style>
