import React, { FC, useState, useEffect, useRef } from "react";
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
  Usage,
} from "../types";
import { useGennanCore } from "../hooks";
import { PresenterWide } from "./PresentaterWide";
import { Presenter } from "./Presenter";
import { parseGennanCodeToParams } from "../utils/gennanCode/parser";
import { stringifyGennanCode } from "../utils/gennanCode/stringifier";
import { downloadTextFile } from "../utils/utils";
import { useDownloadableSVGRef } from "../hooks/useDownloadableSVGRef";

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
//   fulcrumPoint?: Point;
// };
// export type Props = Others & RequireOne<Options>;

export type Props = {
  sgf?: string;
  gridNum?: GridNum;
  usage?: Usage;
  initPath?: Array<number>;
  onSgfChange?: (sgf: string) => void;
  onPathChange?: (path: TreePath) => void;
  onSideCountChanged?: (sc: number) => void;
  onFulcrumPointChanged?: (p: Point) => void;
  lang?: "ja" | "en";
  sideCount?: number;
  fulcrumPoint?: Point;
  gennanCode?: string;
  onGennanCodeChanged?: (gncd: string) => void;
};

export type EditModeInfo = {
  em: EditMode;
  isActive: boolean;
  onClick: () => void;
};

export const Container: FC<Props> = ({
  lang = "ja",
  usage = "view",
  sgf: s,
  gridNum: gn = 19,
  initPath: ip,
  onSgfChange,
  onPathChange,
  onSideCountChanged,
  onFulcrumPointChanged,
  fulcrumPoint: fp = { x: 1, y: 1 },
  sideCount: sc,
  gennanCode,
  onGennanCodeChanged,
}: Props) => {
  // console.log("Gennan is rendering!");

  // gennanCodeが与えられていたらそちらを優先する
  let sgf = s;
  let initPath = ip;
  let sideC = sc;
  let fulcrumP = fp;
  if (gennanCode) {
    const params = parseGennanCodeToParams(gennanCode);
    if (params.sgf != null) sgf = params.sgf;
    if (params.initPath != null) initPath = params.initPath;
    if (params.sideCount != null) sideC = params.sideCount;
    if (params.fulcrumPoint != null) fulcrumP = params.fulcrumPoint;
  }

  const initGnc = sgf ? GennanCore.createFromSgf(sgf) : GennanCore.create(gn);

  if (initPath != null) initGnc.setFromInitPath(initPath);
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
      setGameDate,
      setGameResult,
      setKomi,
      setComment,
      setBlackPlayer,
      setWhitePlayer,
      takeSnapshot,
      importSgf,
    },
  ] = useGennanCore({
    initGnc,
    onSgfChange,
    onPathChange,
  });

  const [mode, setMode] = useState<Mode>(Mode.View);
  const [editMode, setEditMode] = useState<EditMode>(EditMoveMode.Move);

  // 拡大用パラメータ
  // 始点から得られる最大の正方形 or 始点から与えられた幅の正方形
  const [fulcrumPoint, setFulcrumPoint] = useState(fulcrumP);
  const minSide = Math.min(
    gnc.viewBoard.length - fulcrumPoint.x + 1,
    gnc.viewBoard.length - fulcrumPoint.y + 1
  );
  const sCount = sideC || gnc.viewBoard.length;
  const [sideNum, setSideNum] = useState(minSide >= sCount ? sCount : minSide);

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
          case EditMoveMode.BlackMove:
            if (gnc.viewBoard[point.x - 1][point.y - 1].color == null) {
              const nextOption = gnc.nextMoveOptions.find((no) => {
                const { point: p } = no.move;
                return p != null && p.x === point.x && p.y === point.y;
              });
              if (nextOption != null) {
                forward(nextOption.idx);
              } else {
                addMove({ color: Color.Black, point });
              }
            }
            break;
          case EditMoveMode.WhiteMove:
            if (gnc.viewBoard[point.x - 1][point.y - 1].color == null) {
              const nextOption = gnc.nextMoveOptions.find((no) => {
                const { point: p } = no.move;
                return p != null && p.x === point.x && p.y === point.y;
              });
              if (nextOption != null) {
                forward(nextOption.idx);
              } else {
                addMove({ color: Color.White, point });
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
  if (onGennanCodeChanged != null) {
    useEffect(() => {
      onGennanCodeChanged(
        stringifyGennanCode({
          gnc,
          sideCount: sideNum,
          fulcrumPoint,
        })
      );
    }, [gnc]);
  }

  const [isScaleVisible, setIsScaleVisible] = useState(false);
  const toggleIsScaleVisible = () => setIsScaleVisible(!isScaleVisible);

  const onTakeSnapshot = () => {
    takeSnapshot();
    setMode(Mode.EditFixedStones);
    setEditMode(EditFixedStoneMode.Black);
  };

  const onDownloadSgf = () => downloadTextFile(gnc.gameName + ".sgf", gnc.sgf);

  const {
    ref: svgBoardRef,
    download: downloadBoardImg,
  } = useDownloadableSVGRef();
  const downloadBoardImage = async () => {
    await downloadBoardImg(gnc.gameName ? gnc.gameName : "image" + ".png");
  };

  // render
  if (usage === "viewWide") {
    return (
      <PresenterWide
        isScaleVisible={isScaleVisible}
        toggleIsScaleVisible={toggleIsScaleVisible}
        viewBoard={gnc.viewBoard}
        handlePointClicked={handlePointClicked}
        gameName={gnc.gameName}
        gameDate={gnc.gameDate}
        gameResult={gnc.gameResult}
        komi={gnc.komi}
        blackPlayer={gnc.blackPlayer}
        whitePlayer={gnc.whitePlayer}
        comment={gnc.comment}
        onPlayIconClicked={() => gnc.existsNextMove() && forward(0)}
        onTurnedPlayIconClicked={() => gnc.existsBackMove() && backward()}
        isPlayIconActive={gnc.existsNextMove()}
        isTurnedPlayIconActive={gnc.existsBackMove()}
        sideNum={sideNum}
        fulcrumPoint={fulcrumPoint}
        downloadSgf={onDownloadSgf}
        svgBoardRef={svgBoardRef}
        downloadBoardImage={downloadBoardImage}
      />
    );
  } else {
    const [isPreviewing, setIsPreviewing] = useState(false);
    const [rangeSideNum, setRangeSideNum] = useState(sideNum);
    const [rangeFulcrumPoint, setRangeFulcrumPoint] = useState(fulcrumPoint);
    const [originalMode, setOriginalMode] = useState(mode);
    const [originalSideNum, setOriginlSideNum] = useState(sideNum);
    const [originalFulcrumPoint, setOriginalFulcrumPoint] = useState(
      fulcrumPoint
    );
    const startSelectMagnification = () => {
      if (mode === Mode.EditMagnification) return;

      setOriginalMode(mode);
      setOriginlSideNum(sideNum);
      setOriginalFulcrumPoint(fulcrumPoint);
      setRangeSideNum(sideNum);
      setRangeFulcrumPoint(fulcrumPoint);

      setSideNum(gnc.viewBoard.length);
      setFulcrumPoint({ x: 1, y: 1 });
      setMode(Mode.EditMagnification);
    };
    const confirmMagnification = () => {
      setSideNum(rangeSideNum);
      setFulcrumPoint(rangeFulcrumPoint);
      setMode(originalMode);
      setIsPreviewing(false);

      // コールバックを呼び出す
      if (onSideCountChanged) onSideCountChanged(sideNum);
      if (onFulcrumPointChanged) onFulcrumPointChanged(fulcrumPoint);
      if (onGennanCodeChanged)
        onGennanCodeChanged(
          stringifyGennanCode({
            gnc,
            sideCount: sideNum,
            fulcrumPoint,
          })
        );
    };
    const cancelSelectMagnification = () => {
      setMode(originalMode);
      setSideNum(originalSideNum);
      setFulcrumPoint(originalFulcrumPoint);
    };
    const previewMagnification = () => {
      setSideNum(rangeSideNum);
      setFulcrumPoint(rangeFulcrumPoint);
      setIsPreviewing(true);
    };
    const cancelPreviewMagnification = () => {
      setSideNum(gnc.viewBoard.length);
      setFulcrumPoint({ x: 1, y: 1 });
      setIsPreviewing(false);
    };

    return (
      <>
        <Presenter
          isScaleVisible={isScaleVisible}
          toggleIsScaleVisible={toggleIsScaleVisible}
          mode={mode}
          editModeInfos={editModeInfos}
          viewBoard={gnc.viewBoard}
          gameName={gnc.gameName}
          gameDate={gnc.gameDate}
          gameResult={gnc.gameResult}
          komi={gnc.komi}
          blackPlayer={gnc.blackPlayer}
          whitePlayer={gnc.whitePlayer}
          comment={gnc.comment}
          isUndoIconActive={!gnc.existsNextMove()}
          isPlayIconActive={gnc.existsNextMove()}
          isTurnedPlayIconActive={gnc.existsBackMove()}
          sideNum={sideNum}
          fulcrumPoint={fulcrumPoint}
          handleCommentChange={setComment}
          handleGameNameChange={setGameName}
          handleGameDateChange={setGameDate}
          handleGameResultChange={setGameResult}
          handleKomiChange={setKomi}
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
          startSelectMagnification={startSelectMagnification}
          cancelSelectMagnification={cancelSelectMagnification}
          rangeSideNum={rangeSideNum}
          setRangeSideNum={setRangeSideNum}
          rangeFulcrumPoint={rangeFulcrumPoint}
          setRangeFulcrumPoint={setRangeFulcrumPoint}
          previewMagnification={previewMagnification}
          cancelPreviewMagnification={cancelPreviewMagnification}
          isPreviewing={isPreviewing}
          confirmMagnification={confirmMagnification}
          takeSnapshot={onTakeSnapshot}
          downloadSgf={onDownloadSgf}
          importSgf={importSgf}
          svgBoardRef={svgBoardRef}
          downloadBoardImage={downloadBoardImage}
        />
      </>
    );
  }
};
