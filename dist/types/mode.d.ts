declare const Mode: {
    readonly View: "View";
    readonly EditFixedStones: "EditFixedStones";
    readonly EditMoves: "EditMoves";
    readonly EditMagnification: "EditMagnification";
};
declare type Mode = typeof Mode[keyof typeof Mode];
export { Mode };
