import { Point, TreePath } from "gennan-core";
declare function parseGennanCodeToParams(gennanCode: string): {
    sgf?: string;
    initPath?: TreePath;
    fulcrumPoint?: Point;
    sideCount?: number;
};
export { parseGennanCodeToParams };
