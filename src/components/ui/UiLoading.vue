<template>
  <div
    v-if="loading"
    :class="{
      'loading': true,
      'loading--animate-background': animateBackground,
      'is-fullscreen': fullscreen,
      'is-absolute': absolute,
    }"
  >
    <ui-icon
      icon="loading"
      class="icon-loading"
      size="x3"
    />

    <span class="loading__text">
      <slot>{{ text }}</slot>
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import UiIcon from '@/components/ui/UiIcon.vue';

export default defineComponent({
  name: 'UiLoading',
  components: {
    UiIcon,
  },
  props: {
    loading: {
      type: Boolean,
      default: false,
    },

    fullscreen: {
      type: Boolean,
      default: false,
    },

    absolute: {
      type: Boolean,
      default: false,
    },

    text: {
      type: String,
      default: 'Cargando...',
    },

    animateBackground: {
      type: Boolean,
      default: false,
    },
  },
});
</script>
