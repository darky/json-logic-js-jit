import mapObj from "map-obj";

export const compile = (rule) => {
  let bytecode = "__0__";
  let step = 0;

  mapObj(
    rule,
    (op, val) => {
      if (operatorToRuntime[op] || userOperations[op]) {
        let nextStep = step;
        const arity = calcOperatorArity(op, val);
        const bytecodeParts = [...Array(arity).keys()].map(
          (idx) =>
            `(${
              isObject(val[idx])
                ? `__${++nextStep}__`
                : JSON.stringify(val[idx])
            })`
        );

        bytecode = bytecode.replace(
          `__${step}__`,
          operatorToRuntime[op]
            ? arity === 1
              ? `${operatorToRuntime[op]}${bytecodeParts.join()}`
              : bytecodeParts.join(` ${operatorToRuntime[op]} `)
            : `userOperations["${op}"](${bytecodeParts
                .concat("data")
                .join(", ")})`
        );
      }

      step += 1;
      return [op, val];
    },
    { deep: true }
  );

  const fn = new Function("userOperations", "data", `return ${bytecode}`).bind(
    null,
    userOperations
  );
  fn.bytecode = bytecode;
  return fn;
};

export const addOperation = (name, fn) => {
  userOperations[name] = fn;
};

const userOperations = {};

const isObject = (value) => {
  return value != null && typeof value === "object";
};

const operatorToRuntime = {
  or: "||",
  and: "&&",
  ">": ">",
  "<": "<",
  ">=": ">=",
  "<=": "<=",
  "==": "==",
  "===": "===",
  "!=": "!=",
  "!==": "!==",
  "+": "+",
  "-": "-",
  "*": "*",
  "/": "/",
  "%": "%",
  "!": "!",
  "!!": "!!",
};

const operatorArity = {
  or: 0,
  and: 0,
  "+": 0,
  "-": 0,
  "*": 0,
  "/": 0,
  "!": 1,
  "!!": 1,
  "%": 2,
  ">": 2,
  "<": 2,
  ">=": 2,
  "<=": 2,
  "==": 2,
  "===": 2,
  "!=": 2,
  "!==": 2,
};

const calcOperatorArity = (operator = "", value = []) => {
  if (operatorArity[operator] > 0) {
    return operatorArity[operator];
  }
  if (operatorArity[operator] === 0) {
    return value.length;
  }
  if (userOperations[operator]) {
    return value.length;
  }
};
