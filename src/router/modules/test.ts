import Index from '@/layout/index.vue';
import TableManagement from '@/components/TableManagement/TableManagement.vue';
import InterFace from '@/components/InterFace/InterFace.vue';
import DataBase from '@/components/DataBase/DataBase.vue';
import Catalogue from '@/components/Catalogue/Catalogue.vue';
import ManageMent from '@/components/management/ManageMent.vue';
export default {
  path: '/',
  component: Index,
  meta: {
    title: '数据工厂',
  },
  redirect: '/interface',
  children: [
    {
      path: 'interface',
      name: 'interface',
      component: InterFace,
    },
    {
      path: 'database',
      name: 'database',
      component: DataBase,
    },
    {
      path: 'tablemanagement',
      name: 'tablemanagement',
      component: TableManagement,
    },
    {
      path: 'catalogue',
      name: 'catalogue',
      component: Catalogue,
    },
    {
      path: 'management',
      name: 'management',
      component: ManageMent,
    },
  ],
};
