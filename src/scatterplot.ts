/// <reference types="../../CTAutocomplete/index" />
/// <reference lib="es2015" />

import * as Elementa from "../../Elementa/index";
import { Axis, DataPoint, ScreenPoint } from "./types";
import { distSquared, findBounds, addCommas } from "./utils";

const GL11 = Java.type("org.lwjgl.opengl.GL11");
const ScaledResolution = Java.type("net.minecraft.client.gui.ScaledResolution");

export class ScatterPlot {
  private gui: Gui;

  private left: number;
  private right: number;
  private top: number;
  private bottom: number;

  private plotPoints: DataPoint[];
  private screenPoints: ScreenPoint[];

  private background: Elementa.UIBlock;
  private window: Elementa.Window;

  private zoom: number;

  private offsetX: number;
  private offsetY: number;

  private xAxis: Axis;
  private yAxis: Axis;

  private changedPos: boolean;
  private changedMouse: boolean;

  private pointList?: number;
  private lineList?: number;

  private mousePos: [number, number];

  private screenWidth = Renderer.screen.getWidth();
  private screenHeight = Renderer.screen.getHeight();

  private screenCenterX = this.screenWidth / 2;
  private screenCenterY = this.screenHeight / 2;

  private totalDays: number;
  private maxPrice: number;

  constructor(
    private width: number,
    private height: number,
    private backgroundColor: JavaTColor
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
      .setX(new Elementa.CenterConstraint())
      .setY(new Elementa.CenterConstraint());

    // @ts-ignore
    this.window = new Elementa.Window().addChild(this.background);

    this.zoom = 1;
    this.offsetX = 0;
    this.offsetY = 0;

    this.xAxis = [this.left, this.bottom, this.right, this.bottom];
    this.yAxis = [this.left, this.top, this.left, this.bottom];

    this.changedPos = true;
    this.changedMouse = true;

    this.mousePos = [-1, -1];

    this.totalDays = 0;
    this.maxPrice = 0;

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

    this.gui.registerDraw((mx, my, pt) => {
      this.mousePos[0] = this.mousePos[1];
      this.mousePos[1] = mx;

      if (this.mousePos[0] !== this.mousePos[1]) this.changedMouse = true;
    });

    register("dragged", (dx, dy, mx, my, btn) => {
      if (!this.gui.isOpen()) return;
      this.offsetX += dx;
      this.offsetY += dy;

      this.changedPos = true;
      this.changedMouse = true;
    });
  }

  private addPointsToScreen() {
    this.plotPoints.forEach(([, price], i) => {
      this.screenPoints.push(this.priceToPoint(i, price));
    });
  }

  public addPlotPoints(points: DataPoint[]) {
    this.plotPoints.push(...points);
    const { xMax, yMax } = findBounds(this.plotPoints);
    this.totalDays = xMax;
    this.maxPrice = yMax;

    this.addPointsToScreen();
  }

  private priceToPoint(index: number, price: number) {
    const percentX = this.left + (index / this.totalDays) * this.width;
    const percentY = this.bottom - (price / this.maxPrice) * this.height;
    return { x: percentX, y: percentY };
  }

  private constrainMouseX() {
    return MathLib.clampFloat(
      (Client.getMouseX() - this.offsetX) / this.zoom,
      this.left,
      this.right
    );
  }

  private closestPointToMouse() {
    let currentDistance = Number.MAX_VALUE;
    let closestIndex = -1;

    for (let i = 0; i < this.screenPoints.length; i++) {
      let loc = this.priceToPoint(i, this.plotPoints[i][1]);

      if (distSquared(this.constrainMouseX(), 0, loc.x, 0) < currentDistance) {
        currentDistance = distSquared(this.constrainMouseX(), 0, loc.x, 0);
        closestIndex = i;
      }
    }
    return {
      pt: this.priceToPoint(closestIndex, this.plotPoints[closestIndex][1]),
      index: closestIndex
    };
  }

  private shadeGraphBackground() {
    GL11.glPushMatrix();
    GL11.glTranslated(this.offsetX, this.offsetY, 0);
    GL11.glScaled(this.zoom, this.zoom, this.zoom);

    GL11.glColor3f(0.7, 0.7, 0.7);
    GL11.glBegin(GL11.GL_QUADS);
    GL11.glVertex2d(this.left, this.top);
    GL11.glVertex2d(this.left, this.bottom);
    GL11.glVertex2d(this.right, this.bottom);
    GL11.glVertex2d(this.right, this.top);
    GL11.glEnd();
    GL11.glPopMatrix();
  }

  private drawIntersectLines() {
    if (!this.screenPoints.length) return;
    const {
      pt: { x, y }
    } = this.closestPointToMouse();

    GL11.glPushMatrix();
    GL11.glLineWidth(1);
    GL11.glTranslated(this.offsetX, this.offsetY, 0);
    GL11.glScaled(this.zoom, this.zoom, this.zoom);

    GL11.glColor3f(0, 0, 1);
    GL11.glBegin(GL11.GL_LINES);
    GL11.glVertex2d(this.left, y);
    GL11.glVertex2d(this.right, y);
    GL11.glVertex2d(x, this.top);
    GL11.glVertex2d(x, this.bottom);

    GL11.glEnd();
    GL11.glPopMatrix();
  }

  private drawPoints() {
    GL11.glPushMatrix();
    GL11.glLineWidth(1);
    GL11.glTranslated(this.offsetX, this.offsetY, 0);
    GL11.glScaled(this.zoom, this.zoom, this.zoom);

    GL11.glColor3f(0, 0, 0);
    GL11.glBegin(GL11.GL_LINE_STRIP);
    this.screenPoints.forEach((p) => GL11.glVertex2d(p.x, p.y));
    GL11.glEnd();
    GL11.glPopMatrix();
  }

  private drawAxes() {
    GL11.glPushMatrix();
    GL11.glTranslated(this.offsetX, this.offsetY, 0);
    GL11.glScaled(this.zoom, this.zoom, this.zoom);

    GL11.glLineWidth(1);
    GL11.glColor3f(1, 0, 0);
    GL11.glBegin(GL11.GL_LINES);
    GL11.glVertex2d(this.xAxis[0], this.xAxis[1]);
    GL11.glVertex2d(this.xAxis[2], this.xAxis[3]);
    GL11.glVertex2d(this.yAxis[0], this.yAxis[1]);
    GL11.glVertex2d(this.yAxis[2], this.yAxis[3]);
    GL11.glEnd();
    GL11.glPopMatrix();
  }

  public draw() {
    if (!this.gui.isOpen()) return;
    this.window.draw();

    const sr = new ScaledResolution(Client.getMinecraft());
    const scaleFactor = sr.func_78325_e(); // getScaleFactor

    GL11.glScissor(
      this.left * scaleFactor,
      this.top * scaleFactor,
      this.width * scaleFactor,
      this.height * scaleFactor
    );

    if (this.changedPos) {
      GL11.glDisable(GL11.GL_TEXTURE_2D);
      GL11.glEnable(GL11.GL_SCISSOR_TEST);

      if (!this.pointList) {
        this.pointList = GL11.glGenLists(1);
      }

      GL11.glNewList(this.pointList, GL11.GL_COMPILE);

      GL11.glDisable(GL11.GL_TEXTURE_2D);
      GL11.glEnable(GL11.GL_SCISSOR_TEST);

      this.shadeGraphBackground();
      this.drawPoints();
      this.drawAxes();

      GL11.glDisable(GL11.GL_SCISSOR_TEST);
      GL11.glEnable(GL11.GL_TEXTURE_2D);

      GL11.glEndList();

      this.changedPos = false;
    }

    if (this.changedMouse) {
      if (!this.lineList) {
        this.lineList = GL11.glGenLists(1);
      }

      GL11.glNewList(this.lineList, GL11.GL_COMPILE);

      GL11.glDisable(GL11.GL_TEXTURE_2D);
      GL11.glEnable(GL11.GL_SCISSOR_TEST);

      this.drawIntersectLines();

      GL11.glDisable(GL11.GL_SCISSOR_TEST);
      GL11.glEnable(GL11.GL_TEXTURE_2D);

      GL11.glEndList();

      this.changedMouse = false;
    }

    GL11.glCallList(this.pointList);
    GL11.glCallList(this.lineList);

    //TODO: make this less messy please
    GL11.glEnable(GL11.GL_SCISSOR_TEST);

    const {
      pt: { x },
      index
    } = this.closestPointToMouse();

    Renderer.translate(this.offsetX, this.offsetY);
    Renderer.scale(this.zoom);
    const price = new Text(addCommas(this.plotPoints[index][1])).setScale(
      MathLib.clampFloat(1 / this.zoom, 0, 2)
    );
    price.draw(this.left, this.screenCenterY - price.getHeight() / 2);

    Renderer.translate(this.offsetX, this.offsetY);
    Renderer.scale(this.zoom);
    new Text(this.plotPoints[index][0])
      .setScale(MathLib.clampFloat(1 / this.zoom, 0, 2))
      .setAlign(DisplayHandler.Align.CENTER)
      .draw(x, this.top);

    GL11.glDisable(GL11.GL_SCISSOR_TEST);
  }

  public open() {
    this.gui.open();
  }
}
