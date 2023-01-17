import { Vec } from "../utils/vec.js";
import { Dimensions } from "./types.js";

export const getNeighborVectors = (vec: Vec): [N: Vec, E: Vec, S: Vec, W: Vec] => {
    return [
        vec.moveInDirection('N', { immutable: true }),
        vec.moveInDirection('E', { immutable: true }),
        vec.moveInDirection('S', { immutable: true }),
        vec.moveInDirection('W', { immutable: true }),
    ];
}

export const isInsideGrid = (vec: Vec, dimensions: Dimensions) => {
    return vec.x >= 0 && vec.y >= 0 && vec.x < dimensions.width && vec.y < dimensions.height;
}

type HeuristicFn = (pos: Vec, height: number, goal: Vec) => number;
export function aStar(heightmap: number[][], start: Vec, goal: Vec, heuristic: HeuristicFn) {
    const startStr = start.toCoordString();
    const openSet = new Set([startStr]);
    const cameFrom: Map<string, string> = new Map();

    const gScore: Map<string, number> = new Map([[startStr, 0]]);
    const fScore: Map<string, number> = new Map([[startStr, heuristic(start, heightmap[start.y][start.x], goal)]]);

    while (openSet.size) {
        const current = [...openSet].reduce((acc, val) => {
            const curFScore = fScore.get(val) ?? Infinity;
            if (curFScore < acc.fScore) {
                return { coords: val, fScore: curFScore };
            } else return acc;
        }, { fScore: Infinity } as { coords: string, fScore: number });
        const currentCoords = current.coords;
        const currentVec = Vec.fromCoordString(currentCoords);
        if (currentVec.equals(goal)) {
            console.log('FINISHED!! Reconstruct path now.');
            return 999999;
        }

        openSet.delete(currentCoords);
        const neighbors = getNeighborVectors(currentVec);
    }
}