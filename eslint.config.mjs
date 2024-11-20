import antfu from '@antfu/eslint-config'

export default antfu({
  astro: {
    overrides: {
      'antfu/no-top-level-await': 'off'
    }
  },
  rules: {
    'antfu/if-newline': 'off',
    'comma-dangle': ['error', 'only-multiline'],
    'style/comma-dangle': ['error', 'only-multiline'],
    'style/no-tabs': 'off',
    'vue/block-order': ['error', {
      order: ['template', 'script', 'style']
    }]
  },
  formatters: {
    astro: false
  }
})
