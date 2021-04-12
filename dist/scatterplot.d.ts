/// <reference types="../../ctautocomplete/index" />
import { Plot } from "./utils";
import { Point } from "./wrappers";
declare class ScatterPlot implements Plot {
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
    xStep: number;
    yStep: number;
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
    addPoint(point: Point): void;
    addPoints(points: Point[]): void;
    draw(): void;
    open(): void;
}
export { ScatterPlot };
