import Vue from 'vue'
// ant-design-vue 1.x 全量样式（lazy_use.js 通过 Vue.use 注册组件，但样式仍需整体引入）
import 'ant-design-vue/dist/antd.less'
import App from './App.vue'
import router from './router'
import store from './store/'
import i18n from './locales'
import { VueAxios } from './utils/request'
import ProLayout, { PageHeaderWrapper } from '@ant-design-vue/pro-layout'

import bootstrap from './core/bootstrap'
import './core/lazy_use' // use lazy load components
import './permission' // permission control
import './utils/filter' // global filter
import './global.less' // global style
// Wise design tokens + component overrides (loaded after antd + global so cascade wins)
import './styles/design-tokens.less'
import './styles/wise-design.less'
// 必须在 global.less 之后：覆盖 Pro Layout 顶栏/侧栏底栏（否则会被 global 与组件顺序盖住）
import './qd-layout-dark-override.less'
// Pro Layout 导航 Wise 样式（选择器锚定 .basic-layout-wrapper + .ant-pro-basicLayout）
import './layouts/BasicLayout.less'

Vue.config.productionTip = false

// Suppress noisy ResizeObserver loop errors (harmless in most cases on responsive layouts)
if (typeof window !== 'undefined') {
  const ignoreResizeObserverError = (e) => {
    const msg = (e && (e.reason && e.reason.message || e.message)) || ''
    if (msg.includes('ResizeObserver loop') || msg.includes('ResizeObserver loop limit exceeded')) {
      e.preventDefault && e.preventDefault()
      e.stopImmediatePropagation && e.stopImmediatePropagation()
      return false
    }
  }
  window.addEventListener('error', ignoreResizeObserverError)
  window.addEventListener('unhandledrejection', ignoreResizeObserverError)
}

// mount axios to `Vue.$http` and `this.$http`
Vue.use(VueAxios)
// use pro-layout components
Vue.component('ProLayout', ProLayout)
Vue.component('PageContainer', PageHeaderWrapper)
Vue.component('PageHeaderWrapper', PageHeaderWrapper)

new Vue({
  router,
  store,
  i18n,
  // init localstorage, vuex, Logo message
  created: bootstrap,
  render: h => h(App)
}).$mount('#app')
