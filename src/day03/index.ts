import run from "aocrunner";
import { splitRows, sum } from "../utils/index.js";

const parseInput = (rawInput: string) => splitRows(rawInput);

type Compartments = [Set<string>, Set<string>];

const toCompartments = (row: string): Compartments => {
  const len = row.length / 2;
  return [new Set(row.slice(0, len).split('')), new Set(row.slice(len).split(''))];
}
const findSharedItems = <T>(a: Set<T>, b: Set<T>) => {
  const shared: T[] = [];
  for (const item of a) {
    if (b.has(item)) shared.push(item);
  }
  return shared;
}
const toPriority = (char: string) => {
  const code = char.charCodeAt(0);
  return code >  94 ? code - 96 : code - 64 + 26;
}
const toPriorities = (values: string[]) => {
  return values.map(char => toPriority(char));
}

const part1 = (rawInput: string): number => {
  const input = parseInput(rawInput);
  const sharedItemsPerBackpack = input.map(bp => {
    const [a, b] = toCompartments(bp);
    return findSharedItems(a, b);
  });
  const prioritiesPerBackpack = sharedItemsPerBackpack.map(v => toPriorities(v));
  return sum(prioritiesPerBackpack.flat());
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
};

run({
  part1: {
    tests: [
      {
        input: `vJrwpWtwJgWrhcsFMMfFFhFp
        jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
        PmmdzqPrVvPwwTWBwg
        wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
        ttgJtRGJQctTZtZT
        CrZsJsPPZsGzwwsLwLmpwMDw`,
        expected: 157,
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
