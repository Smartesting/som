import { BoundedMark, BoundingBox, Mark } from './types'
import { MARK_INDEX_ATTRIBUTE } from './index'
import { buildRenderConfig } from './renderConfig'

export function elementsToMarks(htmlElements: ReadonlyArray<HTMLElement>): Mark[] {
  return buildMarks(
    htmlElements.map(function (item, index) {
      item.setAttribute(MARK_INDEX_ATTRIBUTE, `${index}`)
      return buildBoundedMark(item, index)
    })
  )
}

export function elementsToCurrentMarks(htmlElements: ReadonlyArray<HTMLElement>): Mark[] {
  return buildMarks(
    htmlElements.flatMap(function (item) {
      const indexAttribute = item.getAttribute(MARK_INDEX_ATTRIBUTE)
      const label = parseInt(indexAttribute ?? '')
      if (isNaN(label)) return []
      return [buildBoundedMark(item, label)]
    })
  )
}

function buildBoundedMark(htmlElement: HTMLElement, index: number): BoundedMark {
  return {
    id: index,
    htmlElement: htmlElement,
    bounds: mapDomRectToBoundingBox(htmlElement.getBoundingClientRect())
  }
}

function buildAllPositionsCandidates(
  gridSize: number,
  { bounds: markBounds }: BoundedMark,
  labelSize: {
    width: number
    height: number
  }
): { top: number; left: number }[] {
  const positions: { top: number; left: number }[] = []
  for (let i = 0; i <= gridSize; i++) {
    positions.push(
      {
        top: markBounds.top - labelSize.height,
        left: markBounds.left + (markBounds.width / gridSize) * i - labelSize.width / 2
      },
      {
        top: markBounds.top + markBounds.height,
        left: markBounds.left + (markBounds.width / gridSize) * i - labelSize.width / 2
      },
      {
        top: markBounds.top + (markBounds.height / gridSize) * i - labelSize.height / 2,
        left: markBounds.left - labelSize.width
      },
      {
        top: markBounds.top + (markBounds.height / gridSize) * i - labelSize.height / 2,
        left: markBounds.left + markBounds.width
      }
    )
  }
  return positions
}

function buildMarks(boundedMarks: ReadonlyArray<BoundedMark>): Mark[] {
  const labels: BoundingBox[] = []
  return boundedMarks.map((boundedMark) => {
    const labelSize = { width: 15.5 + 9.7 * (boundedMark.id.toString().length - 1), height: 18.2 }
    const gridSize = 10
    const positions = buildAllPositionsCandidates(gridSize, boundedMark, labelSize)

    const scores = positions.map((position) =>
      calculatePositionScore(
        position,
        labelSize,
        labels,
        boundedMarks.map((info) => info.bounds)
      )
    )
    const bestPosition = positions[scores.indexOf(Math.min(...scores))]

    labels.push({
      top: bestPosition.top,
      left: bestPosition.left,
      width: labelSize.width,
      height: labelSize.height
    })
    return {
      ...boundedMark,
      renderConfig: buildRenderConfig(bestPosition)
    }
  })
}

function mapDomRectToBoundingBox({
  left,
  top,
  width,
  height
}: {
  left: number
  top: number
  width: number
  height: number
}) {
  return { left, top, width, height }
}

function calculatePositionScore(
  position: { top: number; left: number },
  labelSize: { width: number; height: number },
  labels: BoundingBox[],
  boxes: BoundingBox[]
): number {
  let score = 0

  if (
    position.top < 0 ||
    position.top + labelSize.height > window.innerHeight ||
    position.left < 0 ||
    position.left + labelSize.width > window.innerWidth
  ) {
    return Infinity
  }

  labels.concat(boxes).forEach((existing) => {
    const overlapWidth = Math.max(
      0,
      Math.min(position.left + labelSize.width, existing.left + existing.width) - Math.max(position.left, existing.left)
    )
    const overlapHeight = Math.max(
      0,
      Math.min(position.top + labelSize.height, existing.top + existing.height) - Math.max(position.top, existing.top)
    )
    score += overlapWidth * overlapHeight
  })

  return score
}
