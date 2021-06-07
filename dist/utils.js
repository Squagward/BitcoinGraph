import numeral from "../../numeraljs";
import * as moment from "../../moment";
import { GL11 } from "./types";
export const formatDate = (date) => {
    return new Date(date).toISOString().split("T")[0];
};
export const findBounds = (arr) => {
    const xMax = arr.length - 1;
    const yMax = Math.max(...arr.map(({ price }) => price));
    return { xMax, yMax };
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
    return moment(date).add(300, "day");
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
export const Colors = {
    TEXT: [214, 200, 49],
    TEXT_BACKGROUND: [77, 77, 77],
    GRAPH_OUT_OF_BOUNDS: [100, 100, 100],
    AXES: [235 / 255, 64 / 255, 52 / 255],
    POINTS: [52 / 255, 168 / 255, 235 / 255],
    INTERSECT_LINES: [52 / 255, 235 / 255, 101 / 255],
    GRAPH_BACKGROUND: [77 / 255, 77 / 255, 77 / 255]
};
export const StartDates = {
    BTC: 1437350400000,
    ETH: 1463529600000,
    DOGE: 1622678400000,
    USDT: 1620086400000,
    ADA: 1616025600000,
    XLM: 1552521600000,
    LINK: 1561680000000,
    UNI: 1600300800000,
    BCH: 1513728000000,
    LTC: 1471478400000,
    GRT: 1608163200000,
    FIL: 1607472000000,
    AAVE: 1607990400000,
    EOS: 1554768000000,
    ALGO: 1565827200000,
    XTZ: 1565049600000,
    YFI: 1600128000000,
    NU: 1606867200000
};
export const loopFromStart = (startDate) => {
    const dates = [];
    let start = startDate;
    while (start < moment().valueOf()) {
        dates.push(formatDate(start));
        if (dates.length !== 1) {
            start = moment(start).add(1, "day").valueOf();
            dates.push(formatDate(start));
        }
        start = moment(dayIn300(start)).valueOf();
    }
    return dates;
};
