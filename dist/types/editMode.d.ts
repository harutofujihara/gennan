declare const MarkupMode: {
    readonly Circle: "Circle";
    readonly Square: "Square";
    readonly Triangle: "Triangle";
    readonly Cross: "Cross";
    readonly Alpha: "Alpha";
    readonly Num: "Num";
};
declare const EditMoveMode: {
    readonly Move: "Move";
    readonly BlackMove: "BlackMove";
    readonly WhiteMove: "WhiteMove";
};
declare const EditFixedStoneMode: {
    readonly Black: "Black";
    readonly White: "White";
};
declare const EditMode: {
    readonly Black: "Black";
    readonly White: "White";
    readonly Move: "Move";
    readonly BlackMove: "BlackMove";
    readonly WhiteMove: "WhiteMove";
    readonly Circle: "Circle";
    readonly Square: "Square";
    readonly Triangle: "Triangle";
    readonly Cross: "Cross";
    readonly Alpha: "Alpha";
    readonly Num: "Num";
};
declare type EditMode = typeof EditMode[keyof typeof EditMode];
export { EditMode, MarkupMode, EditMoveMode, EditFixedStoneMode };
