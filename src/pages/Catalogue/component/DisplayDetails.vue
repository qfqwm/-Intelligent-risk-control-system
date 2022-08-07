<template>
  <!-- 显示详情 -->
  <div>
    <a-modal v-model:visible="Detailsvisible" :title="Detailed.chineseName + '(' + Detailed.standardId + ')'">
      <div v-for="(item, index) in show" :key="index"
        ><span> {{ item.name }}</span
        >{{ Detailed[item.content] }}
      </div>
      <!-- float -->
      <div v-show="Detailed.dataType == 'Float'">
        <div><span> 数据精度：</span>{{ Detailed.dataPrecision }}</div>
      </div>
      <!-- int -->
      <div v-show="Detailed.dataType == 'Int' || Detailed.dataType == 'Float'">
        <div><span> 取值范围：</span>{{ Detailed.dataMin }}~{{ Detailed.dataMax }}</div>
      </div>
      <!-- enum -->
      <div v-show="Detailed.dataType == 'Enum'">
        <span> 枚举范围精度：</span><a href="#" @click.prevent="show_Enum_Modal(Detailed.codeId, Detailed.codeNameSplice)">{{ Detailed.codeName }}</a>
      </div>
      <!-- string -->
      <div v-show="Detailed.dataType == 'String'"> <span> 数据长度：</span>{{ Detailed.dataLength }} </div>
      <div><span> 默认值：</span>{{ Detailed.dataDefault }}</div>
      <template #footer>
        <a-button @click="handleCancel">关闭</a-button>
      </template>
    </a-modal>
  </div>
  <!-- Enum 枚举类型弹框 -->
  <div>
    <a-modal v-model:visible="Enum_visible" :title="Enum_title + '(详情)'">
      <a-table :columns="Enum_column" :data-source="Enum_data" :scroll="{ y: 100 }" :pagination="false" />
      <template #footer>
        <a-button @click="Enum_handleCancel">关闭</a-button>
      </template>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
  import { Select_ConfigureInfoById, Lookup } from '@/api/test/index';
  import type { Ref } from 'vue';
  type Props = {
    // eslint-disable-next-line vue/prop-name-casing
    to_standardid: string;
    // eslint-disable-next-line vue/prop-name-casing
    details_number: number;
  };
  const props = defineProps<Props>();
  interface enum_DataItem {
    configureId: null | string;
    codeId: null | string;
    configureValue: string;
    configureName: string;
    configureMean: string;
    configureType: null | string;
  }
  // 展示数据详情弹框
  watch(
    () => props.details_number,
    () => {
      showModal(props.to_standardid);
    },
  );
  const Detailsvisible = ref<boolean>(false);
  // 定义详情数据
  const Detailed = ref({
    chineseName: '',
    standardId: '',
    englishName: '',
    standardExplain: '',
    sourceAgencies: '',
    isNull: '',
    dataType: '',
    dataPrecision: '',
    dataDefault: '',
    dataMin: '',
    dataMax: '',
    enumRange: '',
    dataLength: '',
    codeName: '',
    codeNameSplice: '',
    codeId: '',
  });
  // 获取数据
  const showModal = (standardId: string) => {
    Detailsvisible.value = true;
    Lookup(standardId).then(function (res) {
      Detailed.value = res.data.data;
      if (Detailed.value.dataType == '1') {
        Detailed.value.dataType = 'Int';
      }
      if (Detailed.value.dataType == '2') {
        Detailed.value.dataType = 'Float';
      }
      if (Detailed.value.dataType == '3') {
        Detailed.value.dataType = 'Enum';
      }
      if (Detailed.value.dataType == '4') {
        Detailed.value.dataType = 'String';
      }
      if (Detailed.value.isNull == '0') {
        Detailed.value.isNull = '可为空';
      }
      if (Detailed.value.isNull == '1') {
        Detailed.value.isNull = '不可为空';
      }
    });
  };
  const handleCancel = () => {
    Detailsvisible.value = false;
  };
  const Enum_handleCancel = () => {
    Enum_visible.value = false;
  };
  // 定义展示列表
  const show = ref([
    {
      name: '标准编号：',
      content: 'standardId',
    },
    {
      name: '中文名称：',
      content: 'chineseName',
    },
    {
      name: '英文名称：',
      content: 'englishName',
    },
    {
      name: '标准说明：',
      content: 'standardExplain',
    },
    {
      name: '是否为空：',
      content: 'isNull',
    },
    {
      name: '数据类型：',
      content: 'dataType',
    },
  ]);
  // 枚举类型弹框
  const Enum_data: Ref<enum_DataItem[]> = ref([]);
  const Enum_title = ref<string>('');
  const Enum_visible = ref<boolean>(false);
  const show_Enum_Modal = (codeId: string, codeNameSplice: string) => {
    Enum_visible.value = true;
    Enum_title.value = codeNameSplice;
    Select_ConfigureInfoById(codeId).then(function (res) {
      if (res.data.msg == '查询成功') Enum_data.value = res.data.data;
    });
  };
  const Enum_column = [
    {
      title: '码值取值',
      dataIndex: 'configureValue',
      width: 90,
    },
    {
      title: '码值名称',
      dataIndex: 'configureName',
      width: 150,
    },
    {
      title: '码值含义',
      dataIndex: 'configureMean',
    },
  ];
</script>
<style lang="less" scoped>
  div {
    span {
      display: inline-block;
      width: 100px;
      text-align: right;
      color: gray;
    }
  }
</style>
