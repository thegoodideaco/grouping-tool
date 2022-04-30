import { readonly, shallowRef } from '@vue/composition-api'
import crossfilter from 'crossfilter2'

/**
 *
 * @param {unkown[]} dataset
 * @param {import('crossfilter2').OrderedValueSelector[]} dimensions
 */
export function useCrossfilter(dataset, dimensions) {
  const cf = readonly(crossfilter(dataset))

  const dimensionObjects = shallowRef()

  if (Array.isArray(dimensions)) {
    dimensionObjects.value = Array.from(dimensions, strOrFn => {
      /**
       * Force string fields to be numerical
       */
      if (typeof strOrFn === 'string') {
        return cf.dimension(r => +r[strOrFn])
      }

      const dim = cf.dimension(strOrFn, false)
      return dim
    })
  }

  return {
    cf,
    dimensions: dimensionObjects
  }
}
