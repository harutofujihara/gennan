import { ViewPointState } from "gennan-core";
import { FC } from "react";
import { PointPosition } from "../SvgBoard";
declare type Props = {
    cx: number;
    cy: number;
    width: number;
    pointPosition: PointPosition;
    pointState: ViewPointState;
    onClick: () => void;
    isNextIdxVisible: boolean;
};
export declare const Square: FC<Props>;
export {};
