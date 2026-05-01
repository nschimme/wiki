import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import NotFound from './NotFound.vue'
import ImageMap from './components/ImageMap.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout: Layout,
  enhanceApp({ app }) {
    app.component('ImageMap', ImageMap)
    app.component('NotFound', NotFound)
  }
}
