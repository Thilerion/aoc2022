import run from "aocrunner";
import { testInput } from './test-input.js';

const parseInput = (rawInput: string) => {
  const [top, moveString] = rawInput.split("\n\n");
  return [top, moveString];
};
interface Move {
  amount: number,
  from: number,
  to: number
}
class TableColumn {
  items: string[] = [];
  private initialized = false;
  constructor(public no: number) {

  }
  get size() {
    return this.items.length;
  }
  add(letter: string) {
    if (this.initialized) throw new Error('Cannot add to column; already initialized.');
    if (letter === " ") return this;
    this.items.push(letter);
    return this;
  }
  moveOnTop(item: string) {
    this.items.push(item);
    return this;
  }
  moveTopTo(column: TableColumn) {
    const item = this.items.pop()!;
    column.moveOnTop(item);
    return this;
  }
  finish() {
    if (this.initialized) throw new Error('Cannot add to column; already initialized.');
    this.items.reverse();
    this.initialized = true;
    return this;
  }
  peek() {
    if (this.items.length < 1) return "";
    return this.items[this.items.length - 1];
  }
}


const parseMoveStringLine = (linestr: string) => {
  const split = linestr.split(' ');
  const [_moveStr, pieceStr, _fromStr, fromStr, _toStr, toStr] = split;
  return { amount: +pieceStr, from: +fromStr, to: +toStr } as Move;
}
const parseRawMoveList = (raw: string) => {
  const split = raw.split('\n');
  return split.map(line => parseMoveStringLine(line));
}

const parsePiece = (str: string) => str.slice(1, 2);
const parseBoard = (str: string, width = 9) => {
  const lines = str.split('\n');
  const columns: TableColumn[] = [];
  for (const line of lines) {
    for (let i = 0, col = 0; i < line.length; i += 4, col++) {
      if (columns.length <= col) {
        columns.push(new TableColumn(col + 1));
      }
      const valueStr = parsePiece(line.slice(i, i + 4));
      const ccol = columns[col];
      if (+valueStr === ccol.no) {
        ccol.finish();
      } else {
        ccol.add(valueStr);
      }
    }
  }
  return columns;
}
const moveToColumn = (columns: TableColumn[], move: Move) => {
  const { amount, from, to } = move;
  const colFrom = columns.find(c => c.no === from)!;
  const colTo = columns.find(c => c.no === to)!;

  for (let i = 0; i < amount; i++) {
    colFrom.moveTopTo(colTo);
  }
}

const part1 = (rawInput: string) => {
  const [initialBoard, rawMoveList] = parseInput(rawInput);
  const parsedBoard = parseBoard(initialBoard);
  const parsedMoveList = parseRawMoveList(rawMoveList);
  for (const move of parsedMoveList) {
    moveToColumn(parsedBoard, move);
  }
  return parsedBoard.map(col => col.peek()).join('');
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
};

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: "CMZ",
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
  trimTestInputs: false,
  // onlyTests: true,
});
