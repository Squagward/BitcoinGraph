// @ts-ignore
import numeral from "../../numeraljs";
import { DataPoint } from "./types";

export const distSquared = (x1: number, y1: number, x2: number, y2: number) => {
  return (x1 - x2) ** 2 + (y1 - y2) ** 2;
};

export const findBounds = (arr: DataPoint[]) => {
  const xMax = arr.length - 1;
  const yMax = Math.max(...arr.map(([, price]) => price));
  return { xMax, yMax };
};

export const addCommas = (x: number): string => numeral(x).format("$0,0.00");
