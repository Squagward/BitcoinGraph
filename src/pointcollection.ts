import { Mode, Range } from "./constants";
import { Square } from "./square";
import type { DataPoint, ScreenPoint } from "./types";
import { findBounds } from "./utils/index";

export class PointCollection {
  private totalDays: number;
  private maxPrice: number;
  private minPrice: number;

  private totalPlotPoints: DataPoint[];
  public currentPlotPoints: DataPoint[];
  public currentScreenPoints: ScreenPoint[];

  public mode!: Mode;

  private readonly square: Square;

  constructor() {
    this.totalDays = 0;
    this.maxPrice = 0;
    this.minPrice = 0;

    this.totalPlotPoints = [];
    this.currentPlotPoints = [];
    this.currentScreenPoints = [];

    const width = Renderer.screen.getWidth();
    const height = Renderer.screen.getHeight();
    const dimension = width > height ? height - 34 : width - 34;

    this.square = new Square(dimension, dimension);
  }

  public get left(): number {
    return this.square.left;
  }

  public get right(): number {
    return this.square.right;
  }

  public get top(): number {
    return this.square.top;
  }

  public get bottom(): number {
    return this.square.bottom;
  }

  public get width(): number {
    return this.square.width;
  }

  public get height(): number {
    return this.square.height;
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

  public setGraphRange(type: string): void {
    this.currentPlotPoints = this.totalPlotPoints.slice(-Range[type]);
  }

  public priceToPoint(index: number, price: number): ScreenPoint {
    const x = MathLib.map(index, 0, this.totalDays, this.left, this.right);
    let y = this.bottom;

    switch (this.mode) {
      case Mode.HISTORICAL: {
        y -= (price / this.maxPrice) * this.height;
        break;
      }
      case Mode.LIVE: {
        const priceRange = this.maxPrice - this.minPrice;
        const denominator = priceRange || 1;

        y -= ((price - this.minPrice) / denominator) * this.height;
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
