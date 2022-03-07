<template>
  <div
    ref="containerEl"
    class="group-viewer">
    <svg
      width="100%"
      height="100%">
      <template v-for="(node, index) in leaves">
        <circle
          :key="index"
          class="node"
          :class="{ leaf: node.children == null }"
          :cx="node.x"
          :cy="node.y"
          :r="node.r">
          hey
        </circle>
      </template>
    </svg>
  </div>
</template>

<script>
import {
  computed,
  defineComponent,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  toRefs,
  watchEffect
} from '@vue/composition-api'
import { treemap, pack, hierarchy } from 'd3-hierarchy'
import debounce from 'lodash/debounce'
export default defineComponent({
  props: {
    group: {
      type:     Map,
      required: true
    },

    /**
     * @options {"treemap" | "pack"}
     */
    layout: {
      type:    String,
      default: 'treemap'
    },
    options: {
      type:    Object,
      default: () => ({
        padding: 2
      })
    }
  },
  setup(props, _ctx) {
    const { group, layout, options } = toRefs(props)
    const padding = computed(() => options.value?.padding)

    /** @type {import('@vue/composition-api').Ref<(d3.HierarchyCircularNode & d3.HierarchyRectangularNode)>} */
    const h = shallowRef()

    const leaves = computed(() => {
      if (h.value) {
        const nodes = Array.from(h.value)
        // remove main node
        nodes.shift()

        return nodes
      }
    })

    /** @type {import('@vue/composition-api').Ref<HTMLElement>} */
    const containerEl = shallowRef()

    const dimensions = shallowRef([
      1,
      1
    ])

    /**
     * Layout Generator with settings applied
     */
    const layoutGen = computed(() => {
      if (layout.value === 'treemap') {
        return treemap().size(dimensions.value)
      } else {
        return pack()
          .size(dimensions.value)
          .padding(padding.value ?? 0)
      }
    })

    function updatedimensions() {
      const { width, height } = containerEl.value.getBoundingClientRect()
      dimensions.value = [
        width,
        height
      ]
    }

    const updatedimensionsDebounced = debounce(updatedimensions, 10)

    onMounted(() => {
      updatedimensions()
      window.addEventListener('resize', updatedimensionsDebounced)

      watchEffect(() => {
        if (group.value && layoutGen.value) {
          const _h = hierarchy(group.value)

          // _h.count()
          _h.sum(d => d[1].count)
          _h.sort((b, a) => a.value - b.value || a.height - b.height)

          layoutGen.value(_h)

          h.value = _h
        }
      })
    })

    onBeforeUnmount(() => {
      console.log('unmounting')
      window.removeEventListener('resize', updatedimensionsDebounced)
    })

    return {
      dimensions,
      containerEl,
      hierarchy: h,
      g:         group,
      leaves
    }
  }
})
</script>

<style lang="scss" scoped>
.node {
  fill-opacity: 0.15;

  &.leaf {
    fill: green;
    fill-opacity: 1;
  }
}
</style>
