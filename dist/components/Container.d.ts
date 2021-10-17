import { FC } from "react";
import { GridNum, Point, TreePath } from "gennan-core";
import { EditMode, Usage } from "../types";
export declare type Props = {
    sgf?: string;
    gridNum?: GridNum;
    usage?: Usage;
    initPath?: Array<number>;
    onSgfChange?: (sgf: string) => void;
    onPathChange?: (path: TreePath) => void;
    onSideCountChanged?: (sc: number) => void;
    onFulcrumPointChanged?: (p: Point) => void;
    lang?: "ja" | "en";
    sideCount?: number;
    fulcrumPoint?: Point;
    gennanCode?: string;
    onGennanCodeChanged?: (gncd: string) => void;
};
export declare type EditModeInfo = {
    em: EditMode;
    isActive: boolean;
    onClick: () => void;
};
export declare const Container: FC<Props>;
