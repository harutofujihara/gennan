import { Point, TreePath, parseInitialPath } from "gennan-core";

function parseGennanCodeToParams(
  gennanCode: string
): {
  sgf?: string;
  initPath?: TreePath;
  fulcrumPoint?: Point;
  sideCount?: number;
} {
  const splitted = gennanCode.split(",");
  const sgf = splitted[0] ? splitted[0] : undefined;
  const initPath = splitted[1] ? parseInitialPath(splitted[1]) : undefined;
  const fulcrumPoint = splitted[2]
    ? {
        x: Number(splitted[2].split(":")[0]),
        y: Number(splitted[2].split(":")[1]),
      }
    : undefined;
  const sideCount = splitted[3] ? Number(splitted[3]) : undefined;

  return { sgf, initPath, fulcrumPoint, sideCount };
}

export { parseGennanCodeToParams };
