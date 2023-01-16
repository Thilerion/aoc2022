import run from "aocrunner";
import { splitRows, sum } from "../utils/index.js";

type Op = 'add' | 'noop';
interface Instruction {
  op: Op 
}
type AddInstruction = {
  op: 'add',
  target: 'X',
  value: number
}
type NoopInstruction = {
  op: 'noop'
}

const parseInstruction = (str: string) => {
  if (str === 'noop') {
    return { op: 'noop' } as NoopInstruction;
  } else if (str.startsWith('addx')) {
    const [_a, valueStr] = str.split(' ');
    return { op: 'add', target: 'X', value: +valueStr} as AddInstruction;
  }
  throw new Error('invalid instrcution');
}


class CPU {
  registers: Map<string, number> = new Map();
  cycle = 0;
  importantSignalStrengths: Map<number, number> = new Map();
  private readonly signalStrengths: number[] = [];
  cycleCb!: (x: number) => void;

  constructor(cb?: (x: number) => void) {
    this.setCycleCb(cb);
  }

  setCycleCb(cb?: (x: number) => void) {
    if (cb) {
      this.cycleCb = cb;
    } else {
      this.cycleCb = () => {};
    }
  }

  get signalStrength() {
    return this.cycle * this.registers.get('X')!;
  }

  initRegister(register: string, value: number) {
    this.registers.set(register, value);
  }

  nextCycle() {
    this.cycleCb(this.registers.get('X')!);
    this.cycle += 1;
    const strength = this.signalStrength;
    this.signalStrengths.push(strength);
    if (this.cycle === 20 || (this.cycle - 20) % 40 === 0) {
      this.importantSignalStrengths.set(this.cycle, strength);
    }
    return this;
  }

  executeNoop() {
    return this.nextCycle();
  }
  executeAddx(value: number) {
    const current = this.registers.get('X')!;
    this.nextCycle();
    this.nextCycle();
    this.registers.set('X', current + value);
    return this;
  }

  executeInstruction(instruction: NoopInstruction | AddInstruction) {
    if (instruction.op === 'noop') {
      this.executeNoop();
    } else if (instruction.op === 'add' && instruction.target === 'X') {
      this.executeAddx(instruction.value);
    }
    return this;
  }
}

class CRT {
  cpu: CPU;
  screen: ('.' | '#')[][] = [[]];

  constructor(cpu: CPU) {
    this.cpu = cpu;
    this.cpu.setCycleCb((x: number) => {
      const pos = this.cpu.cycle % 40;
      const spriteLeft = x - 1;
      const spriteRight = x + 1;
      const sprite = x;

      if (pos === sprite || pos === spriteLeft || pos === spriteRight) {
        this.draw(true);
      } else this.draw(false);
    })
  }

  get curRow() {
    return this.screen[this.screen.length - 1];
  }
  draw(value: boolean) {
    let row = this.curRow;
    if (row.length >= 40) {
      this.screen.push([]);
      row = this.curRow;
    }
    row.push(value ? '#' : '.');
    return this;
  }

  executeInstruction(instruction: NoopInstruction | AddInstruction) {
    this.cpu.executeInstruction(instruction);
  }

  display() {
    const str = this.screen.map(row => row.join('')).join('\n');
    return str;
  }
}

const parseInput = (rawInput: string) => splitRows(rawInput).map(row => parseInstruction(row));

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const cpu = new CPU();
  cpu.initRegister('X', 1);

  for (const instruction of input) {
    cpu.executeInstruction(instruction);
  }
  const signalStrengths = sum([...cpu.importantSignalStrengths.values()]);

  // console.log([...cpu.importantSignalStrengths.values()]);

  return signalStrengths;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const cpu = new CPU();
  cpu.initRegister('X', 1);

  const crt = new CRT(cpu);
  for (const instruction of input) {
    crt.executeInstruction(instruction);
  }

  console.log(crt.display());
  return 'BZPAJELK';
};

run({
  part1: {
    /*tests: [
      {
        input: `
        addx 15
        addx -11
        addx 6
        addx -3
        addx 5
        addx -1
        addx -8
        addx 13
        addx 4
        noop
        addx -1
        addx 5
        addx -1
        addx 5
        addx -1
        addx 5
        addx -1
        addx 5
        addx -1
        addx -35
        addx 1
        addx 24
        addx -19
        addx 1
        addx 16
        addx -11
        noop
        noop
        addx 21
        addx -15
        noop
        noop
        addx -3
        addx 9
        addx 1
        addx -3
        addx 8
        addx 1
        addx 5
        noop
        noop
        noop
        noop
        noop
        addx -36
        noop
        addx 1
        addx 7
        noop
        noop
        noop
        addx 2
        addx 6
        noop
        noop
        noop
        noop
        noop
        addx 1
        noop
        noop
        addx 7
        addx 1
        noop
        addx -13
        addx 13
        addx 7
        noop
        addx 1
        addx -33
        noop
        noop
        noop
        addx 2
        noop
        noop
        noop
        addx 8
        noop
        addx -1
        addx 2
        addx 1
        noop
        addx 17
        addx -9
        addx 1
        addx 1
        addx -3
        addx 11
        noop
        noop
        addx 1
        noop
        addx 1
        noop
        noop
        addx -13
        addx -19
        addx 1
        addx 3
        addx 26
        addx -30
        addx 12
        addx -1
        addx 3
        addx 1
        noop
        noop
        noop
        addx -9
        addx 18
        addx 1
        addx 2
        noop
        noop
        addx 9
        noop
        noop
        noop
        addx -1
        addx 2
        addx -37
        addx 1
        addx 3
        noop
        addx 15
        addx -21
        addx 22
        addx -6
        addx 1
        noop
        addx 2
        addx 1
        noop
        addx -10
        noop
        noop
        addx 20
        addx 1
        addx 2
        addx 2
        addx -6
        addx -11
        noop
        noop
        noop
        `,
        expected: 13140,
      },
    ],*/
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        addx 15
        addx -11
        addx 6
        addx -3
        addx 5
        addx -1
        addx -8
        addx 13
        addx 4
        noop
        addx -1
        addx 5
        addx -1
        addx 5
        addx -1
        addx 5
        addx -1
        addx 5
        addx -1
        addx -35
        addx 1
        addx 24
        addx -19
        addx 1
        addx 16
        addx -11
        noop
        noop
        addx 21
        addx -15
        noop
        noop
        addx -3
        addx 9
        addx 1
        addx -3
        addx 8
        addx 1
        addx 5
        noop
        noop
        noop
        noop
        noop
        addx -36
        noop
        addx 1
        addx 7
        noop
        noop
        noop
        addx 2
        addx 6
        noop
        noop
        noop
        noop
        noop
        addx 1
        noop
        noop
        addx 7
        addx 1
        noop
        addx -13
        addx 13
        addx 7
        noop
        addx 1
        addx -33
        noop
        noop
        noop
        addx 2
        noop
        noop
        noop
        addx 8
        noop
        addx -1
        addx 2
        addx 1
        noop
        addx 17
        addx -9
        addx 1
        addx 1
        addx -3
        addx 11
        noop
        noop
        addx 1
        noop
        addx 1
        noop
        noop
        addx -13
        addx -19
        addx 1
        addx 3
        addx 26
        addx -30
        addx 12
        addx -1
        addx 3
        addx 1
        noop
        noop
        noop
        addx -9
        addx 18
        addx 1
        addx 2
        noop
        noop
        addx 9
        noop
        noop
        noop
        addx -1
        addx 2
        addx -37
        addx 1
        addx 3
        noop
        addx 15
        addx -21
        addx 22
        addx -6
        addx 1
        noop
        addx 2
        addx 1
        noop
        addx -10
        noop
        noop
        addx 20
        addx 1
        addx 2
        addx 2
        addx -6
        addx -11
        noop
        noop
        noop
        `,
        expected: `##..##..##..##..##..##..##..##..##..##..
###...###...###...###...###...###...###.
####....####....####....####....####....
#####.....#####.....#####.....#####.....
######......######......######......####
#######.......#######.......#######.....`,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
});
