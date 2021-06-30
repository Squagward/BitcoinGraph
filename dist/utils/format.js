import numeral from "../../../numeraljs";
export const addCommas = (x) => {
    return numeral(x).format("$0,0.00[0000000000]");
};
export const formatDate = (date) => {
    return new Date(date).toISOString().split("T")[0];
};
