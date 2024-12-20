import { createApp } from 'vue'
import App from './App.vue'
import router from './router.js'
import VueCarousel from '@chenfengyuan/vue-carousel';

createApp(App).use(router).component(VueCarousel.name, VueCarousel).mount('#app')
