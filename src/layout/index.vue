<template>
  <a-layout class="sidelan">
    <a-layout-header class="header">
      <div class="logo" />
      <div class="title">数据工厂</div>
    </a-layout-header>
    <a-layout>
      <a-layout-sider width="200" style="background: #fff">
        <a-menu v-model:selectedKeys="selectedKeys2" v-model:openKeys="openKeys" mode="inline" :style="{ height: '100%', borderRight: 0 }">
          <a-sub-menu key="sub1">
            <template #title>
              <span> 数据源管理 </span>
            </template>
            <a-menu-item key="1"> <router-link to="/interface">接口管理</router-link></a-menu-item>
            <a-menu-item key="2"><router-link to="/database">数据库管理</router-link></a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="sub2">
            <template #title>
              <span> 数据标准管理 </span>
            </template>
            <a-menu-item key="3"> <router-link to="/catalogue">数据标准目录</router-link></a-menu-item>
            <a-menu-item key="4">
              <router-link to="/tablemanagement">码表管理</router-link>
            </a-menu-item>
          </a-sub-menu>
          <a-menu-item key="5"> <router-link to="/management">数据资产管理</router-link></a-menu-item>
          <a-menu-item key="6"><router-link to="/scriptment">脚本管理</router-link></a-menu-item>
          <a-menu-item key="7">
            <router-link to="/taskment">任务管理</router-link>
          </a-menu-item>
        </a-menu>
      </a-layout-sider>
      <a-layout style="padding: 0 24px 24px">
        <a-breadcrumb style="margin: 16px 0" >
          <a-breadcrumb-item>数据工厂</a-breadcrumb-item>
            <a-breadcrumb-item><router-link :to=route.meta.url @click="jump">{{route.meta.title}}</router-link></a-breadcrumb-item>
            <a-breadcrumb-item v-if="route.meta.module"><router-link :to=route.meta.url>{{route.meta.module}}</router-link></a-breadcrumb-item>
        </a-breadcrumb>
        <a-layout-content :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '280px' }">
          <router-view></router-view>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router'
  const route = useRoute()
  // console.log(route);
  
  const breadList = ref([])
  const selectedKeys1 = ref<string[]>(['2'])
  const selectedKeys2 = ref<string[]>(['1'])
  const collapsed = ref<boolean>(false)
  const openKeys = ref<string[]>(['sub1'])
  
  console.log(selectedKeys2.value[0]);
  console.log(openKeys.value[0]);
  
  const jump = (() => {
    if(selectedKeys2.value[0] == '2'){
      selectedKeys2.value[0] = '1'
    }
    if(selectedKeys2.value[0] == '4'){
      selectedKeys2.value[0] = '3'
    }
  })
</script>
<style>
  .sidelan {
    height: 100vh;
  }

  #app > section > header {
    padding-left: 10px;
    height: 50px;
    background: #323e50;
  }

  #app > section > header > ul {
    height: 50px;
    background: #323e50;
  }

  .title {
    float: left;
    width: 150px;
    height: 50px;
    font-size: 30px;
    font-weight: bold;
    text-align: center;
    color: #ffffff;
    background: #2e4a83;
    line-height: 50px;
  }

  .logo {
    float: left;
    margin-left: 60px;
    margin-right: 35px;
    width: 120px;
    height: 50px;
    background-repeat: no-repeat;
    background-image: url('/img/u199.png');
  }

  .ant-row-rtl #components-layout-demo-top-side-2 .logo {
    float: right;
    margin: 16px 0 16px 24px;
  }

  .site-layout-background {
    background: #fff;
  }

  .ant-layout-content {
    position: relative;
  }
</style>
