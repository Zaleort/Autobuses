<template>
  <h1>
    Tarjetas
    <ui-icon
      icon="plus"
      size="mini"
      color="primary"
      class="clickable"
      @click="openTarjetaDialog"
    />
  </h1>

  <ui-alert v-if="!datos.tarjetas || datos.tarjetas.length === 0" color="info">
    Haz un seguimiento del saldo de tus tarjetas y calcula el coste de tus viajes
  </ui-alert>

  <div class="home-user__tarjetas">
    <tarjetas-item
      v-for="tarjeta of datos.tarjetas"
      :id="tarjeta._id"
      :key="tarjeta._id"
      v-bind="tarjeta"
    />
  </div>

  <ui-dialog v-model:visibility="tarjetaDialog" :fullscreen="{ t: true }">
    <template #header>
      Crear nueva tarjeta
    </template>

    <ui-label class="login__input">
      Nombre
      <template #content>
        <ui-input v-model:value="nuevaTarjeta.nombre" size="large" />
      </template>
    </ui-label>

    <ui-label class="login__input">
      Saldo
      <template #content>
        <ui-input
          v-model:value="nuevaTarjeta.saldo"
          v-model:error="hasTarjetaError"
          size="large"
          :validator="validateTarjetaSaldo"
          validate-on="input"
        >
          <template #append>
            €
          </template>
        </ui-input>
      </template>
    </ui-label>

    <template #footer>
      <ui-button :loading="loadingTarjeta" @click="saveTarjetaDialog">
        Guardar
      </ui-button>

      <ui-button
        color="danger"
        class="mr-2"
        @click="tarjetaDialog = false"
      >
        Cancelar
      </ui-button>
    </template>
  </ui-dialog>
</template>

<script lang="ts">
import {
  computed, defineComponent, reactive, ref,
} from 'vue';
import TarjetasItem from '@/components/TarjetasItem.vue';
import UiAlert from '@/components/ui/UiAlert.vue';
import UiIcon from '@/components/ui/UiIcon.vue';
import UiDialog from '@/components/ui/UiDialog.vue';
import UiInput from '@/components/ui/UiInput.vue';
import UiLabel from '@/components/ui/UiLabel.vue';
import UiButton from '@/components/ui/UiButton.vue';
import { useStore } from '@/store';

export default defineComponent({
  name: 'Tarjetas',
  components: {
    TarjetasItem,
    UiAlert,
    UiIcon,
    UiDialog,
    UiInput,
    UiButton,
    UiLabel,
  },

  setup(props, context) {
    const store = useStore();
    const datos = computed(() => store.state.usuario.autobuses);
    const nuevaTarjeta = reactive<{ nombre: string; saldo: number | string; viajes: number }>({
      nombre: 'Nueva tarjeta',
      saldo: '0',
      viajes: 0,
    });

    const tarjetaDialog = ref(false);
    const loadingTarjeta = ref(false);
    const hasTarjetaError = ref(false);
    const validateTarjetaSaldo = () => {
      const floatRegex = /^-?\d+(?:[.,]\d{1,2}?)?$/;
      if (!floatRegex.test(nuevaTarjeta.saldo as string)) return false;

      const saldo = parseFloat(nuevaTarjeta.saldo as string);
      if (isNaN(saldo)) return false;
      return true;
    };

    const openTarjetaDialog = () => {
      nuevaTarjeta.nombre = 'Nueva Tarjeta';
      nuevaTarjeta.saldo = '0';
      tarjetaDialog.value = true;
    };

    const saveTarjetaDialog = async () => {
      if (hasTarjetaError.value) return;

      try {
        loadingTarjeta.value = true;
        const saldo = parseFloat((nuevaTarjeta.saldo as string).replace(',', '.'));
        const tarjeta = { ...nuevaTarjeta, saldo };
        await store.dispatch('usuario/addTarjeta', tarjeta);

        nuevaTarjeta.nombre = 'Nueva Tarjeta';
        nuevaTarjeta.saldo = '0';
        tarjetaDialog.value = false;
      } catch (error) {
        console.log(error);
      } finally {
        loadingTarjeta.value = false;
      }
    };

    return {
      store,
      datos,
      tarjetaDialog,
      openTarjetaDialog,
      saveTarjetaDialog,
      nuevaTarjeta,
      hasTarjetaError,
      validateTarjetaSaldo,
      loadingTarjeta,
    };
  },
});
</script>
