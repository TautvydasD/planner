module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  collectCoverage: false,
  collectCoverageFrom: [
    '**/views/*.{js,vue}',
    '!**/node_modules/**',
    '**/components/*.{js,vue}',
    '**/services/*.{js,vue}',
    '!**/services/dnd.js',
    '!**/components/LineChart.vue',
    '!**/views/BarChart.vue',
    '**/store/**/*.{js,vue}',
  ],
};
