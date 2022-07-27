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
          <a-menu-item key="6"><span>脚本管理</span> </a-menu-item>
          <a-menu-item key="7">
            <span> 任务管理 </span>
          </a-menu-item>
        </a-menu>
      </a-layout-sider>
      <a-layout style="padding: 0 24px 24px" :style="{ marginLeft: '201px', marginTop: '50px' }">
        <a-breadcrumb style="margin: 16px 0">
          <a-breadcrumb-item>数据工厂</a-breadcrumb-item>
          <a-breadcrumb-item><a href="">Application Center</a></a-breadcrumb-item>
          <a-breadcrumb-item><a href="">Application List</a></a-breadcrumb-item>
        </a-breadcrumb>

        <a-layout-content :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '280px' }">
          <router-view></router-view>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  export default defineComponent({
    setup() {
      return {
        // selectedKeys1: ref<string[]>(['2']),
        selectedKeys2: ref<string[]>(['7']),
        // collapsed: ref<boolean>(false),
        // openKeys: ref<string[]>(['sub2']),
      };
    },
  });
</script>
<style lang="less" scoped>
  .sidelan {
    min-height: 100vh;
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
    margin-right: 70px;
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

  .ant-layout-header {
    position: fixed;
    z-index: 2;
    overflow: 'auto';
    width: 100%;
  }

  .ant-layout-sider,
  .ant-layout-sider-dark {
    position: fixed;
    top: 50px;
    z-index: 1;
    overflow: 'auto';
    height: 100vh;
  }
</style>
