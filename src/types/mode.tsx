const Mode = {
  View: "View",
  // ViewWide: "ViewWide",
  EditFixedStones: "EditFixedStones",
  EditMoves: "EditMoves",
  EditMagnification: "EditMagnification",
} as const;
type Mode = typeof Mode[keyof typeof Mode];

export { Mode };
