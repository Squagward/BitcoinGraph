import { Mode } from "./constants";
import { PointCollection } from "./pointcollection";
export declare class BitcoinGraph {
    readonly pointCollection: PointCollection;
    private readonly zoomHandler;
    private readonly gui;
    private readonly display;
    private readonly axes;
    private changedPos;
    private changedMouse;
    private clicked;
    private dragging;
    private pointList;
    private lineList;
    constructor();
    private resetTransforms;
    private closestPointToMouse;
    private shadeGraphBackground;
    private drawLabels;
    private drawIntersectLines;
    private drawPoints;
    private drawAxes;
    draw(text: string): void;
    private drawOutOfBoundsBackground;
    private setupScissor;
    drawLive(text: string): void;
    open(mode: Mode): void;
}
