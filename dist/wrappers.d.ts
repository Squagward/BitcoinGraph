declare abstract class CustomShape {
    protected r: number;
    protected g: number;
    protected b: number;
    protected a: number;
    constructor(r: number, g: number, b: number, a?: number);
    abstract draw(): void;
    abstract toString(): string;
    setColor(r: number, g: number, b: number, a?: number): void;
    protected beginDraw(): void;
    protected endDraw(): void;
}
declare class Point extends CustomShape {
    x: number;
    y: number;
    thickness: number;
    protected r: number;
    protected g: number;
    protected b: number;
    protected a: number;
    constructor(x: number, y: number, thickness: number, r?: number, g?: number, b?: number, a?: number);
    setPos(x: number, y: number): void;
    draw(): void;
    toString(): string;
}
declare class Line extends CustomShape {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    thickness: number;
    r: number;
    g: number;
    b: number;
    a: number;
    constructor(x1: number, y1: number, x2: number, y2: number, thickness: number, r: number, g: number, b: number, a?: number);
    setStartPos(x1: number, y1: number): void;
    setEndPos(x2: number, y2: number): void;
    setThickness(thickness: number): void;
    draw(): void;
    toString(): string;
}
export { Line, Point };
