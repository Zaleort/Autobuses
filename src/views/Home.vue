<template>
  <home-user v-if="usuario" />
  <home-guest v-else />
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import HomeUser from '@/views/HomeUser.vue';
import HomeGuest from '@/views/HomeGuest.vue';
import { useStore } from '@/store';

export default defineComponent({
  name: 'Home',
  components: {
    HomeUser,
    HomeGuest,
  },

  setup() {
    const store = useStore();
    const usuario = computed(() => store.state.usuario.usuario);

    return {
      usuario,
      store,
    };
  },
});
</script>
