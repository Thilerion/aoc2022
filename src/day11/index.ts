import run from "aocrunner";
import { parseMonkeyInput, parseInput, type MonkeyOperation, type MonkeyTest, IMonkey } from "./parse.js";


function runOperation(operation: MonkeyOperation, old: number) {
  const a = operation.a === 'old' ? old : operation.a;
  const b = operation.b === 'old' ? old : operation.b;

  switch(operation.op) {
    case '+':
      return a + b;
    case '*':
      return a * b;
    case '-':
      return a - b;
    case '/':
      return a / b;
    default:
      throw new Error('unknown operation while running: ' + operation.op);
  }
}
function runMonkeyOperation(level: number, operation: MonkeyOperation, withRelief: boolean) {
  const next = runOperation(operation, level);
  const next2 = withRelief ? Math.floor(next / 3) : next;
  return next2;
}
function runMonkeyTest(level: number, test: MonkeyTest) {
  const divisibleBy = test.divisibleBy;
  if (level % divisibleBy === 0) {
    return test.ifTrue;
  } else return test.ifFalse;  
}

function throwToMonkey(level: number, monkey: number, monkeys: IMonkey[]) {
  const throwTo = monkeys.find(m => m.id === monkey)!;
  throwTo.items.push(level);
}

function processRound(monkeys: IMonkey[], withRelief = true) {
  for (const monkey of monkeys) {
    const origItems = [...monkey.items];
    monkey.items = [];
    for (const item of origItems) {
      monkey.itemInspections += 1;
      const level2 = runMonkeyOperation(item, monkey.operation, withRelief);
      const targetMonkey = runMonkeyTest(level2, monkey.test);
      throwToMonkey(level2, targetMonkey, monkeys);
    }
  }
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const parsedMonkeys = input.map(minput => parseMonkeyInput(minput));

  for (let i = 0; i < 20; i++) {
    processRound(parsedMonkeys);
  }

  for (const monkey of parsedMonkeys) {
    console.log(`Monkey ${monkey.id}: ${monkey.itemInspections}`);
  }
  const orderedInspections = parsedMonkeys.map(m => m.itemInspections).sort((a, b) => b - a);

  return orderedInspections[0] * orderedInspections[1];
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const parsedMonkeys = input.map(minput => parseMonkeyInput(minput));

  for (let i = 0; i < 10000; i++) {
    processRound(parsedMonkeys, false);
  }

  for (const monkey of parsedMonkeys) {
    console.log(`Monkey ${monkey.id}: ${monkey.itemInspections}`);
  }
  const orderedInspections = parsedMonkeys.map(m => m.itemInspections).sort((a, b) => b - a);

  return orderedInspections[0] * orderedInspections[1];
};

run({
  part1: {
    tests: [
      {
        input: `
        Monkey 0:
          Starting items: 79, 98
          Operation: new = old * 19
          Test: divisible by 23
            If true: throw to monkey 2
            If false: throw to monkey 3

        Monkey 1:
          Starting items: 54, 65, 75, 74
          Operation: new = old + 6
          Test: divisible by 19
            If true: throw to monkey 2
            If false: throw to monkey 0

        Monkey 2:
          Starting items: 79, 60, 97
          Operation: new = old * old
          Test: divisible by 13
            If true: throw to monkey 1
            If false: throw to monkey 3

        Monkey 3:
          Starting items: 74
          Operation: new = old + 3
          Test: divisible by 17
            If true: throw to monkey 0
            If false: throw to monkey 1
        `,
        expected: 10605,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        Monkey 0:
          Starting items: 79, 98
          Operation: new = old * 19
          Test: divisible by 23
            If true: throw to monkey 2
            If false: throw to monkey 3

        Monkey 1:
          Starting items: 54, 65, 75, 74
          Operation: new = old + 6
          Test: divisible by 19
            If true: throw to monkey 2
            If false: throw to monkey 0

        Monkey 2:
          Starting items: 79, 60, 97
          Operation: new = old * old
          Test: divisible by 13
            If true: throw to monkey 1
            If false: throw to monkey 3

        Monkey 3:
          Starting items: 74
          Operation: new = old + 3
          Test: divisible by 17
            If true: throw to monkey 0
            If false: throw to monkey 1
        `,
        expected: 2713310158,
      }
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
});
