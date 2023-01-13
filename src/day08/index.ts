import run from "aocrunner";
import { splitRows } from "../utils/index.js";


type Grid = number[][];
type Vec = { x: number, y: number };
const parseInput = (rawInput: string): Grid => splitRows(rawInput).map(row => row.split('').map(Number));

const transpose = (grid: Grid) => {
  return grid[0].map((_col, i) => grid.map(row => row[i]));
}
const getDimensions = (grid: Grid) => {
  const width = grid[0].length;
  const height = grid.length;
  return [width, height];
}
const countEdges = (grid: Grid) => {
  const [w, h] = getDimensions(grid);
  return (w - 1) * 2 + (h - 1) * 2;
}
const isVisible = (height: number, others: number[]) => {
  return others.length < 1 || Math.max(...others) < height;
}

const part1 = (rawInput: string) => {
  const grid = parseInput(rawInput);
  // const alongEdges = countEdges(grid);
  const transposed = transpose(grid);
  const [width, height] = getDimensions(grid);
  const visible: Vec[] = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const h = grid[y][x];
      const vec = { x, y };
      
      const fromLeft = grid[y].slice(0, x).reverse();
      const fromRight = grid[y].slice(x + 1, width + 1);
      const fromTop = transposed[x].slice(0, y).reverse();
      const fromBottom = transposed[x].slice(y + 1, height + 1);

      let curVisible = false;

      if (x === 0 || y === 0) {
        curVisible = true;
      } else if (isVisible(h, fromLeft)) {
        curVisible = true;
      } else if (isVisible(h, fromRight)) {
        curVisible = true;
      } else if (isVisible(h, fromTop)) {
        curVisible = true;
      } else if (isVisible(h, fromBottom)) {
        curVisible = true;
      }
      if (curVisible) {
        visible.push(vec);
      }
      // console.log({ x, y, h, fromLeft, fromRight, fromTop, fromBottom, curVisible });
    }
  }
  return visible.length;
};

const calculateScenicScoreInDirection = (height: number, trees: number[]): number => {
  const higherIdx = trees.findIndex(v => v >= height);
  if (higherIdx < 0) return trees.length;
  return higherIdx + 1;
}
const calculateScenicScore = (height: number, views: number[][]) => {
  let score = 1;
  for (const view of views) {
    score *= calculateScenicScoreInDirection(height, view);
  }
  return score;
}


const part2 = (rawInput: string) => {
  const grid = parseInput(rawInput);
  // const alongEdges = countEdges(grid);
  const transposed = transpose(grid);
  const [width, height] = getDimensions(grid);
  let maxScore = -1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const h = grid[y][x];
      const vec = { x, y };
      
      const fromLeft = grid[y].slice(0, x).reverse();
      const fromRight = grid[y].slice(x + 1, width + 1);
      const fromTop = transposed[x].slice(0, y).reverse();
      const fromBottom = transposed[x].slice(y + 1, height + 1);

      const score = calculateScenicScore(h, [fromLeft, fromRight, fromTop, fromBottom]);
      if (score > maxScore) maxScore = score;
    }
  }
  return maxScore;
};

run({
  part1: {
    tests: [
      {
        input: `
        30373
        25512
        65332
        33549
        35390
        `,
        expected: 21,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        30373
        25512
        65332
        33549
        35390
        `,
        expected: 8,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
});
