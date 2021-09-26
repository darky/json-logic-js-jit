# json-logic-js-jit

Another implementation of [JsonLogic](https://jsonlogic.com), which precompile JSON rules for high speed performance.

## Examples

#### Basic

```js
import { compile } from 'json-logic-js-jit';

const fn = compile({ "and" : [
  { ">" : [3,1] },
  { "<" : [1,3] }
]});

fn(); // true
```

#### Add operation

```js
import { compile, addOperation } from 'json-logic-js-jit';

addOperation("plus", (a, b) => a + b);

const fn = compile({ plus: [1, 2] });

fn(); // 3
```

#### Pass data 

```js
import { compile, addOperation } from 'json-logic-js-jit';

addOperation("var", (key, data) => data[key]);

const fn = compile({ var: ["fruit"] });

fn({ fruit: "apple" }); // "apple"
```

## Built-in operators

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

## Additional tools

https://github.com/darky/json-logic-js-jit-tools
