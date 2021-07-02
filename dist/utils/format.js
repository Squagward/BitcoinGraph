export const addCommas = (num, decimalPlaces = findDecimalPlaces(num)) => {
    const number = num.toFixed(decimalPlaces);
    const parts = String(number).split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
};
export const formatDate = (date) => {
    return new Date(date).toISOString().split("T")[0];
};
export const findDecimalPlaces = (num) => {
    var _a, _b;
    const length = (_b = (_a = String(num).split(".")[1]) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0;
    return MathLib.clamp(length, 2, 6);
};
