import { Range } from "./constants";
import { Square } from "./square";
import { findBounds } from "./utils/index";
export class PointCollection {
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
    setGraphRange(type) {
        this.currentPlotPoints = this.totalPlotPoints.slice(-Range[type]);
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
                const priceRange = this.maxPrice - this.minPrice;
                const denominator = priceRange || 1;
                y -= ((price - this.minPrice) / denominator) * this.height;
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
