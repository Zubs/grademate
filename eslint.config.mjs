import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  ignores: ['openspec/**', '.claude/**', 'playwright-report/**', 'test-results/**'],
})
