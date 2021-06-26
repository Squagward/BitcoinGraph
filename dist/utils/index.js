import * as moment from "moment";
import { GL11 } from "../constants";
import { getFinalDayInRange } from "./dates";
import { formatDate } from "./format";
export const findBounds = (arr) => {
    let yMin = arr[0].price;
    let yMax = arr[0].price;
    let price;
    for ({ price } of arr) {
        yMin = Math.min(yMin, price);
        yMax = Math.max(yMax, price);
    }
    const xMax = arr.length - 1;
    return { xMax, yMin, yMax };
};
export const createList = (changedVar, list, ...fns) => {
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
export const getDatesForLooping = (startDate) => {
    const dates = [];
    let start = startDate;
    while (start < moment().utc().valueOf()) {
        dates.push(formatDate(start));
        if (dates.length !== 1) {
            start = moment(start).utc().add(1, "day").valueOf();
            dates.push(formatDate(start));
        }
        start = moment(getFinalDayInRange(start)).utc().valueOf();
    }
    return dates;
};
