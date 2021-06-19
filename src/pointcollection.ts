import { GraphDimensions, Mode } from "./constants";
import { Square } from "./square";
import type { DataPoint, ScreenPoint } from "./types";
import { findBounds, Range } from "./utils";

export class PointCollection {
  private totalDays: number;
  private maxPrice: number;
  private minPrice: number;

  private totalPlotPoints: DataPoint[];
  public currentPlotPoints: DataPoint[];
  public currentScreenPoints: ScreenPoint[];

  public mode!: Mode;

  public readonly square: Square;

  constructor() {
    this.totalDays = 0;
    this.maxPrice = 0;
    this.minPrice = 0;

    this.totalPlotPoints = [];
    this.currentPlotPoints = [];
    this.currentScreenPoints = [];

    this.square = new Square(GraphDimensions);
  }

  public addPointsToScreen(): void {
    this.currentScreenPoints = [];

    this.currentPlotPoints.forEach(({ price }, i) => {
      this.currentScreenPoints.push(this.priceToPoint(i, price));
    });
  }

  public setPlotPoints(points: DataPoint[]): void {
    this.totalPlotPoints = points;
  }

  public addPoint(point: DataPoint): void {
    this.currentPlotPoints.push(point);

    this.updateRanges();

    this.currentScreenPoints.push(
      this.priceToPoint(this.currentPlotPoints.length - 1, point.price)
    );
  }

  public setGraphRange(type: string): void {
    if (type.toLowerCase() === "max") {
      this.currentPlotPoints = this.totalPlotPoints;
    } else {
      this.currentPlotPoints = this.totalPlotPoints.slice(-Range[type]);
    }
  }

  public priceToPoint(index: number, price: number) {
    const x = MathLib.map(
      index,
      0,
      this.totalDays,
      this.square.left,
      this.square.right
    );
    let y = this.square.bottom;

    switch (this.mode) {
      case Mode.HISTORICAL: {
        y -= (price / this.maxPrice) * this.square.height;
        break;
      }
      case Mode.LIVE: {
        y -=
          ((price - this.minPrice) / (this.maxPrice - this.minPrice || 1)) *
          this.square.height;
        break;
      }
    }
    return { x, y };
  }

  public updateRanges(): void {
    const { xMax, yMin, yMax } = findBounds(this.currentPlotPoints);
    this.totalDays = xMax;
    this.maxPrice = yMax;
    this.minPrice = yMin;
  }
}
