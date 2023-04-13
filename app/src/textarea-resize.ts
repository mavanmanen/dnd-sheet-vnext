import { onMounted, onUpdated, onActivated } from 'vue'

function resizeTextArea(target: any) {
  target.style.height = 'auto'
  target.style.height = target.scrollHeight + 'px'
}

function setupTextAreaResize() {
  for (const textArea of document.getElementsByTagName('textarea')) {
    resizeTextArea(textArea)
    let callback = (event: Event) => resizeTextArea(event.target)
    textArea.removeEventListener('input', callback)
    textArea.addEventListener('input', callback)
  }
}

export function textAreaResize() {
  onMounted(() => setupTextAreaResize())
  onUpdated(() => setupTextAreaResize())
  onActivated(() => setupTextAreaResize())
  setupTextAreaResize()
}