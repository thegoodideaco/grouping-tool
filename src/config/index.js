import Vue from 'vue'
import VueCompositionApi, * as composition from '@vue/composition-api'

import axios from 'axios'
import { csvParse } from 'd3'

export const CSV_PATHS = [
  '/datasets/marvel_dc_characters.csv',
  '/datasets/titanic.csv',
  '/datasets/top_women_chess_players_aug_2020.csv',
  '/datasets/worldcities.csv'
]
// export const CSV_PATHS = Array.from(
//   require.context('!!raw-loader!/public/datasets', true, /\.csv$/, 'sync').keys(),
//   path => path.replace('./', '/datasets/')
// )

Vue.use(VueCompositionApi)

if (process.env.NODE_ENV === 'development') {
  const loadCsv = async function (pathOrIndex) {
    const isIndex = typeof pathOrIndex === 'number'

    const url = isIndex ? CSV_PATHS[pathOrIndex] : pathOrIndex

    const { data } = await axios.get(url, {
      transformResponse: _d => csvParse(_d)
    })

    return data
  }

  Object.assign(window, {
    dev: {
      d3:   require('d3'),
      d3ar: require('d3-array'),
      composition,
      CSV_PATHS,
      loadCsv,
      Vue
    }
  })
}
