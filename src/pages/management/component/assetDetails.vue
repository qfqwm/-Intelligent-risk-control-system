<template>
  <!-- 蒙版区域 -->
  <div v-show="show.outmask" class="mask">
    <!-- 企业信息基本表 -->
    <div v-show="show.PersonnelGender" class="PersonnelGender">
      <div class="basemess">
        <h1><a href="#" class="close" @click.prevent="closePersonnelGender"> X</a></h1>
        <h2>企业基本信息表</h2>
        <h3>基本信息</h3><br />
        <span class="label"> 中文名称：</span> {{ dataAsset.chineseName }} <br />
        <span class="label"> 英文名称：</span>{{ dataAsset.englishName }} <br />
        <h4>数据资产表描述：</h4>
        <span class="label"> 所属目录：</span>
        <a-button>{{ personnelcodetable.directoryNames[0] }}</a-button> <a-button>{{ personnelcodetable.directoryNames[1] }}</a-button> <a-button>{{ personnelcodetable.directoryNames[2] }}</a-button>
        <br />
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
          <tr v-for="(item, index) in list1" :key="index">
            <td>{{ item.englishName }}</td>
            <td>{{ item.chineseName }}</td>
            <td>{{ item.fieldExplain }}</td>
            <td>{{ item.standardId }}</td>
            <td>{{ item.dataType }}</td>
            <td>{{ item.dataLength }}</td>
            <td>{{ item.dataPrecision }}</td>
            <td>{{ item.dataDefault }}</td>
            <td>{{}}</td>
            <td>{{ item.enumRange }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import emitter from '@/utils/bus';
  import { rebaseTbl } from '@/api/test/index';

  let record: any = {};
  emitter.on('sendchilds', (t: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    record = t.record;
    console.log(record, 'sdda');
    showcode(record.chineseName);
  });

  // 判断弹框显示隐藏
  const show = reactive({ outmask: false, addcode: false, inmask: false, addincode: false, editincode: false, PersonnelGender: false });

  // 人员性别编码弹框
  const personnelcodetable = ref({
    directoryNames: '',
    assetFieldList: [
      {
        englishName: '',
        chineseName: '',
        fieldExplain: '',
        standardId: '',
        dataStandard: {
          englishName: '',
          chineseName: '',
          standardExplain: '',
          dataType: '',
          dataLength: '',
          dataPrecision: '',
          standardId: '',
          dataDefault: '',
          dataMin: '',
          dataMax: '',
          enumRange: '',
        },
      },
    ],
  });

  const dataAsset = ref({
    chineseName: '',
    englishName: '',
    updateTime: '',
  });
  const list = ref();
  const list1 = ref();

  //中文
  const showcode = (code1: string) => {
    personnelcodetable.value = {
      directoryNames: '',
      assetFieldList: [] as any[],
    };

    const object = {
      chineseName: code1,
    };

    rebaseTbl(object).then(function (res: any) {
      if (res.data.msg == '查询成功') {
        dataAsset.value = res.data.data.dataAsset;
        personnelcodetable.value = res.data.data;
        list.value = res.data.data.assetFieldList;
        //数组遍历
        let a = ref({});
        const listArr = ref<any>([]);
        for (let i = 0; i < list.value.length; i++) {
          a = { ...list.value[i], ...list.value[i].dataStandard };
          listArr.value.push(a);
        }

        console.log(listArr.value, '2');
        list1.value = listArr.value;
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
  @import '../style.less';
</style>
