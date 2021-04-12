import * as Elementa from "../../Elementa/index";
import { Line, Point } from "./wrappers";
class ScatterPlot {
    constructor(width, height, backgroundColor) {
        this.width = width;
        this.height = height;
        this.backgroundColor = backgroundColor;
        this.screenWidth = Renderer.screen.getWidth();
        this.screenHeight = Renderer.screen.getHeight();
        this.screenCenterX = this.screenWidth / 2;
        this.screenCenterY = this.screenHeight / 2;
        this.gui = new Gui();
        this.width = width;
        this.height = height;
        this.left = this.screenCenterX - this.width / 2;
        this.right = this.screenCenterX + this.width / 2;
        this.top = this.screenCenterY - this.height / 2;
        this.bottom = this.screenCenterY + this.height / 2;
        this.plotPoints = [];
        this.screenPoints = [];
        this.background = new Elementa.UIBlock(this.backgroundColor)
            .setWidth(new Elementa.PixelConstraint(this.width))
            .setHeight(new Elementa.PixelConstraint(this.height))
            .setX(new Elementa.PixelConstraint(this.left))
            .setY(new Elementa.PixelConstraint(this.top));
        // starting dimensions
        this.xMin = -10;
        this.xMax = 10;
        this.yMin = -10;
        this.yMax = 10;
        this.zoom = 1;
        this.xStep = this.width / (this.xMax - this.xMin);
        this.yStep = this.height / (this.yMax - this.yMin);
        this.offsetX = -this.screenCenterX;
        this.offsetY = -this.screenCenterY;
        this.xAxis = new Line(this.left, this.graphToScreen(this.xMin, 0).y, this.right, this.graphToScreen(this.xMax, 0).y, 1, 1, 0, 0);
        this.yAxis = new Line(this.graphToScreen(0, this.yMax).x, this.top, this.graphToScreen(0, this.yMin).x, this.bottom, 1, 1, 0, 0);
        // @ts-ignore
        this.window = new Elementa.Window().addChild(this.background);
        this.gui.registerScrolled((mx, my, dir) => {
            const { x: mxPlotBefore, y: myPlotBefore } = this.screenToGraph(mx, my);
            switch (dir) {
                case -1:
                    // zooming out
                    this.zoom *= 0.9;
                    break;
                case 1:
                    // zooming in
                    this.zoom *= 10 / 9;
                    break;
            }
            const { x: mxPlotAfter, y: myPlotAfter } = this.screenToGraph(mx, my);
            this.offsetX += mxPlotBefore - mxPlotAfter;
            this.offsetY += myPlotBefore - myPlotAfter;
            this.updateAxes();
            this.updatePoints();
        });
        register("dragged", (dx, dy, mx, my, btn) => {
            if (!this.gui.isOpen())
                return;
            this.offsetX -= dx / this.zoom;
            this.offsetY += dy / this.zoom;
            this.updateAxes();
            this.updatePoints();
        });
    }
    graphToScreen(x, y) {
        const outX = (x - this.offsetX) * this.zoom;
        const outY = this.screenHeight - (y - this.offsetY) * this.zoom;
        return { x: outX, y: outY };
    }
    screenToGraph(x, y) {
        const outX = x / this.zoom + this.offsetX;
        const outY = (this.screenHeight - y) / this.zoom + this.offsetY;
        return { x: outX, y: outY };
    }
    updateAxes() {
        let { x: xZero, y: yZero } = this.graphToScreen(0, 0);
        if (yZero <= this.bottom && yZero >= this.top) {
            this.xAxis.setStartPos(this.left, yZero);
            this.xAxis.setEndPos(this.right, yZero);
        }
        else {
            // set off screen if it is out of bounds
            this.xAxis.setStartPos(-100, -100);
            this.xAxis.setEndPos(-100, -100);
        }
        if (xZero >= this.left && xZero <= this.right) {
            this.yAxis.setStartPos(xZero, this.top);
            this.yAxis.setEndPos(xZero, this.bottom);
        }
        else {
            // set off screen if it is out of bounds
            this.yAxis.setStartPos(-100, -100);
            this.yAxis.setEndPos(-100, -100);
        }
        const topLeft = this.screenToGraph(this.left, this.top);
        const bottomRight = this.screenToGraph(this.right, this.bottom);
        this.xMin = topLeft.x / this.xStep;
        this.yMin = topLeft.y / this.yStep;
        this.xMax = bottomRight.x / this.xStep;
        this.yMax = bottomRight.y / this.yStep;
        console.log(this.xMin.toFixed(2), this.xMax.toFixed(2), this.yMin.toFixed(2), this.yMax.toFixed(2));
    }
    updatePoints() {
        this.screenPoints = [];
        this.plotPoints.forEach((pt) => {
            const { x, y } = this.graphToScreen(pt.x, pt.y);
            const newPoint = new Point(x, y, pt.thickness);
            if (!this.inGraphBounds(newPoint))
                return;
            this.screenPoints.push(newPoint);
        });
    }
    inGraphBounds(point) {
        return (point.x >= this.left &&
            point.x <= this.right &&
            point.y >= this.top &&
            point.y <= this.bottom);
    }
    addPoint(point) {
        this.plotPoints.push(point);
        const { x, y } = this.graphToScreen(point.x, point.y);
        const newPoint = new Point(x, y, point.thickness);
        if (!this.inGraphBounds(newPoint))
            return;
        this.screenPoints.push(newPoint);
    }
    addPoints(points) {
        points.forEach((pt) => this.addPoint(pt));
    }
    draw() {
        if (!this.gui.isOpen())
            return;
        this.window.draw();
        this.xAxis.draw();
        this.yAxis.draw();
        this.screenPoints.forEach((p) => p.draw());
    }
    open() {
        this.gui.open();
    }
}
export { ScatterPlot };
