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
        <span class="label"> 所属目录：</span> {{ personnelcodetable.directoryNames }}
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
  // import { ref} from 'vue';

  // import emitter from '@/utils/bus';

  // //eitter获取
  //  const show ='';
  //  const code1=ref()
  //  emitter.on('code', (t: any) => {

  //   });
</script>
<style lang="" scoped></style>
