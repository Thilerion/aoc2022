export interface IVec {
    x: number;
    y: number;
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

    add(other: IVec) {
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
}

export const VecRight = Object.freeze(new Vec(1, 0));
export const VecLeft = Object.freeze(new Vec(-1, 0));
export const VecUp = Object.freeze(new Vec(0, -1));
export const VecDown = Object.freeze(new Vec(0, 1));