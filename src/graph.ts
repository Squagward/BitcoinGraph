import { Colors, GL11, Mode, screenCenterY } from "./constants";
import { PointCollection } from "./pointcollection";
import type { Axes } from "./types";
import { addCommas, createList } from "./utils";

const ScaledResolution = Java.type("net.minecraft.client.gui.ScaledResolution");

export class BitcoinGraph {
  public readonly pointCollection: PointCollection;

  private gui: Gui;
  private display: Display;

  private zoom: number;

  private offsetX: number;
  private offsetY: number;

  private axes: Axes;

  private changedPos: boolean;
  private changedMouse: boolean;

  private clicked: boolean;
  private dragging: boolean;

  private pointList!: number;
  private lineList!: number;

  constructor() {
    this.pointCollection = new PointCollection();

    this.gui = new Gui();

    this.display = new Display()
      .setRenderLoc(this.pointCollection.left - 10, screenCenterY)
      .setAlign(DisplayHandler.Align.RIGHT)
      .setBackground(DisplayHandler.Background.FULL)
      .setTextColor(Renderer.color(...Colors.TEXT))
      .setBackgroundColor(Renderer.color(...Colors.TEXT_BACKGROUND));

    this.zoom = 1;
    this.offsetX = 0;
    this.offsetY = 0;

    this.axes = [
      [this.pointCollection.left, this.pointCollection.top],
      [this.pointCollection.left, this.pointCollection.bottom],
      [this.pointCollection.right, this.pointCollection.bottom]
    ];

    this.changedPos = true;
    this.changedMouse = true;

    this.clicked = false;
    this.dragging = false;

    // force this context on the current class
    this.shadeGraphBackground = this.shadeGraphBackground.bind(this);
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

    register("step", () => {
      if (!this.gui.isOpen() || !this.pointCollection.currentPlotPoints.length)
        return;
      this.changedMouse = true;
      this.drawLabels();
    }).setFps(20);

    register("clicked", (mx, my, btn, down) => {
      this.clicked = down;
      if (!down) this.dragging = false;
    });

    register("dragged", (dx, dy) => {
      if (!this.gui.isOpen() || (dx === 0 && dy === 0)) return;
      this.offsetX += dx;
      this.offsetY += dy;

      this.changedPos = true;
      this.changedMouse = true;
      if (this.clicked) this.dragging = true;
    });
  }

  public get mode(): Mode {
    return this.pointCollection.mode;
  }

  private resetTransforms(): void {
    this.offsetX = 0;
    this.offsetY = 0;
    this.zoom = 1;
    this.changedPos = true;
    this.changedMouse = true;
  }

  private constrainMouseX(): number {
    return (Client.getMouseX() - this.offsetX) / this.zoom;
  }

  private closestPointToMouse() {
    let currentDistance = Number.MAX_VALUE;
    let closestIndex = 0;

    const mouseX = this.constrainMouseX();
    this.pointCollection.currentPlotPoints.forEach(({ price }, i) => {
      const { x } = this.pointCollection.priceToPoint(i, price);

      if (Math.abs(mouseX - x) < currentDistance) {
        currentDistance = Math.abs(mouseX - x);
        closestIndex = i;
      }
    });

    return {
      loc: this.pointCollection.priceToPoint(
        closestIndex,
        this.pointCollection.currentPlotPoints[closestIndex].price
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
    GL11.glVertex2d(this.pointCollection.left, this.pointCollection.top);
    GL11.glVertex2d(this.pointCollection.left, this.pointCollection.bottom);
    GL11.glVertex2d(this.pointCollection.right, this.pointCollection.bottom);
    GL11.glVertex2d(this.pointCollection.right, this.pointCollection.top);
    GL11.glEnd();
    GL11.glPopMatrix();
  }

  private drawLabels(): void {
    if (this.dragging || !this.pointCollection.currentPlotPoints.length) return;
    const { index } = this.closestPointToMouse();

    const { date, price } = this.pointCollection.currentPlotPoints[index];
    this.display.setLine(1, date).setLine(2, addCommas(price));
  }

  private drawIntersectLines(): void {
    if (!this.pointCollection.currentScreenPoints.length) return;
    const {
      loc: { x, y }
    } = this.closestPointToMouse();

    GL11.glPushMatrix();
    GL11.glLineWidth(1);
    GL11.glTranslated(this.offsetX, this.offsetY, 0);
    GL11.glScaled(this.zoom, this.zoom, this.zoom);

    GL11.glColor3d(...Colors.INTERSECT_LINES);
    GL11.glBegin(GL11.GL_LINES);
    GL11.glVertex2d(this.pointCollection.left, y);
    GL11.glVertex2d(this.pointCollection.right, y);
    GL11.glVertex2d(x, this.pointCollection.top);
    GL11.glVertex2d(x, this.pointCollection.bottom);

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
    this.pointCollection.currentScreenPoints.forEach(({ x, y }) => {
      GL11.glVertex2d(x, y);
    });
    GL11.glEnd();

    GL11.glLineWidth(2);
    GL11.glColor3d(...Colors.AXES);
    GL11.glBegin(GL11.GL_LINE_STRIP);
    this.axes.forEach(([x, y]) => GL11.glVertex2d(x, y));
    GL11.glEnd();

    GL11.glPopMatrix();
  }

  public draw(text: string): void {
    if (!this.gui.isOpen() || !this.pointCollection.currentPlotPoints.length) {
      if (this.display.getLines().length) this.display.clearLines();
      return;
    }
    this.display.setLine(
      0,
      new DisplayLine(`§l${text}`).setAlign(DisplayHandler.Align.CENTER)
    );

    this.enableScissor();

    this.drawOutOfBoundsBackground();

    const { changedVar: changedPos, list: pointList } = createList(
      this.changedPos,
      this.pointList,
      this.shadeGraphBackground,
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

  private drawOutOfBoundsBackground() {
    Renderer.drawRect(
      Renderer.color(...Colors.GRAPH_OUT_OF_BOUNDS),
      this.pointCollection.left,
      this.pointCollection.top,
      this.pointCollection.width,
      this.pointCollection.height
    );
  }

  private enableScissor() {
    const sr = new ScaledResolution(Client.getMinecraft());
    const scaleFactor = sr.func_78325_e(); // getScaleFactor

    GL11.glScissor(
      this.pointCollection.left * scaleFactor,
      this.pointCollection.top * scaleFactor,
      this.pointCollection.width * scaleFactor,
      this.pointCollection.height * scaleFactor
    );
  }

  public drawLive(text: string): void {
    if (!this.gui.isOpen() || !this.pointCollection.currentPlotPoints.length) {
      if (this.display.getLines().length) this.display.clearLines();
      return;
    }
    this.display.setLine(
      0,
      new DisplayLine(`§l${text}`).setAlign(DisplayHandler.Align.CENTER)
    );

    this.enableScissor();

    this.drawOutOfBoundsBackground();

    GL11.glDisable(GL11.GL_TEXTURE_2D);
    GL11.glEnable(GL11.GL_SCISSOR_TEST);

    this.pointCollection.updateRanges();
    this.pointCollection.addPointsToScreen();

    this.shadeGraphBackground();
    this.drawPoints();
    this.drawIntersectLines();

    GL11.glDisable(GL11.GL_SCISSOR_TEST);
    GL11.glEnable(GL11.GL_TEXTURE_2D);
  }

  public open(mode: Mode): void {
    this.resetTransforms();
    this.pointCollection.mode = mode;

    if (this.pointCollection.mode === Mode.HISTORICAL) {
      this.pointCollection.updateRanges();
      this.pointCollection.addPointsToScreen();
    }

    this.gui.open();
  }
}
