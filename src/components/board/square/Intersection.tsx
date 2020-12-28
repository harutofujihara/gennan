import React, { FC, useState, useEffect } from "react";
import { PointPosition } from "../Board";

type Props = {
  cx: number;
  cy: number;
  width: number;
  pointPosition: PointPosition;
};

export const Intersection: FC<Props> = ({
  cx,
  cy,
  width,
  pointPosition,
}: Props) => {
  const [strokeWidth, setStrokeWidth] = useState(0);
  useEffect(() => {
    setStrokeWidth(width / 35);
  });

  return (
    <g>
      <line
        x1={
          pointPosition === PointPosition.LeftUpCorner ||
          pointPosition === PointPosition.LeftEdge ||
          pointPosition === PointPosition.LeftLowCorner
            ? cx
            : cx - width / 2
        }
        y1={cy}
        x2={
          pointPosition === PointPosition.RightUpCorner ||
          pointPosition === PointPosition.RightEdge ||
          pointPosition === PointPosition.RightLowCorner
            ? cx
            : cx + width / 2
        }
        y2={cy}
        stroke="black"
        strokeWidth={strokeWidth}
      />
      <line
        x1={cx}
        y1={
          pointPosition === PointPosition.LeftUpCorner ||
          pointPosition === PointPosition.UpperEdge ||
          pointPosition === PointPosition.RightUpCorner
            ? cy
            : cy - width / 2
        }
        x2={cx}
        y2={
          pointPosition === PointPosition.RightLowCorner ||
          pointPosition === PointPosition.LowerEdge ||
          pointPosition === PointPosition.LeftLowCorner
            ? cy
            : cy + width / 2
        }
        stroke="black"
        strokeWidth={strokeWidth}
      />
    </g>
  );
};
