declare global {
    interface Window {
        markPage: (highlightElements: boolean) => void;
    }
}

export {};
