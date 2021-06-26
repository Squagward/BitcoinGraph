import { Mode } from "./constants";
import type { DataPoint, ScreenPoint } from "./types";
export declare class PointCollection {
    private totalDays;
    private maxPrice;
    private minPrice;
    private totalPlotPoints;
    currentPlotPoints: DataPoint[];
    currentScreenPoints: ScreenPoint[];
    mode: Mode;
    private readonly square;
    constructor();
    get left(): number;
    get right(): number;
    get top(): number;
    get bottom(): number;
    get width(): number;
    get height(): number;
    addPointsToScreen(): void;
    setPlotPoints(points: DataPoint[]): void;
    setGraphRange(type: string): void;
    priceToPoint(index: number, price: number): ScreenPoint;
    updateRanges(): void;
}
