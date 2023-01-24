import run from "aocrunner";
import { splitRows } from "../utils/index.js";

interface Valve {
  name: ValveID;
  flowRate: number;
  leadsTo: ValveID[];
}
type ValveID = string & { readonly _brand_: 'valve' };
interface State {
  current: ValveID,
  opened: ValveID[],
  unopened: ValveID[],
  timeElapsed: number,
  pressureRelieved: number
}

const parseValveLine = (line: string): Valve => {
  const [a, b] = line.split('; ');
  // console.log({ a, b });
  const splitA = a.split(' ');
  const id = splitA[1] as ValveID;
  const rate = +(splitA[4].split('=')[1]);
  const [_b1, b2] = b.split(' to ');
  const b3 = b2.replace('valves ', '').replace('valve ', '');

  return {
    name: id,
    flowRate: rate,
    leadsTo: b3.split(', ') as ValveID[]
  }
}

const parseInput = (rawInput: string) => splitRows(rawInput).map(parseValveLine);


const part1 = (rawInput: string) => {
  const valves = parseInput(rawInput);
  console.log(valves);
  return;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
};


const testCase1 = `
Valve AA has flow rate=0; tunnels lead to valves DD, II, BB
Valve BB has flow rate=13; tunnels lead to valves CC, AA
Valve CC has flow rate=2; tunnels lead to valves DD, BB
Valve DD has flow rate=20; tunnels lead to valves CC, AA, EE
Valve EE has flow rate=3; tunnels lead to valves FF, DD
Valve FF has flow rate=0; tunnels lead to valves EE, GG
Valve GG has flow rate=0; tunnels lead to valves FF, HH
Valve HH has flow rate=22; tunnel leads to valve GG
Valve II has flow rate=0; tunnels lead to valves AA, JJ
Valve JJ has flow rate=21; tunnel leads to valve II
`;
run({
  part1: {
    tests: [
      {
        input: testCase1,
        expected: 1651,
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
