import React, {
  FC,
  useRef,
  useState,
  useEffect,
  ChangeEvent,
  Ref,
} from "react";
import styled, { css } from "styled-components";
import {
  GridNum,
  Point,
  ViewBoard,
  assertIsDefined,
  Board,
  cloneNode,
} from "gennan-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  // faImage,
  // faCut,
  faObjectGroup,
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
  faExpand,
  faCompress,
  faPlusCircle,
  faMinusCircle,
  faSearchPlus,
  faSearchMinus,
  faStop,
  faDownload,
  faFileImport,
  faArrowRight,
  faArrowLeft,
  faImage,
  faCamera,
} from "@fortawesome/free-solid-svg-icons";
import {
  faSquare,
  faCircle,
  // faHandPaper,
} from "@fortawesome/free-regular-svg-icons";
import { useResizeObserver } from "../hooks/useResizeObserver";
import { BoardContainer, BoardContent } from "./board/BoardContainer";
import {
  EditFixedStoneMode,
  EditMode,
  EditMoveMode,
  MarkupMode,
  Mode,
} from "../types";
import { commentValidate, readFileText, splitArr } from "../utils/utils";
import { EditModeInfo } from "./Container";
import { SvgBoard } from "./board/SvgBoard";
import { GameInfoOverlay } from "./board/GameInfoOverlay";
import { useDrag } from "react-use-gesture";

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
    cursor: pointer;
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
  cursor: pointer;

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

const nums = [...Array(20)].map((_, i) => i + 1);
const alphas = "abcdefghijklmnopqrstuvwxyz"
  .split("")
  .map((s) => s.toUpperCase());

type Props = {
  mode: Mode;
  editModeInfos: Array<EditModeInfo>;
  gridNum?: GridNum;
  sideNum: number;
  fulcrumPoint?: Point;
  viewBoard: ViewBoard;
  gameName?: string;
  gameDate?: string;
  gameResult?: string;
  komi?: string;
  blackPlayer?: string;
  whitePlayer?: string;
  comment?: string;
  isUndoIconActive: boolean;
  isPlayIconActive: boolean;
  isTurnedPlayIconActive: boolean;
  handleCommentChange: (c: string) => void;
  handleGameNameChange: (gn: string) => void;
  handleGameDateChange: (gd: string) => void;
  handleGameResultChange: (result: string) => void;
  handleKomiChange: (komi: string) => void;
  handleBlackPlayerChange: (p: string) => void;
  handleWhitePlayerChange: (p: string) => void;
  onClickPoint?: (p: Point) => void;
  onClickUndoIcon: () => void;
  onClickPlayIcon: () => void;
  onClickTurnedPlayIcon: () => void;
  onClickNextButton: () => void;
  startSelectMagnification: () => void;
  cancelSelectMagnification: () => void;
  rangeSideNum: number;
  setRangeSideNum: (n: number) => void;
  rangeFulcrumPoint: Point;
  setRangeFulcrumPoint: (p: Point) => void;
  previewMagnification: () => void;
  cancelPreviewMagnification: () => void;
  isPreviewing: boolean;
  confirmMagnification: () => void;
  isScaleVisible?: boolean;
  toggleIsScaleVisible: () => void;
  takeSnapshot: () => void;
  downloadSgf: () => void;
  importSgf: (sgf: string) => void;
  svgBoardRef: Ref<SVGSVGElement>;
  downloadBoardImage: () => Promise<void>;
};

export const Presenter: FC<Props> = ({
  mode,
  editModeInfos,
  sideNum,
  fulcrumPoint = { x: 1, y: 1 },
  viewBoard,
  gameName = "",
  gameDate = "",
  gameResult = "",
  komi = "",
  blackPlayer = "",
  whitePlayer = "",
  comment = "",
  isUndoIconActive,
  isPlayIconActive,
  isTurnedPlayIconActive,
  handleCommentChange,
  handleGameNameChange,
  handleGameDateChange,
  handleGameResultChange,
  handleKomiChange,
  handleBlackPlayerChange,
  handleWhitePlayerChange,
  onClickPoint = () => {},
  onClickUndoIcon,
  onClickPlayIcon,
  onClickTurnedPlayIcon,
  onClickNextButton,
  startSelectMagnification,
  cancelSelectMagnification,
  rangeSideNum,
  rangeFulcrumPoint,
  setRangeSideNum,
  setRangeFulcrumPoint,
  previewMagnification,
  cancelPreviewMagnification,
  isPreviewing,
  confirmMagnification,
  isScaleVisible = false,
  toggleIsScaleVisible,
  takeSnapshot,
  downloadSgf,
  importSgf,
  svgBoardRef,
  downloadBoardImage,
}: Props) => {
  const ref = useRef(null);
  const [boardContainerWidthPx] = useResizeObserver(ref);
  const [isBoardOverlayVisible, setIsBoardOverlayVisible] = useState(false);

  // const oneSquarePx = boardContainerWidthPx / (sideNum + 1);
  const oneSquarePx = isScaleVisible
    ? boardContainerWidthPx / (sideNum + 1)
    : boardContainerWidthPx / sideNum;
  // const boardWidthPx = isScaleVisible
  //   ? oneSquarePx * sideNum
  //   : boardContainerWidthPx;
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
              fontSize: oneSquarePx * 0.5 + "px",
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

  const EditModeButtons: Array<JSX.Element> = editModeInfos.map((info, i) => {
    const icon = EditModeIcons.find((emi) => emi.em === info.em);
    assertIsDefined(icon);
    return (
      <EditModeButton
        width={boardContainerWidthPx / 20}
        border={boardContainerWidthPx / 300}
        isActive={info.isActive}
        key={i}
        onClick={info.onClick}
      >
        {icon.el as JSX.Element}
      </EditModeButton>
    );
  });

  const rangeGridPx = oneSquarePx * rangeSideNum;

  useEffect(() => {
    setX(oneSquarePx * (rangeFulcrumPoint.x - 1));
    setY(oneSquarePx * (rangeFulcrumPoint.y - 1));
  }, [oneSquarePx]);

  const [x, setX] = useState(oneSquarePx * (rangeFulcrumPoint.x - 1));
  const [y, setY] = useState(oneSquarePx * (rangeFulcrumPoint.y - 1));
  const bind = useDrag(
    ({ down, offset: [ox, oy], movement: [mx, my] }) => {
      setX(ox);
      setY(oy);

      if (!down) {
        setRangeFulcrumPoint({
          x: Math.floor(x / (oneSquarePx - 0.01) + 1),
          y: Math.floor(y / (oneSquarePx - 0.01) + 1),
        });
      }
    },
    {
      bounds: {
        left: 0,
        right: boardWidthPx - rangeGridPx,
        top: 0,
        bottom: boardWidthPx - rangeGridPx,
      },
    }
  );
  const expandMagnification = () => {
    if (rangeSideNum < sideNum) {
      setRangeSideNum(rangeSideNum + 1);

      if (boardWidthPx < x + rangeGridPx + oneSquarePx) {
        setX(x - oneSquarePx);
        setRangeFulcrumPoint(
          Object.assign(rangeFulcrumPoint, {
            x: rangeFulcrumPoint.x - 1,
          })
        );
      }

      if (boardWidthPx < y + rangeGridPx + oneSquarePx) {
        setY(y - oneSquarePx);
        setRangeFulcrumPoint(
          Object.assign(rangeFulcrumPoint, {
            y: rangeFulcrumPoint.y - 1,
          })
        );
      }
      if (x <= oneSquarePx) setX(0);
      if (y <= oneSquarePx) setY(0);
    }
  };
  const shrinkMagnification = () => {
    if (1 < rangeSideNum) setRangeSideNum(rangeSideNum - 1);
  };

  const [isCommentValid, setIsCommentValid] = useState(true);

  // import sgf
  const inputFileRef = useRef(null);
  const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const sgf = await readFileText(file);
      console.log(file);
      console.log(sgf);
      importSgf(sgf);
      (e.target as any).value = null; // reset
    }
  };

  return (
    <div ref={ref}>
      <input
        type="file"
        id="file"
        ref={inputFileRef}
        style={{ display: "none" }}
        onChange={onFileChange}
      />

      <div
        style={{
          textAlign: "center",
          height: `${boardContainerWidthPx / 5}px`,
          position: "relative",
        }}
      >
        <FontAwesomeIcon
          icon={isScaleVisible ? faExpand : faCompress}
          style={{
            fontSize: `${boardContainerWidthPx / 24}px`,
            position: "absolute",
            left: boardContainerWidthPx * 0.01 + "px",
            top: boardContainerWidthPx * 0.1 + "px",
            cursor: "pointer",
          }}
          onClick={toggleIsScaleVisible}
        />
        <FontAwesomeIcon
          icon={faInfoCircle}
          style={{
            fontSize: `${boardContainerWidthPx / 9}px`,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            cursor: "pointer",
          }}
          onClick={() => setIsBoardOverlayVisible(!isBoardOverlayVisible)}
        />

        <FontAwesomeIcon
          icon={faCamera}
          style={{
            fontSize: `${boardContainerWidthPx / 24}px`,
            position: "absolute",
            top: boardContainerWidthPx * 0.1 + "px",
            right: boardContainerWidthPx * 0.36 + "px",
            cursor: "pointer",
            opacity: mode === Mode.EditMagnification ? 0.5 : 1,
          }}
          onClick={downloadBoardImage}
        />

        <FontAwesomeIcon
          icon={faFileImport}
          style={{
            fontSize: `${boardContainerWidthPx / 24}px`,
            position: "absolute",
            top: boardContainerWidthPx * 0.1 + "px",
            right: boardContainerWidthPx * 0.27 + "px",
            cursor: "pointer",
            opacity: mode === Mode.EditMagnification ? 0.5 : 1,
          }}
          onClick={() => {
            const cur = inputFileRef.current as any;
            if (cur) cur.click();
          }}
        />

        <FontAwesomeIcon
          icon={faDownload}
          style={{
            fontSize: `${boardContainerWidthPx / 24}px`,
            position: "absolute",
            top: boardContainerWidthPx * 0.1 + "px",
            right: boardContainerWidthPx * 0.18 + "px",
            cursor: "pointer",
            opacity: mode === Mode.EditMagnification ? 0.5 : 1,
          }}
          onClick={downloadSgf}
        />

        <FontAwesomeIcon
          icon={faStop}
          style={{
            fontSize: `${boardContainerWidthPx / 24}px`,
            position: "absolute",
            top: boardContainerWidthPx * 0.1 + "px",
            right: boardContainerWidthPx * 0.09 + "px",
            cursor: "pointer",
            opacity: mode === Mode.EditMagnification ? 0.5 : 1,
          }}
          onClick={takeSnapshot}
        />

        <FontAwesomeIcon
          icon={faObjectGroup}
          style={{
            fontSize: `${boardContainerWidthPx / 24}px`,
            position: "absolute",
            top: boardContainerWidthPx * 0.1 + "px",
            // right: boardContainerWidthPx * 0.01 + "px",
            right: 0,
            cursor: "pointer",
            // opacity: mode === Mode.EditMagnification ? 0.5 : 1,
          }}
          onClick={
            mode === Mode.EditMagnification
              ? () => cancelSelectMagnification()
              : () => startSelectMagnification()
          }
        />
      </div>

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
            onClickPoint={onClickPoint}
            boardRef={svgBoardRef}
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
              gameDate={gameDate}
              gameResult={gameResult}
              komi={komi}
              blackPlayer={blackPlayer}
              whitePlayer={whitePlayer}
              onGameNameChange={handleGameNameChange}
              onGameDateChange={handleGameDateChange}
              onGameResultChange={handleGameResultChange}
              onKomiChange={handleKomiChange}
              onBlackPlayerChange={handleBlackPlayerChange}
              onWhitePlayerChange={handleWhitePlayerChange}
              isEditable={mode !== Mode.View}
            />
          </BoardContent>
        )}

        {mode === Mode.EditMagnification && !isPreviewing && (
          <BoardContent
            style={{
              width: boardWidthPx + "px",
              height: boardWidthPx + "px",
              bottom: 0,
              right: 0,
            }}
          >
            <div
              style={{
                background: "rgba(0, 0, 0, 0.5)",
                width: rangeGridPx + "px",
                height: rangeGridPx + "px",
                border: "2px dashed",
                borderColor: "white",
                position: "absolute",
                left: x + "px",
                top: y + "px",
                boxSizing: "border-box",
                cursor: "grab",
                touchAction: "none",
              }}
              {...bind()}
            />
          </BoardContent>
        )}
      </BoardContainer>

      <div
        style={{
          padding: `${boardContainerWidthPx / 50}px 0`,
        }}
      >
        <textarea
          placeholder="Write comment..."
          disabled={mode === Mode.View || mode === Mode.EditMagnification}
          style={{
            width: "100%",
            height: `${boardContainerWidthPx / 6}px`,
            boxSizing: "border-box",
            margin: 0,
            overflow: "scroll",
            resize: "none",
            fontSize: `${boardContainerWidthPx / 24}px`,
          }}
          maxLength={200}
          value={comment}
          onInput={(e: ChangeEvent<HTMLTextAreaElement>) => {
            if (commentValidate(e.target.value)) {
              handleCommentChange(e.target.value);
              setIsCommentValid(true);
            } else setIsCommentValid(false);
            // handleCommentChange(e.target.value.replace(/(?:\[)/g, `\\[`));
          }}
        />
        {!isCommentValid && (
          <p
            style={{
              margin: 0,
              color: "red",
              fontSize: `${boardContainerWidthPx / 26}px`,
            }}
          >
            The following characters are not allowed.()[],
          </p>
        )}
      </div>

      <div
        style={{
          height: `${boardContainerWidthPx / 8}px`,
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
            <p
              style={{ margin: 0, fontSize: `${boardContainerWidthPx / 25}px` }}
            >
              Set handicap stones
            </p>

            <FlatSimpleButton
              style={{ fontSize: `${boardContainerWidthPx / 30}px` }}
              onClick={onClickNextButton}
            >
              Record game context next <FontAwesomeIcon icon={faCaretRight} />
            </FlatSimpleButton>
          </>
        )}

        {mode === Mode.EditMoves && (
          <FontAwesomeIcon
            icon={faUndo}
            style={{
              fontSize: `${boardContainerWidthPx / 11}px`,
              position: "absolute",
              top: boardContainerWidthPx / 60 + "px",
              left: boardContainerWidthPx / 18 + "px",
              userSelect: "none",
              opacity: isUndoIconActive ? 1 : 0.5,
              cursor: "pointer",
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
                fontSize: `${boardContainerWidthPx / 9}px`,
                position: "absolute",
                left: (15 / 40) * boardContainerWidthPx + "px",
                userSelect: "none",
                opacity: isTurnedPlayIconActive ? 1 : 0.5,
                cursor: "pointer",
              }}
              onClick={onClickTurnedPlayIcon}
            />
            <FontAwesomeIcon
              icon={faPlay}
              style={{
                fontSize: `${boardContainerWidthPx / 9}px`,
                position: "absolute",
                left: (16 / 30) * boardContainerWidthPx + "px",
                userSelect: "none",
                opacity: isPlayIconActive ? 1 : 0.5,
                cursor: "pointer",
              }}
              onClick={onClickPlayIcon}
            />
          </>
        )}
        {mode === Mode.EditMagnification && (
          <>
            <FlatSimpleButton
              style={{
                fontSize: `${boardContainerWidthPx / 30}px`,
                marginRight: "1rem",
                position: "absolute",
                left: 0,
                bottom: 0,
              }}
              onClick={
                isPreviewing
                  ? () => cancelPreviewMagnification()
                  : () => cancelSelectMagnification()
              }
            >
              <FontAwesomeIcon icon={faArrowLeft} /> Cancel
            </FlatSimpleButton>

            <FontAwesomeIcon
              icon={faSearchMinus}
              style={{
                fontSize: `${boardContainerWidthPx / 9}px`,
                position: "absolute",
                left: "38%",
                userSelect: "none",
                opacity: 1 < rangeSideNum && !isPreviewing ? 1 : 0.5,
                cursor: "pointer",
              }}
              onClick={() => !isPreviewing && shrinkMagnification()}
            />
            <FontAwesomeIcon
              icon={faSearchPlus}
              style={{
                fontSize: `${boardContainerWidthPx / 9}px`,
                position: "absolute",
                left: "52%",
                userSelect: "none",
                opacity: rangeSideNum < sideNum && !isPreviewing ? 1 : 0.5,
                cursor: "pointer",
              }}
              onClick={() => !isPreviewing && expandMagnification()}
            />

            <FlatSimpleButton
              style={{
                fontSize: `${boardContainerWidthPx / 30}px`,
                position: "absolute",
                right: 0,
                bottom: 0,
                background: isPreviewing ? "#808080" : "#C0C0C0",
              }}
              onClick={
                isPreviewing
                  ? () => confirmMagnification()
                  : () => previewMagnification()
              }
            >
              {isPreviewing ? "Confirm" : "Preview"}{" "}
              <FontAwesomeIcon icon={faArrowRight} />
            </FlatSimpleButton>
          </>
        )}
      </div>
    </div>
  );
};
