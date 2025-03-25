import { Mark } from './types'
import { collectInteractiveElements } from './collectInteractiveElements'
import { highlightMarks } from './highlightMarks'
import { elementsToMarks } from './marks'

let labels: HTMLDivElement[] = []

export const MARK_INDEX_ATTRIBUTE = 'data-mark'

function unmarkPage() {
  for (const label of labels) document.body.removeChild(label)
  labels = []
  document
    .querySelectorAll(`[${MARK_INDEX_ATTRIBUTE}]`)
    .forEach((element) => element.removeAttribute(MARK_INDEX_ATTRIBUTE))
}

function markPage(highlightElements: boolean): Mark[] {
  unmarkPage()
  const interactiveElements = collectInteractiveElements()
  const marks = elementsToMarks(interactiveElements)
  if (highlightElements) {
    labels.push(...highlightMarks(marks))
  }
  return marks
}

window.markPage = markPage

export * from './types'
export * from './global'
