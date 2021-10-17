import { FC } from "react";
import { GridNum, Point, TreePath } from "gennan-core";
import { EditMode, Usage } from "../types";
export declare type Props = {
    sgf?: string;
    gridNum?: GridNum;
    gennanCode?: string;
    usage?: Usage;
    initPath?: TreePath;
    onSgfChange?: (sgf: string) => void;
    onPathChange?: (path: TreePath) => void;
    onSideCountChanged?: (sc: number) => void;
    onFulcrumPointChanged?: (p: Point) => void;
    onGennanCodeChanged?: (gncd: string) => void;
    lang?: "ja" | "en";
    sideCount?: number;
    fulcrumPoint?: Point;
};
export declare type EditModeInfo = {
    em: EditMode;
    isActive: boolean;
    onClick: () => void;
};
export declare const Container: FC<Props>;
