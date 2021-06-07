import { DataPoint } from "./types";
export declare const formatDate: (date: string | number | Date) => string;
export declare const findBounds: (arr: DataPoint[]) => {
    xMax: number;
    yMax: number;
};
export declare const addCommas: (x: number) => string;
export declare const createList: (changedVar: boolean, list: number | undefined, ...fns: (() => void)[]) => {
    changedVar: false;
    list: number | undefined;
};
export declare const findDayOfYear: () => number;
export declare const findMonthsAgo: (months: number) => number;
export declare const findYearsAgo: (years: number) => number;
export declare const getDaysBetween: (start: number) => number;
export declare const Range: Record<string, number>;
export declare const Colors: Record<string, [number, number, number]>;
export declare const StartDates: Record<string, number>;
export declare const loopFromStart: (startDate: number) => string[];
