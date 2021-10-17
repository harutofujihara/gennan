import { FC, ReactNode } from "react";
declare type ContentProps = {
    children?: ReactNode;
    style?: {};
};
declare const BoardContent: FC<ContentProps>;
declare type ContainerProps = {
    widthPx: number;
    className?: string;
    children?: ReactNode;
};
declare const BoardContainer: FC<ContainerProps>;
export { BoardContent, BoardContainer };
