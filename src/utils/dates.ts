// @ts-ignore
import * as moment from "../../../moment";

export const getDayOfYear = (): number => moment().utc().dayOfYear();

export const getDayOfMonthsAgo = (months: number): number => {
  return moment().utc().startOf("day").subtract(months, "month");
};

export const getDayOfYearsAgo = (years: number): number => {
  return moment().utc().startOf("day").subtract(years, "year");
};

export const getFinalDayInRange = (date: number): string => {
  return moment(date).utc().add(300, "day");
};

export const getDaysBetween = (start: number): number => {
  return (
    moment()
      .utc()
      .startOf("day")
      .diff(moment(start).utc().startOf("day"), "days") + 1
  );
};
