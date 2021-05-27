// @ts-ignore
import numeral from "../../numeraljs";
import { DataPoint, GL11 } from "./types";

export const distSquared = (x1: number, y1: number, x2: number, y2: number) => {
  return (x1 - x2) ** 2 + (y1 - y2) ** 2;
};

export const findBounds = (arr: DataPoint[]) => {
  const xMax = arr.length - 1;
  const yMax = Math.max(...arr.map(({ price }) => price));
  return { xMax, yMax };
};

export const addCommas = (x: number): string => numeral(x).format("$0,0.00");

const MS_IN_DAY = 86400000;

export const findDayOfYear = () => {
  const today = new Date();
  return Math.ceil(
    (Number(today) - Number(new Date(today.getFullYear(), 0, 1))) / MS_IN_DAY
  );
};

export const findYearsAgo = (years: number) => {
  return new Date().setFullYear(new Date().getFullYear() - years);
};

export const getDaysBetween = (start: number, end: number) => {
  const date1 = new Date(start);
  const date2 = new Date(end);

  date1.setHours(0, 0, 0);
  date2.setHours(0, 0, 0);

  return Math.round((date2.getTime() - date1.getTime()) / MS_IN_DAY);
};

export const findMonthsAgo = (months: number) => {
  return new Date().setMonth(new Date().getMonth() - months);
};

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
