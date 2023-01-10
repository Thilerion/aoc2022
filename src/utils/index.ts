/**
 * Root for your util libraries.
 *
 * You can import them in the src/template/index.ts,
 * or in the specific file.
 *
 * Note that this repo uses ES Modules, so you have to explicitly specify
 * .js extension (yes, .js not .ts - even for TypeScript files)
 * for imports that are not imported from node_modules.
 *
 * For example:
 *
 *   correct:
 *
 *     import _ from 'lodash'
 *     import myLib from '../utils/myLib.js'
 *     import { myUtil } from '../utils/index.js'
 *
 *   incorrect:
 *
 *     import _ from 'lodash'
 *     import myLib from '../utils/myLib.ts'
 *     import { myUtil } from '../utils/index.ts'
 *
 *   also incorrect:
 *
 *     import _ from 'lodash'
 *     import myLib from '../utils/myLib'
 *     import { myUtil } from '../utils'
 *
 */

//  const parseInput = (rawInput: string) => rawInput.split('\n').map(row => row.trim().split(' ').map(v => v.trim()) as [PlayerA, PlayerB]);

export type SplitRowsOptions<T extends boolean> = {
    emptyRows?: number | boolean,
    trimRows?: boolean,
    asNumber?: T
}
export type SplitRowsDoubleOptions<T extends boolean> = {
    asNumber?: T,
    trimRows?: boolean
}

export function splitRows(input: string, opts: SplitRowsOptions<true>): number[];
export function splitRows(input: string, opts?: SplitRowsOptions<false>): string[];
export function splitRows(input: string, opts?: SplitRowsOptions<boolean>): number[] | string[];
export function splitRows(input: string, opts: SplitRowsOptions<boolean> = {}) {
    let { emptyRows = false, trimRows = true, asNumber = false } = opts;
    const numNewlines = emptyRows ? +emptyRows : 0;

    const newlines = '\n'.repeat(numNewlines + 1);
    const res = input.trim().split(newlines);
    if (trimRows) {
        if (asNumber) {
            return res.map(r => Number(r.trim()));
        }
        return res.map(r => r.trim());
    } else {
        if (asNumber) {
            return Number(res);
        }
        return res;
    }
}

export function splitRowsDouble(input: string, opts: SplitRowsDoubleOptions<true>): number[][];
export function splitRowsDouble(input: string, opts: SplitRowsDoubleOptions<false>): string[][];
export function splitRowsDouble(input: string, opts?: SplitRowsDoubleOptions<boolean>): number[][] | string[][];
export function splitRowsDouble(input: string, opts: SplitRowsDoubleOptions<boolean> = {}) {
    const { asNumber = false, trimRows = true } = opts;
    const byEmptyRow = splitRows(input, { emptyRows: 1, trimRows: false, asNumber: false });
    return byEmptyRow.map(row => splitRows(row, { emptyRows: 0, trimRows, asNumber }));
}

export const sum = (arr: number[]) => arr.reduce((acc, val) => acc + val, 0);