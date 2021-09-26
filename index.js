import mapObj from "map-obj";

export const compile = (rule) => {
  let bytecode = "__0__";
  let step = 0;

  mapObj(
    rule,
    (op, val) => {
      if (operatorToRuntime[op]) {
        let nextStep = step;
        const arity = calcOperatorArity(op, val);
        const bytecodePart = [...Array(arity).keys()]
          .map(
            (idx) =>
              `(${
                isObject(val[idx])
                  ? `__${++nextStep}__`
                  : JSON.stringify(val[idx])
              })`
          )
          .join(` ${operatorToRuntime[op]} `);
        bytecode = bytecode.replace(
          `__${step}__`,
          arity === 1 ? `${operatorToRuntime[op]}${bytecodePart}` : bytecodePart
        );
      }

      step += 1;
      return [op, val];
    },
    { deep: true }
  );

  const fn = new Function("data", `return ${bytecode}`);
  fn.bytecode = bytecode;
  return fn;
};

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
};
