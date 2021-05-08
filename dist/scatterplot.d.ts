/// <reference types="../../ctautocomplete/index" />
/// <reference lib="es2015" />
declare type Point = [number, number];
export declare class ScatterPlot {
    width: number;
    height: number;
    backgroundColor: JavaTColor;
    private gui;
    private left;
    private right;
    private top;
    private bottom;
    /** Graph coordinates */
    private plotPoints;
    /** Screen coordinates */
    private screenPoints;
    private background;
    private window;
    private xMin;
    private xMax;
    private yMin;
    private yMax;
    private zoom;
    private scaleX;
    private scaleY;
    private offsetX;
    private offsetY;
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
    addPoints(points: Point[]): void;
    draw(): void;
    open(): void;
}
export {};
