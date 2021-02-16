import React, { FC, useCallback, memo } from "react";
import styled from "styled-components";

const StyledInput = styled.input`
  width: 100%;
  margin 10px auto;
`;

type InputProps = {
  defaultValue: string;
  onChange: (s: string) => void;
  disabled: boolean;
};

const Input: FC<InputProps> = memo(
  ({ onChange, defaultValue, disabled }: InputProps) => {
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
      },
      []
    );

    return (
      <StyledInput
        defaultValue={defaultValue}
        onChange={handleChange}
        disabled={disabled}
      />
    );
  }
);

type Props = {
  gameName: string;
  onGameNameChange: (v: string) => void;
  blackPlayer: string;
  onBlackPlayerChange: (v: string) => void;
  whitePlayer: string;
  onWhitePlayerChange: (v: string) => void;
  isEditable: boolean;
};

export const GameInfoOverlay: FC<Props> = memo(
  ({
    gameName,
    onGameNameChange,
    blackPlayer,
    onBlackPlayerChange,
    whitePlayer,
    onWhitePlayerChange,
    isEditable,
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
            <label>
              対局名
              <Input
                defaultValue={gameName}
                onChange={onGameNameChange}
                disabled={!isEditable}
              />
            </label>
            <label>
              黒番
              <Input
                defaultValue={blackPlayer}
                onChange={onBlackPlayerChange}
                disabled={!isEditable}
              />
            </label>
            <label>
              白番
              <Input
                defaultValue={whitePlayer}
                onChange={onWhitePlayerChange}
                disabled={!isEditable}
              />
            </label>
          </form>
        </div>
      </div>
    );
  }
);
