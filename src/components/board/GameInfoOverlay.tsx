import React, { FC, useCallback, memo } from "react";

type InputProps = {
  defaultValue: string;
  onChange?: (s: string) => void;
  disabled: boolean;
  [x: string]: any;
};

const Input: FC<InputProps> = memo(
  ({ onChange, defaultValue, disabled, ...props }: InputProps) => {
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange && onChange(e.target.value);
      },
      []
    );

    return (
      <input
        style={{ width: "100%", margin: "10px auto" }}
        defaultValue={defaultValue}
        onChange={handleChange}
        disabled={disabled}
        {...props}
      />
    );
  }
);

type Props = {
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

export const GameInfoOverlay: FC<Props> = memo(
  ({
    gameName,
    onGameNameChange,
    gameDate,
    onGameDateChange,
    gameResult,
    onGameResultChange,
    komi,
    onKomiChange,
    blackPlayer,
    onBlackPlayerChange,
    whitePlayer,
    onWhitePlayerChange,
    isEditable = false,
  }: Props) => {
    return (
      <div
        style={{
          background: "rgba(0, 0, 0, 0.5)",
          width: "100%",
          height: "100%",
        }}
      >
        <div
          style={{
            width: "80%",
            height: "100%",
            overflowY: "scroll",
            margin: "0 auto",
          }}
        >
          <form style={{ margin: "0 auto", textAlign: "center" }}>
            <label style={{ color: "white" }}>Game name</label>
            <Input
              defaultValue={gameName}
              onChange={onGameNameChange}
              disabled={!isEditable}
              placeholder={isEditable ? "Ear-reddening game" : undefined}
            />
            <label style={{ color: "white" }}>Game date</label>
            <Input
              defaultValue={gameDate}
              onChange={onGameDateChange}
              disabled={!isEditable}
              placeholder={isEditable ? "1846-09-11" : undefined}
            />

            <label style={{ color: "white" }}>Black player</label>
            <Input
              defaultValue={blackPlayer}
              onChange={onBlackPlayerChange}
              disabled={!isEditable}
              placeholder={isEditable ? "Honinbo Shusaku" : undefined}
            />
            <label style={{ color: "white" }}>White player</label>
            <Input
              defaultValue={whitePlayer}
              onChange={onWhitePlayerChange}
              disabled={!isEditable}
              placeholder={isEditable ? "Gennan Inseki" : undefined}
            />

            <label style={{ color: "white" }}>Komi</label>
            <Input
              defaultValue={komi}
              onChange={onKomiChange}
              disabled={!isEditable}
              placeholder={isEditable ? "0" : undefined}
            />

            <label style={{ color: "white" }}>Game result</label>
            <Input
              defaultValue={gameResult}
              onChange={onGameResultChange}
              disabled={!isEditable}
              placeholder={
                isEditable
                  ? "ex. B+2(Black win two points), W+R(White win by resignation)"
                  : undefined
              }
            />
          </form>
        </div>
      </div>
    );
  }
);
