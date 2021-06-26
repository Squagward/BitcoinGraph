// @ts-ignore
import numeral from "numeraljs";

export const addCommas = (x: number): string => {
  return numeral(x).format("$0,0.00[0000000000]"); // force between 2 and 10 decimal places
};

export const formatDate = (date: number): string => {
  return new Date(date).toISOString().split("T")[0];
};
