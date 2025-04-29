import { Mark } from './types'
import { gatherInteractiveElements } from './collectInteractiveElements'
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
  const interactiveElements = gatherInteractiveElements()
  const marks = elementsToMarks(interactiveElements)
  if (highlightElements) {
    labels.push(...highlightMarks(marks))
  }
  return marks
}

if (!window.markPage) window.markPage = markPage

export * from './types'
export * from './global'
