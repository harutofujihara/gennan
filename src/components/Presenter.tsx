import React, { FC, useRef, useState, useEffect, ChangeEvent } from "react";
import styled, { css } from "styled-components";
import { GridNum, Point, ViewBoard, assertIsDefined } from "gennan-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  // faImage,
  // faCut,
  faPlay,
  faInfoCircle,
  faUndo,
  faTimes,
  faSortNumericDown,
  faFont,
  faHandPointUp,
  faCaretUp,
  faCircle as faFillCircle,
  faCaretRight,
  faCompressArrowsAlt,
  faExpandArrowsAlt,
} from "@fortawesome/free-solid-svg-icons";
import {
  faSquare,
  faCircle,
  // faHandPaper,
} from "@fortawesome/free-regular-svg-icons";
import { useResizeObserver } from "../hooks/useResizeObserver";
import { BoardContainer } from "./board/BoardContainer";
import {
  EditFixedStoneMode,
  EditMode,
  EditMoveMode,
  MarkupMode,
  Mode,
} from "../types";
import { splitArr } from "../utils";
import { EditModeInfo } from "./Container";

const EditModeButton = styled.a`
  ${({
    width,
    border,
    isActive,
  }: {
    width: number;
    border: number;
    isActive: boolean;
  }) => css`
    display: inline-block;
    text-decoration: none;
    width: ${`${width}px`};
    height: ${`${width}px`};
    line-height: ${`${width}px`};
    font-size: ${`${width / 1.5}px`};
    color: black;
    border: solid ${`${border}px black`};
    text-align: center;
    overflow: hidden;
    font-weight: bold;
    transition: 0.4s;
    background: ${isActive ? "#b0b0b0" : "#f0f0f0"};
    i {
      line-height: ${`${width}px`};
    }
    &:hover {
      background: #c0c0c0;
    }
  `}
`;

// const IButton = styled.a`
//   ${({ width, border }: { width: number; border: number }) => css`
//     display: inline-block;
//     text-decoration: none;
//     width: ${`${width}px`};
//     height: ${`${width}px`};
//     line-height: ${`${width}px`};
//     font-size: ${`${width / 1.5}px`};
//     color: black;
//     border: ${`solid ${border}px black`};
//     text-align: center;
//     overflow: hidden;
//     font-weight: bold;
//     transition: 0.4s;
//     i {
//       line-height: ${`${width}px`};
//     }
//     &:hover {
//       background: #c0c0c0;
//     }
//   `}
// `;

// const ICircleButton = styled(IButton)`
//   border-radius: 50%;
// `;

const FlatSimpleButton = styled.a`
  position: relative;
  display: inline-block;
  font-weight: bold;
  padding: 0.25em 0.5em;
  text-decoration: none;
  color: #333333;
  background: #ececec;
  transition: 0.4s;

  &:hover {
    background: #808080;
    color: white;
  }
`;

const EditModeIcons: Array<{ el: JSX.Element; em: EditMode }> = [
  {
    el: <FontAwesomeIcon icon={faCircle} />,
    em: MarkupMode.Circle,
  },
  {
    el: <FontAwesomeIcon icon={faSquare} />,
    em: MarkupMode.Square,
  },
  {
    el: <FontAwesomeIcon icon={faCaretUp} />,
    em: MarkupMode.Triangle,
  },
  {
    el: <FontAwesomeIcon icon={faTimes} />,
    em: MarkupMode.Cross,
  },
  {
    el: <FontAwesomeIcon icon={faFont} />,
    em: MarkupMode.Alpha,
  },
  {
    el: <FontAwesomeIcon icon={faSortNumericDown} />,
    em: MarkupMode.Num,
  },
  {
    el: <FontAwesomeIcon icon={faHandPointUp} color="black" />,
    em: EditMoveMode.Move,
  },
  {
    el: <FontAwesomeIcon icon={faFillCircle} color="black" />,
    em: EditFixedStoneMode.Black,
  },
  {
    el: <FontAwesomeIcon icon={faFillCircle} color="white" />,
    em: EditFixedStoneMode.White,
  },
];

type Props = {
  mode: Mode;
  editModeInfos: Array<EditModeInfo>;
  gridNum?: GridNum;
  sideNum?: number;
  startPoint?: Point;
  viewBoard: ViewBoard;
  gameName?: string;
  blackPlayer?: string;
  whitePlayer?: string;
  comment?: string;
  isUndoIconActive: boolean;
  isPlayIconActive: boolean;
  isTurnedPlayIconActive: boolean;
  handleCommentChange: (c: string) => void;
  handleGameNameChange: (gn: string) => void;
  handleBlackPlayerChange: (p: string) => void;
  handleWhitePlayerChange: (p: string) => void;
  onClickPoint?: (p: Point) => void;
  onClickUndoIcon: () => void;
  onClickPlayIcon: () => void;
  onClickTurnedPlayIcon: () => void;
  onClickNextButton: () => void;
};

export const Presenter: FC<Props> = ({
  mode,
  editModeInfos,
  sideNum,
  startPoint = { x: 1, y: 1 },
  viewBoard,
  gameName = "",
  blackPlayer = "",
  whitePlayer = "",
  comment = "",
  isUndoIconActive,
  isPlayIconActive,
  isTurnedPlayIconActive,
  handleCommentChange,
  handleGameNameChange,
  handleBlackPlayerChange,
  handleWhitePlayerChange,
  onClickPoint = () => {},
  onClickUndoIcon,
  onClickPlayIcon,
  onClickTurnedPlayIcon,
  onClickNextButton,
}: Props) => {
  const ref = useRef(null);
  const [containerWidth] = useResizeObserver(ref);
  const [isBoardOverlayVisible, setIsBoardOverlayVisible] = useState(false);
  const [isScaleVisible, setIsScaleVisible] = useState(false);

  const EditModeButtons: Array<JSX.Element> = editModeInfos.map((info, i) => {
    const icon = EditModeIcons.find((emi) => emi.em === info.em);
    assertIsDefined(icon);
    return (
      <EditModeButton
        width={containerWidth / 20}
        border={containerWidth / 300}
        isActive={info.isActive}
        key={i}
        onClick={info.onClick}
      >
        {icon.el as JSX.Element}
      </EditModeButton>
    );
  });

  return (
    <div ref={ref}>
      <div
        style={{
          textAlign: "center",
          height: `${containerWidth / 5}px`,
          position: "relative",
        }}
      >
        <FontAwesomeIcon
          icon={faInfoCircle}
          style={{
            fontSize: `${containerWidth / 9}px`,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
          onClick={() => setIsBoardOverlayVisible(!isBoardOverlayVisible)}
        />

        <FontAwesomeIcon
          icon={isScaleVisible ? faCompressArrowsAlt : faExpandArrowsAlt}
          style={{
            fontSize: `${containerWidth / 24}px`,
            position: "absolute",
            right: containerWidth * 0.025 + "px",
            top: containerWidth * 0.1 + "px",
            transform: "translateX(50%)",
          }}
          onClick={() => setIsScaleVisible(!isScaleVisible)}
        />
      </div>

      <BoardContainer
        withScale={isScaleVisible}
        gameName={gameName}
        blackPlayer={blackPlayer}
        whitePlayer={whitePlayer}
        isOverlayVisible={isBoardOverlayVisible}
        isGameInfoEditable={mode !== Mode.View}
        width={containerWidth}
        viewBoard={viewBoard}
        sideNum={sideNum ? sideNum : viewBoard.length}
        startPoint={startPoint}
        onClickPoint={onClickPoint}
        onGameNameChange={handleGameNameChange}
        onBlackPlayerChange={handleBlackPlayerChange}
        onWhitePlayerChange={handleWhitePlayerChange}
      />

      <div
        style={{
          padding: `${containerWidth / 50}px 0`,
        }}
      >
        <textarea
          disabled={mode === Mode.View}
          style={{
            width: "100%",
            height: `${containerWidth / 7}px`,
            boxSizing: "border-box",
            padding: 0,
            margin: 0,
            overflow: "scroll",
          }}
          maxLength={200}
          value={comment}
          onInput={(e: ChangeEvent<HTMLTextAreaElement>) =>
            handleCommentChange(e.target.value)
          }
        />
      </div>

      <div
        style={{
          height: `${containerWidth / 8}px`,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "0",
            right: "0",
          }}
        >
          {splitArr(EditModeButtons, 4).map((ems, i) => (
            <p style={{ margin: 0, lineHeight: 0 }} key={i}>
              {Array.isArray(ems) && ems.map((em) => em)}
            </p>
          ))}
        </div>

        {mode === Mode.EditFixedStones && (
          <>
            <p style={{ margin: 0, fontSize: `${containerWidth / 25}px` }}>
              置石をセットしてください
            </p>

            <FlatSimpleButton
              style={{ fontSize: `${containerWidth / 30}px` }}
              onClick={onClickNextButton}
            >
              置石を終了して手順に進む <FontAwesomeIcon icon={faCaretRight} />
            </FlatSimpleButton>
          </>
        )}

        {mode === Mode.EditMoves && (
          <FontAwesomeIcon
            icon={faUndo}
            style={{
              fontSize: `${containerWidth / 11}px`,
              position: "absolute",
              top: containerWidth / 60 + "px",
              left: containerWidth / 18 + "px",
              userSelect: "none",
              opacity: isUndoIconActive ? 1 : 0.5,
            }}
            onClick={onClickUndoIcon}
          />
        )}

        {(mode === Mode.View || mode === Mode.EditMoves) && (
          <>
            <FontAwesomeIcon
              icon={faPlay}
              rotation={180}
              style={{
                fontSize: `${containerWidth / 9}px`,
                position: "absolute",
                left: (15 / 40) * containerWidth + "px",
                userSelect: "none",
                opacity: isTurnedPlayIconActive ? 1 : 0.5,
              }}
              onClick={onClickTurnedPlayIcon}
            />
            <FontAwesomeIcon
              icon={faPlay}
              style={{
                fontSize: `${containerWidth / 9}px`,
                position: "absolute",
                left: (16 / 30) * containerWidth + "px",
                userSelect: "none",
                opacity: isPlayIconActive ? 1 : 0.5,
              }}
              onClick={onClickPlayIcon}
            />
          </>
        )}
      </div>
    </div>
  );
};
