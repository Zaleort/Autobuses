<template>
  <h1>
    Tarjetas
    <ui-icon
      icon="plusCircle"
      size="mini"
      color="primary"
      class="clickable"
      @click="openNewDialog"
    />
  </h1>

  <ui-alert v-if="!datos.tarjetas || datos.tarjetas.length === 0" color="info">
    Haz un seguimiento del saldo de tus tarjetas y calcula el coste de tus viajes
  </ui-alert>

  <div class="home-user__tarjetas">
    <tarjetas-item
      v-for="tarjeta of datos.tarjetas"
      :key="tarjeta._id"
      v-bind="tarjeta"
      @edit="openEditDialog"
    />
  </div>

  <ui-dialog v-model:visibility="dialog" :fullscreen="{ t: true }">
    <template #header>
      {{ isEditing ? 'Editar' : 'Crear nueva' }}
      tarjeta
    </template>

    <ui-label class="mb-4">
      Nombre
      <template #content>
        <ui-input v-model:value="tarjeta.nombre" size="large" />
      </template>
    </ui-label>

    <ui-label>
      Saldo
      <template #content>
        <ui-input
          v-model:value="tarjeta.saldo"
          v-model:error="saldoError"
          size="large"
          :validator="validateSaldo"
          validate-on="input"
        >
          <template #append>
            €
          </template>
        </ui-input>
      </template>
    </ui-label>

    <template #footer>
      <ui-button :loading="loading" @click="save">
        Guardar
      </ui-button>

      <ui-button
        color="danger"
        class="mr-2"
        @click="dialog = false"
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
    const tarjeta = reactive<{ _id: string | null; nombre: string; saldo: number | string; viajes: number | string }>({
      _id: null,
      nombre: 'Nueva tarjeta',
      saldo: '0',
      viajes: '0',
    });

    const dialog = ref(false);
    const loading = ref(false);
    const isEditing = ref(false);

    const saldoError = ref(false);
    const hasError = computed(() => saldoError.value);

    const validateSaldo = () => {
      const floatRegex = /^-?\d+(?:[.,]\d{1,2}?)?$/;
      if (!floatRegex.test(tarjeta.saldo as string)) return false;

      const saldo = parseFloat(tarjeta.saldo as string);
      if (isNaN(saldo)) return false;
      return true;
    };

    const openNewDialog = () => {
      tarjeta._id = null;
      tarjeta.nombre = 'Nueva Tarjeta';
      tarjeta.saldo = '0';
      isEditing.value = false;
      dialog.value = true;
    };

    const openEditDialog = (e: any) => {
      tarjeta._id = e._id;
      tarjeta.nombre = e.nombre;
      tarjeta.saldo = e.saldo.toString() || '0';
      isEditing.value = true;
      dialog.value = true;
    };

    const save = async () => {
      if (hasError.value) return;

      try {
        loading.value = true;
        const saldo = parseFloat((tarjeta.saldo as string).replace(',', '.'));
        const nuevaTarjeta = { ...tarjeta, saldo };

        if (isEditing.value) {
          await store.dispatch('usuario/editTarjeta', nuevaTarjeta);
        } else {
          await store.dispatch('usuario/addTarjeta', nuevaTarjeta);
        }

        tarjeta.nombre = 'Nueva Tarjeta';
        tarjeta.saldo = '0';
        dialog.value = false;
      } catch (error) {
        console.log(error);
      } finally {
        loading.value = false;
      }
    };

    return {
      store,
      datos,
      dialog,
      openNewDialog,
      openEditDialog,
      save,
      tarjeta,
      saldoError,
      hasError,
      isEditing,
      validateSaldo,
      loading,
    };
  },
});
</script>
