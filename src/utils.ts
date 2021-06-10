// @ts-ignore
import numeral from "../../numeraljs";
// @ts-ignore
import * as moment from "../../moment";
import { GL11 } from "./types";
import type { DataPoint } from "./types";

export const findBounds = (arr: DataPoint[]) => {
  const xMax = arr.length - 1;
  const yMax = Math.max(...arr.map(({ price }) => price));
  return { xMax, yMax };
};

export const addCommas = (x: number): string => numeral(x).format("$0,0.00");

export const createList = (
  changedVar: boolean,
  list: number,
  ...fns: Array<() => void>
) => {
  if (changedVar) {
    if (!list) {
      list = GL11.glGenLists(1);
    }

    GL11.glNewList(list, GL11.GL_COMPILE);

    GL11.glDisable(GL11.GL_TEXTURE_2D);
    GL11.glEnable(GL11.GL_SCISSOR_TEST);

    fns.forEach((fn) => fn());

    GL11.glDisable(GL11.GL_SCISSOR_TEST);
    GL11.glEnable(GL11.GL_TEXTURE_2D);

    GL11.glEndList();

    changedVar = false;
  }
  return { changedVar, list };
};

export const formatDate = (date: number): string => {
  return new Date(date).toISOString().split("T")[0];
};

export const findDayOfYear = (): number => moment().utc().dayOfYear();

export const findMonthsAgo = (months: number): number => {
  return moment().utc().startOf("day").subtract(months, "month");
};

export const findYearsAgo = (years: number): number => {
  return moment().utc().startOf("day").subtract(years, "year");
};

export const getDaysBetween = (start: number): number => {
  return (
    moment()
      .utc()
      .startOf("day")
      .diff(moment(start).utc().startOf("day"), "days") + 1
  );
};

const dayIn300 = (date: number): string => {
  return moment(date).utc().add(300, "day");
};

export const Range: Record<string, number> = {
  "5d": 5,
  "1m": getDaysBetween(findMonthsAgo(1)),
  "3m": getDaysBetween(findMonthsAgo(3)),
  "6m": getDaysBetween(findMonthsAgo(6)),
  "ytd": findDayOfYear(),
  "1y": getDaysBetween(findYearsAgo(1)),
  "2y": getDaysBetween(findYearsAgo(2)),
  "5y": getDaysBetween(findYearsAgo(5))
};

export const loopFromStart = (startDate: number): string[] => {
  const dates: string[] = [];
  let start = startDate;
  while (start < moment().utc().valueOf()) {
    dates.push(formatDate(start));
    if (dates.length !== 1) {
      start = moment(start).utc().add(1, "day").valueOf(); // no overlapping of ranges
      dates.push(formatDate(start));
    }
    start = moment(dayIn300(start)).utc().valueOf();
  }
  return dates;
};
