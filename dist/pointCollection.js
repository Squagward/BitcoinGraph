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
        if (type.toLowerCase() === "max") {
            this.currentPlotPoints = this.totalPlotPoints;
        }
        else {
            this.currentPlotPoints = this.totalPlotPoints.slice(-Range[type]);
        }
    }
    priceToPoint(index, price) {
        const x = MathLib.map(index, 0, this.totalDays, this.square.left, this.square.right);
        let y = this.square.bottom;
        switch (this.mode) {
            case 0: {
                y -= (price / this.maxPrice) * this.square.height;
                break;
            }
            case 1: {
                y -=
                    ((price - this.minPrice) / (this.maxPrice - this.minPrice || 1)) *
                        this.square.height;
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
