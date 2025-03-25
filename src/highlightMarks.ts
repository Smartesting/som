import { Mark } from './types'

export function highlightMarks(mark: ReadonlyArray<Mark>): ReadonlyArray<HTMLDivElement> {
  return mark.map(highlightMark)
}

function highlightMark(mark: Mark): HTMLDivElement {
  const backgroundColor = mark.renderConfig.backgroundColor
  const newElement = document.createElement('div')
  const borderColor = `#${backgroundColor.r.toString(16)}${backgroundColor.g.toString(16)}${backgroundColor.b.toString(16)}`
  newElement.style.outline = `2px solid ${borderColor}`
  newElement.style.position = 'fixed'
  newElement.style.left = mark.bounds.left + 'px'
  newElement.style.top = mark.bounds.top + 'px'
  newElement.style.width = mark.bounds.width + 'px'
  newElement.style.height = mark.bounds.height + 'px'
  newElement.style.pointerEvents = 'none'
  newElement.style.boxSizing = 'border-box'
  newElement.style.zIndex = '2147483647'

  // Add floating label at the corner
  const label = document.createElement('span')
  label.textContent = String(mark.id)
  label.style.position = 'fixed'
  // These we can tweak if we want
  label.style.top = `${mark.renderConfig.labelAbsolutePosition.top}px`
  label.style.left = `${mark.renderConfig.labelAbsolutePosition.left}px`
  label.style.background = borderColor
  label.style.color = mark.renderConfig.textColor
  label.style.padding = '2px 4px'
  label.style.fontSize = '12px'
  label.style.border = '0px'
  newElement.appendChild(label)

  document.body.appendChild(newElement)
  return newElement
}
