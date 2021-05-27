import { DataPoint } from "./types";
export declare const distSquared: (x1: number, y1: number, x2: number, y2: number) => number;
export declare const findBounds: (arr: DataPoint[]) => {
    xMax: number;
    yMax: number;
};
export declare const addCommas: (x: number) => string;
export declare const findDayOfYear: () => number;
export declare const findYearsAgo: (years: number) => number;
export declare const getDaysBetween: (start: number, end: number) => number;
export declare const findMonthsAgo: (months: number) => number;
export declare const createList: (changedVar: boolean, list: number | undefined, ...fns: (() => void)[]) => {
    changedVar: false;
    list: number | undefined;
};
