<template>
  <div
    :class="{
      'input': type !== 'textarea',
      [`ui-input--${color}`]: color,
      'textarea': type === 'textarea',
      'is-focus': focus,
      'is-disabled': isDisabled,
      'is-readonly': readonly,
      'is-error': error !== null,
    }"
  >
    <div v-if="hasPrepend" class="input__prepend">
      <slot name="prepend" />
    </div>
    <input
      v-if="type !== 'textarea'"
      v-model="inputValue"
      v-bind="$attrs"
      :type="type"
      :disabled="isDisabled"
      :readonly="readonly"
      :class="{
        'input__inner': true,
        'input__inner--small': inputSize === 'small',
        'input__inner--large': inputSize === 'large',
        'is-disabled': isDisabled,
        'is-readonly': readonly,
      }"
      @input="handleInput"
      @change="handleChange"
      @focus="handleFocus"
      @blur="handleBlur"
    >

    <textarea
      v-else
      v-model="inputValue"
      v-bind="$attrs"
      :disabled="isDisabled"
      :readonly="readonly"
      :class="{
        'textarea__inner': true,
        'textarea__inner--small': inputSize === 'small',
        'textarea__inner--large': inputSize === 'large',
        'is-fixed': fixed,
        'is-disabled': isDisabled,
        'is-readonly': readonly,
      }"
      @input="$emit('input', $event)"
      @focus="setFocus(true)"
      @blur="setFocus(false)"
    />
    <div v-if="hasAppend" class="input__append">
      <slot name="append" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import useFormInject from '@/composables/formInject';

export default defineComponent({
  name: 'UiInput',
  props: {
    color: {
      type: String,
      default: null,
    },

    value: {
      type: String,
      default: '',
    },

    type: {
      type: String,
      default: 'text',
    },

    disabled: {
      type: Boolean,
      default: false,
    },

    readonly: {
      type: Boolean,
      default: false,
    },

    fixed: {
      type: Boolean,
      default: false,
    },

    size: {
      type: String,
      default: null,
      validator: (value: string) => ['large', 'normal', 'small'].indexOf(value) !== -1,
    },

    validator: {
      type: Function,
      default: null,
    },

    validateOn: {
      type: String,
      default: 'submit',
    },
  },

  emits: ['update:value', 'input', 'change', 'blur', 'focus'],

  setup(props, context) {
    const {
      formDisabled,
      formSize,
      formValidateOn,
      formValidators,
    } = useFormInject();

    const error = ref<string | null>(null);
    const inputValue = computed({
      get: () => props.value,
      set: val => context.emit('update:value', val),
    });

    const handleInput = (e: InputEvent) => {
      context.emit('input', e);

      if (typeof props.validator === 'function' && props.validateOn === 'input') {
        error.value = props.validator();
      }
    };

    const handleChange = (e: Event) => {
      context.emit('change', e);

      if (typeof props.validator === 'function' && props.validateOn === 'change') {
        error.value = props.validator();
      }
    };

    const focus = ref(false);
    const setFocus = (set: boolean) => focus.value = set;
    const handleFocus = (e: Event) => {
      setFocus(true);
      context.emit('focus', e);
    };

    const handleBlur = (e: Event) => {
      setFocus(false);
      context.emit('blur', e);

      if (typeof props.validator === 'function' && props.validateOn === 'blur') {
        error.value = props.validator();
      }
    };

    const isDisabled = computed(() => props.disabled || formDisabled);
    const inputSize = computed(() => props.size || formSize || 'normal');
    const hasPrepend = computed(() => !!context.slots.prepend);
    const hasAppend = computed(() => !!context.slots.append);

    const inputValidateOn = computed(() => props.validateOn || formValidateOn);

    if (typeof formValidators === 'function' && typeof props.validator === 'function') {
      formValidators(props.validator);
    }

    return {
      inputValue,
      error,
      focus,
      setFocus,
      handleFocus,
      handleBlur,
      formDisabled,
      formSize,
      formValidators,
      formValidateOn,
      isDisabled,
      inputSize,
      hasPrepend,
      hasAppend,
      inputValidateOn,
      handleInput,
      handleChange,
    };
  },
});
</script>
