import React, {
  FC,
  useRef,
  useCallback,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  ChangeEvent,
} from "react";
import styled, { css } from "styled-components";
import { GennanCore, Color, GridNum, Point, TreePath } from "gennan-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faInfoCircle,
  faImage,
  faUndo,
  faTimes,
  faSortNumericDown,
  faFont,
  faHandPointUp,
  faCut,
  faCaretUp,
  faCircle as faFillCircle,
  faCaretRight,
} from "@fortawesome/free-solid-svg-icons";
import {
  faSquare,
  faCircle,
  faHandPaper,
} from "@fortawesome/free-regular-svg-icons";
import { Board } from "./board/Board";
import { useResizeObserver } from "../hooks/useResizeObserver";
import { GameInfoOverlay } from "./GameInfoOverlay";
import { RequireOne } from "../types/requireOne";
import { Mode } from "../types/mode";
import {
  EditMode,
  MarkupMode,
  EditMoveMode,
  EditFixedStoneMode,
} from "../types/editMode";

const StyledBoard = styled(Board)`
  ${({ width }: { width: number }) => css`
    width: ${`${width}px`};
    height: ${`${width}px`};
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  `}
`;
const StyledGameInfoOverlay = styled(GameInfoOverlay)`
  ${({ width }: { width: number }) => css`
    width: ${`${width}px`};
    height: ${`${width}px`};
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    zindex: 10;
  `}
`;

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

const IButton = styled.a`
  ${({ width, border }: { width: number; border: number }) => css`
    display: inline-block;
    text-decoration: none;
    width: ${`${width}px`};
    height: ${`${width}px`};
    line-height: ${`${width}px`};
    font-size: ${`${width / 1.5}px`};
    color: black;
    border: ${`solid ${border}px black`};
    text-align: center;
    overflow: hidden;
    font-weight: bold;
    transition: 0.4s;
    i {
      line-height: ${`${width}px`};
    }
    &:hover {
      background: #c0c0c0;
    }
  `}
`;

const ICircleButton = styled(IButton)`
  border-radius: 50%;
`;

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

const OperateIcon = styled(FontAwesomeIcon)`
  ${({
    left,
    fontSize,
    isactive,
  }: {
    left: number;
    fontSize: number;
    isactive: string;
  }) => css`
    position: absolute;
    left: ${`${left}px`};
    font-size: ${`${fontSize}px`};
    user-select: none;
    opacity: ${isactive === "true" ? 1 : 0.5};
    &:hover {
      opacity: 0.5;
    }
  `}
`;

type Options = {
  sgf?: string;
  gridNum?: GridNum;
};

type Others = {
  mode: Mode;
  setMode: Dispatch<SetStateAction<Mode>>;
  path?: Array<number>;
  onSgfChange?: (sgf: string) => void;
  onPathChange?: (path: TreePath) => void;
  lang?: "ja" | "en";
  sideCount?: number;
  startPoint?: Point;
};

type Props = Others & RequireOne<Options>;

export const Gennan: FC<Props> = ({
  lang = "ja",
  mode = Mode.View,
  setMode,
  sgf,
  gridNum: gn = 19,
  path,
  onSgfChange,
  onPathChange,
  startPoint = { x: 1, y: 1 },
  sideCount,
}: Props) => {
  console.log("Gennan is rendering!");
  const originalGnc =
    sgf != null ? GennanCore.createFromSgf(sgf) : GennanCore.create(gn);
  const [gnc, setGnc] = useState(originalGnc);
  const { gridNum } = originalGnc;
  const [viewBoard, setViewBoard] = useState(gnc.viewBoard);

  // 拡大用パラメータ
  // 始点から得られる最大の正方形 or 始点から与えられた幅の正方形
  const minSide = Math.min(
    viewBoard.length - startPoint.x + 1,
    viewBoard.length - startPoint.y + 1
  );
  const sCount = sideCount || viewBoard.length;
  const sideNum = minSide >= sCount ? sCount : minSide;

  const ref = useRef(null);
  const [width] = useResizeObserver(ref);
  const [isScaleVisible, setIsScaleVisible] = useState(false);
  const [isGameInfoVisible, setIsGameInfoVisible] = useState(false);
  const [boardWidth, setBoardWidth] = useState(0);
  const [scaleWidth, setScaleWidth] = useState(0);

  // editing mode
  const [editMode, setEditMode] = useState<EditMode>(EditMoveMode.Move);

  // comment
  const [comment, setComment] = useState(gnc.comment);
  const handleCommentChange = (c: string) => {
    setComment(c);
    gnc.setComment(c);
    if (onSgfChange != null) onSgfChange(gnc.sgf);
  };

  // game name
  const [gameName, setGameName] = useState(gnc.gameName);
  const handleGameNameChange = useCallback((newValue: string) => {
    setGameName(newValue);
    gnc.setGameName(newValue);
    if (onSgfChange != null) onSgfChange(gnc.sgf);
  }, []);

  // black player
  const [blackPlayer, setBlackPlayer] = useState(gnc.blackPlayer);
  const handleBlackPlayerChange = useCallback((newValue: string) => {
    setBlackPlayer(newValue);
    gnc.setBlackPlayer(newValue);
    if (onSgfChange != null) onSgfChange(gnc.sgf);
  }, []);

  // white player
  const [whitePlayer, setWhitePlayer] = useState(gnc.whitePlayer);
  const handleWhitePlayerChange = useCallback((newValue: string) => {
    setWhitePlayer(newValue);
    gnc.setWhitePlayer(newValue);
    if (onSgfChange != null) onSgfChange(gnc.sgf);
  }, []);

  // scale change
  useEffect(() => {
    if (isScaleVisible) {
      const squareWidth = width / (gridNum + 3);
      setBoardWidth(squareWidth * (gridNum + 1));
      setScaleWidth(squareWidth);
    } else {
      setBoardWidth(width);
      setScaleWidth(0);
    }
  });

  // mount or unmount
  useEffect(() => {
    if (path != null) {
      gnc.playToPath(path);
    }
    setViewBoard(gnc.viewBoard);
    if (mode === Mode.EditFixedStones) {
      setEditMode(EditFixedStoneMode.Black);
    }
  }, []);

  const forward = (idx = 0) => {
    gnc.playForward(idx);
    setViewBoard(gnc.viewBoard);
    setComment(gnc.comment != null ? gnc.comment : "");
    if (onPathChange != null) onPathChange(gnc.currentPath);
  };
  const backward = () => {
    gnc.playBackward();
    setViewBoard(gnc.viewBoard);
    setComment(gnc.comment != null ? gnc.comment : "");
    if (onPathChange != null) onPathChange(gnc.currentPath);
  };
  const removeMove = () => {
    gnc.removeMove();
    setViewBoard(gnc.viewBoard);
    setComment(gnc.comment != null ? gnc.comment : "");
    if (onSgfChange != null) onSgfChange(gnc.sgf);
  };

  const handlePointClicked = (point: Point) => {
    switch (mode) {
      case Mode.View:
        if (viewBoard[point.x - 1][point.y - 1].color == null) {
          const nextOption = gnc.nextOptions.find((no) => {
            const { point: p } = no.move;
            return p != null && p.x === point.x && p.y === point.y;
          });
          if (nextOption != null) {
            forward(nextOption.idx);
          }
        }
        break;
      case Mode.EditMoves:
        switch (editMode) {
          case EditMoveMode.Move:
            if (viewBoard[point.x - 1][point.y - 1].color == null) {
              const nextOption = gnc.nextOptions.find((no) => {
                const { point: p } = no.move;
                return p != null && p.x === point.x && p.y === point.y;
              });
              if (nextOption != null) {
                forward(nextOption.idx);
              } else {
                gnc.addMove({ color: gnc.teban, point });
                forward(gnc.nextOptions.length - 1);
              }
            }
            break;
          case MarkupMode.Circle:
            if (viewBoard[point.x - 1][point.y - 1].circle) {
              gnc.removeCircle(point);
            } else gnc.setCircle(point);

            break;
          case MarkupMode.Square:
            if (viewBoard[point.x - 1][point.y - 1].square) {
              gnc.removeSquare(point);
            } else gnc.setSquare(point);

            break;
          case MarkupMode.Triangle:
            if (viewBoard[point.x - 1][point.y - 1].triangle) {
              gnc.removeTriangle(point);
            } else gnc.setTriangle(point);

            break;
          case MarkupMode.Cross:
            if (viewBoard[point.x - 1][point.y - 1].cross) {
              gnc.removeCross(point);
            } else gnc.setCross(point);

            break;
          case MarkupMode.Text:
            if (viewBoard[point.x - 1][point.y - 1].text) {
              gnc.removeText(point);
            } else gnc.setAlpha(point);

            break;
          case MarkupMode.Num:
            if (viewBoard[point.x - 1][point.y - 1].text) {
              gnc.removeText(point);
            } else gnc.setIncrement(point);

            break;
          default:
            break;
        }

        break;
      case Mode.EditFixedStones:
        switch (editMode) {
          case EditFixedStoneMode.Black:
            if (viewBoard[point.x - 1][point.y - 1].color == null) {
              gnc.addFixedStone({ color: Color.Black, point });
            } else if (
              viewBoard[point.x - 1][point.y - 1].color === Color.Black
            ) {
              gnc.removeFixedStone({ color: Color.Black, point });
            }
            break;
          case EditFixedStoneMode.White:
            if (viewBoard[point.x - 1][point.y - 1].color == null) {
              gnc.addFixedStone({ color: Color.White, point });
            } else if (
              viewBoard[point.x - 1][point.y - 1].color === Color.White
            ) {
              gnc.removeFixedStone({ color: Color.White, point });
            }
            break;
          case MarkupMode.Circle:
            if (viewBoard[point.x - 1][point.y - 1].circle) {
              gnc.removeCircle(point);
            } else gnc.setCircle(point);

            break;
          case MarkupMode.Square:
            if (viewBoard[point.x - 1][point.y - 1].square) {
              gnc.removeSquare(point);
            } else gnc.setSquare(point);

            break;
          case MarkupMode.Triangle:
            if (viewBoard[point.x - 1][point.y - 1].triangle) {
              gnc.removeTriangle(point);
            } else gnc.setTriangle(point);

            break;
          case MarkupMode.Cross:
            if (viewBoard[point.x - 1][point.y - 1].cross) {
              gnc.removeCross(point);
            } else gnc.setCross(point);

            break;
          case MarkupMode.Text:
            if (viewBoard[point.x - 1][point.y - 1].text) {
              gnc.removeText(point);
            } else gnc.setAlpha(point);

            break;
          case MarkupMode.Num:
            if (viewBoard[point.x - 1][point.y - 1].text) {
              gnc.removeText(point);
            } else gnc.setIncrement(point);

            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
    setViewBoard(gnc.viewBoard);
    if (onSgfChange != null) onSgfChange(gnc.sgf);
  };

  return (
    <div ref={ref}>
      <div
        style={{
          textAlign: "center",
          height: `${width / 9}px`,
          marginBottom: `${width / 18}px`,
          position: "relative",
        }}
      >
        <FontAwesomeIcon
          icon={faInfoCircle}
          style={{
            fontSize: `${width / 9}px`,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
          onClick={() => setIsGameInfoVisible(!isGameInfoVisible)}
        />

        {mode === Mode.EditMoves && (
          <div
            style={{
              position: "absolute",
              top: "40%",
              right: "0",
            }}
          >
            <ICircleButton
              width={width / 15}
              border={width / 150}
              style={{ marginRight: `${width / 30}px` }}
            >
              <FontAwesomeIcon icon={faImage} />
            </ICircleButton>
            <ICircleButton width={width / 15} border={width / 150}>
              <FontAwesomeIcon icon={faCut} />
            </ICircleButton>
          </div>
        )}
      </div>

      <div
        className="board-container"
        style={{
          height: `${width}px`,
          position: "relative",
        }}
      >
        <StyledBoard
          width={boardWidth}
          sideWidth={boardWidth}
          viewBoard={viewBoard}
          startPoint={startPoint}
          sideNum={sideNum}
          onClickPoint={handlePointClicked}
        />

        {isGameInfoVisible && (
          <StyledGameInfoOverlay
            width={boardWidth}
            height={boardWidth}
            gameName={gameName || ""}
            onGameNameChange={handleGameNameChange}
            blackPlayer={blackPlayer || ""}
            onBlackPlayerChange={handleBlackPlayerChange}
            whitePlayer={whitePlayer || ""}
            onWhitePlayerChange={handleWhitePlayerChange}
            isEditable={
              mode === Mode.EditFixedStones || mode === Mode.EditMoves
            }
          />
        )}
      </div>

      <div
        style={{
          padding: `${width / 40}px 0`,
        }}
      >
        <textarea
          disabled={!(mode === Mode.EditMoves || mode === Mode.EditFixedStones)}
          style={{
            width: "100%",
            height: `${width / 7}px`,
            boxSizing: "border-box",
            padding: 0,
            margin: 0,
          }}
          maxLength={200}
          value={comment}
          onInput={(e: ChangeEvent<HTMLTextAreaElement>) =>
            handleCommentChange(e.target.value)
          }
        />
      </div>

      <div
        className="operation-container"
        style={{
          height: `${width / 8}px`,
          position: "relative",
        }}
      >
        {mode === Mode.EditFixedStones && (
          <>
            {/* <p style={{ margin: 0, fontSize: `${width / 25}px` }}>
              置石をセットしてください
            </p> */}

            <FlatSimpleButton
              style={{ fontSize: `${width / 30}px` }}
              onClick={() => {
                setMode(Mode.EditMoves);
                setEditMode(EditMode.Move);
              }}
            >
              置石を終了して手順に進む <FontAwesomeIcon icon={faCaretRight} />
            </FlatSimpleButton>

            <div
              style={{
                position: "absolute",
                top: "0",
                right: "0",
              }}
            >
              <p style={{ margin: 0, lineHeight: 0 }}>
                <EditModeButton
                  width={width / 20}
                  border={width / 150}
                  isActive={editMode === EditFixedStoneMode.Black}
                  onClick={() => setEditMode(EditFixedStoneMode.Black)}
                >
                  <FontAwesomeIcon icon={faFillCircle} color="black" />
                </EditModeButton>
                <EditModeButton
                  width={width / 20}
                  border={width / 150}
                  isActive={editMode === EditFixedStoneMode.White}
                  onClick={() => setEditMode(EditFixedStoneMode.White)}
                >
                  <FontAwesomeIcon icon={faFillCircle} color="white" />
                </EditModeButton>
                <EditModeButton
                  width={width / 20}
                  border={width / 150}
                  isActive={editMode === MarkupMode.Square}
                  onClick={() => setEditMode(MarkupMode.Square)}
                >
                  <FontAwesomeIcon icon={faSquare} />
                </EditModeButton>
                <EditModeButton
                  width={width / 20}
                  border={width / 150}
                  isActive={editMode === MarkupMode.Circle}
                  onClick={() => setEditMode(MarkupMode.Circle)}
                >
                  <FontAwesomeIcon icon={faCircle} />
                </EditModeButton>
              </p>
              <p style={{ margin: 0, lineHeight: 0 }}>
                <EditModeButton
                  width={width / 20}
                  border={width / 150}
                  isActive={editMode === MarkupMode.Triangle}
                  onClick={() => setEditMode(MarkupMode.Triangle)}
                >
                  <FontAwesomeIcon icon={faCaretUp} />
                </EditModeButton>
                <EditModeButton
                  width={width / 20}
                  border={width / 150}
                  isActive={editMode === MarkupMode.Cross}
                  onClick={() => setEditMode(MarkupMode.Cross)}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </EditModeButton>
                <EditModeButton
                  width={width / 20}
                  border={width / 150}
                  isActive={editMode === MarkupMode.Text}
                  onClick={() => setEditMode(MarkupMode.Text)}
                >
                  <FontAwesomeIcon icon={faFont} />
                </EditModeButton>
                <EditModeButton
                  width={width / 20}
                  border={width / 150}
                  isActive={editMode === MarkupMode.Num}
                  onClick={() => setEditMode(MarkupMode.Num)}
                >
                  <FontAwesomeIcon icon={faSortNumericDown} />
                </EditModeButton>
              </p>
            </div>
          </>
        )}

        {mode === Mode.EditMoves && (
          <OperateIcon
            icon={faUndo}
            left={width / 18}
            fontSize={boardWidth / 11}
            isactive={(!gnc.existsNextMove()).toString()}
            onClick={() => !gnc.existsNextMove() && removeMove()}
          />
        )}

        {(mode === Mode.View || mode === Mode.EditMoves) && (
          <>
            <OperateIcon
              icon={faPlay}
              rotation={180}
              left={width / 2 - width / 10 - width / 40}
              fontSize={boardWidth / 9}
              isactive={gnc.existsBackMove().toString()}
              onClick={() => gnc.existsBackMove() && backward()}
            />
            <OperateIcon
              icon={faPlay}
              isactive={gnc.existsNextMove().toString()}
              left={boardWidth / 2 + boardWidth / 30}
              fontSize={boardWidth / 9}
              onClick={() => gnc.existsNextMove() && forward(0)}
            />
          </>
        )}

        {mode === Mode.EditMoves && (
          <div
            style={{
              position: "absolute",
              top: "0",
              right: "0",
            }}
          >
            <p style={{ margin: 0, lineHeight: 0 }}>
              <EditModeButton
                width={width / 20}
                border={width / 150}
                isActive={editMode === EditMoveMode.Move}
                onClick={() => setEditMode(EditMoveMode.Move)}
              >
                <FontAwesomeIcon icon={faHandPointUp} />
              </EditModeButton>
              {/* <EditModeButton
                width={width / 20}
                isActive={editMode === EditMoveMode.Pass}
                onClick={() => setEditMode(EditMoveMode.Pass)}
              >
                <FontAwesomeIcon icon={faHandPaper} />
              </EditModeButton> */}
              <EditModeButton
                width={width / 20}
                border={width / 150}
                isActive={editMode === MarkupMode.Square}
                onClick={() => setEditMode(MarkupMode.Square)}
              >
                <FontAwesomeIcon icon={faSquare} />
              </EditModeButton>
              <EditModeButton
                width={width / 20}
                border={width / 150}
                isActive={editMode === MarkupMode.Circle}
                onClick={() => setEditMode(MarkupMode.Circle)}
              >
                <FontAwesomeIcon icon={faCircle} />
              </EditModeButton>
            </p>
            <p style={{ margin: 0, lineHeight: 0 }}>
              <EditModeButton
                width={width / 20}
                border={width / 150}
                isActive={editMode === MarkupMode.Triangle}
                onClick={() => setEditMode(MarkupMode.Triangle)}
              >
                <FontAwesomeIcon icon={faCaretUp} />
              </EditModeButton>
              <EditModeButton
                width={width / 20}
                border={width / 150}
                isActive={editMode === MarkupMode.Cross}
                onClick={() => setEditMode(MarkupMode.Cross)}
              >
                <FontAwesomeIcon icon={faTimes} />
              </EditModeButton>
              <EditModeButton
                width={width / 20}
                border={width / 150}
                isActive={editMode === MarkupMode.Text}
                onClick={() => setEditMode(MarkupMode.Text)}
              >
                <FontAwesomeIcon icon={faFont} />
              </EditModeButton>
              <EditModeButton
                width={width / 20}
                border={width / 150}
                isActive={editMode === MarkupMode.Num}
                onClick={() => setEditMode(MarkupMode.Num)}
              >
                <FontAwesomeIcon icon={faSortNumericDown} />
              </EditModeButton>
            </p>
          </div>
        )}
      </div>

      {/* <button type="button" onClick={() => setIsScaleVisible(!isScaleVisible)}>
        scale
      </button>

      <button type="button" onClick={() => console.log(gnc.sgf)}>
        sgf
      </button> */}
    </div>
  );
};
