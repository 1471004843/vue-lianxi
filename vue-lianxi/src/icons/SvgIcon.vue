<template>
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="name" />
  </svg>

</template>
<script>
import {
  reactive,
  ref,
  isRef,
  toRefs,
  onMounted,
  computed
} from "@vue/composition-api";
export default {
  name: "svgIcon",
  setup() {
    const msg = ref('"手把手撸码前端"');
    const svg = reactive({
      props: {
        iconClass: {
          type: String,
          required: true
        },
        className: {
          type: String,
          default: ""
        }
      }
    });
    const iconName = computed(() => {
       return `#icon-${this.iconClass}`
    });
    const svgClass = computed(() => {
        if (svg.props.className) {
                    return 'svg-icon ' + svg.props.className
                } else {
                    return 'svg-icon'
                }
    });
    const styleExternalIcon = computed(() => {
         return {
                    mask: `url(${svg.props.iconClass}) no-repeat 50% 50%`,
                    '-webkit-mask': `url(${svg.props.iconClass}) no-repeat 50% 50%`
                }
    });
    return {
      msg,
      svg,
      iconName
    };
  }
};
</script>
<style lang="scss" scoped>

</style>