<template>
  <a-row :gutter="16">
    <a-col :span="20">
      <a-form-item label="所属目录：" name="dynamicValidateForm" :model="dynamicValidateForm" :rules="[{ required: true, validator: checkPrice }]">
        <div class="all">
          <a-space v-for="(sight, i) in dynamicValidateForm.sights" :key="sight.id" class="obj" align="baseline">
            <a-form-item-rest>
              <a-tree-select
                v-model:value="dynamicValidateForm.chineseName[i]"
                show-search
                style="width: 415px"
                allow-clear
                tree-default-expand-all
                placeholder="请选择所属目录"
                :tree-data="props.tree_data"
                :field-names="fieldNames"
                @change="adddata"
              >
                <template #title="{ value: directoryId, title: name }">
                  <b v-if="directoryId === '11'" style="color: #08c">{{ name }}</b>
                  <template v-else>{{ name }}</template>
                </template>
              </a-tree-select>
            </a-form-item-rest>
            <MinusCircleOutlined @click="removeSight(sight)" />
          </a-space>
        </div>
      </a-form-item>
      <a-button type="dashed" block class="add" style="width: 67%" @click="addSight">
        <PlusOutlined />
        添加一行
      </a-button>
    </a-col>
  </a-row>
</template>
<script lang="ts" setup>
  import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons-vue';
  // 接收参数
  type Props = {
    // eslint-disable-next-line vue/prop-name-casing
    tree_data: any;
    // eslint-disable-next-line vue/prop-name-casing
    dynamic_validate_form: any;
  };

  const props = defineProps<Props>();
  onMounted(() => {
    dynamicValidateForm.value = { ...props.dynamic_validate_form };
    convertData(props.tree_data);
  });
  watch(
    () => props.dynamic_validate_form,
    val => {
      dynamicValidateForm.value = val;
    },
  );

  const emit = defineEmits(['sonDataName']);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const checkPrice = (_: any, value: any) => {
    value = dynamicValidateForm.value.directoryId.length;
    if (value > 0) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('请输入所属目录'));
  };

  const fieldNames = {
    children: 'children',
    title: 'name',
    key: 'directoryId',
    value: 'directoryId',
  };

  const convertData = (treedata: any) => {
    treedata.forEach((item: { title: any; name: any; value: any; directoryId: any; children: any }) => {
      item.title = item.name;
      item.value = item.directoryId;
      if (item.children) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        convertData(item.children);
      }
    });
  };

  interface Sights {
    id: string;
  }

  interface Sights1 {
    directoryId: string;
  }

  const dynamicValidateForm = ref<{ sights: Sights[]; chineseName: ['']; directoryId: Sights1[] }>({
    sights: [],
    chineseName: [''],
    directoryId: [],
  });

  const removeSight = (item: Sights) => {
    let index = dynamicValidateForm.value.sights.indexOf(item);
    if (index !== -1) {
      dynamicValidateForm.value.sights.splice(index, 1);
    }
  };

  //添加一行
  const addSight = () => {
    dynamicValidateForm.value.sights.push({
      id: 'i' + Date.now(),
    });
    dynamicValidateForm.value.chineseName.push('');
  };

  //选择目录改变事件
  const adddata = () => {
    dynamicValidateForm.value.directoryId = [];
    for (let i = 0; i < dynamicValidateForm.value.sights.length; i++) {
      dynamicValidateForm.value.directoryId.push({
        directoryId: dynamicValidateForm.value.chineseName[i],
      });
    }
    emit('sonDataName', dynamicValidateForm.value);
  };
</script>

<style lang="less" scoped>
  .all {
    overflow-y: scroll;
    border: 1px solid #eee;
    padding: 5px;
    width: 470px;
    min-height: 50px;
    max-height: 190px;

    .obj {
      display: flex;
      margin-bottom: 8px;
    }
  }

  .add {
    margin-left: 33%;
    border: 1px solid blue;
    border-style: dashed;
    color: blue;
  }
</style>
