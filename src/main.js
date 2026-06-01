import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import 'element-plus/dist/index.css';
import './styles/variables.scss';
import App from './App.vue';
import router from './router';

const app = createApp(App);
const pinia = createPinia();

// 註冊 Element Plus Icons
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}

// 自定義 Element Plus 主題（綠色系）
app.use(ElementPlus, {
    size: 'default',
    zIndex: 3000,
});

app.use(pinia);
app.use(router);

app.mount('#app');
