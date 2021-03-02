import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import '@/styles/main.scss';

const app = createApp(App);
app.use(store).use(router);

app.directive('click-outside', {
  beforeMount(el, binding) {
    el.clickOutsideEvent = (event: Event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event, el);
      }
    };
    document.body.addEventListener('click', el.clickOutsideEvent);
  },
  unmounted(el) {
    document.body.removeEventListener('click', el.clickOutsideEvent);
  },
});

app.mount('#app');
