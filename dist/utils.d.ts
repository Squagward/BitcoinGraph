import { DataPoint } from "./types";
export declare const distSquared: (x1: number, y1: number, x2: number, y2: number) => number;
export declare const findBounds: (arr: DataPoint[]) => {
    xMax: number;
    yMax: number;
};
export declare const addCommas: (x: number) => string;
