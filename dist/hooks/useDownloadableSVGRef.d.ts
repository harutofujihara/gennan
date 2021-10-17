/// <reference types="react" />
export declare function useDownloadableSVGRef(): {
    ref: import("react").MutableRefObject<SVGSVGElement>;
    download: (filename?: string, widthPx?: number, heightPx?: number) => Promise<void>;
};
