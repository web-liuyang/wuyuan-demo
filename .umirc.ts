import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  alias: {
    '@image': '@/assets/image',
  },
  fastRefresh: {},
  hash: true,
  extraPostCSSPlugins: [],
  ignoreMomentLocale: true,
  routes: [
    { path: '/', exact: true, component: '@/pages/index-page' },
  ],
});
