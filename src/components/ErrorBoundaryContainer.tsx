import React, { FC, useEffect, useRef, useState } from "react";
import { Container, Props as ContainerProps } from "./Container";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  // mount or unmount
  useEffect(() => {
    if (ref.current != null) setWidth(ref.current.offsetWidth);
  }, []);

  return (
    <div
      role="alert"
      ref={ref}
      style={
        width
          ? {
              width: width + "px",
              height: width + "px",
              backgroundColor: "#f5be7e",
              padding: "10px",
            }
          : {}
      }
    >
      <p style={{ fontSize: "0.8rem", overflow: "hidden" }}>
        Something went wrong:
      </p>
      <p style={{ fontSize: "0.8rem", overflow: "hidden" }}>{error.message}</p>
      {/* <button onClick={resetErrorBoundary}>Try again</button> */}
    </div>
  );
}

export const ErrorBoundaryContainer: FC<ContainerProps> = (
  props: ContainerProps
) => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // reset the state of your app so the error doesn't happen again
      }}
    >
      <Container {...props} />
    </ErrorBoundary>
  );
};
