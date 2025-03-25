export function collectInteractiveElements(): ReadonlyArray<HTMLElement> {
  const items = Array.prototype.slice
    .call(document.querySelectorAll('*'))
    .map(function (element: HTMLElement) {
      const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
      const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
      const textualContent = element.textContent?.trim().replace(/\s{2,}/g, ' ')
      const elementType = element.tagName.toLowerCase()
      const ariaLabel = element.getAttribute('aria-label') || ''

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

      const area = rects.reduce((acc, rect) => acc + rect.width * rect.height, 0)

      return {
        element: element,
        include:
          element.tagName === 'INPUT' ||
          element.tagName === 'TEXTAREA' ||
          element.tagName === 'SELECT' ||
          element.tagName === 'BUTTON' ||
          element.tagName === 'A' ||
          element.onclick != null ||
          window.getComputedStyle(element).cursor == 'pointer' ||
          element.tagName === 'IFRAME' ||
          element.tagName === 'VIDEO',
        area,
        rects,
        text: textualContent,
        type: elementType,
        ariaLabel: ariaLabel
      }
    })
    .filter((item) => item.include && item.area >= 20)

  return items.filter((x) => !items.some((y) => x.element.contains(y.element) && !(x == y))).map((item) => item.element)
}
