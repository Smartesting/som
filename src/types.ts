type BoundingBox = {
    top: number;
    left: number;
    width: number;
    height: number;
};

type Mark = {
    id: number;
    bounds: BoundingBox
    rects: BoundingBox[]
    htmlElementType: string;
    textContent: any;
    ariaLabel: any
}