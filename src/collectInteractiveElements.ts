export function gatherInteractiveElements() {
  const htmlElements: HTMLElement[] = []
  collectInteractiveElements(document.body, htmlElements, {
    isContentEditable: document.body.isContentEditable,
    cursor: window.getComputedStyle(document.body).cursor
  })
  return htmlElements
}

type CollectorContext = {
  cursor: CSSStyleDeclaration['cursor']
  isContentEditable: boolean
}

const IRRELEVANT_CURSOR_VALUES = ['auto', 'default', 'none', 'not-allowed', 'inherit', 'initial']
const RELEVANT_TAG_NAMES = ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'A', 'VIDEO']
const RELEVANT_ROLES = [
  'OPTION',
  'BUTTON',
  'LINK',
  'MENUITEM',
  'MENUITEMCHECKBOX',
  'MENUITEMRADIO',
  'RADIO',
  'TEXTBOX',
  'SEARCHBOX'
]

function isRelevantElement(element: HTMLElement, parentContext: CollectorContext, context: CollectorContext): boolean {
  if (RELEVANT_TAG_NAMES.includes(element.tagName.toUpperCase())) {
    return computeArea(element) >= 20
  }
  const role = element.role ?? element.getAttribute('role')
  if (role && RELEVANT_ROLES.includes(role.toUpperCase())) {
    return computeArea(element) >= 20
  }
  if (context.isContentEditable && parentContext.isContentEditable != context.isContentEditable) {
    return computeArea(element) >= 20
  }
  if (parentContext.cursor != context.cursor && !IRRELEVANT_CURSOR_VALUES.includes(context.cursor)) {
    return computeArea(element) >= 20
  }
  return false
}

function collectInteractiveElements(elt: HTMLElement, collector: HTMLElement[], parentContext: CollectorContext) {
  const context: CollectorContext = {
    cursor: window.getComputedStyle(elt).cursor,
    isContentEditable: elt.isContentEditable
  }
  if (isRelevantElement(elt, parentContext, context)) collector.push(elt)
  gatherHTMLChildren(elt).forEach((child) => collectInteractiveElements(child, collector, context))
}

function computeArea(element: HTMLElement): number {
  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
  const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
  const rects = [...element.getClientRects()]
    .filter((bb) => {
      const center_x = bb.left + bb.width / 2
      const center_y = bb.top + bb.height / 2
      const elAtCenter = document.elementFromPoint(center_x, center_y)

      return elAtCenter === element || element.contains(elAtCenter)
    })
    .map((bb) => {
      const rect = {
        left: Math.max(0, bb.left),
        top: Math.max(0, bb.top),
        right: Math.min(vw, bb.right),
        bottom: Math.min(vh, bb.bottom)
      }
      return {
        ...rect,
        width: rect.right - rect.left,
        height: rect.bottom - rect.top
      }
    })

  return rects.reduce((acc, rect) => acc + rect.width * rect.height, 0)
}

function gatherHTMLChildren(element: HTMLElement): ReadonlyArray<HTMLElement> {
  return Array.from(element.childNodes).filter((e) => e instanceof HTMLElement)
}
