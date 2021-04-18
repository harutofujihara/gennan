import React, { FC, useRef, useState } from "react";
import { Point, ViewBoard } from "gennan-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faInfoCircle,
  faCompress,
  faExpand,
} from "@fortawesome/free-solid-svg-icons";
import { useResizeObserver } from "../hooks/useResizeObserver";
import { BoardContainer, BoardContent } from "./board/BoardContainer";
import { SvgBoard } from "./board/SvgBoard";
import { GameInfoOverlay } from "./board/GameInfoOverlay";

type Props = {
  handlePointClicked?: (p: Point) => void;
  sideNum: number;
  fulcrumPoint: Point;
  viewBoard: ViewBoard;
  gameName?: string;
  blackPlayer?: string;
  whitePlayer?: string;
  comment?: string;
  onPlayIconClicked?: () => void;
  onTurnedPlayIconClicked?: () => void;
  isPlayIconActive?: boolean;
  isTurnedPlayIconActive?: boolean;
  isScaleVisible?: boolean;
  toggleIsScaleVisible: () => void;
};

const nums = [...Array(20)].map((_, i) => i + 1);
const alphas = "abcdefghijklmnopqrstuvwxyz"
  .split("")
  .map((s) => s.toUpperCase());

export const PresenterWide: FC<Props> = ({
  handlePointClicked = () => {},
  sideNum,
  fulcrumPoint = { x: 1, y: 1 },
  viewBoard,
  gameName = "",
  blackPlayer = "",
  whitePlayer = "",
  comment = "",
  onPlayIconClicked,
  onTurnedPlayIconClicked,
  isPlayIconActive = true,
  isTurnedPlayIconActive = false,
  isScaleVisible = false,
  toggleIsScaleVisible,
}: Props) => {
  const ref = useRef(null);
  const [containerWidth] = useResizeObserver(ref);
  const boardContainerWidthPx = containerWidth * 0.7;
  const [isBoardOverlayVisible, setIsBoardOverlayVisible] = useState(false);
  const oneSquarePx = isScaleVisible
    ? boardContainerWidthPx / (sideNum + 1)
    : boardContainerWidthPx / sideNum;
  const boardWidthPx = oneSquarePx * sideNum;

  const VerticalScale: JSX.Element = (
    <>
      {alphas
        .slice(fulcrumPoint.y - 1, fulcrumPoint.y - 1 + sideNum)
        .map((a, i) => (
          <span
            key={i}
            style={{
              position: "absolute",
              fontSize: oneSquarePx * 0.5 + "px",
              top: (i + 1.5) * oneSquarePx + "px",
              left: 0.5 * oneSquarePx + "px",
              transform: "translate(-50%, -50%)",
              userSelect: "none",
            }}
          >
            {a}
          </span>
        ))}
    </>
  );
  const HorizontalScale: JSX.Element = (
    <>
      {nums
        .slice(fulcrumPoint.x - 1, fulcrumPoint.x - 1 + sideNum)
        .map((a, i) => (
          <span
            key={i}
            style={{
              position: "absolute",
              fontSize: oneSquarePx * 0.5 + "5px",
              top: 0.5 * oneSquarePx + "px",
              left: (i + 1.5) * oneSquarePx + "px",
              transform: "translate(-50%, -50%)",
              userSelect: "none",
            }}
          >
            {a}
          </span>
        ))}
    </>
  );

  return (
    <div ref={ref} style={{ height: boardContainerWidthPx + "px" }}>
      <div style={{ position: "relative" }}>
        <FontAwesomeIcon
          icon={faInfoCircle}
          style={{
            fontSize: `${containerWidth / 12}px`,
            position: "absolute",
            right: containerWidth * 0.15 + "px",
            transform: "translateX(50%)",
            cursor: "pointer",
          }}
          onClick={() => setIsBoardOverlayVisible(!isBoardOverlayVisible)}
        />

        <FontAwesomeIcon
          icon={isScaleVisible ? faExpand : faCompress}
          style={{
            fontSize: `${containerWidth / 35}px`,
            position: "absolute",
            right: containerWidth * 0.05 + "px",
            top: containerWidth * 0.05 + "px",
            transform: "translateX(50%)",
            cursor: "pointer",
          }}
          onClick={toggleIsScaleVisible}
        />

        <p
          style={{
            position: "absolute",
            left: containerWidth * 0.7 + "px",
            top: `${containerWidth / 10}px`,
            width: containerWidth * 0.26 + "px",
            height: containerWidth * 0.5 + "px",
            margin: `0 ${containerWidth * 0.02}px`,
            overflow: "scroll",
            fontSize: `${containerWidth / 28}px`,
          }}
        >
          {comment}
        </p>

        <BoardContainer widthPx={boardContainerWidthPx}>
          {isScaleVisible && VerticalScale}
          {isScaleVisible && HorizontalScale}
          <BoardContent
            style={{
              width: boardWidthPx + "px",
              height: boardWidthPx + "px",
              bottom: 0,
              right: 0,
            }}
          >
            <SvgBoard
              widthPx={boardWidthPx}
              viewBoard={viewBoard}
              fulcrumPoint={fulcrumPoint}
              sideNum={sideNum ? sideNum : viewBoard.length}
              onClickPoint={handlePointClicked}
            />
          </BoardContent>
          {isBoardOverlayVisible && (
            <BoardContent
              style={{
                width: boardWidthPx + "px",
                height: boardWidthPx + "px",
                bottom: 0,
                right: 0,
              }}
            >
              <GameInfoOverlay
                gameName={gameName}
                blackPlayer={blackPlayer}
                whitePlayer={whitePlayer}
              />
            </BoardContent>
          )}
        </BoardContainer>

        <FontAwesomeIcon
          icon={faPlay}
          rotation={180}
          style={{
            fontSize: `${containerWidth / 11}px`,
            position: "absolute",
            bottom: "1px",
            right: containerWidth * 0.17 + "px",
            userSelect: "none",
            opacity: isTurnedPlayIconActive ? 1 : 0.5,
            cursor: "pointer",
          }}
          onClick={onTurnedPlayIconClicked}
        />
        <FontAwesomeIcon
          icon={faPlay}
          style={{
            fontSize: `${containerWidth / 11}px`,
            position: "absolute",
            bottom: "1px",
            right: containerWidth * 0.05 + "px",
            userSelect: "none",
            opacity: isPlayIconActive ? 1 : 0.5,
            cursor: "pointer",
          }}
          onClick={onPlayIconClicked}
        />
      </div>
    </div>
  );
};
