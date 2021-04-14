import * as Elementa from "../../Elementa/index";
import { Line, Point } from "./customShapes";

class ScatterPlot {
  gui: Gui;

  left: number;
  right: number;
  top: number;
  bottom: number;

  /** Graph coordinates */
  private plotPoints: Point[];
  /** Screen coordinates */
  private screenPoints: Point[];

  private background: Elementa.UIBlock;
  private window: Elementa.Window;

  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;

  zoom: number;
  scaleX: number;
  scaleY: number;

  offsetX: number;
  offsetY: number;

  private xAxis: Line;
  private yAxis: Line;

  private readonly screenWidth = Renderer.screen.getWidth();
  private readonly screenHeight = Renderer.screen.getHeight();

  private readonly screenCenterX = this.screenWidth / 2;
  private readonly screenCenterY = this.screenHeight / 2;

  constructor(
    public width: number,
    public height: number,
    public backgroundColor: JavaTColor
  ) {
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
    this.scaleX = this.width / (this.xMax - this.xMin);
    this.scaleY = this.height / (this.yMax - this.yMin);

    this.offsetX = -this.screenCenterX;
    this.offsetY = -this.screenCenterY;

    this.xAxis = new Line(
      this.left,
      this.graphToScreen(this.xMin, 0).y,
      this.right,
      this.graphToScreen(this.xMax, 0).y,
      1,
      1,
      0,
      0
    );
    this.yAxis = new Line(
      this.graphToScreen(0, this.yMax).x,
      this.top,
      this.graphToScreen(0, this.yMin).x,
      this.bottom,
      1,
      1,
      0,
      0
    );

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
      if (!this.gui.isOpen()) return;
      this.offsetX -= dx / this.zoom;
      this.offsetY += dy / this.zoom;

      this.updateAxes();
      this.updatePoints();
    });

    console.log(JSON.stringify(this.graphToScreen(10, 10)));
  }

  // holy shit it actually works
  private graphToScreen(x: number, y: number) {
    const outX = (x - this.offsetX) * this.zoom + this.scaleX * this.zoom * x;
    const outY =
      this.screenHeight -
      ((y - this.offsetY) * this.zoom + this.scaleY * this.zoom * y);

    return { x: outX, y: outY };
  }

  // holy shit it actually works
  private screenToGraph(x: number, y: number) {
    const outX = (x - this.scaleX * this.zoom * x) / this.zoom + this.offsetX;
    const outY =
      (this.screenHeight - y - this.scaleY * this.zoom * y) / this.zoom +
      this.offsetY;
    return { x: outX, y: outY };
  }

  private updateAxes() {
    let { x: xZero, y: yZero } = this.graphToScreen(0, 0);

    if (yZero <= this.bottom && yZero >= this.top) {
      this.xAxis.setStartPos(this.left, yZero);
      this.xAxis.setEndPos(this.right, yZero);
    } else {
      // set off screen if it is out of bounds
      this.xAxis.setStartPos(-100, -100);
      this.xAxis.setEndPos(-100, -100);
    }

    if (xZero >= this.left && xZero <= this.right) {
      this.yAxis.setStartPos(xZero, this.top);
      this.yAxis.setEndPos(xZero, this.bottom);
    } else {
      // set off screen if it is out of bounds
      this.yAxis.setStartPos(-100, -100);
      this.yAxis.setEndPos(-100, -100);
    }

    const topLeft = this.screenToGraph(this.left, this.top);
    const bottomRight = this.screenToGraph(this.right, this.bottom);

    this.xMin = topLeft.x / this.zoom;
    this.yMin = topLeft.y / this.zoom;

    this.xMax = bottomRight.x / this.zoom;
    this.yMax = bottomRight.y / this.zoom;
  }

  private updatePoints() {
    this.screenPoints = [];

    this.plotPoints.forEach((pt) => {
      const { x, y } = this.graphToScreen(pt.x, pt.y);
      const newPoint = new Point(x, y, pt.thickness);

      if (!this.inGraphBounds(newPoint)) return;

      this.screenPoints.push(newPoint);
    });
  }

  private inGraphBounds(point: Point) {
    return (
      point.x >= this.left &&
      point.x <= this.right &&
      point.y >= this.top &&
      point.y <= this.bottom
    );
  }

  public addPoint(pt: Point) {
    this.plotPoints.push(pt);
    const { x, y } = this.graphToScreen(pt.x, pt.y);
    const newPoint = new Point(x, y, pt.thickness);
    if (!this.inGraphBounds(newPoint)) return;
    this.screenPoints.push(newPoint);
  }

  public addPoints(points: Point[]) {
    points.forEach((pt) => this.addPoint(pt));
  }

  public draw() {
    if (!this.gui.isOpen()) return;
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
