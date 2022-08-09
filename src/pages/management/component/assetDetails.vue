<template>
  <!-- 蒙版区域 -->
  <div v-show="show.outmask" class="mask">
    <!-- 企业信息基本表 -->
    <div v-show="show.PersonnelGender" class="PersonnelGender">
      <div class="basemess">
        <h1><a href="#" class="close" @click.prevent="closePersonnelGender"> X</a></h1>
        <h2>企业基本信息表</h2>
        <h3>基本信息</h3><br />
        <span class="label"> 中文名称：</span> {{ personnelcodetable.chineseName }} <br />
        <span class="label"> 英文名称：</span>{{ personnelcodetable.englishName }} <br />
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
          <tr v-for="(item, index) in personnelcodetable.dataAssetField" :key="index">
            <td>{{ item.englishName }}</td>
            <td>{{ item.chineseName }}</td>
            <td>{{ item.fieldExplain }}</td>
            <td>{{ item.standardId }}</td>
            <td>{{}}</td>
            <td>{{}}</td>
            <td>{{}}</td>
            <td>{{}}</td>
            <td>{{}}</td>
            <td>{{}}</td>
          </tr>
          <tr v-for="(item1, index) in personnelcodetable.dataStandards" :key="index">
            <td>{{ item1.englishName }}</td>
            <td>{{ item1.chineseName }}</td>
            <td>{{ item1.standardExplain }}</td>
            <td>{{ item1.standardId }}</td>
            <td>{{ item1.dataType }}</td>
            <td>{{ item1.dataLength }}</td>
            <td>{{}}</td>
            <td>{{ item1.dataDefault }}</td>
            <td>{{}}</td>
            <td>{{ item1.enumRange }}</td>
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
    showcode1(record.chineseName);
    showcode2(record.englishName);
  });

  // 判断弹框显示隐藏
  const show = reactive({ outmask: false, addcode: false, inmask: false, addincode: false, editincode: false, PersonnelGender: false });

  // 人员性别编码弹框
  const personnelcodetable = ref({
    chineseName: '',
    englishName: '',
    directoryNames: '',
    dataAssetField: [
      {
        englishName: '',
        chineseName: '',
        fieldExplain: '',
        standardId: '',
      },
    ],
    dataStandards: [
      {
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
    ],
  });

  //中文
  const showcode1 = (code1: string) => {
    personnelcodetable.value = {
      chineseName: code1,
      englishName: '',
      directoryNames: '',
      dataAssetField: [],
      dataStandards: [],
    };

    const object = {
      chineseName: code1,
    };

    rebaseTbl(object).then(function (res: any) {
      if (res.data.msg == '返回成功') {
        personnelcodetable.value = res.data.data;
      }
    });
    show.outmask = true;
    show.PersonnelGender = true;
  };
  //英文
  const showcode2 = (code2: any) => {
    personnelcodetable.value = {
      chineseName: '',
      englishName: code2,
      directoryNames: '',
      dataAssetField: [],
      dataStandards: [],
    };

    const object = {
      englishName: code2,
    };
    rebaseTbl(object).then(function (res: any) {
      if (res.data.msg == '返回成功') {
        personnelcodetable.value = res.data.data;
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
