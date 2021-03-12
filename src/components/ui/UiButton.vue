<template>
  <button
    :class="{
      'button': true,
      'button--small': buttonSize === 'small',
      'button--large': buttonSize === 'large',
      [`button--${color}`]: true,
      'is-pill': pill,
      'is-loading': loading,
      'is-plain': plain,
    }"
    :disabled="isDisabled"
    :type="type"
  >
    <ui-icon
      v-if="loading"
      class="icon-loading"
      icon="loading"
      size="small"
    />
    <slot />
  </button>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import UiIcon from '@/components/ui/UiIcon.vue';
import useFormInject from '@/composables/formInject';

export default defineComponent({
  name: 'UiButton',
  components: {
    UiIcon,
  },

  props: {
    type: {
      type: String,
      default: 'button',
    },

    plain: {
      type: Boolean,
      default: false,
    },

    size: {
      type: String,
      default: null,
      validator: (value: string) => ['large', 'normal', 'small'].indexOf(value) !== -1,
    },

    color: {
      type: String,
      default: 'primary',
    },

    disabled: {
      type: Boolean,
      default: false,
    },

    pill: {
      type: Boolean,
      default: false,
    },

    loading: {
      type: Boolean,
      default: false,
    },
  },

  setup(props) {
    const { formDisabled, formSize } = useFormInject();
    const isDisabled = computed(() => props.loading || props.disabled || formDisabled);
    const buttonSize = computed(() => props.size || formSize || 'normal');

    return {
      formDisabled,
      isDisabled,
      formSize,
      buttonSize,
    };
  },
});
</script>
