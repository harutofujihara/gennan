# gennan

### [Demo](https://harutofujihara.github.io/gennan/)

## Install
```sh
$ npm install gennan
```
or
```sh
$ yarn add gennan
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
| gennanCode         | key binds                                               | string               |         |
| onGennanCodeChanged | class name to be applied to preview area                | (gncd: string) => void                                            |    |
| usage  | morphdom callbacks to be applied to preview area        | "viewWide" \| "view" \| "new" \| "edit"                    |       |
