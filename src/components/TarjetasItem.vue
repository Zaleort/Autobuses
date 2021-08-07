<template>
  <div>
    <ui-card
      compact
      border
      clickable
    >
      <template #title>
        <span class="tarjeta-card__name" @click="openEdit">
          {{ nombre }}
        </span>
      </template>

      <div class="tarjeta-card__saldo">
        {{ saldo }}€
      </div>

      <template #options>
        <ui-icon
          icon="plusCircle"
          class="clickable mr-1"
          @click="addViaje"
        />
        <ui-icon
          icon="close"
          class="clickable"
          @click="deleteTarjeta"
        />
      </template>
    </ui-card>
  </div>

  <component
    :is="alertComponent"
    :show="showAlertBox"
    show-cancel-button
    @ok="closeAlert"
    @cancel="closeAlert"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import UiCard from '@/components/ui/UiCard.vue';
import UiIcon from '@/components/ui/UiIcon.vue';
import AlertBox from '@/composables/alertBox';
import { useStore } from '@/store';

export default defineComponent({
  name: 'TarjetasItem',
  components: {
    UiCard,
    UiIcon,
  },

  props: {
    _id: {
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

    compact: {
      type: Boolean,
      default: true,
    },
  },

  emits: ['edit'],

  setup(props, context) {
    const store = useStore();
    const {
      openAlert, closeAlert, alertComponent, showAlertBox,
    } = AlertBox();

    const deleteTarjeta = () => {
      openAlert({
        title: `Borrar línea ${props.nombre}`,
        message: '¿Estás seguro de que quieres borrar la línea?',
        okButton: 'Borrar',
        okButtonAction: async () => {
          try {
            await store.dispatch('usuario/removeTarjeta', props._id);
          } catch (error) {
            console.log(error);
          }
        },
      });
    };

    const openEdit = () => {
      const tarjeta = {
        _id: props._id,
        nombre: props.nombre,
        saldo: props.saldo,
      };

      context.emit('edit', tarjeta);
    };

    const addViaje = () => {

    };

    return {
      store,
      deleteTarjeta,
      openEdit,
      addViaje,
      openAlert,
      closeAlert,
      alertComponent,
      showAlertBox,
    };
  },
});
</script>
