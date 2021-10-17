import { RefObject } from "react";
export interface ResizeObserverEntry {
    target: HTMLElement;
    contentRect: DOMRectReadOnly;
}
export declare const useResizeObserver: (ref: RefObject<HTMLElement>, callback?: (entry: DOMRectReadOnly) => void) => Array<number>;
