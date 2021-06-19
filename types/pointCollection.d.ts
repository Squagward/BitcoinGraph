import { Mode } from "./constants";
import { Square } from "./square";
import type { DataPoint, ScreenPoint } from "./types";
export declare class PointCollection {
    private totalDays;
    private maxPrice;
    private minPrice;
    private totalPlotPoints;
    currentPlotPoints: DataPoint[];
    currentScreenPoints: ScreenPoint[];
    mode: Mode;
    readonly square: Square;
    constructor();
    addPointsToScreen(): void;
    setPlotPoints(points: DataPoint[]): void;
    addPoint(point: DataPoint): void;
    setGraphRange(type: string): void;
    priceToPoint(index: number, price: number): {
        x: number;
        y: number;
    };
    updateRanges(): void;
}
