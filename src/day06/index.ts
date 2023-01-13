import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput;

function* windowIteration(arr: string[], n = 4) {
  const data: { i: number, last: string, list: string[]} = { i: 0, last: null!, list: [] };
  for (let j = 0; j < n; j++, data.i++) {
    data.last = arr.shift()!;
    data.list.push(data.last);
  }
  yield {...data, list: [...data.list]};
  while(arr.length) {
    data.last = arr.shift()!;
    data.list.push(data.last);
    data.list.shift();
    data.i += 1;
    yield {...data, list: [...data.list]};
  }
}
const hasDuplicateChars = (arr: string[]) => {
  const set = new Set(arr);
  return set.size < arr.length;
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const inputArr = input.split('');
  for (const dataObj of windowIteration(inputArr)) {
    const { list, last, i } = dataObj;
    if (!hasDuplicateChars(list)) {
      return i;
    }
  }

  return -1;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const inputArr = input.split('');
  for (const dataObj of windowIteration(inputArr, 14)) {
    const { list, last, i } = dataObj;
    if (!hasDuplicateChars(list)) {
      return i;
    }
  }

  return -1;
};

run({
  part1: {
    tests: [
      {
        input: `bvwbjplbgvbhsrlpgdmjqwftvncz`,
        expected: 5,
      },
      {
        input: 'nppdvjthqldpwncqszvftbrmjlhg',
        expected: 6
      },
      {
        input: 'nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg',
        expected: 10
      },
      {
        input: 'zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw',
        expected: 11
      }
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `bvwbjplbgvbhsrlpgdmjqwftvncz`,
        expected: 23,
      },
      {
        input: 'nppdvjthqldpwncqszvftbrmjlhg',
        expected: 23
      },
      {
        input: 'nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg',
        expected: 29
      },
      {
        input: 'zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw',
        expected: 26
      }
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
});
