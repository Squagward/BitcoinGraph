import { GraphDimensions } from "./constants";
import { Square } from "./square";
import { findBounds, Range } from "./utils";
export class PointCollection {
    constructor() {
        this.totalDays = 0;
        this.maxPrice = 0;
        this.minPrice = 0;
        this.totalPlotPoints = [];
        this.currentPlotPoints = [];
        this.currentScreenPoints = [];
        this.square = new Square(GraphDimensions);
    }
    get left() {
        return this.square.left;
    }
    get right() {
        return this.square.right;
    }
    get top() {
        return this.square.top;
    }
    get bottom() {
        return this.square.bottom;
    }
    get width() {
        return this.square.width;
    }
    get height() {
        return this.square.height;
    }
    addPointsToScreen() {
        this.currentScreenPoints = [];
        this.currentPlotPoints.forEach(({ price }, i) => {
            this.currentScreenPoints.push(this.priceToPoint(i, price));
        });
    }
    setPlotPoints(points) {
        this.totalPlotPoints = points;
    }
    addPoint(point) {
        this.currentPlotPoints.push(point);
        this.updateRanges();
        this.currentScreenPoints.push(this.priceToPoint(this.currentPlotPoints.length - 1, point.price));
    }
    setGraphRange(type) {
        this.currentPlotPoints = this.totalPlotPoints.slice(Range[-type]);
    }
    priceToPoint(index, price) {
        const x = MathLib.map(index, 0, this.totalDays, this.left, this.right);
        let y = this.bottom;
        switch (this.mode) {
            case 0: {
                y -= (price / this.maxPrice) * this.height;
                break;
            }
            case 1: {
                y -=
                    ((price - this.minPrice) / (this.maxPrice - this.minPrice || 1)) *
                        this.height;
                break;
            }
        }
        return { x, y };
    }
    updateRanges() {
        const { xMax, yMin, yMax } = findBounds(this.currentPlotPoints);
        this.totalDays = xMax;
        this.maxPrice = yMax;
        this.minPrice = yMin;
    }
}
