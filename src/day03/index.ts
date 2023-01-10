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
const groupThreeElves = (input: string[]) => {
  const list = [...input].reverse();
  const total: [string, string, string][] = [];
  let i = 0;
  while (list.length > 2) {
    const group: [string, string, string] = [list.pop()!, list.pop()!, list.pop()!];
    total.push(group.reverse() as [string, string, string]);
    if (i > input.length) throw new Error('oops, invalid loop.');
    i += 3;
  }
  return total;
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
  const grouped = groupThreeElves(input);
  const badges: string[] = [];
  for (const group of grouped) {
    const [a, b, c] = group.map(arr => new Set(arr.split('')));
    const sharedAB = [...a].filter(valueA => {
      return b.has(valueA);
    })
    const sharedABC = [...sharedAB].filter(valueAB => {
      return c.has(valueAB);
    })
    if (sharedABC.length > 1) {
      throw new Error('multiple badges');
    } else if (sharedABC.length < 1) {
      console.log({ a, b, c, sharedABC, sharedAB, group, grouped})
      throw new Error('no badge...');
    }
    badges.push(...sharedABC);
  }
  const priorities = toPriorities(badges);
  return sum(priorities);
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
      {
        input: `vJrwpWtwJgWrhcsFMMfFFhFp
        jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
        PmmdzqPrVvPwwTWBwg
        wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
        ttgJtRGJQctTZtZT
        CrZsJsPPZsGzwwsLwLmpwMDw`,
        expected: 70,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
});
