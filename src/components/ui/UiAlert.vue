<template>
  <div
    v-if="!isClosed"
    :class="{
      'alert': true,
      [`alert--${color}`]: true,
    }"
  >
    <div>
      <div v-if="hasTitle" class="alert__title">
        <slot name="title">
          {{ title }}
        </slot>
      </div>
      <slot>{{ message }}</slot>
    </div>
    <div
      v-if="closable"
      class="alert__close"
      @click="close"
    >
      <ui-icon icon="close" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';

export default defineComponent({
  name: 'UiAlert',
  props: {
    closable: {
      type: Boolean,
      default: true,
    },

    title: {
      type: String,
      default: null,
    },

    message: {
      type: String,
      default: null,
    },

    color: {
      type: String,
      default: 'danger',
    },
  },

  emits: {
    closed: null,
  },

  setup(props, context) {
    const isClosed = ref(false);
    const close = () => {
      isClosed.value = true;
      context.emit('closed', true);
    };

    const hasTitle = computed(() => !!props.title || !!context.slots.title);

    return {
      isClosed,
      close,
      hasTitle,
    };
  },
});
</script>
