import { Point } from "./customShapes";

const linearRegression = (data: Point[]) => {
  const N = data.length;
  const SUM_X = data.reduce((a, b) => b.x + a, 0);
  const SUM_Y = data.reduce((a, b) => b.y + a, 0);
  const SUM_X2 = data.reduce((a, b) => b.x ** 2 + a, 0);
  const SUM_Y2 = data.reduce((a, b) => b.y ** 2 + a, 0);
  const SUM_XY = data.reduce((a, b) => a + b.x * b.y, 0);

  const AVG_X = data.reduce((a, b) => a + b.x, 0) / N;
  const AVG_Y = data.reduce((a, b) => a + b.y, 0) / N;

  const b = (N * SUM_XY - SUM_X * SUM_Y) / (N * SUM_X2 - SUM_X ** 2);
  const a = AVG_Y - b * AVG_X;

  const R =
    (N * SUM_XY - SUM_X * SUM_Y) /
    Math.sqrt((N * SUM_X2 - SUM_X ** 2) * (N * SUM_Y2 - SUM_Y ** 2));
  const R2 = R ** 2;

  return { a, b, R, R2 };
};

const quadraticRegression = (data: Point[]) => {
  /**
   * https://www.easycalculation.com/statistics/learn-quadratic-regression.php
   */

  const N = data.length;
  const SUM_X = data.reduce((a, b) => b.x + a, 0);
  const SUM_Y = data.reduce((a, b) => b.y + a, 0);
  const SUM_X2 = data.reduce((a, b) => b.x ** 2 + a, 0);
  const SUM_X3 = data.reduce((a, b) => b.x ** 3 + a, 0);
  const SUM_X4 = data.reduce((a, b) => b.x ** 4 + a, 0);

  const SUM_XX = SUM_X2 - SUM_X ** 2 / N;
  const SUM_XY = data.reduce((a, b) => a + b.x * b.y, 0) - (SUM_X * SUM_Y) / N;
  const SUM_XX2 = SUM_X3 - (SUM_X2 * SUM_X) / N;
  const SUM_X2Y =
    data.reduce((a, b) => a + b.x ** 2 * b.y, 0) - (SUM_X2 * SUM_Y) / N;
  const SUM_X2X2 = SUM_X4 - SUM_X2 ** 2 / N;

  let a =
    (SUM_X2Y * SUM_XX - SUM_XY * SUM_XX2) / (SUM_XX * SUM_X2X2 - SUM_XX2 ** 2);

  let b =
    (SUM_XY * SUM_X2X2 - SUM_X2Y * SUM_XX2) /
    (SUM_XX * SUM_X2X2 - SUM_XX2 ** 2);

  let c = SUM_Y / N - (b * SUM_X) / N - (a * SUM_X2) / N;

  a = Math.round(a * 1000) / 1000;
  b = Math.round(b * 1000) / 1000;
  c = Math.round(c * 1000) / 1000;
  return { a, b, c };
};

export { linearRegression, quadraticRegression };
