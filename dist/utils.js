import numeral from "../../numeraljs";
export const distSquared = (x1, y1, x2, y2) => {
    return Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2);
};
export const findBounds = (arr) => {
    const xMax = arr.length - 1;
    const yMax = Math.max(...arr.map(([, price]) => price));
    return { xMax, yMax };
};
export const addCommas = (x) => numeral(x).format("$0,0.00");
