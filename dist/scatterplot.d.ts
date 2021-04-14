/// <reference types="../../ctautocomplete/index" />
import { Point } from "./customShapes";
declare class ScatterPlot {
    width: number;
    height: number;
    backgroundColor: JavaTColor;
    gui: Gui;
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
    private readonly screenWidth;
    private readonly screenHeight;
    private readonly screenCenterX;
    private readonly screenCenterY;
    constructor(width: number, height: number, backgroundColor: JavaTColor);
    private graphToScreen;
    private screenToGraph;
    private updateAxes;
    private updatePoints;
    private inGraphBounds;
    addPoint(pt: Point): void;
    addPoints(points: Point[]): void;
    draw(): void;
    open(): void;
}
export { ScatterPlot };
