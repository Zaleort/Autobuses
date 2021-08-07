<template>
  <div class="login">
    <form class="login__content">
      <h1 class="login__heading">
        Registrarse
      </h1>

      <ui-alert
        v-if="error"
        class="mb-5"
        color="danger"
        :message="error"
        :closable="false"
      />

      <ui-label class="login__input">
        Usuario
        <template #content>
          <ui-input
            v-model:value="user"
            size="large"
            @keyup.enter="register"
          />
        </template>
      </ui-label>

      <ui-label class="login__input">
        Contraseña
        <template #content>
          <ui-input
            v-model:value="pass"
            type="password"
            size="large"
            @keyup.enter="register"
          />
        </template>
      </ui-label>

      <ui-label class="login__input">
        Repetir contraseña
        <template #content>
          <ui-input
            v-model:value="rePass"
            type="password"
            size="large"
            @keyup.enter="register"
          />
        </template>
      </ui-label>

      <ui-button
        :loading="loading"
        class="login__button"
        @click="register"
      >
        Registrarse
      </ui-button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useStore } from '@/store';

export default defineComponent({
  name: 'Register',
  setup() {
    const store = useStore();
    const user = ref();
    const pass = ref();
    const rePass = ref();
    const loading = ref(false);
    const error = ref();

    const register = async () => {
      if (pass.value !== rePass.value) {
        error.value = 'Las contraseñas no coinciden';
        return;
      }

      error.value = null;
      const usuario = {
        usuario: user.value,
        contrasena: pass.value,
      };

      try {
        loading.value = true;
        const response = await store.dispatch('usuario/register', usuario);
        console.log(response);
      } catch (e) {
        error.value = e.message || e;
      } finally {
        loading.value = false;
      }
    };

    return {
      store,
      user,
      pass,
      rePass,
      error,
      loading,
      register,
    };
  },
});
</script>
