const MarkupMode = {
  Circle: "Circle",
  Square: "Square",
  Triangle: "Triangle",
  Cross: "Cross",
  Alpha: "Alpha",
  Num: "Num",
} as const;

const EditMoveMode = {
  Move: "Move",
  BlackMove: "BlackMove",
  WhiteMove: "WhiteMove",
  // Pass: "Pass",
} as const;

const EditFixedStoneMode = {
  Black: "Black",
  White: "White",
} as const;

const EditMode = {
  ...MarkupMode,
  ...EditMoveMode,
  ...EditFixedStoneMode,
} as const;
type EditMode = typeof EditMode[keyof typeof EditMode];

export { EditMode, MarkupMode, EditMoveMode, EditFixedStoneMode };
