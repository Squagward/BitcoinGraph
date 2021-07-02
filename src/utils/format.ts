export const addCommas = (
  num: number,
  decimalPlaces: number = findDecimalPlaces(num)
): string => {
  const number = num.toFixed(decimalPlaces);
  const parts = String(number).split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return parts.join(".");
};

export const formatDate = (date: number): string => {
  return new Date(date).toISOString().split("T")[0];
};

export const findDecimalPlaces = (num: number): number => {
  const length = String(num).split(".")[1]?.length ?? 0;
  return MathLib.clamp(length, 2, 6);
};
