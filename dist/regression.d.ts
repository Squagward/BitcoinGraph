declare const linearRegression: (data: [number, number][]) => {
    a: number;
    b: number;
    R: number;
    R2: number;
};
declare const quadraticRegression: (data: [number, number][]) => {
    a: number;
    b: number;
    c: number;
};
export { linearRegression, quadraticRegression };
