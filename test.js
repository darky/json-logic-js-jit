import { test } from "uvu";
import { equal } from "uvu/assert";

import { compile } from "./index.js";

test("and", () => {
  const fn = compile({ and: [true, false] });
  equal(fn.bytecode, "(true) && (false)");
});

test("or", () => {
  const fn = compile({ or: [true, false] });
  equal(fn.bytecode, "(true) || (false)");
});

test(">", () => {
  const fn = compile({ ">": [2, 1] });
  equal(fn.bytecode, "(2) > (1)");
});

test("<", () => {
  const fn = compile({ "<": [1, 2] });
  equal(fn.bytecode, "(1) < (2)");
});

test(">=", () => {
  const fn = compile({ ">=": [2, 1] });
  equal(fn.bytecode, "(2) >= (1)");
});

test("<=", () => {
  const fn = compile({ "<=": [1, 2] });
  equal(fn.bytecode, "(1) <= (2)");
});

test("==", () => {
  const fn = compile({ "==": [2, 1] });
  equal(fn.bytecode, "(2) == (1)");
});

test("===", () => {
  const fn = compile({ "===": [2, 1] });
  equal(fn.bytecode, "(2) === (1)");
});

test("!=", () => {
  const fn = compile({ "!=": [2, 1] });
  equal(fn.bytecode, "(2) != (1)");
});

test("!==", () => {
  const fn = compile({ "!==": [2, 1] });
  equal(fn.bytecode, "(2) !== (1)");
});

test("+", () => {
  const fn = compile({ "+": [2, 1, 2] });
  equal(fn.bytecode, "(2) + (1) + (2)");
});

test("-", () => {
  const fn = compile({ "-": [2, 1, 2] });
  equal(fn.bytecode, "(2) - (1) - (2)");
});

test("-", () => {
  const fn = compile({ "*": [2, 1, 2] });
  equal(fn.bytecode, "(2) * (1) * (2)");
});

test("/", () => {
  const fn = compile({ "/": [2, 1, 2] });
  equal(fn.bytecode, "(2) / (1) / (2)");
});

test("complex arithmetic", () => {
  const fn = compile({ "+": [{ "/": [2, 1, 2] }, { "*": [1, 2] }] });
  equal(fn.bytecode, "((2) / (1) / (2)) + ((1) * (2))");
});

test("runtime check", () => {
  const fn = compile({ "<": [1, 2] });
  equal(fn(), true);
});

test("nested example", () => {
  const fn = compile({
    or: [{ and: [true, false] }, { or: [true, { and: [false, true] }] }],
  });
  equal(fn.bytecode, "((true) && (false)) || ((true) || ((false) && (true)))");
});

test("and with big arity", () => {
  const fn = compile({ and: [true, false, false, true] });
  equal(fn.bytecode, "(true) && (false) && (false) && (true)");
});

test("or with big arity", () => {
  const fn = compile({ or: [true, false, false, true] });
  equal(fn.bytecode, "(true) || (false) || (false) || (true)");
});

test("serialize string", () => {
  const fn = compile({ and: ["test1", "test2"] });
  equal(fn.bytecode, '("test1") && ("test2")');
});

test("serialize null", () => {
  const fn = compile({ and: [true, null] });
  equal(fn.bytecode, "(true) && (null)");
});

test("serialize undefined", () => {
  const fn = compile({ and: [true, void 0] });
  equal(fn.bytecode, "(true) && (undefined)");
});

test("serialize number", () => {
  const fn = compile({ ">": [3, 1] });
  equal(fn.bytecode, "(3) > (1)");
});

test("serialize boolean", () => {
  const fn = compile({ and: [true, false] });
  equal(fn.bytecode, "(true) && (false)");
});

test.run();
