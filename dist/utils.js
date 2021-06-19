import * as moment from "../../moment";
import numeral from "../../numeraljs";
import { GL11 } from "./constants";
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
export const addCommas = (x) => numeral(x).format("$0,0.0000");
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
const getDayOfYear = () => moment().utc().dayOfYear();
const getDayOfMonthsAgo = (months) => {
    return moment().utc().startOf("day").subtract(months, "month");
};
const getDayOfYearsAgo = (years) => {
    return moment().utc().startOf("day").subtract(years, "year");
};
const getFinalDayInRange = (date) => {
    return moment(date).utc().add(300, "day");
};
const getDaysBetween = (start) => {
    return (moment()
        .utc()
        .startOf("day")
        .diff(moment(start).utc().startOf("day"), "days") + 1);
};
export const Range = {
    "5d": 5,
    "1m": getDaysBetween(getDayOfMonthsAgo(1)),
    "3m": getDaysBetween(getDayOfMonthsAgo(3)),
    "6m": getDaysBetween(getDayOfMonthsAgo(6)),
    "ytd": getDayOfYear(),
    "1y": getDaysBetween(getDayOfYearsAgo(1)),
    "2y": getDaysBetween(getDayOfYearsAgo(2)),
    "5y": getDaysBetween(getDayOfYearsAgo(5))
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
