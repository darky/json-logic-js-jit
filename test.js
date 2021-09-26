import { test } from "uvu";
import { equal } from "uvu/assert";

import { compile } from "./index.js";

test("basic and", () => {
  const fn = compile({ and: [true, false] });
  equal(fn.bytecode, "(true) && (false)");
});

test("basic and", () => {
  const fn = compile({ or: [true, false] });
  equal(fn.bytecode, "(true) || (false)");
});

test("basic >", () => {
  const fn = compile({ ">": [2, 1] });
  equal(fn.bytecode, "(2) > (1)");
});

test("basic <", () => {
  const fn = compile({ "<": [1, 2] });
  equal(fn.bytecode, "(1) < (2)");
});

test("basic runtime check", () => {
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

test.run();
