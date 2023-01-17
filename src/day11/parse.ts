export const parseInput = (rawInput: string) => rawInput.trim().split('\n\n');

const ValidOpsMap = {
  '+': 'add',
  '-': 'subtract',
  '*': 'multiply',
  '/': 'divide'
} as const satisfies Record<Op, string>;
type Op = '+' | '-' | '*' | '/';
const ValidOps = ['+', '-', '*', '/'] as const;
function isValidOp(value: string): value is Op {
  return ValidOps.includes(value as any);
}

export interface MonkeyTest {
  divisibleBy: number,
  ifTrue: number,
  ifFalse: number
}
export interface MonkeyOperation {
  op: Op,
  a: number | 'old',
  b: number | 'old'
}
export interface IMonkey {
  test: MonkeyTest,
  id: number,
  operation: MonkeyOperation,
  items: number[],
  itemInspections: number
}

export function parseMonkeyInput(monkeyStr: string): IMonkey {
  const lines = monkeyStr.split('\n').map(line => line.trim());
  
  const monkeyNum = +(lines[0].split(' ')[1].replace(':', ''));
  const startingItemsList = lines[1].split(': ')[1].split(', ').map(Number);
  const opString = lines[2].replace('Operation: new = ', '');

  const [a, opStr, b] = opString.split(' ');
  if (!isValidOp(opStr)) {
    throw new Error('invalid op');
  }
  const op: MonkeyOperation = {
    op: opStr,
    a: a === 'old' ? 'old' : +a,
    b: b === 'old' ? 'old' : +b
  }

  const testDivisibleBy = +lines[3].replace('Test: divisible by ', '');
  const testIfTrue = +lines[4].split(' ').at(-1)!;
  const testIfFalse = +lines[5].split(' ').at(-1)!;

  const test: MonkeyTest = {
    divisibleBy: testDivisibleBy,
    ifTrue: testIfTrue,
    ifFalse: testIfFalse
  }

  return { id: monkeyNum, items: startingItemsList, operation: op, test, itemInspections: 0 };
}