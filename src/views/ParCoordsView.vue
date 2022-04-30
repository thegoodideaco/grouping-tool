<template>
  <div class="inline-block">
    <div class="data-loader">
      <csv-select
        v-model="test"
        :placeholder="'select me'"
        @before:load="loading=true"
        @input="loading = false" />
    </div>

    <template v-if="summary">
      <div
        v-for="(item, key) in summary"
        :key="key"
        :class="{'text-blue-600': item.numerical}">
        {{ key }}: {{ item.domain }}
      </div>

      <par-coords
        :dataset="dataset"
        :fields="numericalKeys" />
    </template>
  </div>
</template>

<script>
import ParCoords from '@/components/dataviz/ParCoords/ParCoords.vue'
import CsvSelect from '@/components/inputs/CsvSelect.vue'
import DataLoader from '@/components/inputs/DataLoader.vue'
import { extent } from 'd3-array'
import { computed, defineComponent, provide, ref, shallowRef } from 'vue-demi'
export default defineComponent({
  name:       'ParCoordsView',
  components: {
    CsvSelect,
    ParCoords,
    DataLoader
  },
  setup() {
    const test = shallowRef(null)
    const dataLength = computed(() => test.value?.data.length)
    const loading = ref(false)

    const keys = computed(() => {
      if (test.value?.data.length) {
        return Object.keys(test.value.data[0])
      }
    })

    const domains = computed(() => {
      if (keys.value) {
        return Array.from(keys.value, k => {
          const isNumerical = !isNaN(+test.value.data[0][k])

          return extent(test.value.data, r => isNumerical ? +r[k] : r[k])
        })
      }
    })

    const summary = computed(() => {
      if (domains.value) {
        return Object.fromEntries(Array.from(keys.value, (key, i) => {
          const isNumerical = !isNaN(+test.value.data[0][key])
          const value = [
            key,
            {
              domain:    domains.value[i],
              numerical: isNumerical
            }
          ]

          value[1].numerical = isNumerical

          return value
        }))
      }
    })

    const dataset = computed(() => {
      return test.value?.data || []
    })

    const numericalKeys = computed(() => {
      if (dataset.value.length) {
        const entries = Object.entries(dataset.value[0])

        return entries.reduce((prev, cur) => {
          const [
            key,
            value
          ] = cur
          const isNumerical = !isNaN(+value)

          if (isNumerical) {
            prev.push(key)
          }

          return prev
        }, [])
      }
    })

    provide('domains', domains)

    return {
      test,
      dataLength,
      loading,
      keys,
      domains,
      summary,
      dataset,
      numericalKeys
    }
  }
})
</script>

<style>

</style>
