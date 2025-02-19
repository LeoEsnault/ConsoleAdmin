// This file will be run before each test file

import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest'
import { Notify } from 'quasar'

installQuasarPlugin({
  config: {
    brand: {
      primary: '#027be3',
    },
    dark: false,
  },
  plugins: { Notify },
})
