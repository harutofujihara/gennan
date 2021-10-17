import { FC, Ref } from "react";
import { ViewBoard, Point } from "gennan-core";
declare type Props = {
    className?: string;
    widthPx: number;
    viewBoard: ViewBoard;
    fulcrumPoint: Point;
    sideNum: number;
    onClickPoint: (point: Point) => void;
    boardRef: Ref<SVGSVGElement>;
};
export declare const PointPosition: {
    readonly LeftUpCorner: "LeftUpCorner";
    readonly RightUpCorner: "RightUpCorner";
    readonly LeftLowCorner: "LeftLowCorner";
    readonly RightLowCorner: "RightLowCorner";
    readonly LeftEdge: "LeftEdge";
    readonly UpperEdge: "UpperEdge";
    readonly RightEdge: "RightEdge";
    readonly LowerEdge: "LowerEdge";
    readonly Internal: "Internal";
};
export declare type PointPosition = typeof PointPosition[keyof typeof PointPosition];
export declare const SvgBoard: FC<Props>;
export {};
