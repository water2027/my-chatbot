import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  react: true,
  rules: {
    'no-console': ['error', { allow: ['log', 'error']}],
    'node/prefer-global/process': 'off'
  }
})
