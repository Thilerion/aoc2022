import run from "aocrunner";
import { splitRowsDouble } from "../utils/index.js";

const parseInput = (rawInput: string): InputValue[][] => splitRowsDouble(rawInput, { trimRows: true, asNumber: false }).map((val) => {
  return val.map(v2 => JSON.parse(v2));
});

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const result = input.map((value) => {
    return compare(value[0], value[1]);
  })
  console.log(result);
  // return result
  return result.reduce((acc, val, idx) => {
    if (val) {
      return acc + (idx + 1);
    }
    return acc;
  }, 0);
};

type CompareResult = true | false | 'equal';
type RecArray = Array<RecArray | number>;
type InputValue = RecArray | number;

function isInteger(value: unknown): value is number {
  return Number.isInteger(value);
}
function isArray(value: unknown): value is RecArray {
  return Array.isArray(value);
}
function compareIntegers(left: number, right: number): CompareResult {
  return left < right ? true : left > right ? false : 'equal';
}
function compareArrays(left: RecArray, right: RecArray): CompareResult {
  const len = Math.max(left.length, right.length);
  for (let i = 0; i < len; i++) {
    const li = left[i];
    const ri = right[i];
    if (li == null && ri != null) {
      return true;
    } else if (li != null && ri == null) {
      return false;
    }
    const result = compare(li, ri);
    if (result === 'equal') continue;
    return result;
  }
  return 'equal';
}

function compare(left: InputValue, right: InputValue): CompareResult {
  if (isArray(left) && !isArray(right)) {
    // convert right to array
    const res = compare(left, [right]);
    // console.log({ left, right, res });
    return res;
  } else if (isArray(right) && !isArray(left)) {
    // convert left to array
    const res = compare([left], right);
    // console.log({ left, right, res });
    return res;
  } else if (isInteger(left) && isInteger(right)) {
    const res = compareIntegers(left, right);
    // console.log({ left, right, res });
    return res;
  }
  if (isArray(left) && isArray(right)) {
    const res = compareArrays(left, right);
    // console.log({ left, right, res });
    return res;
  }
  throw new Error(`${left}\n${right}`);
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
};
const testInput = `
[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
});
