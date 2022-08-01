import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { createHead } from '@vueuse/head';
import Antd from 'ant-design-vue';
import './assets/index.postcss';
import 'ant-design-vue/dist/antd.css';
const head = createHead();
const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(head);
app.use(Antd);
app.mount('#app');
