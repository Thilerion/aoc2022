import run from "aocrunner";
import { Vec, VecLeft, VecRight, VecDown, VecUp } from '../utils/vec.js';
import { splitRows } from '../utils/index.js';

type Dir = 'L' | 'R' | 'U' | 'D';
const VecDirMap = {
  'L': VecLeft,
  'R': VecRight,
  'U': VecUp,
  'D': VecDown
} as const satisfies Record<Dir, Vec>;

const parseInput = (rawInput: string) => splitRows(rawInput).map(row => {
  const split = row.split(' ');
  const dir: Dir = split[0] as Dir;
  const amount: number = +split[1];
  return [dir, amount] as [Dir, number];
});
const expandInput = (data: [Dir, number][]) => {
  const result: Dir[] = [];
  for (const line of data) {
    for (let i = 0; i < line[1]; i++) {
      result.push(line[0]);
    }
  }
  return result;
}

const getKnotMovement = (current: Vec, nextCurrent: Vec, nextUpdated: Vec) => {
  if (current.equals(nextCurrent)) return current;
  if (current.distManhattan(nextUpdated) <= 1) return current;
  if (current.distX(nextUpdated) <= 1 && current.distY(nextUpdated) <= 1) return current;

  const diffX = nextUpdated.diffX(current);
  const diffY = nextUpdated.diffY(current);

  if (diffX === 0) {
    if (diffY === 2) {
      return current.clone().add(VecDown);
    } else if (diffY === -2) {
      return current.clone().add(VecUp);
    }
  } else if (diffY === 0) {
    if (diffX === 2) {
      return current.clone().add(VecRight);
    } else if (diffX === -2) {
      return current.clone().add(VecLeft);
    }
  }

  // head is too far, move diagonally to keep up
  const dx2 = Math.abs(diffX) >= 2 ? diffX / 2 : diffX;
  const dy2 = Math.abs(diffY) >= 2 ? diffY / 2 : diffY;
  
  const tail2 = current.clone().add(new Vec(dx2, dy2));
  return tail2;
}

class RopeMover {
  head: Vec = new Vec(0, 0);
  tail: Vec = new Vec(0, 0);
  positions: Set<string> = new Set();

  updatePositions(head: Vec, tail: Vec) {
    this.head = head;
    this.tail = tail;
    return this;
  }

  moveHead(vec: Vec) {
    const head2 = this.head.clone().add(vec);
    return head2;
  }
  moveHeadInDir(dir: Dir) {
    const vec = VecDirMap[dir];
    return this.moveHead(vec);
  }

  moveTail(head2: Vec) {
    return getKnotMovement(this.tail, this.head, head2);
  }
  recordTailPosition() {
    this.positions.add(this.tail.toCoordString());
    return this;
  }

  move(dir: Dir) {
    const head2 = this.moveHeadInDir(dir);
    const tail2 = this.moveTail(head2);
    this.updatePositions(head2, tail2);
    this.recordTailPosition();
    // console.log({ dir, head: this.head.toCoordString(), tail: this.tail.toCoordString()})
    return this;
  }
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const expanded = expandInput(input);
  // console.log(expanded);
  const ropeMover = new RopeMover();
  for (const dir of expanded) {
    ropeMover.move(dir);
  }
  return ropeMover.positions.size;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
};

run({
  part1: {
    tests: [
      {
        input: `
        R 4
        U 4
        L 3
        D 1
        R 4
        D 1
        L 5
        R 2
        `,
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
