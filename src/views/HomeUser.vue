<template>
  <div v-if="usuario">

  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useStore } from '@/store';

export default defineComponent({
  name: 'HomeUser',
  setup() {
    const store = useStore();
    const usuario = computed(() => store.state.usuario.usuario);
    const datos = computed(() => store.state.usuario.autobuses);

    return {
      usuario,
      datos,
      store,
    };
  },
});
</script>
