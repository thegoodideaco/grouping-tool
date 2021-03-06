<template>
  <div
    id="app"
    class="abs-fill">
    <!-- Sidebar -->
    <side-panel
      class="grid-panel bg-gray-900 text-white"
      @update:records="updateRecords"
      @update:group-fn="updateGrouping" />

    <!-- Content -->
    <main class="grid-content bg-gray-800 text-white relative">
      <vue-use-test />
      <template v-if="loaded && groupData">
        <group-viewer

          ref="group-viewer"
          class="abs-fill"
          :group="groupData"
          :layout="layout"
          @select:node="selectedNodeIndex = $event" />
        <div class="info-pane absolute">
          <p>
            Total Records: {{ records.length }}
          </p>
          <p>
            Total Nodes: {{ nodes.length }}
          </p>
          <p v-if="selectedPath">
            Selected Node: {{ selectedPath }}
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
  shallowRef
} from '@vue/composition-api'
import GroupViewer from './components/GroupViewer.vue'
import SidePanel from './components/SidePanel.vue'
import VueUseTest from './components/VueUseTest.vue'

export default defineComponent({
  name:       'App',
  components: {
    SidePanel,
    GroupViewer,
    VueUseTest
  },
  setup(_props, _ctx) {
    let records = []

    const groupViewer = shallowRef()
    const nodes = computed(() => groupViewer.value?.allNodes || [])

    const selectedNodeIndex = shallowRef()

    const selectedPath = computed(() => {
      if (selectedNodeIndex.value == null) return
      const _n = nodes.value[selectedNodeIndex.value]

      if (_n == null) return []

      const _nodes = _n.ancestors()

      if (_nodes == null || _nodes.length === 0) return

      _nodes.pop()
      _nodes.reverse()

      return Array.from(_nodes, n => String(n.data[0]) || 'NULL').join('/')
    })

    /** @type {import('@vue/composition-api').Ref<(dataset: any[]) => any>} */
    const groupFn = shallowRef()

    const groupData = shallowRef()

    const loaded = computed(() => {
      return !!groupFn.value
    })

    function updateGrouping($event) {
      groupFn.value = $event
      if (typeof groupFn.value === 'function') groupData.value = () => groupFn.value(records)
    }

    return {
      loaded,
      groupFn,
      groupData,
      records,
      layout:         'pack',
      nodes,
      'group-viewer': groupViewer,
      updateGrouping,
      updateRecords(_records) {
        // console.log(_records)
        console.log(_records)
        records = !_records ? null : Array.from(_records, r => Object.freeze(r))
        console.log(_records)
      },
      selectedNodeIndex,
      selectedPath
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
