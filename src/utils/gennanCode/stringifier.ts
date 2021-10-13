import { GennanCore, Point, toInitPathString, TreePath } from "gennan-core";

function stringifyGennanCode(params: {
  gnc?: GennanCore;
  fulcrumPoint?: Point;
  sideCount?: number;
}): string {
  const sgfStr = params.gnc ? params.gnc.sgf : "";
  const pathStr = params.gnc
    ? toInitPathString(params.gnc.currentPath, !params.gnc.existsNextMove)
    : "";
  const fulcrumPointStr = params.fulcrumPoint
    ? params.fulcrumPoint.x + ":" + params.fulcrumPoint.y
    : "";
  const sideCountStr = params.sideCount ? params.sideCount.toString() : "";

  const gennanCode =
    sgfStr + "," + pathStr + "," + fulcrumPointStr + "," + sideCountStr;

  return gennanCode;
}

export { stringifyGennanCode };
