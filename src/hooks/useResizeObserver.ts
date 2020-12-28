import { useLayoutEffect, useState, useCallback, RefObject } from "react";
// import ResizeObserver from "resize-observer-polyfill";

export interface ResizeObserverEntry {
  target: HTMLElement;
  contentRect: DOMRectReadOnly;
}

export const useResizeObserver = (
  ref: RefObject<HTMLElement>,
  callback?: (entry: DOMRectReadOnly) => void
): Array<number> => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const handleResize = useCallback(
    (entries: ResizeObserverEntry[]) => {
      if (!Array.isArray(entries)) {
        return;
      }

      const entry = entries[0];
      setWidth(entry.contentRect.width);
      setHeight(entry.contentRect.height);

      if (callback) {
        callback(entry.contentRect);
      }
    },
    [callback]
  );

  useLayoutEffect(() => {
    if (!ref.current) {
      return;
    }

    let RO: ResizeObserver | null = new ResizeObserver((entries) => {
      handleResize(entries as ResizeObserverEntry[]);
    });
    RO.observe(ref.current);

    return () => {
      if (RO != null) {
        RO.disconnect();
        RO = null;
      }
    };
  }, [ref]);

  return [width, height];
};
