import { FC } from "react";
declare type Props = {
    gameName: string;
    onGameNameChange?: (v: string) => void;
    gameDate: string;
    onGameDateChange?: (v: string) => void;
    gameResult: string;
    onGameResultChange?: (v: string) => void;
    komi: string;
    onKomiChange?: (v: string) => void;
    blackPlayer: string;
    onBlackPlayerChange?: (v: string) => void;
    whitePlayer: string;
    onWhitePlayerChange?: (v: string) => void;
    isEditable?: boolean;
};
export declare const GameInfoOverlay: FC<Props>;
export {};
