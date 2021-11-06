# gennan

## Install
```sh
$ npm install gennan
```

## Usage
```js
import React, { useState } from 'react';
import { render } from 'react-dom';
import { Gennan } from 'gennan';

const Gennan = () => {
  const [gennanCode, setGennanCode] = useState('(;FF[4]SZ[19]CA[UTF-8]KM[6.5]),0,1:1,19')

  return (
    <Gennan
      usage="viewWide"
      gennanCode={gennanCode}
      onGennanCodeChanged={setGennanCode}
    />
  )
}

render(<Gennan />, document.getElementById("app"));
```

## Props
| Props            | Description                                             | Type                                        | Default |
|------------------|---------------------------------------------------------|---------------------------------------------|---------|
| sgf | Smart Go Format | string | |
| gridNum | board grid number | GridNum | 19 |
| gennanCode         | gennan code format                                              | string               |         | |
| usage | usage | Usage | "view" |
| initPath | initial path of the game | TreePath | |
| onSgfChange | callback when sgf changed | (sgf: string) => void | |
| onPathChange | callback when current path changed | (path: TreePath) => void | |
| onSideCountChanged | callback when board size changed | (sc: number) => void | |
| onGennanCodeChanged | callback when current gennan code changed                | (gncd: string) => void                                            |    | |
| onFulcrumPointChanged | callback when fulcrum point changed | (p: Point) => void | |
| sideCount | for display scale | number | |
| fulcrumPoint | for display scale | Point | { x: 1, y: 1 } |
