import run from "aocrunner";

type Rock = 'A' | 'X';
type Paper = 'B' | 'Y';
type Scissors = 'C' | 'Z';
const PlayerASymbols = ['A', 'B', 'C'] as const;
const PlayerBSymbols = ['X', 'Y', 'Z'] as const;
const RequiredResults = ['L', 'T', 'W'] as const;

type PlayerA = typeof PlayerASymbols[number];
type PlayerB = typeof PlayerBSymbols[number];
type RequiredResult = typeof RequiredResults[number];
type ShapeScore = (1 | 2 | 3) & { _brand?: 'ShapeScore' };

const PlayerBWinCheck = {
  'A': 'Y',
  'B': 'Z',
  'C': 'X'
} as const;
const PlayerBLossCheck = {
  'B': 'X',
  'C': 'Y',
  'A': 'Z'
} as const;
const PlayerAWinCheck = {
  'X': 'B',
  'Y': 'C',
  'Z': 'A'
} as const;

const parseInput = (rawInput: string) => rawInput.split('\n').map(row => row.trim().split(' ').map(v => v.trim()) as [PlayerA, PlayerB]);

const checkRoundWinner = (a: PlayerA, b: PlayerB): 0 | 3 | 6 | undefined => {
  const idxA = PlayerASymbols.indexOf(a);
  const idxB = PlayerBSymbols.indexOf(b);
  const isTie = idxA === idxB;
  if (isTie) return 3;

  const isWinnerB = PlayerBWinCheck[a] === b;
  if (isWinnerB) return 6;

  const isWinnerA = PlayerAWinCheck[b] === a;
  if (isWinnerA) return 0;

  console.warn(`Who wins? ${a} vs ${b}`);
  return;
}
const interpretXYZAsRequiredResult = (b: PlayerB): RequiredResult => {
  return RequiredResults[PlayerBSymbols.indexOf(b)];
}
const determineRequiredSymbol = (a: PlayerA, b: RequiredResult) => {
  if (b === 'T') {
    const idxA = PlayerASymbols.indexOf(a);
    return PlayerBSymbols[idxA];
  } else if (b === 'W') {
    return PlayerBWinCheck[a];
  } else if (b === 'L') {
    return PlayerBLossCheck[a];
  }
  throw new Error(`Unknown required symbol for ${b} result, with player A choice ${a}.`);
}

const getShapeScore = (val: PlayerB): ShapeScore => {
  switch(val) {
    case 'X':
      return 1;
    case 'Y':
      return 2;
    case 'Z':
      return 3;
  }
}

const getRoundScore = (a: PlayerA, b: PlayerB) => {
  const shapeScore = getShapeScore(b);
  let score = 0;
  score += shapeScore;
  const roundScore = checkRoundWinner(a, b);
  if (roundScore == null) {
    throw new Error('No winner...');
  }
  score += roundScore;
  return score;
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  return input.reduce((acc, val) => {
    return acc + getRoundScore(val[0], val[1]);
  }, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const trueInput = input.map(val => {
    const [playerA, misinterpretedPlayerB] = val;
    const reqResult = interpretXYZAsRequiredResult(misinterpretedPlayerB);
    const playerB = determineRequiredSymbol(playerA, reqResult);
    return [playerA, playerB] as const;
  })
  return trueInput.reduce((acc, val) => {
    return acc + getRoundScore(val[0], val[1]);
  }, 0);
};

run({
  part1: {
    tests: [
      // {
      //   input: `A X\nB Y\nC Z`,
      //   expected: "3 3 3",
      // },
      // {
      //   input: `A Y\nB Z\nC X`,
      //   expected: "0 0 0",
      // },
      // {
      //   input: `A Z\nB X\nC Y`,
      //   expected: "6 6 6",
      // },
      {
        input: `A Y
        B X
        C Z`,
        expected: 15
      }
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `A Y
        B X
        C Z`,
        expected: 12
      }
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
});
