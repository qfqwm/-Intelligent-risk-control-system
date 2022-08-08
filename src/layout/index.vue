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
            <a-menu-item key="/interface"> <router-link to="/interface">接口管理</router-link></a-menu-item>
            <a-menu-item key="/database"><router-link to="/database">数据库管理</router-link></a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="sub2">
            <template #title>
              <span> 数据标准管理 </span>
            </template>
            <a-menu-item key="/catalogue"> <router-link to="/catalogue">数据标准目录</router-link></a-menu-item>
            <a-menu-item key="/tablemanagement">
              <router-link to="/tablemanagement">码表管理</router-link>
            </a-menu-item>
          </a-sub-menu>
          <a-menu-item key="/management"> <router-link to="/management">数据资产管理</router-link></a-menu-item>
          <a-menu-item key="/scriptment"><router-link to="/scriptment">脚本管理</router-link></a-menu-item>
          <a-menu-item key="/taskment">
            <router-link to="/taskment">任务管理</router-link>
          </a-menu-item>
        </a-menu>
      </a-layout-sider>
      <a-layout style="padding: 0 24px 24px" :style="{ marginLeft: '201px', marginTop: '50px' }">
        <a-breadcrumb style="margin: 16px 0">
          <a-breadcrumb-item>数据工厂</a-breadcrumb-item>
          <a-breadcrumb-item
            ><router-link :to="route.meta.url" @click="jump">{{ route.meta.title }}</router-link></a-breadcrumb-item
          >
          <template v-if="route.meta.name">
            <a-breadcrumb-item v-if="route.meta.module"
              ><router-link :to="route.meta.url">{{ route.meta.module }}</router-link></a-breadcrumb-item
            >
            <a-breadcrumb-item v-if="route.meta.name"
              ><router-link :to="route.path">{{ route.meta.name }}</router-link></a-breadcrumb-item
            >
          </template>
          <template v-else>
            <a-breadcrumb-item v-if="route.meta.module"
              ><router-link :to="route.path">{{ route.meta.module }}</router-link></a-breadcrumb-item
            >
          </template>
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
  import { useRoute } from 'vue-router';
  const route = useRoute();
  const selectedKeys2 = ref<string[]>([route.path]);
  const openKeys = ref<string[]>(['sub1']);
  if (route.path === '/interface' || route.path === '/database') {
    openKeys.value = ['sub1'];
  } else if (route.path === '/catalogue' || route.path === '/tablemanagement') {
    openKeys.value = ['sub2'];
  } else {
    openKeys.value = [''];
  }
  const jump = () => {
    if (selectedKeys2.value[0] == '/database') {
      selectedKeys2.value[0] = '/interface';
    }
    if (selectedKeys2.value[0] == '/tablemanagement') {
      selectedKeys2.value[0] = '/catalogue';
    }
  };
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

  .interfaceDetail {
    margin: 0 -23px 16px;
    padding-top: 16px;
    padding-left: 23px;
    height: 100px;
    background-color: #fff;
  }
</style>
