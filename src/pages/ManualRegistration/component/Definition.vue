<template>
  <div>
    <a-modal v-model:visible="visible" width="1000px" ok-text="确定" cancel-text="取消" title="码值定义" @ok="handleOk">
      <!-- 按钮区域 -->
      <div class="button">
        <a-button type="primary" size="middle" @click="showcode">新增码值表</a-button>
      </div>
      <AddedCodeVue />
      <AddedCustomVue :recorddatasourceindex="props.recorddatasourceindex" />
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
  import emitter from '@/utils/bus';
  import AddedCustomVue from './Child/AddedCustom.vue';
  import AddedCodeVue from './Child/AddedCode.vue';
  const props = defineProps({
    recorddatasourceindex: {
      type: Array,
      default: () => {
        return [];
      },
    },
  });

  const visible = ref();
  emitter.on('Code_value_definition', () => {
    showModal();
  });

  const showModal = () => {
    visible.value = true;
  };
  // 记录下标
  const dataSource_index = ref<any>([]);
  emitter.on('dataSource_index', e => {
    dataSource_index.value = e;
  });
  // 记录recode地址，改变他的configureId值
  let change_record: any = {} as any;
  emitter.on('change_record', (e: any) => {
    change_record = e;
  });
  const handleOk = () => {
    change_record.configureId = dataSource_index.value;
    visible.value = false;
  };

  const visible_Add = ref<boolean>(false);
  //码值定义模态框开关
  const showcode = () => {
    const sdds = reactive({
      visible: visible_Add,
    });
    emitter.emit('Sendchild_add_edit', sdds);
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
