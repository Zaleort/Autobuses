<template>
  <div class="container">
    <ui-topbar>
      <router-link
        v-slot="{ navigate }"
        to="/"
        custom
      >
        <h1 class="logo clickable" @click="navigate">
          Autobuses
        </h1>
      </router-link>
      <nav class="nav">
        <router-link class="nav-link" to="/tarifas">
          Tarifas
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
import { defineComponent, onMounted } from 'vue';
import { useStore } from '@/store';

export default defineComponent({
  name: 'App',
  setup() {
    const store = useStore();
    console.log(store);

    onMounted(async () => {
      console.log('App Mounted');
      try {
        await store.dispatch('usuario/checkToken');
      } catch (error) {
        store.dispatch('usuario/clearUsuario');
      }
    });

    return {
      store,
    };
  },
});
</script>
