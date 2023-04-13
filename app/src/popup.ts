import { reactive } from 'vue'

const popup = reactive({
  shown: false,
  content: '',

  showPopup(content: string) {
    this.content = content
    this.shown = true

    setTimeout(() => this.shown = false, 2000)
  }
})

export default popup