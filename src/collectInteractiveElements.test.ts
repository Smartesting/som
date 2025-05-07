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

  it('collects elements with role "option"', () => {
    document.body.innerHTML = `
        <div>
          <ul id="ul-0">
            <li id="li-0">-</li>
            <li role="option" id="li-1">1</li>
          </ul>
        </div>`
    const li = spyHtmlElementById('li-1', { width: 200, height: 20 })
    const result = gatherInteractiveElements()
    expect(result).toEqual([li])
  })

  it('collects elements with role "button"', () => {
    document.body.innerHTML = `
        <div>
          <div role="button" id="id" tabindex="0" onclick="alert('Clicked!')">
            Clique ici
          </div>
        </div>`
    const element = spyHtmlElementById('id', { width: 200, height: 20 })
    const result = gatherInteractiveElements()
    expect(result).toEqual([element])
  })

  it('collects elements with role "link"', () => {
    document.body.innerHTML = `
        <div>
          <div role="link" id="id" tabindex="0" onclick="alert('Clicked!')">
            Clique ici
          </div>
        </div>`
    const element = spyHtmlElementById('id', { width: 200, height: 20 })
    const result = gatherInteractiveElements()
    expect(result).toEqual([element])
  })

  it('collects elements with role "menuitem"', () => {
    document.body.innerHTML = `
        <div role="menu" tabindex="0">
          <div role="menuitem" id="id" tabindex="-1" onclick="alert('Clicked!')">
            Clique ici
          </div>
        </div>`
    const element = spyHtmlElementById('id', { width: 200, height: 20 })
    const result = gatherInteractiveElements()
    expect(result).toEqual([element])
  })

  it('collects elements with role "menuitemcheckbox"', () => {
    document.body.innerHTML = `
        <div role="menu" tabindex="0">
          <div role="menuitemcheckbox" id="id" tabindex="-1" onclick="alert('Clicked!')">
            Clique ici
          </div>
        </div>`
    const element = spyHtmlElementById('id', { width: 200, height: 20 })
    const result = gatherInteractiveElements()
    expect(result).toEqual([element])
  })

  it('collects elements with role "menuitemradio"', () => {
    document.body.innerHTML = `
        <div role="menu" tabindex="0">
          <div role="menuitemradio" id="id" tabindex="-1" onclick="alert('Clicked!')">
            Clique ici
          </div>
        </div>`
    const element = spyHtmlElementById('id', { width: 200, height: 20 })
    const result = gatherInteractiveElements()
    expect(result).toEqual([element])
  })

  it('collects elements with role "radio"', () => {
    document.body.innerHTML = `
          <div role="radio" id="id" tabindex="-1" onclick="alert('Clicked!')">
            Clique ici
          </div>`
    const element = spyHtmlElementById('id', { width: 200, height: 20 })
    const result = gatherInteractiveElements()
    expect(result).toEqual([element])
  })

  it('collects elements with role "textbox"', () => {
    document.body.innerHTML = `
        <div role="textbox" id="id">Enter text here</div>`
    const element = spyHtmlElementById('id', { width: 200, height: 20 })
    const result = gatherInteractiveElements()
    expect(result).toEqual([element])
  })

  it('collects elements with role "searchbox"', () => {
    document.body.innerHTML = `
        <div role="searchbox" id="id">Enter text here</div>`
    const element = spyHtmlElementById('id', { width: 200, height: 20 })
    const result = gatherInteractiveElements()
    expect(result).toEqual([element])
  })

  it('collects elements inside a iFrame', () => {
    const iframe = document.createElement('iframe')
    iframe.id = 'iFrame'
    document.body.appendChild(iframe)

    const doc = iframe.contentDocument!
    doc.open()
    doc.write(`
    <!DOCTYPE html>
    <html lang="en">
      <body>
        <button id="button">Click me</button>
      </body>
    </html>`)
    doc.close()
    const element = spyHtmlElementById('button', { width: 200, height: 20 }, 'iFrame')
    const result = gatherInteractiveElements()
    expect(result).toEqual([element])
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

function spyHtmlElementById(id: string, size: { width: number; height: number }, frameId?: string): HTMLElement {
  let relevantDocument = document
  // eslint-disable-next-line
  if (frameId) relevantDocument = (document.getElementById(frameId) as HTMLIFrameElement).contentWindow?.document!
  const element = relevantDocument.getElementById(id)!
  jest.spyOn(element, 'getClientRects').mockReturnValue(createRectList(size))
  jest.spyOn(document, 'elementFromPoint').mockReturnValue(element)
  return element
}
