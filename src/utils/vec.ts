export interface IVec {
    x: number;
    y: number;
}
export type ImmutableOpts = {
    immutable?: boolean
}

export class Vec implements IVec {
    constructor(public x: number, public y: number) {}

    static fromObj(obj: IVec) {
        const { x, y } = obj;
        return new Vec(x, y);
    }
    static fromArray(arr: [number, number] | number[]) {
        const [x, y] = arr;
        return new Vec(x, y);
    }

    equals(other: Vec) {
        return this.equalX(other) && this.equalY(other);
    }
    equalX(other: Vec) {
        return this.x === other.x;
    }
    equalY(other: Vec) {
        return this.y === other.y;
    }

    distManhattan(other: Vec) {
        return this.distX(other) + this.distY(other);
    }

    distX(other: Vec) {
        return Math.abs(this.x - other.x);
    }
    distY(other: Vec) {
        return Math.abs(this.y - other.y);
    }

    diffX(other: Vec) {
        return this.x - other.x;
    }
    diffY(other: Vec) {
        return this.y - other.y;
    }

    add(other: IVec, opts: ImmutableOpts = { immutable: false }) {
        if (opts.immutable) {
            return new Vec(this.x + other.x, this.y + other.y);
        }
        this.x += other.x;
        this.y += other.y;
        return this;
    }

    clone() {
        return Vec.fromObj(this);
    }

    toCoordString() {
        return `${this.x},${this.y}`;
    }

    moveInDirection(dir: Dir, opts?: ImmutableOpts) {
        const dirVec = getDirectionVec(dir);
        return this.add(dirVec, opts);
    }

    static fromCoordString(str: string) {
        const [x, y] = str.split(',').map(Number);
        return new Vec(x, y);
    }
}

export const VecRight = Object.freeze(new Vec(1, 0));
export const VecLeft = Object.freeze(new Vec(-1, 0));
export const VecUp = Object.freeze(new Vec(0, -1));
export const VecDown = Object.freeze(new Vec(0, 1));

export const VecDirEast = new Vec(1, 0);
export const VecDirWest = new Vec(-1, 0);
export const VecDirNorth = new Vec(0, -1);
export const VecDirSouth = new Vec(0, 1);

export type Dir = 'N' | 'S' | 'E' | 'W';
export const DirVecMap = {
    'N': new Vec(0, -1),
    'S': new Vec(0, 1),
    'E': new Vec(1, 0),
    'W': new Vec(-1, 0)
} as const satisfies Record<Dir, Vec>;
export const getDirectionVec = (dir: Dir): Vec => {
    return DirVecMap[dir];
}