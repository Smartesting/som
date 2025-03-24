export type BoundingBox = {
    top: number;
    left: number;
    width: number;
    height: number;
};

export type Mark = {
    id: number;
    bounds: BoundingBox
    rects: BoundingBox[]
    htmlElementType: string;
    textContent: any;
    ariaLabel: any
}

export type MarkPageFn = (highlightElements: boolean) => Mark[]