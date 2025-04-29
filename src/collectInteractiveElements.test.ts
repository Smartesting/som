import { gatherInteractiveElements } from './collectInteractiveElements'

describe('gatherInteractiveElements', () => {
  beforeEach(() => {
    Object.defineProperty(document, 'elementFromPoint', {
      value: jest.fn(),
      writable: true
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('collects INPUT with surface >= 20', () => {
    document.body.innerHTML = `<div><input id="input-large" /></div>`
    const input = spyHtmlElementById('input-large', { width: 10, height: 3 })

    const result = gatherInteractiveElements()
    expect(result).toContain(input)
  })

  it('does NOT collect INPUT with surface < 20', () => {
    document.body.innerHTML = `<div><input id="input-small" /></div>`
    spyHtmlElementById('input-small', { width: 4, height: 4 })

    const result = gatherInteractiveElements()
    expect(result).toEqual([])
  })

  it('collects element with cursor:pointer and surface >= 20', () => {
    document.body.innerHTML = `<div><span id="hoverable" style="cursor: pointer">Hover me</span></div>`
    const span = spyHtmlElementById('hoverable', { width: 5, height: 5 })

    const result = gatherInteractiveElements()
    expect(result).toContain(span)
  })

  it('does NOT collect element with cursor:pointer and surface < 20', () => {
    document.body.innerHTML = `<div><span id="small-hover" style="cursor: pointer">Tiny hover</span></div>`
    spyHtmlElementById('small-hover', { width: 2, height: 8 })

    const result = gatherInteractiveElements()
    expect(result).toEqual([])
  })
})

function createRectList(size: { width: number; height: number }) {
  const rects: DOMRect[] & { item(index: number): DOMRect | null } = [
    {
      width: size.width,
      height: size.height,
      top: 0,
      left: 0,
      bottom: size.height,
      right: size.width,
      x: 0,
      y: 0,
      toJSON: () => {}
    }
  ] as DOMRect[] & { item(index: number): DOMRect | null }
  rects.item = (index: number) => rects[index]
  return rects as DOMRectList
}

function spyHtmlElementById(id: string, size: { width: number; height: number }): HTMLElement {
  const element = document.getElementById(id)!
  jest.spyOn(element, 'getClientRects').mockReturnValue(createRectList(size))
  jest.spyOn(document, 'elementFromPoint').mockReturnValue(element)
  return element
}
