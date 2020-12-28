import React, { FC, useEffect, useState } from "react";
import { ViewBoard, Point } from "gennan-core";
import { Square } from "./square";

type Props = {
  className?: string;
  sideWidth: number;
  viewBoard: ViewBoard;
  startPoint: Point;
  sideNum: number;
  onClickPoint: (point: Point) => void;
};

export const PointPosition = {
  LeftUpCorner: "LeftUpCorner",
  RightUpCorner: "RightUpCorner",
  LeftLowCorner: "LeftLowCorner",
  RightLowCorner: "RightLowCorner",
  LeftEdge: "LeftEdge",
  UpperEdge: "UpperEdge",
  RightEdge: "RightEdge",
  LowerEdge: "LowerEdge",
  Internal: "Internal",
} as const;
export type PointPosition = typeof PointPosition[keyof typeof PointPosition];

export const Board: FC<Props> = ({
  viewBoard,
  sideWidth,
  className,
  startPoint,
  sideNum,
  onClickPoint,
}: Props) => {
  const [squareWidth, setSquareWidth] = useState(0);
  const isNextIdxVisible = (): boolean => {
    return (
      viewBoard.reduce((acc, cur) => {
        return acc + cur.filter((vvv) => vvv.nextIndex != null).length;
      }, 0) > 1
    );
  };

  useEffect(() => {
    setSquareWidth(sideWidth / sideNum);
  });

  const Squares = viewBoard
    .map((v, i) => {
      return v.map((vv, ii) => {
        let pp: PointPosition = PointPosition.Internal;
        if (i === 0) {
          pp = PointPosition.LeftEdge;
          if (ii === 0) pp = PointPosition.LeftUpCorner;
          if (ii === viewBoard.length - 1) pp = PointPosition.LeftLowCorner;
        } else if (i === viewBoard.length - 1) {
          pp = PointPosition.RightEdge;
          if (ii === 0) pp = PointPosition.RightUpCorner;
          if (ii === viewBoard.length - 1) pp = PointPosition.RightLowCorner;
        } else if (ii === 0) {
          pp = PointPosition.UpperEdge;
          if (i === 0) pp = PointPosition.LeftUpCorner;
          if (i === viewBoard.length - 1) pp = PointPosition.LeftLowCorner;
        } else if (ii === viewBoard.length - 1) {
          pp = PointPosition.LowerEdge;
          if (i === 0) pp = PointPosition.RightUpCorner;
          if (i === viewBoard.length - 1) pp = PointPosition.RightLowCorner;
        }
        return {
          point: { x: i + 1, y: ii + 1 },
          state: vv,
          pp,
        };
      });
    })
    .filter((_, i) => startPoint.x - 1 <= i && i <= startPoint.x + sideNum) // x座標の拡大
    .map(
      (v) =>
        v.filter(
          (_, ii) => startPoint.y - 1 <= ii && ii <= startPoint.y + sideNum
        ) // y座標の拡大
    )
    .map((v, i) => {
      return v.map((vv, ii) => {
        const onClick = () => {
          onClickPoint(vv.point);
        };

        return (
          <Square
            cx={i * squareWidth + squareWidth / 2}
            cy={ii * squareWidth + squareWidth / 2}
            width={squareWidth}
            pointPosition={vv.pp}
            pointState={viewBoard[vv.point.x - 1][vv.point.y - 1]}
            key={vv.point.x.toString() + vv.point.y.toString()}
            onClick={onClick}
            isNextIdxVisible={isNextIdxVisible()}
          />
        );
      });
    });

  return (
    <svg
      className={className}
      version="1.1"
      baseProfile="full"
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="50%"
    >
      <rect width="100%" height="100%" fill="#f5be7e" stroke="black" />
      {Squares}
    </svg>
  );
};
