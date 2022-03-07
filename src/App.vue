<template>
  <div
    id="app"
    class="abs-fill">
    <!-- Sidebar -->
    <side-panel
      class="grid-panel bg-gray-900 text-white"
      @update:records="updateRecords"
      @update:group-fn="groupFn = $event" />

    <!-- Content -->
    <main class="grid-content bg-gray-800 text-white relative">
      <template v-if="loaded && groupData">
        <group-viewer

          ref="group-viewer"
          class="abs-fill"
          :group="groupData"
          :layout="layout" />
        <div class="info-pane absolute">
          <p>
            Total Records: {{ records.length }}
          </p>
          <p>
            Total Nodes: {{ nodes.length }}
          </p>
        </div>
      </template>
    </main>
  </div>
</template>

<script>
import {
  computed,
  defineComponent,
  ref,
  shallowRef
} from '@vue/composition-api'
import GroupViewer from './components/GroupViewer.vue'
import SidePanel from './components/SidePanel.vue'

export default defineComponent({
  name:       'App',
  components: {
    SidePanel,
    GroupViewer
  },
  setup(_props, _ctx) {
    const records = shallowRef([])

    const groupViewer = shallowRef()

    const nodes = computed(() => groupViewer.value?.leaves || [])

    const loaded = computed(() => {
      return !!records.value?.length
    })

    /** @type {import('@vue/composition-api').Ref<(dataset: any[]) => any>} */
    const groupFn = shallowRef()

    const groupData = computed(() => {
      const fn = groupFn.value
      if (typeof fn === 'function') {
        return fn(records.value)
      }
    })

    return {
      loaded,
      groupFn,
      groupData,
      records,
      layout:         'pack',
      nodes,
      'group-viewer': groupViewer,
      updateRecords(_records) {
        console.log(_records)
        records.value = _records
      }
    }
  }
})
</script>

<style lang="scss" scoped>
#app {
  display: grid;
  grid-template:
    "panel content" 1fr
    / minmax(100px, 500px) 1fr;
}

.grid {
  &-panel {
    grid-area: panel;
  }

  &-content {
    grid-area: content;
  }
}
</style>
