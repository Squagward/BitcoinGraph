/// <reference types="../../ctautocomplete/index" />
/// <reference lib="es2015" />
import { DataPoint } from "./types";
export declare class ScatterPlot {
    private width;
    private height;
    private backgroundColor;
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
    private changedPos;
    private changedMouse;
    private pointList?;
    private lineList?;
    private mousePos;
    private screenWidth;
    private screenHeight;
    private screenCenterX;
    private screenCenterY;
    private totalDays;
    private maxPrice;
    constructor(width: number, height: number, backgroundColor: JavaTColor);
    private addPointsToScreen;
    addPlotPoints(points: DataPoint[]): void;
    private priceToPoint;
    private constrainMouseX;
    private closestPointToMouse;
    private shadeGraphBackground;
    private drawIntersectLines;
    private drawPoints;
    private drawAxes;
    draw(): void;
    open(): void;
}
