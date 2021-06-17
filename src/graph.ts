import { Colors, screenCenterX, screenCenterY } from "./constants";
import { GL11 } from "./types";
import type { Axis, DataPoint, ScreenPoint } from "./types";
import { addCommas, createList, findBounds, Range } from "./utils";

const ScaledResolution = Java.type("net.minecraft.client.gui.ScaledResolution");

export class BitcoinGraph {
  private gui: Gui;
  private display: Display;

  private left: number;
  private right: number;
  private top: number;
  private bottom: number;

  private totalPlotPoints: DataPoint[];
  public currentPlotPoints: DataPoint[];
  private currentScreenPoints: ScreenPoint[];

  private zoom: number;

  private offsetX: number;
  private offsetY: number;

  private xAxis: Axis;
  private yAxis: Axis;

  private changedPos: boolean;
  private changedMouse: boolean;

  private clicked: boolean;
  private dragging: boolean;

  private pointList!: number;
  private lineList!: number;

  private totalDays: number;
  private maxPrice: number;
  private minPrice: number;

  public mode!: string;

  private tableTitle: string;

  constructor(private width: number, private height: number) {
    this.gui = new Gui();

    this.left = screenCenterX - this.width / 2;
    this.right = screenCenterX + this.width / 2;

    this.top = screenCenterY - this.height / 2;
    this.bottom = screenCenterY + this.height / 2;

    this.display = new Display()
      .setRenderLoc(this.left - 10, screenCenterY)
      .setAlign(DisplayHandler.Align.RIGHT)
      .setBackground(DisplayHandler.Background.FULL)
      .setTextColor(Renderer.color(...Colors.TEXT))
      .setBackgroundColor(Renderer.color(...Colors.TEXT_BACKGROUND));

    this.totalPlotPoints = [];
    this.currentPlotPoints = [];
    this.currentScreenPoints = [];

    this.zoom = 1;
    this.offsetX = 0;
    this.offsetY = 0;

    this.xAxis = [this.left, this.bottom, this.right, this.bottom];
    this.yAxis = [this.left, this.top, this.left, this.bottom];

    this.changedPos = true;
    this.changedMouse = true;

    this.clicked = false;
    this.dragging = false;

    this.totalDays = 0;
    this.maxPrice = 0;
    this.minPrice = 0;

    this.tableTitle = "";

    // force this context on the current class
    this.shadeGraphBackground = this.shadeGraphBackground.bind(this);
    this.drawAxes = this.drawAxes.bind(this);
    this.drawIntersectLines = this.drawIntersectLines.bind(this);
    this.drawPoints = this.drawPoints.bind(this);

    this.gui.registerScrolled((mx, my, dir) => {
      this.offsetX -= mx;
      this.offsetY -= my;

      const delta = dir > 0 ? 1.25 : 0.8;
      this.zoom *= delta;

      this.offsetX *= delta;
      this.offsetY *= delta;

      this.offsetX += mx;
      this.offsetY += my;

      this.changedPos = true;
      this.changedMouse = true;
    });

    this.gui.registerKeyTyped((typed, key) => {
      if (key === Keyboard.KEY_R) {
        this.resetTransforms();
      }
    });

    register("step", (steps) => {
      if (!this.gui.isOpen() || !this.currentPlotPoints.length) return;
      this.changedMouse = true;
      this.drawLabels();
    }).setFps(20);

    register("clicked", (mx, my, btn, down) => {
      this.clicked = down;
      if (!down) this.dragging = false;
    });

    register("dragged", (dx, dy, mx, my, btn) => {
      if (!this.gui.isOpen() || (dx === 0 && dy === 0)) return;
      this.offsetX += dx;
      this.offsetY += dy;

      this.changedPos = true;
      this.changedMouse = true;
      if (this.clicked) this.dragging = true;
    });
  }

  private resetTransforms(): void {
    this.offsetX = 0;
    this.offsetY = 0;
    this.zoom = 1;
    this.changedPos = true;
    this.changedMouse = true;
  }

  private addPointsToScreen(): void {
    this.currentScreenPoints = [];

    this.currentPlotPoints.forEach(({ price }, i) => {
      this.currentScreenPoints.push(this.priceToPoint(i, price, this.mode));
    });
  }

  public setPlotPoints(points: DataPoint[]): void {
    this.totalPlotPoints = points;
  }

  public setGraphRange(type: string): void {
    if (type.toLowerCase() === "max") {
      this.currentPlotPoints = this.totalPlotPoints;
    } else {
      this.currentPlotPoints = this.totalPlotPoints.slice(-Range[type]);
    }
  }

  private priceToPoint(index: number, price: number, mode: string) {
    const x = MathLib.map(index, 0, this.totalDays, this.left, this.right);
    let y = this.bottom;

    switch (mode) {
      case "LIVE":
        let denom = this.maxPrice - this.minPrice;
        if (this.maxPrice === this.minPrice) denom = 1;
        y -= ((price - this.minPrice) / denom) * this.height;

        break;
      case "HISTORICAL":
        y -= (price / this.maxPrice) * this.height;
        break;
    }
    return { x, y };
  }

  private constrainMouseX(): number {
    return (Client.getMouseX() - this.offsetX) / this.zoom;
  }

  private closestPointToMouse(mode: string) {
    let currentDistance = Number.MAX_VALUE;
    let closestIndex = 0;

    const mouseX = this.constrainMouseX();
    this.currentPlotPoints.forEach(({ price }, i) => {
      const { x } = this.priceToPoint(i, price, mode);

      if (Math.abs(mouseX - x) < currentDistance) {
        currentDistance = Math.abs(mouseX - x);
        closestIndex = i;
      }
    });

    return {
      loc: this.priceToPoint(
        closestIndex,
        this.currentPlotPoints[closestIndex].price,
        mode
      ),
      index: closestIndex
    };
  }

  private shadeGraphBackground(): void {
    GL11.glPushMatrix();
    GL11.glTranslated(this.offsetX, this.offsetY, 0);
    GL11.glScaled(this.zoom, this.zoom, this.zoom);

    GL11.glColor3d(...Colors.GRAPH_BACKGROUND);
    GL11.glBegin(GL11.GL_QUADS);
    GL11.glVertex2d(this.left, this.top);
    GL11.glVertex2d(this.left, this.bottom);
    GL11.glVertex2d(this.right, this.bottom);
    GL11.glVertex2d(this.right, this.top);
    GL11.glEnd();
    GL11.glPopMatrix();
  }

  private drawLabels(): void {
    if (this.dragging || !this.currentScreenPoints.length) return;
    const { index } = this.closestPointToMouse(this.mode);

    const { date, price } = this.currentPlotPoints[index];
    this.display.setLine(1, date).setLine(2, addCommas(price));
  }

  private drawIntersectLines(): void {
    if (!this.currentScreenPoints.length) return;
    const {
      loc: { x, y }
    } = this.closestPointToMouse(this.mode);

    GL11.glPushMatrix();
    GL11.glLineWidth(1);
    GL11.glTranslated(this.offsetX, this.offsetY, 0);
    GL11.glScaled(this.zoom, this.zoom, this.zoom);

    GL11.glColor3d(...Colors.INTERSECT_LINES);
    GL11.glBegin(GL11.GL_LINES);
    GL11.glVertex2d(this.left, y);
    GL11.glVertex2d(this.right, y);
    GL11.glVertex2d(x, this.top);
    GL11.glVertex2d(x, this.bottom);

    GL11.glEnd();
    GL11.glPopMatrix();
  }

  private drawPoints(): void {
    GL11.glPushMatrix();
    GL11.glLineWidth(1);
    GL11.glTranslated(this.offsetX, this.offsetY, 0);
    GL11.glScaled(this.zoom, this.zoom, this.zoom);

    GL11.glColor3d(...Colors.POINTS);
    GL11.glBegin(GL11.GL_LINE_STRIP);
    this.currentScreenPoints.forEach((p) => GL11.glVertex2d(p.x, p.y));
    GL11.glEnd();
    GL11.glPopMatrix();
  }

  private drawAxes(): void {
    GL11.glPushMatrix();
    GL11.glLineWidth(2);
    GL11.glTranslated(this.offsetX, this.offsetY, 0);
    GL11.glScaled(this.zoom, this.zoom, this.zoom);

    GL11.glColor3d(...Colors.AXES);
    GL11.glBegin(GL11.GL_LINES);
    GL11.glVertex2d(this.xAxis[0], this.xAxis[1]);
    GL11.glVertex2d(this.xAxis[2], this.xAxis[3]);
    GL11.glVertex2d(this.yAxis[0], this.yAxis[1]);
    GL11.glVertex2d(this.yAxis[2], this.yAxis[3]);
    GL11.glEnd();
    GL11.glPopMatrix();
  }

  public draw(text: string): void {
    if (!this.gui.isOpen() || !this.currentPlotPoints.length) {
      if (this.display.getLines().length) this.display.clearLines();
      return;
    }
    this.display.setLine(
      0,
      new DisplayLine(text).setAlign(DisplayHandler.Align.CENTER)
    );

    Renderer.drawRect(
      Renderer.color(...Colors.GRAPH_OUT_OF_BOUNDS),
      this.left,
      this.top,
      this.width,
      this.height
    );

    const sr = new ScaledResolution(Client.getMinecraft());
    const scaleFactor = sr.func_78325_e(); // getScaleFactor

    GL11.glScissor(
      this.left * scaleFactor,
      this.top * scaleFactor,
      this.width * scaleFactor,
      this.height * scaleFactor
    );

    const { changedVar: changedPos, list: pointList } = createList(
      this.changedPos,
      this.pointList,
      this.shadeGraphBackground,
      this.drawAxes,
      this.drawPoints
    );
    this.changedPos = changedPos;
    this.pointList = pointList;

    const { changedVar: changedMouse, list: lineList } = createList(
      this.changedMouse,
      this.lineList,
      this.drawIntersectLines
    );
    this.changedMouse = changedMouse;
    this.lineList = lineList;

    GL11.glCallList(this.pointList);
    GL11.glCallList(this.lineList);
  }

  public drawLive(text: string): void {
    if (!this.gui.isOpen() || !this.currentPlotPoints.length) {
      if (this.display.getLines().length) this.display.clearLines();
      return;
    }
    this.display.setLine(
      0,
      new DisplayLine(text).setAlign(DisplayHandler.Align.CENTER)
    );

    const { xMax, yMin, yMax } = findBounds(this.currentPlotPoints);
    this.totalDays = xMax;
    this.maxPrice = yMax;
    this.minPrice = yMin;

    this.addPointsToScreen();

    Renderer.drawRect(
      Renderer.color(...Colors.GRAPH_OUT_OF_BOUNDS),
      this.left,
      this.top,
      this.width,
      this.height
    );

    const sr = new ScaledResolution(Client.getMinecraft());
    const scaleFactor = sr.func_78325_e(); // getScaleFactor

    GL11.glScissor(
      this.left * scaleFactor,
      this.top * scaleFactor,
      this.width * scaleFactor,
      this.height * scaleFactor
    );

    GL11.glDisable(GL11.GL_TEXTURE_2D);
    GL11.glEnable(GL11.GL_SCISSOR_TEST);

    this.shadeGraphBackground();
    this.drawPoints();
    this.drawIntersectLines();

    GL11.glDisable(GL11.GL_SCISSOR_TEST);
    GL11.glEnable(GL11.GL_TEXTURE_2D);
  }

  public open(mode: string): void {
    this.changedPos = true;
    this.changedMouse = true;
    this.resetTransforms();
    this.gui.open();
    this.mode = mode;

    switch (mode) {
      case "HISTORICAL":
        const { xMax, yMin, yMax } = findBounds(this.currentPlotPoints);
        this.totalDays = xMax;
        this.maxPrice = yMax;
        this.minPrice = yMin;

        this.addPointsToScreen();
        break;
    }
  }
}
