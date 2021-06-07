// @ts-ignore
import numeral from "../../numeraljs";
// @ts-ignore
import * as moment from "../../moment";
import { DataPoint, GL11 } from "./types";

export const formatDate = (date: string | number | Date): string => {
  return new Date(date).toISOString().split("T")[0];
};

export const findBounds = (arr: DataPoint[]) => {
  const xMax = arr.length - 1;
  const yMax = Math.max(...arr.map(({ price }) => price));
  return { xMax, yMax };
};

export const addCommas = (x: number): string => numeral(x).format("$0,0.00");

export const createList = (
  changedVar: boolean,
  list: number | undefined,
  ...fns: (() => void)[]
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

//#region Date Manip

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
  return moment(date).add(300, "day");
};

//#endregion Date Manip

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

export const Colors: Record<string, [number, number, number]> = {
  TEXT: [214, 200, 49],
  TEXT_BACKGROUND: [77, 77, 77],
  GRAPH_OUT_OF_BOUNDS: [100, 100, 100],
  AXES: [235 / 255, 64 / 255, 52 / 255],
  POINTS: [52 / 255, 168 / 255, 235 / 255],
  INTERSECT_LINES: [52 / 255, 235 / 255, 101 / 255],
  GRAPH_BACKGROUND: [77 / 255, 77 / 255, 77 / 255]
};

// max timestamps
export const StartDates: Record<string, number> = {
  BTC: 1437350400000, //"2015-07-20"
  ETH: 1463529600000, //"2016-05-18"
  DOGE: 1622678400000, //"2021-06-03"
  USDT: 1620086400000, //"2021-05-04"
  ADA: 1616025600000, //"2021-03-18"
  XLM: 1552521600000, //"2019-03-14"
  LINK: 1561680000000, //"2019-06-28"
  UNI: 1600300800000, //"2020-09-17"
  BCH: 1513728000000, //"2017-12-20"
  LTC: 1471478400000, //"2016-08-18"
  GRT: 1608163200000, //"2020-12-17"
  FIL: 1607472000000, //"2020-12-09"
  AAVE: 1607990400000, //"2020-12-15"
  EOS: 1554768000000, //"2019-04-09"
  ALGO: 1565827200000, //"2019-08-15"
  XTZ: 1565049600000, //"2019-08-06"
  YFI: 1600128000000, //"2020-09-15"
  NU: 1606867200000 //"2020-12-02"
};

export const loopFromStart = (startDate: number): string[] => {
  const dates: string[] = [];
  let start = startDate;
  while (start < moment().valueOf()) {
    dates.push(formatDate(start));
    if (dates.length !== 1) {
      start = moment(start).add(1, "day").valueOf(); // no overlapping of ranges
      dates.push(formatDate(start));
    }
    start = moment(dayIn300(start)).valueOf();
  }
  return dates;
};
