export const distSquared = (x1, y1, x2, y2) => {
    return Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2);
};
export const findBounds = (arr) => {
    const xMax = arr.length;
    const yMax = Math.max(...arr.map((p) => p.val));
    return { xMax, yMax };
};
