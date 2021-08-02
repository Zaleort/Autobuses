<template>
  <h1>Recorridos</h1>

  <ui-alert v-if="!datos.recorridos || datos.recorridos.length === 0" color="info">
    Selecciona tus destinos más frecuentes para ver cuándo saldrán los próximos buses
  </ui-alert>
</template>

<script lang="ts">
import { useStore } from '@/store';
import { computed, defineComponent } from 'vue';
import UiAlert from '@/components/ui/UiAlert.vue';

export default defineComponent({
  name: 'Recorridos',
  components: {
    UiAlert,
  },

  setup() {
    const store = useStore();
    const datos = computed(() => store.state.usuario.autobuses);

    return {
      store,
      datos,
    };
  },
});
</script>
