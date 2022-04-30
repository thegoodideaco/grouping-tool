<template>
  <div class="par-coords w-80 h-80 bg-blue-300">
    Hey there {{ dataset.length }}

    <div>
      {{ fields }}
    </div>
  </div>
</template>

<script>
import { useCrossfilter } from '@/composition/dataviz'
import { defineComponent, inject } from 'vue-demi'

export default defineComponent({
  props: {
    dataset: {
      type:    Array,
      default: () => null
    },
    fields: {
      type:    Array,
      default: () => null
    }
  },

  setup(props) {
    const {
      cf,
      dimensions
    } = useCrossfilter(props.dataset, props.fields)

    inject('dimensions', dimensions)

    return {
      cf,
      dimensions
    }
  }
})
</script>

<style>

</style>
