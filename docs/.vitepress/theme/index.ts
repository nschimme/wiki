import DefaultTheme from 'vitepress/theme'
import NotFound from './NotFound.vue'
import ImageMap from './components/ImageMap.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  NotFound: NotFound,
  enhanceApp({ app }) {
    app.component('ImageMap', ImageMap)
    app.component('NotFound', NotFound)
  }
}
