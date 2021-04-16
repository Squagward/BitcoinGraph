import * as Elementa from "../../Elementa/index";
const GL11 = Java.type("org.lwjgl.opengl.GL11");
const ScaledResolution = Java.type("net.minecraft.client.gui.ScaledResolution");

class ScatterPlot {
  gui: Gui;

  left: number;
  right: number;
  top: number;
  bottom: number;

  /** Graph coordinates */
  private plotPoints: [number, number][];
  /** Screen coordinates */
  private screenPoints: [number, number][];

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

  private xAxis: [number, number, number, number];
  private yAxis: [number, number, number, number];

  private changed: boolean;
  private pointList?: number;

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

    this.xAxis = [
      this.left,
      this.graphToScreen(this.xMin, 0).y,
      this.right,
      this.graphToScreen(this.xMax, 0).y
    ];
    this.yAxis = [
      this.graphToScreen(0, this.yMax).x,
      this.top,
      this.graphToScreen(0, this.yMin).x,
      this.bottom
    ];

    this.changed = true;
    this.pointList = undefined;

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
  }

  private graphToScreen(x: number, y: number) {
    const outX = (x - this.offsetX) * this.zoom + this.scaleX * this.zoom * x;
    const outY =
      this.screenHeight -
      ((y - this.offsetY) * this.zoom + this.scaleY * this.zoom * y);

    return { x: outX, y: outY };
  }

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
      this.xAxis[0] = this.left;
      this.xAxis[1] = yZero;
      this.xAxis[2] = this.right;
      this.xAxis[3] = yZero;
    } else {
      // set off screen if it is out of bounds
      this.xAxis[0] = -100;
      this.xAxis[1] = -100;
      this.xAxis[2] = -100;
      this.xAxis[3] = -100;
    }

    if (xZero >= this.left && xZero <= this.right) {
      this.yAxis[0] = xZero;
      this.yAxis[1] = this.top;
      this.yAxis[2] = xZero;
      this.yAxis[3] = this.bottom;
    } else {
      // set off screen if it is out of bounds
      this.yAxis[0] = -100;
      this.yAxis[1] = -100;
      this.yAxis[2] = -100;
      this.yAxis[3] = -100;
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
      const { x, y } = this.graphToScreen(pt[0], pt[1]);
      this.screenPoints.push([x, y]);
    });
    this.changed = true;
  }

  public addPoint(x: number, y: number) {
    this.plotPoints.push([x, y]);
    const { x: newX, y: newY } = this.graphToScreen(x, y);
    this.screenPoints.push([newX, newY]);
  }

  public addPoints(points: [number, number][]) {
    points.forEach((pt) => this.addPoint(pt[0], pt[1]));
  }

  public draw() {
    if (!this.gui.isOpen()) return;
    this.window.draw();
    if (this.changed) {
      if (!this.pointList) {
        this.pointList = GL11.glGenLists(1);
      }

      GL11.glNewList(this.pointList, GL11.GL_COMPILE);

      GL11.glDisable(GL11.GL_TEXTURE_2D);
      GL11.glEnable(GL11.GL_SCISSOR_TEST);

      const sr = new ScaledResolution(Client.getMinecraft());
      const scaleFactor = sr.func_78325_e(); // getScaleFactor

      GL11.glScissor(
        this.left * scaleFactor,
        this.top * scaleFactor,
        this.width * scaleFactor,
        this.height * scaleFactor
      );

      GL11.glLineWidth(1);
      GL11.glColor4f(1, 1, 1, 1);
      GL11.glBegin(GL11.GL_LINE_STRIP);
      this.screenPoints.forEach((p) => {
        GL11.glVertex2f(p[0], p[1]);
      });
      GL11.glEnd();

      GL11.glLineWidth(1);
      GL11.glColor4f(1, 0, 0, 1);
      GL11.glBegin(GL11.GL_LINES);
      GL11.glVertex2f(this.xAxis[0], this.xAxis[1]);
      GL11.glVertex2f(this.xAxis[2], this.xAxis[3]);
      GL11.glVertex2f(this.yAxis[0], this.yAxis[1]);
      GL11.glVertex2f(this.yAxis[2], this.yAxis[3]);
      GL11.glEnd();

      GL11.glDisable(GL11.GL_SCISSOR_TEST);
      GL11.glEnable(GL11.GL_TEXTURE_2D);

      GL11.glEndList();

      this.changed = false;
    }
    GL11.glCallList(this.pointList);
  }

  open() {
    this.gui.open();
  }
}
export { ScatterPlot };

// use glScale, not scroll
