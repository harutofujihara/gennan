import React, { FC } from "react";
import { Point, ViewBoard } from "gennan-core";
import { Board } from "./Board";
import { GameInfoOverlay } from "../GameInfoOverlay";

const nums = [...Array(20)].map((_, i) => i + 1);
const alphas = "abcdefghijklmnopqrstuvwxyz"
  .split("")
  .map((s) => s.toUpperCase());

type Props = {
  withScale?: boolean;
  className?: string;
  width: number;
  viewBoard: ViewBoard;
  startPoint: Point;
  sideNum: number;
  onClickPoint: (point: Point) => void;
  isOverlayVisible: boolean;
  isGameInfoEditable: boolean;
  gameName: string;
  blackPlayer: string;
  whitePlayer: string;
  onGameNameChange?: (gn: string) => void;
  onBlackPlayerChange?: (p: string) => void;
  onWhitePlayerChange?: (p: string) => void;
};

export const BoardContainer: FC<Props> = ({
  className,
  withScale = false,
  width,
  viewBoard,
  startPoint,
  sideNum,
  onClickPoint,
  isOverlayVisible,
  isGameInfoEditable,
  gameName,
  blackPlayer,
  whitePlayer,
  onGameNameChange = () => {},
  onBlackPlayerChange = () => {},
  onWhitePlayerChange = () => {},
}: Props) => {
  const oneSquareSidePx = width / (viewBoard.length + 1);
  const boardWidth = withScale ? oneSquareSidePx * viewBoard.length : width;

  const VerticalScale: JSX.Element = (
    <>
      {alphas.slice(0, viewBoard.length).map((a, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            fontSize: oneSquareSidePx * 0.5 + "px",
            top: (i + 1.5) * oneSquareSidePx + "px",
            left: 0.5 * oneSquareSidePx + "px",
            transform: "translate(-50%, -50%)",
          }}
        >
          {a}
        </span>
      ))}
    </>
  );
  const HorizontalScale: JSX.Element = (
    <>
      {nums.slice(0, viewBoard.length).map((a, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            fontSize: oneSquareSidePx * 0.5 + "5px",
            top: 0.5 * oneSquareSidePx + "px",
            left: (i + 1.5) * oneSquareSidePx + "px",
            transform: "translate(-50%, -50%)",
          }}
        >
          {a}
        </span>
      ))}
    </>
  );

  return (
    <div
      className={className}
      style={{
        width: `${width}px`,
        height: `${width}px`,
        position: "relative",
      }}
    >
      {isOverlayVisible && (
        <div
          style={{
            width: boardWidth + "px",
            height: boardWidth + "px",
            position: "absolute",
            // top: "50%",
            // left: "50%",
            // transform: "translate(-50%, -50%)",
            right: 0,
            bottom: 0,
            zIndex: 10,
          }}
        >
          <GameInfoOverlay
            height={boardWidth}
            gameName={gameName}
            blackPlayer={blackPlayer}
            whitePlayer={whitePlayer}
            onGameNameChange={onGameNameChange}
            onBlackPlayerChange={onBlackPlayerChange}
            onWhitePlayerChange={onWhitePlayerChange}
            isEditable={isGameInfoEditable}
          />
        </div>
      )}

      {withScale && VerticalScale}
      {withScale && HorizontalScale}

      <div
        style={{
          width: boardWidth + "px",
          height: boardWidth + "px",
          position: "absolute",
          right: 0,
          bottom: 0,
        }}
      >
        <Board
          width={boardWidth}
          viewBoard={viewBoard}
          sideNum={sideNum}
          startPoint={startPoint}
          onClickPoint={onClickPoint}
        />
      </div>
    </div>
  );
};
