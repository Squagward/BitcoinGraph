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
    private plotPoints;
    private screenPoints;
    private background;
    private window;
    private zoom;
    private offsetX;
    private offsetY;
    private xAxis;
    private yAxis;
    private changed;
    private pointList?;
    private screenWidth;
    private screenHeight;
    private screenCenterX;
    private screenCenterY;
    constructor(width: number, height: number, backgroundColor: JavaTColor);
    private findBounds;
    private addPointsToScreen;
    addPlotPoints(points: Point[]): void;
    draw(): void;
    private shadeGraphBackground;
    private drawPoints;
    private drawAxes;
    open(): void;
}
export {};
