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
import { BoardContainer } from "./board/BoardContainer";

type Props = {
  handlePointClicked?: (p: Point) => void;
  sideNum?: number;
  startPoint?: Point;
  viewBoard: ViewBoard;
  gameName?: string;
  blackPlayer?: string;
  whitePlayer?: string;
  comment?: string;
  onPlayIconClicked?: () => void;
  onTurnedPlayIconClicked?: () => void;
  isPlayIconActive?: boolean;
  isTurnedPlayIconActive?: boolean;
};

export const PresenterWide: FC<Props> = ({
  handlePointClicked = () => {},
  sideNum,
  startPoint = { x: 1, y: 1 },
  viewBoard,
  gameName = "",
  blackPlayer = "",
  whitePlayer = "",
  comment = "",
  onPlayIconClicked,
  onTurnedPlayIconClicked,
  isPlayIconActive = true,
  isTurnedPlayIconActive = false,
}: Props) => {
  const ref = useRef(null);
  const [containerWidth] = useResizeObserver(ref);
  const boardContainerWidth = containerWidth * 0.7;
  const [isBoardOverlayVisible, setIsBoardOverlayVisible] = useState(false);
  const [isScaleVisible, setIsScaleVisible] = useState(false);

  return (
    <div ref={ref} style={{ height: boardContainerWidth + "px" }}>
      <div style={{ position: "relative" }}>
        <FontAwesomeIcon
          icon={faInfoCircle}
          style={{
            fontSize: `${containerWidth / 12}px`,
            position: "absolute",
            right: containerWidth * 0.15 + "px",
            transform: "translateX(50%)",
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
          }}
          onClick={() => setIsScaleVisible(!isScaleVisible)}
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
            fontSize: `${containerWidth / 35}px`,
          }}
        >
          {comment}
        </p>

        <BoardContainer
          withScale={isScaleVisible}
          isOverlayVisible={isBoardOverlayVisible}
          width={boardContainerWidth}
          viewBoard={viewBoard}
          sideNum={sideNum ? sideNum : viewBoard.length}
          startPoint={startPoint}
          onClickPoint={handlePointClicked}
          isGameInfoEditable={false}
          gameName={gameName}
          blackPlayer={blackPlayer}
          whitePlayer={whitePlayer}
        />

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
          }}
          onClick={onPlayIconClicked}
        />
      </div>
    </div>
  );
};
