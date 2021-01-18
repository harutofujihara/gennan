import React, { FC, useState, useEffect } from "react";
import {
  GennanCore,
  Color,
  GridNum,
  Point,
  TreePath,
  MarkupSymbol,
} from "gennan-core";
import {
  RequireOne,
  Mode,
  EditMode,
  MarkupMode,
  EditMoveMode,
  EditFixedStoneMode,
} from "../types";
import { useGennan } from "../hooks";
import { PresenterWide } from "./PresentaterWide";
import { Presenter } from "./Presenter";

// for SSR
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

// type Options = {
//   sgf?: string;
//   gridNum?: GridNum;
// };
// type Others = {
//   usage?: "view" | "viewWide" | "new" | "edit";
//   path?: Array<number>;
//   onSgfChange?: (sgf: string) => void;
//   onPathChange?: (path: TreePath) => void;
//   lang?: "ja" | "en";
//   sideCount?: number;
//   startPoint?: Point;
// };
// export type Props = Others & RequireOne<Options>;

export type Props = {
  sgf?: string;
  gridNum?: GridNum;
  usage?: "view" | "viewWide" | "new" | "edit";
  path?: Array<number>;
  onSgfChange?: (sgf: string) => void;
  onPathChange?: (path: TreePath) => void;
  lang?: "ja" | "en";
  sideCount?: number;
  startPoint?: Point;
};

export type EditModeInfo = {
  em: EditMode;
  isActive: boolean;
  onClick: () => void;
};

export const Container: FC<Props> = ({
  lang = "ja",
  usage = "view",
  sgf,
  gridNum: gn = 19,
  path,
  onSgfChange,
  onPathChange,
  startPoint = { x: 1, y: 1 },
  sideCount,
}: Props) => {
  console.log("Gennan is rendering!");

  const initGnc = sgf ? GennanCore.createFromSgf(sgf) : GennanCore.create(gn);

  if (path != null) initGnc.playToPath(path);
  const [
    gnc,
    {
      forward,
      backward,
      addFixedStone,
      removeFixedStone,
      addMove,
      removeMove,
      setSymbol,
      removeSymbol,
      setAlpha,
      setIncrement,
      removeText,
      setGameName,
      setComment,
      setBlackPlayer,
      setWhitePlayer,
    },
  ] = useGennan({
    initGnc,
    onSgfChange,
    onPathChange,
  });

  const [mode, setMode] = useState<Mode>(Mode.View);
  const [editMode, setEditMode] = useState<EditMode>(EditMoveMode.Move);

  // 拡大用パラメータ
  // 始点から得られる最大の正方形 or 始点から与えられた幅の正方形
  const minSide = Math.min(
    gnc.viewBoard.length - startPoint.x + 1,
    gnc.viewBoard.length - startPoint.y + 1
  );
  const sCount = sideCount || gnc.viewBoard.length;
  const sideNum = minSide >= sCount ? sCount : minSide;

  // 編集モードの一覧と状態
  const editModeInfos: Array<EditModeInfo> = [];
  if (mode === Mode.EditFixedStones || mode === Mode.EditMoves) {
    if (mode === Mode.EditFixedStones) {
      for (const m in EditFixedStoneMode) {
        editModeInfos.push({
          em: m as EditMode,
          isActive: editMode === m,
          onClick: () => setEditMode(m as EditMode),
        });
      }
    } else {
      for (const m in EditMoveMode) {
        editModeInfos.push({
          em: m as EditMode,
          isActive: editMode === m,
          onClick: () => setEditMode(m as EditMode),
        });
      }
    }

    for (const m in MarkupMode) {
      editModeInfos.push({
        em: m as EditMode,
        isActive: editMode === m,
        onClick: () => setEditMode(m as EditMode),
      });
    }
  }

  const handlePointClicked = (point: Point) => {
    switch (mode) {
      case Mode.View:
        if (gnc.viewBoard[point.x - 1][point.y - 1].color == null) {
          const nextOption = gnc.nextMoveOptions.find((no) => {
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
          case EditFixedStoneMode.Black:
            if (gnc.viewBoard[point.x - 1][point.y - 1].color == null) {
              addFixedStone({ color: Color.Black, point });
            } else if (
              gnc.viewBoard[point.x - 1][point.y - 1].color === Color.Black
            ) {
              removeFixedStone({ color: Color.Black, point });
            }
            break;
          case EditFixedStoneMode.White:
            if (gnc.viewBoard[point.x - 1][point.y - 1].color == null) {
              addFixedStone({ color: Color.White, point });
            } else if (
              gnc.viewBoard[point.x - 1][point.y - 1].color === Color.White
            ) {
              removeFixedStone({ color: Color.White, point });
            }
            break;
          case EditMoveMode.Move:
            if (gnc.viewBoard[point.x - 1][point.y - 1].color == null) {
              const nextOption = gnc.nextMoveOptions.find((no) => {
                const { point: p } = no.move;
                return p != null && p.x === point.x && p.y === point.y;
              });
              if (nextOption != null) {
                forward(nextOption.idx);
              } else {
                addMove({ color: gnc.teban, point });
              }
            }
            break;
          case MarkupMode.Circle:
            if (gnc.viewBoard[point.x - 1][point.y - 1].circle) {
              removeSymbol(point, MarkupSymbol.Circle);
            } else setSymbol(point, MarkupSymbol.Circle);
            break;
          case MarkupMode.Square:
            if (gnc.viewBoard[point.x - 1][point.y - 1].square) {
              removeSymbol(point, MarkupSymbol.Square);
            } else setSymbol(point, MarkupSymbol.Square);
            break;
          case MarkupMode.Triangle:
            if (gnc.viewBoard[point.x - 1][point.y - 1].triangle) {
              removeSymbol(point, MarkupSymbol.Triangle);
            } else setSymbol(point, MarkupSymbol.Triangle);
            break;
          case MarkupMode.Cross:
            if (gnc.viewBoard[point.x - 1][point.y - 1].cross) {
              removeSymbol(point, MarkupSymbol.Cross);
            } else setSymbol(point, MarkupSymbol.Cross);
            break;
          case MarkupMode.Alpha:
            if (gnc.viewBoard[point.x - 1][point.y - 1].text) {
              removeText(point);
            } else setAlpha(point);
            break;
          case MarkupMode.Num:
            if (gnc.viewBoard[point.x - 1][point.y - 1].text) {
              removeText(point);
            } else setIncrement(point);
            break;
          default:
            break;
        }

        break;
      case Mode.EditFixedStones:
        switch (editMode) {
          case EditFixedStoneMode.Black:
            if (gnc.viewBoard[point.x - 1][point.y - 1].color == null) {
              addFixedStone({ color: Color.Black, point });
            } else if (
              gnc.viewBoard[point.x - 1][point.y - 1].color === Color.Black
            ) {
              removeFixedStone({ color: Color.Black, point });
            }
            break;
          case EditFixedStoneMode.White:
            if (gnc.viewBoard[point.x - 1][point.y - 1].color == null) {
              addFixedStone({ color: Color.White, point });
            } else if (
              gnc.viewBoard[point.x - 1][point.y - 1].color === Color.White
            ) {
              removeFixedStone({ color: Color.White, point });
            }
            break;
          case MarkupMode.Circle:
            if (gnc.viewBoard[point.x - 1][point.y - 1].circle) {
              removeSymbol(point, MarkupSymbol.Circle);
            } else setSymbol(point, MarkupSymbol.Circle);
            break;
          case MarkupMode.Square:
            if (gnc.viewBoard[point.x - 1][point.y - 1].square) {
              removeSymbol(point, MarkupSymbol.Square);
            } else setSymbol(point, MarkupSymbol.Square);
            break;
          case MarkupMode.Triangle:
            if (gnc.viewBoard[point.x - 1][point.y - 1].triangle) {
              removeSymbol(point, MarkupSymbol.Triangle);
            } else setSymbol(point, MarkupSymbol.Triangle);
            break;
          case MarkupMode.Cross:
            if (gnc.viewBoard[point.x - 1][point.y - 1].cross) {
              removeSymbol(point, MarkupSymbol.Cross);
            } else setSymbol(point, MarkupSymbol.Cross);
            break;
          case MarkupMode.Alpha:
            if (gnc.viewBoard[point.x - 1][point.y - 1].text) {
              removeText(point);
            } else setAlpha(point);
            break;
          case MarkupMode.Num:
            if (gnc.viewBoard[point.x - 1][point.y - 1].text) {
              removeText(point);
            } else setIncrement(point);
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
  };

  // mount or unmount
  useEffect(() => {
    switch (usage) {
      case "new":
        setMode(Mode.EditFixedStones);
        setEditMode(EditFixedStoneMode.Black);
        break;
      case "edit":
        setMode(Mode.EditMoves);
        break;
      default:
        break;
    }
  }, []);

  // render
  if (usage === "viewWide") {
    return (
      <PresenterWide
        viewBoard={gnc.viewBoard}
        handlePointClicked={handlePointClicked}
        gameName={gnc.gameName}
        blackPlayer={gnc.blackPlayer}
        whitePlayer={gnc.whitePlayer}
        comment={gnc.comment}
        onPlayIconClicked={() => gnc.existsNextMove() && forward(0)}
        onTurnedPlayIconClicked={() => gnc.existsBackMove() && backward()}
        isPlayIconActive={gnc.existsNextMove()}
        isTurnedPlayIconActive={gnc.existsBackMove()}
        sideNum={sideNum}
        startPoint={startPoint}
      />
    );
  } else {
    return (
      <Presenter
        mode={mode}
        editModeInfos={editModeInfos}
        viewBoard={gnc.viewBoard}
        gameName={gnc.gameName}
        blackPlayer={gnc.blackPlayer}
        whitePlayer={gnc.whitePlayer}
        comment={gnc.comment}
        isUndoIconActive={!gnc.existsNextMove()}
        isPlayIconActive={gnc.existsNextMove()}
        isTurnedPlayIconActive={gnc.existsBackMove()}
        sideNum={sideNum}
        startPoint={startPoint}
        handleCommentChange={setComment}
        handleGameNameChange={setGameName}
        handleBlackPlayerChange={setBlackPlayer}
        handleWhitePlayerChange={setWhitePlayer}
        onClickPoint={handlePointClicked}
        onClickUndoIcon={() => !gnc.existsNextMove() && removeMove()}
        onClickPlayIcon={() => gnc.existsNextMove() && forward(0)}
        onClickTurnedPlayIcon={() => gnc.existsBackMove() && backward()}
        onClickNextButton={() => {
          setMode(Mode.EditMoves);
          setEditMode(EditMoveMode.Move);
        }}
      />
    );
  }
};
