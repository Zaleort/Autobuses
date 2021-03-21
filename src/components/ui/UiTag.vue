<template>
  <span
    :class="{
      'tag': true,
      'tag--mini': size === 'mini',
      'tag--small': size === 'small',
      'tag--large': size === 'large',
      [`tag--${color}`]: true,
      'is-pill': pill,
    }"
  >
    <slot />
    <ui-icon
      v-if="closable"
      class="tag__close"
      icon="close"
      size="small"
      @click="close"
    />
  </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import UiIcon from '@/components/ui/UiIcon.vue';

export default defineComponent({
  name: 'UiTag',
  components: {
    UiIcon,
  },

  props: {
    plain: {
      type: Boolean,
      default: false,
    },

    size: {
      type: String,
      default: 'normal',
      validator: (value: string) => ['large', 'normal', 'small', 'mini'].indexOf(value) !== -1,
    },

    color: {
      type: String,
      default: 'primary',
    },

    pill: {
      type: Boolean,
      default: true,
    },

    closable: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['close'],

  setup(props, context) {
    const close = () => context.emit('close', true);
    return { close };
  },
});
</script>
