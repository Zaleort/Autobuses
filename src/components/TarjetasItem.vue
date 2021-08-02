<template>
  <ui-card compact>
    <template #title>
      {{ nombre }}
    </template>

    <span>Saldo</span>
    <div>
      {{ saldo }}€
    </div>

    <span>Viajes</span>
    <div>
      {{ viajes }}
    </div>

    <template #options>
      <ui-icon
        icon="edit"
        size="small"
        class="clickable mr-2"
        @click="openEdit"
      />
      <ui-icon
        icon="close"
        class="clickable"
        @click="deleteTarjeta"
      />
    </template>
  </ui-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import UiCard from '@/components/ui/UiCard.vue';
import UiIcon from '@/components/ui/UiIcon.vue';

export default defineComponent({
  name: 'TarjetasItem',
  components: {
    UiCard,
    UiIcon,
  },

  props: {
    id: {
      type: String,
      default: null,
    },

    nombre: {
      type: String,
      default: '',
    },

    saldo: {
      type: [String, Number],
      default: 0,
    },

    viajes: {
      type: Number,
      default: 0,
    },

    compact: {
      type: Boolean,
      default: true,
    },
  },

  emits: ['edit'],

  setup(props, context) {
    const deleteTarjeta = () => {

    };

    const openEdit = () => {
      context.emit('edit');
    };

    return {
      deleteTarjeta,
      openEdit,
    };
  },
});
</script>
