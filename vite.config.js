import { defineConfig, loadEnv } from 'vite'
import vue2 from '@vitejs/plugin-vue2'
import vue2Jsx from '@vitejs/plugin-vue2-jsx'
import svgLoader from 'vite-svg-loader'
import { viteMockServe } from 'vite-plugin-mock'
import { fileURLToPath, URL } from 'node:url'
import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf-8'))

const normalizeVersion = (value) => {
  let text = String(value || '').trim()
  if (!text) return ''
  if (text.startsWith('refs/tags/')) {
    text = text.slice('refs/tags/'.length)
  }
  if (text.startsWith('v') && text.length > 1 && /\d/.test(text[1])) {
    text = text.slice(1)
  }
  if (['latest', 'main', 'master'].includes(text)) {
    return ''
  }
  return text
}

const resolveAppVersion = (env) => {
  const gitVersion = (() => {
    try {
      return execSync('git describe --tags --exact-match HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim()
    } catch (e) {
      return ''
    }
  })()
  return normalizeVersion(env.VITE_APP_VERSION) ||
    normalizeVersion(env.APP_VERSION) ||
    normalizeVersion(process.env.APP_VERSION) ||
    normalizeVersion(env.GIT_TAG) ||
    normalizeVersion(process.env.GIT_TAG) ||
    normalizeVersion(process.env.GITHUB_REF_NAME) ||
    normalizeVersion(process.env.GITHUB_REF) ||
    normalizeVersion(gitVersion) ||
    normalizeVersion(pkg.version) ||
    '0.0.0-dev'
}

const gitHash = (() => {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim()
  } catch (e) {
    return 'unknown'
  }
})()

const buildDate = new Date().toLocaleString()

const resolveManualChunk = (id) => {
  if (!id.includes('node_modules')) return undefined
  if (id.includes('@ant-design-vue/pro-layout')) return 'ant-pro-layout'
  if (id.includes('ant-design-vue')) return 'ant-design-vue'
  if (id.includes('@ant-design') || id.includes('@antv')) return 'ant-ecosystem'
  if (id.includes('echarts') || id.includes('klinecharts') || id.includes('viser-vue')) return 'charts'
  if (id.includes('codemirror') || id.includes('vue-quill-editor') || id.includes('wangeditor')) return 'editors'
  if (id.includes('pyodide') || id.includes('comlink')) return 'py-runtime'
  if (id.includes('vue')) return 'vue-core'
  if (
    id.includes('axios') ||
    id.includes('moment') ||
    id.includes('lodash-es') ||
    id.includes('crypto-js') ||
    id.includes('store') ||
    id.includes('nprogress') ||
    id.includes('md5')
  ) {
    return 'vendor-utils'
  }
  return 'vendor'
}

const fixProLayoutLess = () => ({
  name: 'fix-pro-layout-less-selector',
  enforce: 'pre',
  transform(code, id) {
    if (!id.includes('@ant-design-vue/pro-layout') || !id.endsWith('BasicLayout.less')) {
      return null
    }
    return code.replace(/:not\('\.ant-pro-basicLayout-mobile'\)/g, ':not(.ant-pro-basicLayout-mobile)')
  }
})

const fixAntDesignVueLess = () => ({
  name: 'fix-ant-design-vue-less-inline-js',
  enforce: 'pre',
  transform(code, id) {
    if (!id.includes('ant-design-vue') || !id.includes('bezierEasing.less')) {
      return null
    }
    return code.replace(/\.bezierEasingMixin\(\);/g, '')
  }
})

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const enableMock = env.VITE_ENABLE_MOCK === 'true'
  const appVersion = resolveAppVersion(env)

  return {
    base: './',
    resolve: {
      alias: [
        { find: /^~(.+)/, replacement: '$1' },
        {
          find: 'webpack-theme-color-replacer/client',
          replacement: fileURLToPath(new URL('./src/shims/webpack-theme-color-replacer-client.js', import.meta.url))
        },
        { find: /^moment$/, replacement: fileURLToPath(new URL('./src/shims/moment.js', import.meta.url)) },
        { find: /^store$/, replacement: 'store/dist/store.modern.js' },
        { find: /^@\//, replacement: fileURLToPath(new URL('./src/', import.meta.url)) },
        { find: /^@$/, replacement: fileURLToPath(new URL('./src', import.meta.url)) }
      ],
      extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json', '.vue']
    },
    define: {
      APP_VERSION: JSON.stringify(appVersion),
      GIT_HASH: JSON.stringify(gitHash),
      BUILD_DATE: JSON.stringify(buildDate),
      'process.env.APP_VERSION': JSON.stringify(appVersion),
      'process.env.VUE_APP_VERSION': JSON.stringify(appVersion),
      'process.env.VUE_APP_PREVIEW': JSON.stringify(env.VITE_PREVIEW || ''),
      'process.env.VUE_APP_API_BASE_URL': JSON.stringify(env.VITE_API_BASE_URL || ''),
      'process.env.VUE_APP_PYTHON_API_BASE_URL': JSON.stringify(env.VITE_PYTHON_API_BASE_URL || ''),
      'process.env.VUE_APP_PYODIDE_CDN_BASE': JSON.stringify(env.VITE_PYODIDE_CDN_BASE || ''),
      'process.env.VUE_APP_PYODIDE_LOCAL_BASE': JSON.stringify(env.VITE_PYODIDE_LOCAL_BASE || ''),
      'process.env.VUE_APP_PYODIDE_PREFER_CDN': JSON.stringify(env.VITE_PYODIDE_PREFER_CDN || '')
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          additionalData: "@import '@/styles/antd-vars.less';\n",
          modifyVars: {
            // Ant Design Vue 1.x theme tokens aligned to Wise design system
            'primary-color': '#9fe870',
            'link-color': '#0e0f0c',
            'success-color': '#2ead4b',
            'warning-color': '#ffd11a',
            'error-color': '#d03238',
            'text-color': '#0e0f0c',
            'text-color-secondary': '#454745',
            'heading-color': '#0e0f0c',
            'border-color-base': '#e1e4dd',
            'border-color-split': '#e1e4dd',
            'background-color-base': '#e8ebe6',
            'component-background': '#ffffff',
            'item-hover-bg': '#e2f6d5',
            'item-active-bg': '#e2f6d5',
            'btn-primary-bg': '#9fe870',
            'btn-primary-color': '#0e0f0c',
            'btn-default-bg': '#ffffff',
            'btn-default-color': '#0e0f0c',
            'btn-default-border': '#0e0f0c',
            'layout-body-background': '#e8ebe6',
            'layout-header-background': '#ffffff',
            'layout-header-color': '#0e0f0c',
            'layout-sider-background': '#ffffff',
            'menu-bg': '#ffffff',
            'menu-popup-bg': '#ffffff',
            'menu-item-active-bg': '#e2f6d5',
            'menu-item-group-title-color': '#868685',
            'menu-highlight-color': '#163300',
            'menu-item-color': '#454745',
            'menu-dark-bg': '#0e0f0c',
            'menu-dark-submenu-bg': '#161614',
            'menu-dark-color': 'rgba(255, 255, 255, 0.72)',
            'menu-dark-highlight-color': '#9fe870',
            'menu-dark-item-active-bg': 'rgba(159, 232, 112, 0.14)',
            'table-header-bg': '#e8ebe6',
            'table-row-hover-bg': '#e2f6d5',
            'table-header-color': '#868685',
            'card-head-background': '#ffffff',
            'card-background': '#ffffff',
            'input-bg': '#ffffff',
            'input-placeholder-color': '#868685',
            'input-color': '#0e0f0c',
            'tabs-hover-color': '#0e0f0c',
            'tabs-active-color': '#0e0f0c',
            'tabs-highlight-color': '#0e0f0c',
            'border-radius-base': '12px',
            'border-radius-sm': '8px',
            'btn-border-radius-base': '24px',
            'btn-border-radius-sm': '24px',
            'card-radius': '24px'
          }
        }
      }
    },
    plugins: [
      fixAntDesignVueLess(),
      fixProLayoutLess(),
      vue2(),
      vue2Jsx(),
      svgLoader({ defaultImport: 'url' }),
      viteMockServe({
        mockPath: 'src/mock/services',
        enable: enableMock,
        watchFiles: true,
        logger: true
      })
    ],
    server: {
      port: 8000,
      proxy: {
        '/api': {
          target: env.VITE_DEV_PROXY_TARGET || 'http://127.0.0.1:5000',
          ws: true,
          changeOrigin: true,
          timeout: 600000,
          proxyTimeout: 600000
        }
      }
    },
    worker: {
      format: 'es'
    },
    optimizeDeps: {
      exclude: ['pyodide']
    },
    build: {
      target: 'es2020',
      sourcemap: false,
      chunkSizeWarningLimit: 1500,
      commonjsOptions: {
        transformMixedEsModules: true
      },
      rollupOptions: {
        output: {
          manualChunks: resolveManualChunk
        }
      }
    }
  }
})
