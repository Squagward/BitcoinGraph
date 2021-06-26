import type { DataPoint } from "../types";
export declare const findBounds: (arr: DataPoint[]) => {
    xMax: number;
    yMin: number;
    yMax: number;
};
export declare const createList: (changedVar: boolean, list: number, ...fns: (() => void)[]) => {
    changedVar: false;
    list: number;
};
export declare const getDatesForLooping: (startDate: number) => string[];
