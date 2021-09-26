import mapObj from "map-obj";

export const compile = (rule) => {
  let bytecode = "__0__";
  let step = 0;

  mapObj(
    rule,
    (key, val) => {
      if (operatorToRuntime[key]) {
        let nextStep = step;
        const arity = calcOperatorArity(key, val);
        bytecode = bytecode.replace(
          `__${step}__`,
          [...Array(arity).keys()]
            .map(
              (idx) =>
                `(${
                  isObject(val[idx])
                    ? `__${++nextStep}__`
                    : JSON.stringify(val[idx])
                })`
            )
            .join(` ${operatorToRuntime[key]} `)
        );
      }

      step += 1;
      return [key, val];
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
};

const operatorArity = {
  or: 0,
  and: 0,
  "+": 0,
  "-": 0,
  "*": 0,
  "/": 0,
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
