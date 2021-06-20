import {
  TreePath,
  GennanCore,
  Point,
  Stone,
  Move,
  MarkupSymbol,
} from "gennan-core";
import { useEffect, useReducer } from "react";

type Args = {
  initGnc: GennanCore;
  onSgfChange?: (sgf: string) => void;
  onPathChange?: (path: TreePath) => void;
};

type Action =
  | { type: "FORWARD"; idx: number }
  | { type: "FORWARD_TIMES"; times: number }
  | { type: "BACKWARD" }
  | { type: "BACKWARD_TIMES"; times: number }
  | { type: "ADD_FIXED_STONE"; stone: Stone }
  | { type: "REMOVE_FIXED_STONE"; stone: Stone }
  | { type: "ADD_MOVE"; move: Move }
  | { type: "REMOVE_MOVE" }
  | { type: "SET_SYMBOL"; point: Point; symbol: MarkupSymbol }
  | { type: "REMOVE_SYMBOL"; point: Point; symbol: MarkupSymbol }
  | { type: "SET_ALPHA"; point: Point }
  | { type: "SET_INCREMENT"; point: Point }
  | { type: "REMOVE_TEXT"; point: Point }
  | { type: "SET_GAME_NAME"; gameName: string }
  | { type: "SET_COMMENT"; comment: string }
  | { type: "SET_BLACK_PLAYER"; blackPlayer: string }
  | { type: "SET_WHITE_PLAYER"; whitePlayer: string }
  | { type: "SET_GAME_DATE"; gameDate: string }
  | { type: "SET_GAME_RESULT"; gameResult: string }
  | { type: "SET_KOMI"; komi: string }
  | { type: "TAKE_SNAPSHOT" }
  | { type: "IMPORT_SGF"; sgf: string };

type Operation = {
  forward: (i: number) => void;
  forwardTimes: (times?: number) => void;
  backward: () => void;
  backwardTimes: (times?: number) => void;
  addFixedStone: (stone: Stone) => void;
  removeFixedStone: (stone: Stone) => void;
  addMove: (move: Move) => void;
  removeMove: () => void;
  setSymbol: (point: Point, symbol: MarkupSymbol) => void;
  removeSymbol: (point: Point, symbol: MarkupSymbol) => void;
  setAlpha: (point: Point) => void;
  setIncrement: (point: Point) => void;
  removeText: (point: Point) => void;
  setGameName: (gn: string) => void;
  setGameDate: (gd: string) => void;
  setGameResult: (re: string) => void;
  setKomi: (komi: string) => void;
  setComment: (comment: string) => void;
  setBlackPlayer: (bp: string) => void;
  setWhitePlayer: (wp: string) => void;
  takeSnapshot: () => void;
  importSgf: (sgf: string) => void;
};

const useGennanCore = ({
  initGnc,
  onSgfChange,
  onPathChange,
}: Args): [GennanCore, Operation] => {
  // reducer
  const reducer = (gnc: GennanCore, action: Action): GennanCore => {
    let cloned = gnc.clone(); // 関数を純粋に保つため、cloneしたインスタンスを操作する(reducerは2回実行され、操作が純粋でないとバグになる)

    switch (action.type) {
      case "FORWARD":
        cloned.playForward(action.idx);
        break;
      case "FORWARD_TIMES":
        cloned.playForwardTimes(action.times);
        break;
      case "BACKWARD":
        cloned.playBackward();
        break;
      case "BACKWARD_TIMES":
        cloned.playBackwardTimes(action.times);
        break;
      case "ADD_FIXED_STONE":
        cloned.addFixedStone(action.stone);
        break;
      case "REMOVE_FIXED_STONE":
        cloned.removeFixedStone(action.stone);
        break;
      case "ADD_MOVE":
        cloned.addMove(action.move);
        cloned.playForward(cloned.nextMoveOptions.length - 1);
        break;
      case "REMOVE_MOVE":
        cloned.removeMove();
        break;
      case "SET_SYMBOL":
        cloned.setSymbol(action.point, action.symbol);
        break;
      case "REMOVE_SYMBOL":
        cloned.removeSymbol(action.point, action.symbol);
        break;
      case "SET_ALPHA":
        cloned.setAlpha(action.point);
        break;
      case "SET_INCREMENT":
        cloned.setIncrement(action.point);
        break;
      case "REMOVE_TEXT":
        cloned.removeText(action.point);
        break;
      case "SET_GAME_NAME":
        cloned.setGameName(action.gameName);
        break;
      case "SET_GAME_DATE":
        cloned.setGameDate(action.gameDate);
        break;
      case "SET_GAME_RESULT":
        cloned.setGameResult(action.gameResult);
        break;
      case "SET_KOMI":
        cloned.setKomi(action.komi);
        break;
      case "SET_COMMENT":
        cloned.setComment(action.comment);
        break;
      case "SET_BLACK_PLAYER":
        cloned.setBlackPlayer(action.blackPlayer);
        break;
      case "SET_WHITE_PLAYER":
        cloned.setWhitePlayer(action.whitePlayer);
        break;
      case "TAKE_SNAPSHOT":
        cloned = GennanCore.createFromSgf(cloned.snapshotSgf);
        break;
      case "IMPORT_SGF":
        cloned = GennanCore.createFromSgf(action.sgf);
        break;
    }

    // if (onSgfChange != null && gnc.sgf !== cloned.sgf) {
    //   onSgfChange(cloned.sgf);
    // }
    // if (onPathChange != null && gnc.currentPath !== cloned.currentPath) {
    //   onPathChange(cloned.currentPath);
    // }

    return cloned;
  };

  const [gnc, dispatch] = useReducer(reducer, initGnc);

  if (onSgfChange != null) {
    useEffect(() => {
      onSgfChange(gnc.sgf);
    }, [gnc.sgf, onSgfChange]);
  }
  if (onPathChange != null) {
    useEffect(() => {
      onPathChange(gnc.currentPath);
    }, [gnc]);
  }

  // operation
  const forward = (idx: number = 0): void => {
    dispatch({ type: "FORWARD", idx });
  };
  const forwardTimes = (times: number = 10): void => {
    dispatch({ type: "FORWARD_TIMES", times });
  };
  const backward = (): void => {
    dispatch({ type: "BACKWARD" });
  };
  const backwardTimes = (times: number = 10): void => {
    dispatch({ type: "BACKWARD_TIMES", times });
  };

  // edit
  const addFixedStone = (stone: Stone) => {
    dispatch({ type: "ADD_FIXED_STONE", stone });
  };
  const removeFixedStone = (stone: Stone) => {
    dispatch({ type: "REMOVE_FIXED_STONE", stone });
  };
  const addMove = (move: Move): void => {
    dispatch({ type: "ADD_MOVE", move });
  };
  const removeMove = (): void => {
    dispatch({ type: "REMOVE_MOVE" });
  };
  const setSymbol = (point: Point, symbol: MarkupSymbol): void => {
    dispatch({ type: "SET_SYMBOL", point, symbol });
  };
  const removeSymbol = (point: Point, symbol: MarkupSymbol): void => {
    dispatch({ type: "REMOVE_SYMBOL", point, symbol });
  };
  const setAlpha = (point: Point) => {
    dispatch({ type: "SET_ALPHA", point });
  };
  const setIncrement = (point: Point) => {
    dispatch({ type: "SET_INCREMENT", point });
  };
  const removeText = (point: Point) => {
    dispatch({ type: "REMOVE_TEXT", point });
  };
  const setGameName = (gameName: string): void => {
    dispatch({ type: "SET_GAME_NAME", gameName });
  };
  const setGameDate = (gameDate: string): void => {
    dispatch({ type: "SET_GAME_DATE", gameDate });
  };
  const setGameResult = (gameResult: string): void => {
    dispatch({ type: "SET_GAME_RESULT", gameResult });
  };
  const setKomi = (komi: string): void => {
    dispatch({ type: "SET_KOMI", komi });
  };
  const setComment = (comment: string): void => {
    dispatch({ type: "SET_COMMENT", comment });
  };
  const setBlackPlayer = (blackPlayer: string): void => {
    dispatch({ type: "SET_BLACK_PLAYER", blackPlayer });
  };
  const setWhitePlayer = (whitePlayer: string): void => {
    dispatch({ type: "SET_WHITE_PLAYER", whitePlayer });
  };
  const takeSnapshot = (): void => {
    dispatch({ type: "TAKE_SNAPSHOT" });
  };
  const importSgf = (sgf: string): void => {
    dispatch({ type: "IMPORT_SGF", sgf });
  };

  return [
    gnc,
    {
      forward,
      forwardTimes,
      backward,
      backwardTimes,
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
  ];
};

export { useGennanCore };
