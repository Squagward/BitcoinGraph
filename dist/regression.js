const linearRegression = (data) => {
    const N = data.length;
    const SUM_X = data.reduce((a, b) => b[0] + a, 0);
    const SUM_Y = data.reduce((a, b) => b[1] + a, 0);
    const SUM_X2 = data.reduce((a, b) => Math.pow(b[0], 2) + a, 0);
    const SUM_Y2 = data.reduce((a, b) => Math.pow(b[1], 2) + a, 0);
    const SUM_XY = data.reduce((a, b) => a + b[0] * b[1], 0);
    const AVG_X = data.reduce((a, b) => a + b[0], 0) / N;
    const AVG_Y = data.reduce((a, b) => a + b[1], 0) / N;
    const b = (N * SUM_XY - SUM_X * SUM_Y) / (N * SUM_X2 - Math.pow(SUM_X, 2));
    const a = AVG_Y - b * AVG_X;
    const R = (N * SUM_XY - SUM_X * SUM_Y) /
        Math.sqrt((N * SUM_X2 - Math.pow(SUM_X, 2)) * (N * SUM_Y2 - Math.pow(SUM_Y, 2)));
    const R2 = Math.pow(R, 2);
    return { a, b, R, R2 };
};
const quadraticRegression = (data) => {
    /**
     * https://www.easycalculation.com/statistics/learn-quadratic-regression.php
     */
    const N = data.length;
    const SUM_X = data.reduce((a, b) => b[0] + a, 0);
    const SUM_Y = data.reduce((a, b) => b[1] + a, 0);
    const SUM_X2 = data.reduce((a, b) => Math.pow(b[0], 2) + a, 0);
    const SUM_X3 = data.reduce((a, b) => Math.pow(b[0], 3) + a, 0);
    const SUM_X4 = data.reduce((a, b) => Math.pow(b[0], 4) + a, 0);
    const SUM_XX = SUM_X2 - Math.pow(SUM_X, 2) / N;
    const SUM_XY = data.reduce((a, b) => a + b[0] * b[1], 0) - (SUM_X * SUM_Y) / N;
    const SUM_XX2 = SUM_X3 - (SUM_X2 * SUM_X) / N;
    const SUM_X2Y = data.reduce((a, b) => a + Math.pow(b[0], 2) * b[1], 0) - (SUM_X2 * SUM_Y) / N;
    const SUM_X2X2 = SUM_X4 - Math.pow(SUM_X2, 2) / N;
    let a = (SUM_X2Y * SUM_XX - SUM_XY * SUM_XX2) / (SUM_XX * SUM_X2X2 - Math.pow(SUM_XX2, 2));
    let b = (SUM_XY * SUM_X2X2 - SUM_X2Y * SUM_XX2) /
        (SUM_XX * SUM_X2X2 - Math.pow(SUM_XX2, 2));
    let c = SUM_Y / N - (b * SUM_X) / N - (a * SUM_X2) / N;
    a = Math.round(a * 1000) / 1000;
    b = Math.round(b * 1000) / 1000;
    c = Math.round(c * 1000) / 1000;
    return { a, b, c };
};
export { linearRegression, quadraticRegression };
