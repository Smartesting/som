export type Color = { r: number; g: number; b: number }

export type BoundingBox = {
  top: number
  left: number
  width: number
  height: number
}

export type BoundedMark = {
  id: number
  htmlElement: HTMLElement
  bounds: BoundingBox
}
export type Mark = BoundedMark & {
  renderConfig: {
    textColor: 'white' | 'black'
    backgroundColor: {
      r: number
      g: number
      b: number
    }
    labelAbsolutePosition: {
      top: number
      left: number
    }
  }
}

export type MarkPageFn = (highlightElements: boolean) => Mark[]
