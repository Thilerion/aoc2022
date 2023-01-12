import run from "aocrunner";
import { splitRows } from "../utils/index.js";

const parseInput = (rawInput: string) => splitRows(rawInput);
const toElfPairs = (input: string[]): [string, string][] => {
  return input.map(s => s.split(',')) as [string, string][];
}

class Section {
  from: number;
  to: number;

  constructor(sectionStr: string) {
    const [from, to] = sectionStr.split('-').map(Number);
    this.from = from;
    this.to = to;
  }

  get size() {
    return this.to - this.from + 1;
  }
  
  contains(other: Section) {
    return other.size <= this.size && this.from <= other.from && this.to >= other.to;
  }
  isContained(other: Section) {
    return other.contains(this);
  }
  overlaps(other: Section) {
    return Math.max(Math.min(this.to, other.to) - Math.max(this.from, other.from) + 1, 0);
  }
}
class Pair {
  left: Section;
  right: Section;
  constructor(a: Section, b: Section) {
    this.left = a;
    this.right = b;
  }
  static fromPairStrings(pairString: [string, string]) {
    return new Pair(new Section(pairString[0]), new Section(pairString[1]));
  }
  checkContainment() {
    return this.left.contains(this.right) || this.right.contains(this.left);
  }
  checkOverlap() {
    return Math.max(this.left.overlaps(this.right), this.right.overlaps(this.left));
  }
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const pairs = toElfPairs(input).map(pair => {
    return Pair.fromPairStrings(pair);
  })
  return pairs.reduce((acc, val) => {
    if (val.checkContainment()) return acc + 1;
    return acc;
  }, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const pairs = toElfPairs(input).map(pair => {
    return Pair.fromPairStrings(pair);
  })
  return pairs.reduce((acc, val) => {
    if (val.checkOverlap() > 0) return acc + 1;
    return acc;
  }, 0);
};

run({
  part1: {
    tests: [
      {
        input: `2-4,6-8
        2-3,4-5
        5-7,7-9
        2-8,3-7
        6-6,4-6
        2-6,4-8`,
        expected: 2,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `2-4,6-8
        2-3,4-5
        5-7,7-9
        2-8,3-7
        6-6,4-6
        2-6,4-8`,
        expected: 4,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
});
