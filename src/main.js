import { createApp } from 'vue'
import App from './App.vue'
import mixins from './mixins'
import store from './store'
import router from './router'
import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css';

createApp(App).use(router).mixin(mixins).use(VueSweetalert2).use(store).mount('#app')

window.Kakao.init("df722114628d373da9c15d4d8e40f613")