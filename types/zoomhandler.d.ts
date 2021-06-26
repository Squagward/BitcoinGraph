export declare class ZoomHandler {
    private zoom;
    private offsetX;
    private offsetY;
    constructor();
    zoomFunc(mx: number, my: number, dir: number): void;
    dragFunc(dx: number, dy: number): void;
    reset(): void;
    translateAndScale(): void;
    constrainMouseX(): number;
}
