import numeral from "../../numeraljs";
import * as moment from "../../moment";
import { GL11 } from "./types";
export const findBounds = (arr) => {
    const prices = arr.map(({ price }) => price);
    const xMax = arr.length - 1;
    const yMin = Math.min(...prices);
    const yMax = Math.max(...prices);
    return { xMax, yMin, yMax };
};
export const addCommas = (x) => numeral(x).format("$0,0.00");
export const createList = (changedVar, list, ...fns) => {
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
export const formatDate = (date) => {
    return moment(date).utc().format("YYYY-MM-DD");
};
export const findDayOfYear = () => moment().utc().dayOfYear();
export const findMonthsAgo = (months) => {
    return moment().utc().startOf("day").subtract(months, "month");
};
export const findYearsAgo = (years) => {
    return moment().utc().startOf("day").subtract(years, "year");
};
export const getDaysBetween = (start) => {
    return (moment()
        .utc()
        .startOf("day")
        .diff(moment(start).utc().startOf("day"), "days") + 1);
};
const dayIn300 = (date) => {
    return moment(date).utc().add(300, "day");
};
export const Range = {
    "5d": 5,
    "1m": getDaysBetween(findMonthsAgo(1)),
    "3m": getDaysBetween(findMonthsAgo(3)),
    "6m": getDaysBetween(findMonthsAgo(6)),
    "ytd": findDayOfYear(),
    "1y": getDaysBetween(findYearsAgo(1)),
    "2y": getDaysBetween(findYearsAgo(2)),
    "5y": getDaysBetween(findYearsAgo(5))
};
export const loopFromStart = (startDate) => {
    const dates = [];
    let start = startDate;
    while (start < moment().utc().valueOf()) {
        dates.push(formatDate(start));
        if (dates.length !== 1) {
            start = moment(start).utc().add(1, "day").valueOf();
            dates.push(formatDate(start));
        }
        start = moment(dayIn300(start)).utc().valueOf();
    }
    return dates;
};
