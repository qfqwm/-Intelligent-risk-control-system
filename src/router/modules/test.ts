import Index from '@/layout/index.vue';
import TableManagement from '@/pages/TableManagement/TableManagement.vue';
import InterFace from '@/pages/InterFace/InterFace.vue';
import InterfaceDetail from '@/pages/InterFace/component/InterfaceDetail.vue';
import DataBase from '@/pages/DataBase/DataBase.vue';
import Catalogue from '@/pages/Catalogue/index.vue';
import ManageMent from '@/pages/management/ManageMent.vue';
import Scriptment from '@/pages/Scriptment/Scriptment.vue';
import Taskment from '@/pages/Taskment/Taskment.vue';
import ManualRegistration from '@/pages/ManualRegistration/ManualRegistration.vue';
export default {
  path: '/',
  component: Index,
  meta: {
    title: '数据工厂',
  },
  redirect: '/interface',
  children: [
    {
      path: '/interface',
      name: 'interface',
      component: InterFace,
      meta: { title: '数据源管理', module: '接口管理', url: '/interface' },
    },
    {
      path: '/interfaceDetail',
      name: 'interfaceDetail',
      component: InterfaceDetail,
      meta: { title: '数据源管理', module: '接口管理', name: '接口详情', url: '/interface' },
    },
    {
      path: '/database',
      name: 'database',
      component: DataBase,
      meta: { title: '数据源管理', module: '数据库管理', url: '/interface' },
    },
    {
      path: '/catalogue',
      name: 'catalogue',
      component: Catalogue,
      meta: { title: '数据标准管理', module: '数据标准目录', url: '/catalogue' },
    },
    {
      path: '/tablemanagement',
      name: 'tablemanagement',
      component: TableManagement,
      meta: { title: '数据标准管理', module: '码表管理', url: '/catalogue' },
    },
    {
      path: '/management',
      name: 'management',
      component: ManageMent,
      meta: { title: '数据资产管理', url: '/management' },
    },
    {
      path: '/scriptment',
      name: 'scriptment',
      component: Scriptment,
      meta: { title: '脚本管理', url: '/scriptment' },
    },
    {
      path: '/taskment',
      name: 'taskment',
      component: Taskment,
      meta: { title: '任务管理', url: '/taskment' },
    },
    {
      path: 'manualregistration',
      name: 'manualregistration',
      component: ManualRegistration,
      meta: { title: '人工注册', url: '/manualregistration' },
    },
  ],
};
