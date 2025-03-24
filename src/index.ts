import {Mark} from "./types";

let labels: HTMLDivElement[] = [];


const MARK_INDEX_ATTRIBUTE = "data-mark";

function unmarkPage() {
    for (const label of labels) document.body.removeChild(label);
    labels = [];
    document.querySelectorAll(`[${MARK_INDEX_ATTRIBUTE}]`).forEach((element) => element.removeAttribute(MARK_INDEX_ATTRIBUTE));
}

function markPage(highlightElements: boolean): Mark[] {
    unmarkPage();

    let items = Array.prototype.slice
        .call(document.querySelectorAll("*"))
        .map(function (element: HTMLElement) {
            const vw = Math.max(
                document.documentElement.clientWidth || 0,
                window.innerWidth || 0,
            );
            const vh = Math.max(
                document.documentElement.clientHeight || 0,
                window.innerHeight || 0,
            );
            const textualContent = element.textContent?.trim().replace(/\s{2,}/g, " ");
            const elementType = element.tagName.toLowerCase();
            const ariaLabel = element.getAttribute("aria-label") || "";

            const rects = [...element.getClientRects()]
                .filter((bb) => {
                    const center_x = bb.left + bb.width / 2;
                    const center_y = bb.top + bb.height / 2;
                    const elAtCenter = document.elementFromPoint(center_x, center_y);

                    return elAtCenter === element || element.contains(elAtCenter);
                })
                .map((bb) => {
                    const rect = {
                        left: Math.max(0, bb.left),
                        top: Math.max(0, bb.top),
                        right: Math.min(vw, bb.right),
                        bottom: Math.min(vh, bb.bottom),
                    };
                    return {
                        ...rect,
                        width: rect.right - rect.left,
                        height: rect.bottom - rect.top,
                    };
                });

            const area = rects.reduce((acc, rect) => acc + rect.width * rect.height, 0);

            return {
                element: element,
                include:
                    element.tagName === "INPUT" ||
                    element.tagName === "TEXTAREA" ||
                    element.tagName === "SELECT" ||
                    element.tagName === "BUTTON" ||
                    element.tagName === "A" ||
                    element.onclick != null ||
                    window.getComputedStyle(element).cursor == "pointer" ||
                    element.tagName === "IFRAME" ||
                    element.tagName === "VIDEO",
                area,
                rects,
                text: textualContent,
                type: elementType,
                ariaLabel: ariaLabel,
            };
        })
        .filter((item) => item.include && item.area >= 20);

    items = items.filter((x) => !items.some((y) => x.element.contains(y.element) && !(x == y)));

    return items.map(function (item, index) {
        if (highlightElements) highlightElement(item, getRandomColor, index);
        item.element.setAttribute(MARK_INDEX_ATTRIBUTE, `${index}`);
        return {
            id: index,
            bounds: mapDomRectToBoundingBox(item.element.getBoundingClientRect()),
            rects: item.rects.map(mapDomRectToBoundingBox),
            ariaLabel: item.ariaLabel,
            htmlElementType: item.type,
            textContent: item.text,
        }
    });
}

function highlightElement(item: {
    element: HTMLElement;
    include: boolean;
    area: number;
    rects: { left: number; top: number; right: number; bottom: number; width: number; height: number }[];
    text: string | undefined;
    type: string;
    ariaLabel: string
}, getRandomColor: () => string, index: number) {
    item.rects.forEach((bbox) => {
        const newElement = document.createElement("div");
        const borderColor = getRandomColor();
        newElement.style.outline = `2px dashed ${borderColor}`;
        newElement.style.position = "fixed";
        newElement.style.left = bbox.left + "px";
        newElement.style.top = bbox.top + "px";
        newElement.style.width = bbox.width + "px";
        newElement.style.height = bbox.height + "px";
        newElement.style.pointerEvents = "none";
        newElement.style.boxSizing = "border-box";
        newElement.style.zIndex = '2147483647';

        // Add floating label at the corner
        const label = document.createElement("span");
        label.textContent = String(index);
        label.style.position = "absolute";
        // These we can tweak if we want
        label.style.top = "-19px";
        label.style.left = "0px";
        label.style.background = borderColor;
        label.style.color = "white";
        label.style.padding = "2px 4px";
        label.style.fontSize = "12px";
        label.style.borderRadius = "2px";
        newElement.appendChild(label);

        document.body.appendChild(newElement);
        labels.push(newElement);
    });
}

function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function mapDomRectToBoundingBox({left, top, width, height}: {
    left: number,
    top: number,
    width: number,
    height: number
}) {
    return {left, top, width, height}
}


window.markPage = markPage;
