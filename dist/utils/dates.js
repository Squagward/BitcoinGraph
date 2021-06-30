import * as moment from "../../../moment";
export const getDayOfYear = () => moment().utc().dayOfYear();
export const getDayOfMonthsAgo = (months) => {
    return moment().utc().startOf("day").subtract(months, "month");
};
export const getDayOfYearsAgo = (years) => {
    return moment().utc().startOf("day").subtract(years, "year");
};
export const getFinalDayInRange = (date) => {
    return moment(date).utc().add(300, "day");
};
export const getDaysBetween = (start) => {
    return (moment()
        .utc()
        .startOf("day")
        .diff(moment(start).utc().startOf("day"), "days") + 1);
};
