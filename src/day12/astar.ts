import { Vec } from "../utils/vec.js";

type Node<T> = { f: number, g?: number, h?: number, neighbors: Node<T>[], value: T, pos: Vec, parent?: NNode };
type NNode = Node<number>;

export class AStar {
    width: number;
    height: number;
    grid: NNode[][];

    openSet: NNode[] = [];
    closedSet: NNode[] = [];
    path: NNode[] = [];
    start!: NNode;
    end!: NNode;

    constructor(baseGrid: number[][]) {
        this.width = baseGrid[0].length;
        this.height = baseGrid.length;

        const grid: NNode[][] = [];
        for (let y = 0; y < this.height; y++) {
            const row: NNode[] = [];
            for (let x = 0; x < this.width; x++) {
                row.push({ value: baseGrid[y][x], pos: new Vec(x, y), f: 0 } as NNode);
            }
            grid.push(row);
        }
        this.grid = grid;
        const updatedGrid = this.initAllNeighbors(grid);
        this.grid = updatedGrid;
    }

    init(start: Vec, end: Vec) {
        const startNode = this.getNode(start.x, start.y);
        const endNode = this.getNode(end.x, end.y);
        this.start = startNode;
        this.end = endNode;
        this.openSet = [startNode];
        this.closedSet = [];
        this.path = [];

        return this;
    }

    getNode(x: number, y: number) {
        if (!this.isInsideGrid(new Vec(x, y))) {
            throw new Error(`Node at (${x},${y}) is not inside grid.`);
        }
        return this.grid[y][x];
    }

    heuristic(posA: Vec, posB: Vec) {
        return posA.distManhattan(posB);
    }
    isInsideGrid(pos: Vec) {
        return pos.x >= 0 && pos.y >= 0 && pos.x < this.width && pos.y < this.height;
    }
    isValidNeighbor(from: NNode, to: NNode) {
        if (!this.isInsideGrid(to.pos)) return false;
        const fromZ = from.value;
        const toZ = to.value;

        if (toZ - fromZ > 1) return false;
        return true;
    }
    private getNeighbors(node: NNode) {
        const vecs = getNeighborVectors(node.pos);
        return vecs.filter(v => this.isInsideGrid(v)).map(({ x, y }) => {
            return this.getNode(x, y);
        });
    }
    private getValidNeighbors(node: NNode) {
        if (node.neighbors != null) return node.neighbors;
        const nbs = this.getNeighbors(node);
        const validNbs = nbs.filter(nb => this.isValidNeighbor(node, nb));
        return validNbs;
    }
    private updateNodeNeighbors(node: NNode) {
        if (node.neighbors != null) {
            throw new Error('Node already has neighbors...');
        }
        const nbs = this.getValidNeighbors(node);
        node.neighbors = nbs;
    }
    private initAllNeighbors(grid: NNode[][]) {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const node = grid[y][x];
                this.updateNodeNeighbors(node);
            }
        }
        return grid;
    }

    search() {
        while (this.openSet.length > 0) {
            let lowestIndex = 0;
            for (let i = 0; i < this.openSet.length; i++) {
                if (this.openSet[i].f < this.openSet[lowestIndex].f) {
                    lowestIndex = i;
                }
            }
            let current = this.openSet[lowestIndex];

            if (current.pos.equals(this.end.pos)) {
                let temp = current;
                this.path.push(temp);
                while (temp.parent) {
                    this.path.push(temp.parent);
                    temp = temp.parent;
                }
                console.log(`DONE! Path length is "${this.path.length}"!`);
                return [...this.path.reverse()];
            }

            this.openSet.splice(lowestIndex, 1);
            this.closedSet.push(current);

            let neighbors = current.neighbors;

            for (let i = 0; i < neighbors.length; i++) {
                let nb = neighbors[i];
                if (this.closedSet.findIndex(n => n.pos.equals(nb.pos)) < 0) {
                    let possibleG = (current?.g ?? 0) + 1;
                    if (this.openSet.findIndex(n => n.pos.equals(nb.pos)) < 0) {
                        this.openSet.push(nb);
                    } else if (possibleG >= (nb?.g ?? 0)) {
                        continue;
                    }

                    nb.g = possibleG;
                    nb.h = this.heuristic(nb.pos, this.end.pos);
                    nb.f = nb.g + nb.h;
                    nb.parent = current;
                }
            }
        }

        return [];
    }
}

const getNeighborVectors = (vec: Vec): [N: Vec, E: Vec, S: Vec, W: Vec] => {
    return [
        vec.moveInDirection('N', { immutable: true }),
        vec.moveInDirection('E', { immutable: true }),
        vec.moveInDirection('S', { immutable: true }),
        vec.moveInDirection('W', { immutable: true }),
    ];
}