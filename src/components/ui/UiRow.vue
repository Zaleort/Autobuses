<script lang="ts">
import { defineComponent, h } from 'vue';

export default defineComponent({
  name: 'UiRow',
  provide() {
    return {
      gutter: this.gutter,
    };
  },

  props: {
    tag: {
      type: String,
      default: 'div',
    },

    justify: {
      type: String,
      default: 'flex-start',
    },

    align: {
      type: String,
      default: 'center',
    },

    gutter: {
      type: String,
      default: 'normal',
    },
  },

  render() {
    return h(this.tag, {
      class: [
        'row',
        `row--${this.justify}`,
        `row--${this.align}`,
      ],
    }, this.$slots.default ? this.$slots.default() : []);
  },
});
</script>
