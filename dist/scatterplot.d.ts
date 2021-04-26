/// <reference types="../../ctautocomplete/index" />
declare class ScatterPlot {
    width: number;
    height: number;
    backgroundColor: JavaTColor;
    private gui;
    left: number;
    right: number;
    top: number;
    bottom: number;
    /** Graph coordinates */
    private plotPoints;
    /** Screen coordinates */
    private screenPoints;
    private background;
    private window;
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;
    zoom: number;
    scaleX: number;
    scaleY: number;
    offsetX: number;
    offsetY: number;
    private xAxis;
    private yAxis;
    private changed;
    private pointList?;
    private readonly screenWidth;
    private readonly screenHeight;
    private readonly screenCenterX;
    private readonly screenCenterY;
    constructor(width: number, height: number, backgroundColor: JavaTColor);
    private fixupRanges;
    private updateRanges;
    private graphToScreen;
    private screenToGraph;
    private updateAxes;
    private updatePoints;
    addPoint(x: number, y: number): void;
    addPoints(points: [number, number][]): void;
    draw(): void;
    open(): void;
}
export { ScatterPlot };
