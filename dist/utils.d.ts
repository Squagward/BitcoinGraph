import type { DataPoint } from "./types";
export declare const findBounds: (arr: DataPoint[]) => {
    xMax: number;
    yMax: number;
};
export declare const addCommas: (x: number) => string;
export declare const createList: (changedVar: boolean, list: number, ...fns: Array<() => void>) => {
    changedVar: false;
    list: number;
};
export declare const formatDate: (date: number) => string;
export declare const findDayOfYear: () => number;
export declare const findMonthsAgo: (months: number) => number;
export declare const findYearsAgo: (years: number) => number;
export declare const getDaysBetween: (start: number) => number;
export declare const Range: Record<string, number>;
export declare const loopFromStart: (startDate: number) => string[];
