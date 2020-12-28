import { ViewPointState, Color, PointState } from "gennan-core";
import React, { FC } from "react";
import styled from "styled-components";
import { toCircled } from "../../../utils";
import { PointPosition } from "../Board";
import { Intersection } from "./Intersection";

// const Hovering = styled.a`
//   opacity: 0;
//   &:hover {
//     opacity: 0.5;
//   }
// `;

function trianglePoints(cx: number, cy: number, length: number): string {
  const h = Math.sqrt(length * length - (length / 2) * (length / 2));
  return `${cx} ${cy - (h * 2) / 3} ${cx - length / 2} ${cy + (h * 1) / 3} ${
    cx + length / 2
  } ${cy + (h * 1) / 3}`;
}

type Props = {
  cx: number;
  cy: number;
  width: number;
  pointPosition: PointPosition;
  pointState: ViewPointState;
  onClick: () => void;
  isNextIdxVisible: boolean;
};

export const Square: FC<Props> = ({
  cx,
  cy,
  width,
  pointPosition,
  pointState,
  onClick,
  isNextIdxVisible,
}: Props) => {
  const handleClick = () => {
    onClick();
  };

  return (
    <>
      {!(isNextIdxVisible && pointState.nextIndex != null) && (
        <Intersection
          cx={cx}
          cy={cy}
          width={width}
          pointPosition={pointPosition}
        />
      )}

      {/* Star */}
      {pointState.star && (
        <circle fill="black" opacity="1" cx={cx} cy={cy} r={width / 10} />
      )}
      {/* Stone */}
      {(pointState.color === Color.Black ||
        pointState.color === Color.White) && (
        <circle
          fill={pointState.color === PointState.Black ? "black" : "white"}
          stroke="black"
          opacity="1"
          cx={cx}
          cy={cy}
          r={width / 2}
          strokeWidth={width / 20}
        />
      )}
      {/* Circle */}
      {pointState.circle && (
        <circle
          fill="none"
          stroke={pointState.color === Color.Black ? "white" : "black"}
          cx={cx}
          cy={cy}
          r={width / 3}
          strokeWidth={width / 15}
        />
      )}
      {/* Triangle */}
      {pointState.triangle && (
        <polygon
          points={trianglePoints(cx, cy, width / 1.4)}
          fill="none"
          stroke={pointState.color === Color.Black ? "white" : "black"}
          strokeWidth={width / 15}
        />
      )}
      {/* Square */}
      {pointState.square && (
        <rect
          x={cx - width * 0.3}
          y={cy - width * 0.3}
          width={`${width * 0.6}px`}
          height={`${width * 0.6}px`}
          stroke={pointState.color === Color.Black ? "white" : "black"}
          strokeWidth={width / 15}
          fill="none"
        />
      )}
      {/* Cross */}
      {pointState.cross && (
        <>
          <line
            x1={cx - width / 3.5}
            y1={cy - width / 3.5}
            x2={cx + width / 3.5}
            y2={cy + width / 3.5}
            stroke={pointState.color === Color.Black ? "white" : "black"}
            strokeWidth={width / 15}
          />
          <line
            x1={cx - width / 3.5}
            y1={cy + width / 3.5}
            x2={cx + width / 3.5}
            y2={cy - width / 3.5}
            stroke={pointState.color === Color.Black ? "white" : "black"}
            strokeWidth={width / 15}
          />
        </>
      )}
      {/* Text */}
      {pointState.text && (
        <text
          dx={cx}
          dy={cy}
          textAnchor="middle"
          dominantBaseline="central"
          fill={pointState.color === Color.Black ? "white" : "black"}
          fontSize={`${width / 1.4}px`}
          style={{
            userSelect: "none",
            MozUserSelect: "none" /* Firefox */,
            msUserSelect: "none" /* Internet Explorer */,
            KhtmlUserSelect: "none" /* KHTML browsers (e.g. Konqueror) */,
            WebkitUserSelect: "none" /* Chrome, Safari, and Opera */,
            WebkitTouchCallout: "none" /* Disable Android and iOS callouts*/,
          }}
        >
          {pointState.text}
        </text>
      )}
      {/* Current */}
      {pointState.current && (
        <circle fill="#78BBE6" opacity="1" cx={cx} cy={cy} r={width / 6} />
      )}
      {isNextIdxVisible && pointState.nextIndex != null && (
        <text
          dx={cx}
          dy={cy}
          textAnchor="middle"
          dominantBaseline="central"
          fill={pointState.color === Color.Black ? "white" : "black"}
          fontSize={`${width / 1.1}px`}
          style={{
            userSelect: "none",
            MozUserSelect: "none" /* Firefox */,
            msUserSelect: "none" /* Internet Explorer */,
            KhtmlUserSelect: "none" /* KHTML browsers (e.g. Konqueror) */,
            WebkitUserSelect: "none" /* Chrome, Safari, and Opera */,
            WebkitTouchCallout: "none" /* Disable Android and iOS callouts*/,
          }}
        >
          {toCircled(pointState.nextIndex + 1)}
        </text>
      )}
      {/* Click */}
      <rect
        x={cx - width / 2}
        y={cy - width / 2}
        width={`${width}px`}
        height={`${width}px`}
        onClick={handleClick}
        onKeyDown={handleClick}
        role="presentation"
        opacity="0"
      />
    </>
  );
};
