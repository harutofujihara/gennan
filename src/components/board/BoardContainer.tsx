import React, { FC, useEffect, useState, ReactNode, Children } from "react";
import { Color, Point, ViewBoard } from "gennan-core";
import { GameInfoOverlay } from "./GameInfoOverlay";
import { useDrag, useGesture } from "react-use-gesture";

const nums = [...Array(20)].map((_, i) => i + 1);
const alphas = "abcdefghijklmnopqrstuvwxyz"
  .split("")
  .map((s) => s.toUpperCase());

type Props = {
  withScale?: boolean;
  className?: string;
  width: number;
  viewBoard: ViewBoard;
  fulcrumPoint: Point;
  changeFulcrumPoint?: (p: Point) => void;
  sideNum: number;
  changeSideNum?: (sc: number) => void;
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

// export const BoardContainer: FC<Props> = ({
//   className,
//   withScale = false,
//   width,
//   viewBoard,
//   fulcrumPoint,
//   changeFulcrumPoint,
//   sideNum,
//   changeSideNum,
//   onClickPoint,
//   isOverlayVisible,
//   isGameInfoEditable,
//   gameName,
//   blackPlayer,
//   whitePlayer,
//   onGameNameChange = () => {},
//   onBlackPlayerChange = () => {},
//   onWhitePlayerChange = () => {},
// }: Props) => {
//   const oneSquareSidePx = width / (viewBoard.length + 1);
//   const boardWidthPx = withScale ? oneSquareSidePx * viewBoard.length : width;

//   const VerticalScale: JSX.Element = (
//     <>
//       {alphas.slice(0, viewBoard.length).map((a, i) => (
//         <span
//           key={i}
//           style={{
//             position: "absolute",
//             fontSize: oneSquareSidePx * 0.5 + "px",
//             top: (i + 1.5) * oneSquareSidePx + "px",
//             left: 0.5 * oneSquareSidePx + "px",
//             transform: "translate(-50%, -50%)",
//           }}
//         >
//           {a}
//         </span>
//       ))}
//     </>
//   );
//   const HorizontalScale: JSX.Element = (
//     <>
//       {nums.slice(0, viewBoard.length).map((a, i) => (
//         <span
//           key={i}
//           style={{
//             position: "absolute",
//             fontSize: oneSquareSidePx * 0.5 + "5px",
//             top: 0.5 * oneSquareSidePx + "px",
//             left: (i + 1.5) * oneSquareSidePx + "px",
//             transform: "translate(-50%, -50%)",
//           }}
//         >
//           {a}
//         </span>
//       ))}
//     </>
//   );

//   const [x, setX] = useState(0);
//   const [y, setY] = useState(0);

//   const [rangeCellNum, setRangeCellNum] = useState(viewBoard.length + 1);
//   const rangeGridPx = oneSquareSidePx * rangeCellNum;

//   useEffect(() => {
//     console.log(fulcrumPoint);
//     setX(oneSquareSidePx * fulcrumPoint.x);
//     setY(oneSquareSidePx * fulcrumPoint.y);
//   }, [fulcrumPoint]);
//   useEffect(() => {
//     setRangeCellNum(sideNum);
//   }, [sideNum]);

//   const bind = useDrag(
//     ({ down, offset: [ox, oy] }) => {
//       setX(ox);
//       setY(oy);
//     },
//     {
//       bounds: {
//         left: 0,
//         right: boardWidthPx - rangeGridPx,
//         top: 0,
//         bottom: boardWidthPx - rangeGridPx,
//       },
//     }
//   );

//   return (
//     <div
//       className={className}
//       style={{
//         width: `${width}px`,
//         height: `${width}px`,
//         position: "relative",
//       }}
//     >
//       {isOverlayVisible && (
//         <div
//           style={{
//             width: boardWidthPx + "px",
//             height: boardWidthPx + "px",
//             position: "absolute",
//             // top: "50%",
//             // left: "50%",
//             // transform: "translate(-50%, -50%)",
//             right: 0,
//             bottom: 0,
//             zIndex: 10,
//           }}
//         >
//           <GameInfoOverlay
//             height={boardWidthPx}
//             gameName={gameName}
//             blackPlayer={blackPlayer}
//             whitePlayer={whitePlayer}
//             onGameNameChange={onGameNameChange}
//             onBlackPlayerChange={onBlackPlayerChange}
//             onWhitePlayerChange={onWhitePlayerChange}
//             isEditable={isGameInfoEditable}
//           />
//         </div>
//       )}

//       {withScale && VerticalScale}
//       {withScale && HorizontalScale}

//       <div
//         style={{
//           width: boardWidthPx + "px",
//           height: boardWidthPx + "px",
//           position: "absolute",
//           right: 0,
//           bottom: 0,
//         }}
//       >
//         <Board
//           widthPx={boardWidthPx}
//           viewBoard={viewBoard}
//           // sideNum={sideNum}
//           // fulcrumPoint={fulcrumPoint}
//           fulcrumPoint={{ x: 1, y: 1 }}
//           sideNum={19}
//           onClickPoint={onClickPoint}
//         />
//       </div>

//       <div
//         style={{
//           width: boardWidthPx + "px",
//           height: boardWidthPx + "px",
//           position: "absolute",
//           zIndex: 20,
//         }}
//       >
//         <div
//           style={{
//             background: "rgba(0, 0, 0, 0.5)",
//             width: rangeGridPx + "px",
//             height: rangeGridPx + "px",
//             border: "2px dashed",
//             borderColor: "white",
//             position: "absolute",
//             left: x + "px",
//             top: y + "px",
//             boxSizing: "border-box",
//           }}
//           {...bind()}
//         >
//           <button onClick={() => setRangeCellNum(rangeCellNum + 1)}>
//             expand
//           </button>
//           <button onClick={() => setRangeCellNum(rangeCellNum - 1)}>
//             shrink
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

type ContentProps = {
  children?: ReactNode;
  style?: {};
};
const BoardContent: FC<ContentProps> = ({ children, style }) => {
  const defaultStyle = {
    width: "100%",
    height: "100%",
    position: "absolute" as "absolute",
  };
  const Style = { ...defaultStyle, ...style };
  return <div style={Style}>{children}</div>;
};

type ContainerProps = {
  widthPx: number;
  className?: string;
  children?: ReactNode;
};
const BoardContainer: FC<ContainerProps> = ({
  className,
  widthPx,
  children,
}) => {
  // console.log("");
  return (
    <div
      className={className}
      style={{
        width: `${widthPx}px`,
        height: `${widthPx}px`,
        position: "relative",
      }}
    >
      {children}
    </div>
  );
};

export { BoardContent, BoardContainer };
