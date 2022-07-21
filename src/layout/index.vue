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
              <span>
                <user-outlined />
                数据源管理
              </span>
            </template>
            <a-menu-item key="1">接口管理</a-menu-item>
            <a-menu-item key="2">数据库管理</a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="sub2">
            <template #title>
              <span>
                <laptop-outlined />
                数据标准管理
              </span>
            </template>
            <a-menu-item key="3">数据标准目录</a-menu-item>
            <a-menu-item key="4">码表管理</a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="sub3">
            <template #title>
              <span>
                <notification-outlined />
                数据资产管理
              </span>
            </template>
            <a-menu-item key="5"> 数据资产管理</a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="sub4">
            <template #title>
              <span>
                <notification-outlined />
                脚本管理
              </span>
            </template>
            <a-menu-item key="6">脚本管理</a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="sub5">
            <template #title>
              <span>
                <notification-outlined />
                任务管理
              </span>
            </template>
            <a-menu-item key="7">任务管理</a-menu-item>
          </a-sub-menu>
        </a-menu>
      </a-layout-sider>
      <a-layout style="padding: 0 24px 24px">
        <a-breadcrumb style="margin: 16px 0">
          <a-breadcrumb-item>数据工厂</a-breadcrumb-item>
          <a-breadcrumb-item>数据标准管理</a-breadcrumb-item>
          <a-breadcrumb-item>码表管理</a-breadcrumb-item>
        </a-breadcrumb>
        <a-layout-content :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '280px' }">
          <TableManagement></TableManagement>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
</template>
<script lang="ts">
  import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons-vue';
  import TableManagement from '../components/TableManagement.vue';
  import { defineComponent, ref } from 'vue';
  export default defineComponent({
    components: {
      UserOutlined,
      LaptopOutlined,
      NotificationOutlined,
    },
    setup() {
      return {
        selectedKeys1: ref<string[]>(['2']),
        selectedKeys2: ref<string[]>(['1']),
        collapsed: ref<boolean>(false),
        openKeys: ref<string[]>(['sub1']),
      };
    },
  });
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

  .ant-layout-content {
    position: relative;
  }
</style>
