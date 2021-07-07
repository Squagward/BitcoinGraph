import {
  PixelConstraint,
  SiblingConstraint,
  UIText
} from "../../../Elementa/index";
// @ts-ignore
import * as moment from "../../../moment";
import { GL11 } from "../constants";
import type { DataPoint } from "../types";
import { getFinalDayInRange } from "./dates";
import { formatDate } from "./format";

export const findBounds = (arr: DataPoint[]) => {
  let yMin = arr[0].price;
  let yMax = arr[0].price;

  let price: number;
  for ({ price } of arr) {
    yMin = Math.min(yMin, price);
    yMax = Math.max(yMax, price);
  }

  const xMax = arr.length - 1;
  return { xMax, yMin, yMax };
};

export const createList = (
  changedVar: boolean,
  list: number,
  ...fns: (() => void)[]
) => {
  let hasChanged = changedVar;
  let changedList = list;

  if (hasChanged) {
    if (list === undefined) {
      changedList = GL11.glGenLists(1);
    }

    GL11.glNewList(changedList, GL11.GL_COMPILE);

    GL11.glDisable(GL11.GL_TEXTURE_2D);
    GL11.glEnable(GL11.GL_SCISSOR_TEST);

    fns.forEach((fn) => fn());

    GL11.glDisable(GL11.GL_SCISSOR_TEST);
    GL11.glEnable(GL11.GL_TEXTURE_2D);

    GL11.glEndList();

    hasChanged = false;
  }
  return { changedVar: hasChanged, list: changedList };
};

export const getDatesForLooping = (startDate: number): string[] => {
  const dates: string[] = [];
  let start = startDate;
  while (start < moment().utc().valueOf()) {
    dates.push(formatDate(start));
    if (dates.length !== 1) {
      start = moment(start).utc().add(1, "day").valueOf(); // no overlapping of ranges
      dates.push(formatDate(start));
    }
    start = moment(getFinalDayInRange(start)).utc().valueOf();
  }
  return dates;
};

const createEmptyChild = (): UIText => {
  return new UIText("")
    .setX(new PixelConstraint(5))
    .setY(new SiblingConstraint());
};

export const createEmptyChildren = (amount: number): UIText[] => {
  const arr: UIText[] = [];
  for (let i = 0; i < amount; i++) {
    arr.push(createEmptyChild());
  }
  return arr;
};

export const getPriceChangeColor = (
  currentPrice: number,
  lastPrice: number
) => {
  if (currentPrice < lastPrice) return "§c";
  if (currentPrice > lastPrice) return "§a";
  return "";
};
