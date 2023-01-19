import run from "aocrunner";
import { splitRows } from "../utils/index.js";
import { Dir, Vec } from "../utils/vec.js";

enum Material {
  'Rock' = '#',
  'Sand' = '+',
  'Air' = '.',
}
const parseInput = (rawInput: string) => splitRows(rawInput);
const parseLine = (line: string) => line.split(' -> ').map(posStr => {
  const [x, y] = posStr.split(',').map(Number);
  return new Vec(x, y);
})
const moveInDir = (vec: Vec, dir: Dir) => vec.moveInDirection(dir, { immutable: true });
const interpolateBetweenCorners = (a: Vec, b: Vec) => {
  const res: Vec[] = [a.clone()];

  if (a.x === b.x && a.y === b.y) return res;
  else if (a.x === b.x) {
    // vertical line
    const y1 = Math.max(a.y, b.y);
    const y2 = Math.min(a.y, b.y);
    const dy = y1 - y2;
    for (let i = 1; i < dy; i++) {
      const y = y2 + i;
      res.push(new Vec(a.x, y));
    }
    res.push(b);
    return res;
  } else if (a.y === b.y) {
    // horizontal line
    const x1 = Math.max(a.x, b.x);
    const x2 = Math.min(a.x, b.x);
    const dx = x1 - x2;
    for (let i = 1; i < dx; i++) {
      const x = x2 + i;
      res.push(new Vec(x, a.y));
    }
    res.push(b);
    return res;
  } else {
    throw new Error('Delta X and Delta Y together is not possible.');
  }
}
class GridLine {
  readonly corners: ReadonlyArray<Vec>;
  readonly numCorners: number;
  readonly points: ReadonlyArray<Vec>;
  readonly numPoints: number;
  
  constructor(corners: Vec[]) {
    this.corners = [...corners];
    
    const pointsSet = new Set<string>();
    const points: Vec[] = [];
    for (let i = 0; i < this.corners.length - 1; i++) {
      const a = this.corners[i];
      const b = this.corners[i + 1];
      const curPoints = interpolateBetweenCorners(a, b);
      for (const p of curPoints) {
        const coord = p.toCoordString();
        if (pointsSet.has(coord)) continue;
        pointsSet.add(coord);
        points.push(p);
      }
    }
    this.points = points;

    this.numCorners = this.corners.length;
    this.numPoints = this.points.length;
  }
}

const getMinMaxCoords = (list: Vec[]) => {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (const point of list) {
    const { x, y } = point;
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  // console.log({ minX, minY, maxX, maxY });
  return { minX, minY, maxX, maxY };
}

class Cave {
  private readonly rocks: ReadonlyArray<Vec>;
  readonly source: Vec;
  private readonly sourceStr: string;
  map: Map<string, Material> = new Map();
  
  private currentFalling: null | Vec = null;
  numSpawned: number = 0;
  lowestRock: Vec;
  finished: boolean = false;
  currentDownCount = 0;

  drawCorners: Vec[];
  withFloor: false | number;

  constructor(rocks: ReadonlyArray<Vec>, source?: Vec, withFloor?: boolean) {
    this.rocks = rocks;
    this.lowestRock = rocks[0].clone();
    this.source = source ?? new Vec(500, 0);
    this.sourceStr = this.source.toCoordString();

    for (const p of this.rocks) {
      if (p.y > this.lowestRock.y) {
        this.lowestRock = p.clone(); // used for checking abyss
      }
      const str = p.toCoordString();
      this.map.set(str, Material.Rock);
    }

    if (withFloor) {
      const floorHeight = this.lowestRock.y + 2;
      this.withFloor = floorHeight;
    } else {
      this.withFloor = false;
    }

    if (this.withFloor !== false) {
      for (let x = 0; x < 1000; x++) {
        const vec = new Vec(x, this.withFloor);
        this.map.set(vec.toCoordString(), Material.Rock);
      }
    }
    

    const minMaxCoords = getMinMaxCoords([
      this.source,
      ...this.rocks
    ]);

    this.drawCorners = [
      new Vec(minMaxCoords.minX, minMaxCoords.minY),
      new Vec(minMaxCoords.maxX + 2, minMaxCoords.maxY + 2)
    ];
  }

  get hasFloor() {
    return this.withFloor !== false;
  }

  autoDraw() {
    return this.draw(this.drawCorners[0], this.drawCorners[1]);
  }

  draw(topLeft: Vec, bottomRight: Vec) {
    const x0 = Math.min(topLeft.x, bottomRight.x);
    const x1 = Math.max(topLeft.x, bottomRight.x);
    
    const y0 = Math.min(topLeft.y, bottomRight.y);
    const y1 = Math.max(topLeft.y, bottomRight.y);

    const dx = x1 - x0;
    const dy = y1 - y0;

    const arr: Material[][] = [];
    for (let y = y0; y < y1; y += 1) {
      const row: Material[] = [];
      for (let x = x0; x < x1; x += 1) {
        const value = this.map.get(`${x},${y}`) ?? Material.Air;
        row.push(value);
      }
      arr.push(row);
    }
    const res = arr.map(row => row.join('')).join('\n');
    console.log(`\n${res}\n`);
    return res;
  }

  next() {
    if (this.finished) {
      return true;
    }
    if (this.currentFalling == null) {
      this.spawn();
    }
    let lastResult: boolean = this.finished;
    while (!lastResult) {
      lastResult = this.fall();
    }
    // this.autoDraw();
    return true;
  }

  spawn() {
    if (this.currentFalling != null) {
      throw new Error('Cannot spawn, sand is currently falling.');
    } else if (this.finished) {
      throw new Error('Cant spawn if finished.');
    }
    const curSourceValue = this.map.get(this.sourceStr);
    if (curSourceValue != null && curSourceValue !== Material.Air) {
      this.finished = true;
      this.currentFalling = null;
      // this.numSpawned -= 1;
      console.log('spawn on source');
      return this;
    }
    this.map.set(this.sourceStr, Material.Sand);
    this.currentFalling = this.source.clone();
    this.numSpawned += 1;
    this.currentDownCount = 0;
    // console.log('spawned!');
    return this;
  }
  fall() {
    if (this.currentFalling == null) {
      throw new Error('Cannot fall as no sand is currently falling.');
    }
    const cur = this.currentFalling;
    
    const nextPos = this.checkDown(cur) || this.checkLeft(cur) || this.checkRight(cur);
    if (!nextPos) {
      this.settle();
      // console.log('settled');
      return true;
    } else if (nextPos === 'abyss') {
      // console.log('abyss');
      this.fallInAbyss();
      return true;
    } else {
      // console.log('falling!');
      this.moveCurrentTo(nextPos);
      return false;
    }
  }
  settle() {
    this.currentFalling = null;
  }
  fallInAbyss() {
    const curStr = this.currentFalling!.toCoordString();
    this.map.set(curStr, Material.Air);
    this.currentFalling = null;
    this.numSpawned -= 1;
    this.finished = true;
    return true;
  }

  moveCurrentTo(next: Vec) {
    if (this.currentFalling == null) {
      throw new Error('Cannot move current sand if there is none falling.');
    }
    const cur = this.currentFalling;
    const curStr = cur.toCoordString();
    this.map.set(curStr, Material.Air);
    
    const nextStr = next.toCoordString();
    this.map.set(nextStr, Material.Sand);

    this.currentDownCount += 1;    
    this.currentFalling = next;
  }

  checkDown(cur: Vec) {
    const down = moveInDir(cur, 'S'); // y-coordinates are switched around
    const curDown = this.map.get(down.toCoordString());
    if (curDown != null && curDown !== Material.Air) return false;
    // can fall down. if playing with floor, check if touches floor
    if (this.hasFloor && down.y === this.withFloor as number) {
      // set one down as rock, and move down
      // const floorPos = moveInDir(down, 'S');
      // const floorPosLeft = moveInDir(floorPos, 'W');
      // const floorPosRight = moveInDir(floorPos, 'E');
      // this.map.set(floorPos.toCoordString(), Material.Rock);
      // this.map.set(floorPosLeft.toCoordString(), Material.Rock);
      // this.map.set(floorPosRight.toCoordString(), Material.Rock);
      return false;
    } else if (this.hasFloor && down.y > this.withFloor) {
      console.log(cur.clone());
      console.log(down.clone());
      console.log(this.withFloor);
      throw new Error(`${ {floor: this.withFloor, y: down.y }}`);
    }
    // can fall down, but  check if falls in abyss
    if (!this.hasFloor && this.currentDownCount > 5000) {
      return 'abyss';
    } else if (this.currentDownCount > 10000) {
      return 'abyss';
    }
    return down;
  }
  checkRight(cur: Vec) {
    const down = moveInDir(cur, 'S'); // y-coordinates are switched around
    const left = moveInDir(down, 'E'); // x-coordinates are switched around
    const curLeft = this.map.get(left.toCoordString());
    return (curLeft == null || curLeft === Material.Air) ? left : false;
  }
  checkLeft(cur: Vec) {
    const down = moveInDir(cur, 'S'); // y-coordinates are switched around
    const right = moveInDir(down, 'W'); // x-coordinates are switched around
    const curRight = this.map.get(right.toCoordString());
    return (curRight == null || curRight === Material.Air) ? right : false;
  }
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const parsedLines = input.map(parseLine).map(lineCoords => new GridLine(lineCoords));
  const allPointsSet = new Set<string>();
  const allPoints: Vec[] = [];
  for (const line of parsedLines) {
    for (const point of line.points) {
      const str = point.toCoordString();
      if (!allPointsSet.has(str)) {
        allPointsSet.add(str);
        allPoints.push(point);
      }
    }
  }

  const cave = new Cave(allPoints);

  for (let i = 0; i < 3000; i++) {
    if (cave.finished) break;
    cave.next();
    // cave.autoDraw()
  }
  cave.autoDraw();
  return cave.numSpawned;
};

const part2 = (rawInput: string) => {

  const input = parseInput(rawInput);
  const parsedLines = input.map(parseLine).map(lineCoords => new GridLine(lineCoords));
  const allPointsSet = new Set<string>();
  const allPoints: Vec[] = [];
  for (const line of parsedLines) {
    for (const point of line.points) {
      const str = point.toCoordString();
      if (!allPointsSet.has(str)) {
        allPointsSet.add(str);
        allPoints.push(point);
      }
    }
  }

  const cave = new Cave(allPoints, new Vec(500, 0), true);

  for (let i = 0; i < 50000; i++) {
    if (cave.finished) break;
    cave.next();
    // cave.autoDraw()
  }
  // cave.autoDraw();
  return cave.numSpawned;

};

run({
  part1: {
    tests: [
      {
        input: `
        498,4 -> 498,6 -> 496,6
        503,4 -> 502,4 -> 502,9 -> 494,9
        `,
        expected: 24,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
        498,4 -> 498,6 -> 496,6
        503,4 -> 502,4 -> 502,9 -> 494,9
        `,
        expected: 93,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
});
