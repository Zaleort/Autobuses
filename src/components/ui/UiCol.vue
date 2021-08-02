<script lang="ts">
import { defineComponent, inject, h } from 'vue';

export default defineComponent({
  name: 'UiCol',
  props: {
    tag: {
      type: String,
      default: 'div',
    },

    grow: {
      type: Boolean,
      default: false,
    },

    span: {
      type: Number,
      default: null,
    },

    m: {
      type: Number,
      default: null,
    },

    ml: {
      type: Number,
      default: null,
    },

    t: {
      type: Number,
      default: null,
    },

    d: {
      type: Number,
      default: null,
    },

    dl: {
      type: Number,
      default: null,
    },

    dxl: {
      type: Number,
      default: null,
    },
  },

  // Sin setup por ahora Vue no detecta el tipo de Gutter (rc-5)
  setup() {
    const gutter = inject('gutter', 'normal');

    return {
      gutter,
    };
  },

  render() {
    const classList = {
      col: true,
      'col--grow': this.grow,
      [`col--gutter-${this.gutter}`]: this.gutter,
      [`col-${this.span}`]: this.span >= 0,
      [`col-m-${this.m}`]: this.m >= 0,
      [`col-ml-${this.ml}`]: this.ml >= 0,
      [`col-t-${this.t}`]: this.t >= 0,
      [`col-d-${this.d}`]: this.d >= 0,
      [`col-dl-${this.dl}`]: this.dl >= 0,
      [`col-dxl-${this.dxl}`]: this.dxl >= 0,
    };

    return h(this.tag, {
      class: classList,
    }, this.$slots.default ? this.$slots.default() : []);
  },
});
</script>
