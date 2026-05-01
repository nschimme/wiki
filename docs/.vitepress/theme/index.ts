import DefaultTheme from 'vitepress/theme'
import NotFound from './NotFound.vue'
import ImageMap from './components/ImageMap.vue'
import './style.css'

export default {
  ...DefaultTheme,
  NotFound,
  enhanceApp({ app }) {
    app.component('ImageMap', ImageMap)
  }
}
