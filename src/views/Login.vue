<template>
  <div class="login">
    <form class="login__content">
      <h1 class="login__heading">
        Iniciar sesión
      </h1>

      <ui-alert
        v-if="error"
        class="mb-5 mt-3"
        color="danger"
        :message="error"
        :closable="false"
      />

      <ui-label class="login__input">
        Usuario
        <template #content>
          <ui-input v-model:value="user" size="large" />
        </template>
      </ui-label>

      <ui-label class="login__input">
        Contraseña
        <template #content>
          <ui-input
            v-model:value="pass"
            type="password"
            size="large"
          />
        </template>
      </ui-label>
      <ui-button
        :loading="loading"
        class="login__button"
        @click="login"
      >
        Login
      </ui-button>
      <router-link :to="{ name: 'Register' }" class="login__register">
        Registrarse
      </router-link>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useStore } from '@/store';
import UiAlert from '@/components/ui/UiAlert.vue';
import UiLabel from '@/components/ui/UiLabel.vue';
import UiInput from '@/components/ui/UiInput.vue';
import UiButton from '@/components/ui/UiButton.vue';
import router from '@/router';

export default defineComponent({
  name: 'Login',
  components: {
    UiAlert,
    UiLabel,
    UiInput,
    UiButton,
  },

  setup() {
    const store = useStore();
    const user = ref();
    const pass = ref();
    const loading = ref(false);
    const error = ref();

    const login = async () => {
      error.value = null;
      const usuario = {
        usuario: user.value,
        contrasena: pass.value,
      };

      try {
        loading.value = true;
        const response = await store.dispatch('usuario/login', usuario);
        console.log(response);
        router.push({ name: 'Home' });
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
      loading,
      error,
      login,
    };
  },
});
</script>
