import React, { FC, useCallback, memo } from "react";
import styled from "styled-components";

interface StyleProps {
  height: number;
}
const Container = styled.div`
  background: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
`;

const FormWrapper = styled.div`
  width: 80%;
  height: 100px;
  overflow-y: scroll;
  margin: 0 auto;
  height: ${(p: StyleProps) => `${p.height}px`};
`;
const Form = styled.form`
  margin: 0 auto;
  text-align: center;
`;

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
  className?: string;
  height: number;
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
    className,
    height,
    gameName,
    onGameNameChange,
    blackPlayer,
    onBlackPlayerChange,
    whitePlayer,
    onWhitePlayerChange,
    isEditable,
  }: Props) => {
    return (
      <Container className={className}>
        <FormWrapper height={height}>
          <Form>
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
          </Form>
        </FormWrapper>
      </Container>
    );
  }
);
