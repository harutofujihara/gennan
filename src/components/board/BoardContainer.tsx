import React, { FC, ReactNode } from "react";

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
