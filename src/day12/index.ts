import run from "aocrunner";
import { splitRows } from "../utils/index.js";
import { DirVecMap, Vec, type Dir } from "../utils/vec.js";
import { AStar } from "./astar.js";

const MIN_ELEVATION = 0;
const MAX_ELEVATION = 25;

const parseInput = (rawInput: string) => splitRows(rawInput);

const lcCharToInt = (char: string) => char.charCodeAt(0) - 97;

interface Movement {
  dir: Dir,
  vec: Vec
}

function parseLowercaseHeightmap(input: string[]) {
  const mapRows = input.length;
  const mapCols = input[0].length;
  const map: number[][] = Array(mapRows).fill(null).map(() => Array(0));
  let startPosition: Vec | null = null;
  let target: Vec | null = null;
  
  for (let y = 0; y < mapRows; y++) {
    const inputRow = input[y];
    const row = map[y];
    for (let x = 0; x < inputRow.length; x++) {
      let height: number;
      const char = inputRow[x];
      if (char === 'S') {
        height = MIN_ELEVATION;
        startPosition = new Vec(x, y);
      } else if (char === 'E') {
        height = MAX_ELEVATION;
        target = new Vec(x, y);
      } else height = lcCharToInt(inputRow[x]);

      row.push(height);
    }
  }
  if (startPosition == null || target == null) {
    throw new Error('Unknown startPosition and/or target');
  }
  const position = startPosition.clone();
  return {
    elevationMap: map,
    startPosition, target,
    position
  }
}

class HeightMapTraveller {
  private readonly elevationMap: number[][];
  private readonly startPosition: Vec;
  private readonly target: Vec;
  position: Vec;
  path: Dir[];

  visited: Set<string>;

  constructor(elevationMap: number[][], startPosition: Vec, position: Vec, target: Vec, data: { visited?: Set<string>, path?: Dir[] } = {}) {
    this.elevationMap = elevationMap;
    this.startPosition = startPosition;
    this.position = position;
    this.target = target;

    this.visited = data?.visited ?? new Set();
    this.path = data?.path ?? [];

    this.visited.add(this.position.toCoordString());
    this.visited.add(this.startPosition.toCoordString());
  }

  static fromParsedData(data: ReturnType<typeof parseLowercaseHeightmap>) {
    const { elevationMap, position, startPosition, target } = data;
    return new HeightMapTraveller(elevationMap, startPosition, position, target);
  }

  get currentHeight() {
    return this.elevationMap[this.position.y][this.position.x];
  }
  get minimumPathLength() {
    const distanceTo = this.position.distManhattan(this.target);
    return distanceTo + this.path.length;
  }

  reachedDestination() {
    return this.position.equals(this.target);
  }

  isInside(vec: Vec): boolean {
    return vec.x >= 0 && vec.y >= 0 && vec.x < this.elevationMap[0].length && vec.y < this.elevationMap.length;
  }

  lookAround() {
    const result: Map<Dir, { position: Vec, height: number, visited: boolean, validDestination: boolean }> = new Map();

    for (const [dir, dirVec] of Object.entries(DirVecMap) as [Dir, Vec][]) {
      const posVec = this.position.add(dirVec, { immutable: true });
      if (this.isInside(posVec)) {
        const posHeight = this.checkHeight(posVec);
        result.set(dir, {
          position: posVec,
          height: posHeight,
          visited: this.hasVisited(posVec),
          validDestination: this.isValidDestination(posHeight)
        })
      }
    }
    if (result.size === 0) return null;
    return result;
  }

  checkHeight(loc: Vec): number {
    return this.elevationMap[loc.y][loc.x];
  }
  hasVisited(loc: Vec): boolean {
    return this.visited.has(loc.toCoordString());
  }
  isValidDestination(height: number) {
    const curH = this.currentHeight;
    return height <= curH + 1; 
  }

  moveTo(movement: Movement) {
    this.path.push(movement.dir);
    this.position = movement.vec;
    this.visited.add(this.position.toCoordString());
    return this;
  }

  clone() {
    const { elevationMap, startPosition, target } = this;
    return new HeightMapTraveller(
      elevationMap,
      startPosition,
      this.position.clone(),
      target,
      { visited: new Set([...this.visited]), path: [...this.path] }
    )
  }
}

function searchDestination(traveller: HeightMapTraveller) {
  let bestPathLength = Infinity;
  let queue: HeightMapTraveller[] = [traveller];
  const bestAtLocation: Map<string, number> = new Map();
  bestAtLocation.set(traveller.position.toCoordString(), traveller.path.length);
  const maxSteps = 1000;

  for (let step = 0; step < maxSteps; step++) {
    if (!queue.length) {
      return bestPathLength;
    }
    const nextQueue: HeightMapTraveller[] = [];
    while (queue.length) {
      const curTraveller = queue.pop()!;
      if (curTraveller.reachedDestination()) {
        const pathLength = curTraveller.path.length;
        bestPathLength = Math.min(pathLength, bestPathLength);
        continue;
      } else if (curTraveller.minimumPathLength >= bestPathLength) {
        // cannot reach new best
        continue;
      }
      const possibleSteps = curTraveller.lookAround();
      if (possibleSteps == null || possibleSteps.size === 0) {
        // invalid path
        continue;
      } else {
        for (const [dir, movementData] of possibleSteps.entries()) {
          const coordStr = movementData.position.toCoordString();
          const best = bestAtLocation.get(coordStr);
          if (best != null && best < curTraveller.path.length + 1) {
            // cannot improve on previous path
            continue;
          } else if (!movementData.visited && movementData.validDestination) {
            const vec = movementData.position;
            const cloned = curTraveller.clone();
            cloned.moveTo({ dir, vec });
            nextQueue.push(cloned);
          }
        }
      }
    }
    queue = nextQueue;
  }
  return bestPathLength;
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const parsedData = parseLowercaseHeightmap(input);
  const astar = new AStar(parsedData.elevationMap).init(parsedData.startPosition, parsedData.target);
  const path = astar.search();
  return path.length - 1;
  // const hmTraveller = HeightMapTraveller.fromParsedData(parsedData);
  // console.log(hmTraveller.lookAround());

  // const res = searchDestination(hmTraveller);
  // return res;
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
        Sabqponm
        abcryxxl
        accszExk
        acctuvwj
        abdefghi
        `,
        expected: 31,
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
