import { Point, TreePath, parseInitialPath } from "gennan-core";

function parseGennanCodeToParams(
  gennanCode: string
): {
  sgf?: string;
  initPath?: TreePath;
  fulcrumPoint?: Point;
  sideCount?: number;
} {
  // SGFの中に','が混ざっていても問題ないように後ろからパースする
  let remainCode = gennanCode;
  const sideCountStr = remainCode.slice(
    remainCode.lastIndexOf(",") + 1,
    remainCode.length
  );
  remainCode = remainCode.slice(0, remainCode.lastIndexOf(","));
  const sideCount = sideCountStr ? Number(sideCountStr) : undefined;

  const fulcrumPointStr = remainCode.slice(
    remainCode.lastIndexOf(",") + 1,
    remainCode.length
  );
  remainCode = remainCode.slice(0, remainCode.lastIndexOf(","));
  const fulcrumPoint = fulcrumPointStr
    ? {
        x: Number(fulcrumPointStr.split(":")[0]),
        y: Number(fulcrumPointStr.split(":")[1]),
      }
    : undefined;

  const initPathStr = remainCode.slice(
    remainCode.lastIndexOf(",") + 1,
    remainCode.length
  );
  remainCode = remainCode.slice(0, remainCode.lastIndexOf(","));
  const initPath = initPathStr ? parseInitialPath(initPathStr) : undefined;

  const sgf = remainCode ? remainCode : undefined;

  return { sgf, initPath, fulcrumPoint, sideCount };
}

export { parseGennanCodeToParams };
