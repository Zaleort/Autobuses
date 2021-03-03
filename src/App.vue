<template>
  <div class="container">
    <ui-topbar>
      <h1 class="logo" routerLink="/">
        Autobuses
      </h1>
      <nav class="nav">
        <router-link class="nav-link" to="/nucleos">
          Núcleos Urbanos
        </router-link>
        <router-link class="nav-link" to="/lineas">
          Líneas
        </router-link>
      </nav>
    </ui-topbar>

    <main class="main">
      <router-view />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import UiTopbar from '@/components/ui/UiTopbar.vue';

export default defineComponent({
  name: 'App',
  components: {
    UiTopbar,
  },
});
</script>
