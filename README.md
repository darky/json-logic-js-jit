# json-logic-js-jit

Another implementation of [JsonLogic](https://jsonlogic.com), which precompile JSON rules for high speed performance.

## Example

```js
import { compile } from 'json-logic-js-jit';

const fn = compile({ "and" : [
  { ">" : [3,1] },
  { "<" : [1,3] }
]});

fn(); // true
```

## Supported operators

* [x] and
* [x] or
* [x] >
* [x] <
* [x] >=
* [x] <=
* [x] ==
* [x] ===
* [x] !=
* [x] !==
* [x] !
* [x] !!
* [x] +
* [x] -
* [x] *
* [x] /
* [x] %
