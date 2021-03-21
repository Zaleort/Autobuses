<template>
  <teleport to="body">
    <transition name="dialog-fade">
      <div
        v-show="visibility"
        ref="draggableContainer"
        :class="{
          'dialog__container': true,
          'is-mask': mask && !draggable && fullscreen !== true,
        }"
        :style="styles"
        @click="mask ? close() : null"
      >
        <div
          :class="{
            'dialog': true,
            'is-fullscreen': fullscreen === true,

            // Fullscreen del breakpoint hacia abajo
            'is-fullscreen--mobile': fullscreen.m,
            'is-fullscreen--mobile-l': fullscreen.ml,
            'is-fullscreen--tablet': fullscreen.t,
            'is-fullscreen--desktop': fullscreen.d,
            'is-fullscreen--desktop-l': fullscreen.dl,
            'is-fullscreen--desktop-xl': fullscreen.dxl,
          }"
          :style="containerStyles"
          @click.stop
        >
          <header class="dialog__header" @mousedown="onDragMouseDown">
            <div>
              <slot name="header" />
            </div>

            <div class="dialog__actions">
              <slot name="actions">
                <ui-icon
                  icon="close"
                  size="large"
                  class="clickable"
                  @click="close"
                />
              </slot>
            </div>
          </header>

          <main class="dialog__main">
            <slot />
          </main>

          <footer class="dialog__footer">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, computed, watch } from 'vue';
import useDraggable from '@/composables/draggable';

export default defineComponent({
  name: 'UiDialog',
  props: {
    mask: {
      type: Boolean,
      default: true,
    },

    fullscreen: {
      type: [Boolean, Object],
      default: false,
    },

    draggable: {
      type: Boolean,
      default: false,
    },

    visibility: {
      type: Boolean,
      default: false,
    },

    width: {
      type: String,
      default: null,
    },

    maxWidth: {
      type: String,
      default: null,
    },

    minWidth: {
      type: String,
      default: null,
    },
  },

  emits: ['update:visibility'],

  setup(props, context) {
    const {
      defaultPositions,
      draggableContainer,
      dragMouseDown,
    } = useDraggable();

    const hasFooter = computed(() => !!context.slots.footer);
    const styles = computed(() => {
      if (props.width && (!props.mask || props.draggable)) {
        return props.width;
      }

      return {};
    });

    const containerStyles = computed(() => ({
      width: props.width,
      minWidth: props.minWidth,
      maxWidth: props.maxWidth,
    }));

    watch(
      () => props.visibility,
      () => {
        if (props.visibility === false) {
          // Espera a que finalice la animación para resetear posición del diálogo
          if (!draggableContainer.value) return;

          setTimeout(() => {
            (draggableContainer.value! as HTMLElement).style.top = defaultPositions.top;
            (draggableContainer.value! as HTMLElement).style.left = defaultPositions.left;
          }, 190);
        }
      },
    );

    const close = () => {
      context.emit('update:visibility', false);
    };

    const onDragMouseDown = (e: MouseEvent) => {
      if (!props.draggable) return;
      dragMouseDown(e);
    };

    return {
      defaultPositions,
      draggableContainer,
      dragMouseDown,
      onDragMouseDown,
      hasFooter,
      styles,
      containerStyles,
      close,
    };
  },
});
</script>
