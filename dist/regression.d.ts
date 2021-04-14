import { Point } from "./customShapes";
declare const linearRegression: (data: Point[]) => {
    a: number;
    b: number;
    R: number;
    R2: number;
};
declare const quadraticRegression: (data: Point[]) => {
    a: number;
    b: number;
    c: number;
};
export { linearRegression, quadraticRegression };
