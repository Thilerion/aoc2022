import run from "aocrunner";
import { splitRows } from "../utils/index.js";
import { Vec } from "../utils/vec.js";

const parseLocStr = (xStr: string, yStr: string) => {
  const x = +(xStr.slice(2));
  const y = +(yStr.slice(2));
  return new Vec(x, y);
}

const parseInput = (rawInput: string) => {
  const rawLines = splitRows(rawInput);
  let testHeight = 2000000;
  if (rawLines[0].startsWith('y=')) {
    testHeight = +(rawLines.shift()!.replace('y=', ''));
  }
  const pairs: [Vec, Vec][] = [];
  for (const line of rawLines) {
    const [rawSensorLocStr, rawBeaconLocStr] = line.split(': closest beacon is at ');

    const rawSensorLocStr2 = rawSensorLocStr.replace('Sensor at ', '');
    const [sensorXStr, sensorYStr] = rawSensorLocStr2.split(', ');
    const [beaconXStr, beaconYStr] = rawBeaconLocStr.split(', ');
    pairs.push([
      parseLocStr(sensorXStr, sensorYStr),
      parseLocStr(beaconXStr, beaconYStr)
    ]);
  }
  return {
    pairs,
    testHeight
  };
};

class Sensor {
  pos: Vec;
  closestBeacon: Vec;
  radius: number;

  constructor(pair: [Vec, Vec]) {
    this.pos = pair[0];
    this.closestBeacon = pair[1];

    this.radius = this.pos.distManhattan(this.closestBeacon);
  }

  positionsCoveredOnRow(y: number): Vec[] {
    const distanceY = Math.abs(this.pos.y - y);
    if (distanceY > this.radius) return [];

    // 2* radius + 1 - 2* distanceY
    const amount = 2 * (this.radius - distanceY) + 1;
    if (amount <= 0) return [];

    const amountLeft = (amount - 1) / 2;
    const x0 = this.pos.x - amountLeft;
    const x1 = this.pos.x + amountLeft;
    const result: Vec[] = [];
    for (let x = x0; x <= x1; x++) {
      result.push(new Vec(x, y));
    }
    return result;
  }
}

const part1 = (rawInput: string) => {
  const { pairs, testHeight } = parseInput(rawInput);
  const sensors = pairs.map(pair => new Sensor(pair));

  const positionsCoveredSet = new Set<string>();

  for (const s of sensors) {
    const covered = s.positionsCoveredOnRow(testHeight);
    for (const vec of covered) {
      positionsCoveredSet.add(vec.toCoordString());
    }
  }

  for (const s of sensors) {
    const beaconPos = s.closestBeacon.toCoordString();
    positionsCoveredSet.delete(beaconPos);
  }

  return positionsCoveredSet.size;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
};


const testInput = `
y=10
Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 26,
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
