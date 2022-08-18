<template>
  <!-- 蒙版区域 -->
  <div v-show="show.outmask" class="mask">
    <!-- 企业信息基本表 -->
    <div v-show="show.PersonnelGender" class="PersonnelGender">
      <div class="basemess">
        <h1><a href="#" class="close" @click.prevent="closePersonnelGender"> X</a></h1>
        <h2>企业基本信息表</h2>
        <h3>基本信息</h3><br />
        <span class="label"> 中文名称：</span> {{ personnelcodetable.dataAsset.chineseName }} <br />
        <span class="label"> 英文名称：</span>{{ personnelcodetable.dataAsset.englishName }} <br />
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
          <tr v-for="(item, index) in personnelcodetable.assetFieldList" :key="index">
            <td>{{ item.englishName }}</td>
            <td>{{ item.chineseName }}</td>
            <td>{{ item.fieldExplain }}</td>
            <td>{{ item.standardId }}</td>
            <!-- <template v-for="(a, index) in item.dataStandard" :key="index">
            <td>{{a.dataType}}</td>
            <td>{{a.dataLength}}</td>
            <td>{{a.dataPrecision}}</td>
            <td>{{a.dataDefault}}</td>
            <td>{{}}</td>
            <td>{{a.enumRange}}</td>
            </template> -->
            <td>{{ item.dataStandard.dataType }}</td>
            <td>{{ item.dataStandard.dataLength }}</td>
            <td>{{ item.dataStandard.dataPrecision }}</td>
            <td>{{ item.dataStandard.dataDefault }}</td>
            <td>{{}}</td>
            <td>{{ item.dataStandard.enumRange }}</td>
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
    if (t.type == 'chinese') {
      showcode1(record.chineseName);
    }
    if (t.type == 'english') {
      showcode2(record.englishName);
    }
  });

  // 判断弹框显示隐藏
  const show = reactive({ outmask: false, addcode: false, inmask: false, addincode: false, editincode: false, PersonnelGender: false });

  // 人员性别编码弹框
  const personnelcodetable = ref({
    dataAsset: [
      {
        chineseName: '',
        englishName: '',
        updateTime: '',
      },
    ],

    directoryNames: '',
    assetFieldList: [
      {
        englishName: '',
        chineseName: '',
        fieldExplain: '',
        standardId: '',
        dataStandard: [
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
      },
    ],
  });

  //中文
  const showcode1 = (code1: string) => {
    personnelcodetable.value = {
      dataAsset: [] as any[],
      directoryNames: '',
      assetFieldList: [] as any[],
    };

    const object = {
      chineseName: code1,
    };

    rebaseTbl(object).then(function (res: any) {
      console.log(res, 'asda');
      if (res.data.code == 100200) {
        personnelcodetable.value = res.data.data;
        console.log(personnelcodetable.value);
      }
    });
    show.outmask = true;
    show.PersonnelGender = true;
  };
  //英文
  const showcode2 = (code2: any) => {
    personnelcodetable.value = {
      dataAsset: [],
      directoryNames: '',
      assetFieldList: [],
    };

    const object = {
      englishName: code2,
    };
    rebaseTbl(object).then(function (res: any) {
      if (res.data.code == 100200) {
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
