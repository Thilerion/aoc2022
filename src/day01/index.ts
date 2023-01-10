import run from "aocrunner";

const parseInput = (rawInput: string): number[][] => {
  const byElf = rawInput.split('\n\n');
  const byElfNumbers = byElf.map(elfRows => elfRows.split('\n').map(str => Number(str)));
  return byElfNumbers;
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  return Math.max(...input.map(elf => {
    return elf.reduce((acc, val) => acc + val, 0);
  }));
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const list = input.map(elf => {
    return elf.reduce((acc, val) => acc + val, 0);
  }).sort((a, b) => b - a);
  return list[0] + list[1] + list[2];
};

run({
  part1: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
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
