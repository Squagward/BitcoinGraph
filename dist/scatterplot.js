/// <reference types="../../CTAutocomplete/index" />
/// <reference lib="es2015" />
import * as Elementa from "../../Elementa/index";
import { distSquared, findBounds } from "./utils";
const GL11 = Java.type("org.lwjgl.opengl.GL11");
const ScaledResolution = Java.type("net.minecraft.client.gui.ScaledResolution");
export class ScatterPlot {
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
        });
        this.gui.registerDraw((mx, my, pt) => {
            this.mousePos[0] = this.mousePos[1];
            this.mousePos[1] = mx;
            if (this.mousePos[0] !== this.mousePos[1])
                this.changedMouse = true;
        });
        register("dragged", (dx, dy, mx, my, btn) => {
            if (!this.gui.isOpen())
                return;
            this.offsetX += dx;
            this.offsetY += dy;
            this.changedPos = true;
        });
    }
    addPointsToScreen() {
        this.plotPoints.forEach((p) => {
            const percentX = p.index / this.totalDays;
            const percentY = p.val / this.maxPrice;
            this.screenPoints.push({
                date: p.date,
                index: percentX * this.width + this.left,
                val: this.bottom - percentY * this.height
            });
        });
    }
    addPlotPoints(points) {
        this.plotPoints.push(...points);
        const { xMax, yMax } = findBounds(this.plotPoints);
        this.totalDays = xMax;
        this.maxPrice = yMax;
        this.addPointsToScreen();
    }
    priceToPoint(index, price) {
        const percentX = this.left + (index / this.plotPoints.length) * this.width;
        const percentY = this.bottom - (price / this.maxPrice) * this.height;
        return { x: percentX, y: percentY };
    }
    constrainMouseX() {
        return MathLib.clampFloat((Client.getMouseX() - this.offsetX) / this.zoom, this.left, this.right);
    }
    closestPointToMouse() {
        let currentDistance = Number.MAX_VALUE;
        let closestIndex = -1;
        for (let i = 0; i < this.screenPoints.length; i++) {
            let loc = this.priceToPoint(i, this.screenPoints[i].val);
            if (distSquared(this.constrainMouseX(), 0, loc.x, 0) < currentDistance) {
                currentDistance = distSquared(this.constrainMouseX(), 0, loc.x, 0);
                closestIndex = i;
            }
        }
        const screenCoordPoint = this.priceToPoint(closestIndex, this.plotPoints[closestIndex].val);
        return { index: closestIndex, val: screenCoordPoint.y };
    }
    shadeGraphBackground() {
        GL11.glPushMatrix();
        GL11.glTranslated(this.offsetX, this.offsetY, 0);
        GL11.glScaled(this.zoom, this.zoom, this.zoom);
        GL11.glColor3f(0.7, 0.7, 0.7);
        GL11.glBegin(GL11.GL_QUADS);
        GL11.glVertex2f(this.left, this.top);
        GL11.glVertex2f(this.left, this.bottom);
        GL11.glVertex2f(this.right, this.bottom);
        GL11.glVertex2f(this.right, this.top);
        GL11.glEnd();
        GL11.glPopMatrix();
    }
    drawIntersectLines() {
        if (!this.screenPoints.length)
            return;
        const { index, val } = this.closestPointToMouse();
        GL11.glPushMatrix();
        GL11.glLineWidth(1);
        GL11.glTranslated(this.offsetX, this.offsetY, 0);
        GL11.glScaled(this.zoom, this.zoom, this.zoom);
        GL11.glColor3f(0, 0, 1);
        GL11.glBegin(GL11.GL_LINES);
        GL11.glVertex2f(this.left, val);
        GL11.glVertex2f(this.right, val);
        GL11.glVertex2f(this.constrainMouseX(), this.top);
        GL11.glVertex2f(this.constrainMouseX(), this.bottom);
        GL11.glEnd();
        GL11.glPopMatrix();
    }
    drawPoints() {
        GL11.glPushMatrix();
        GL11.glLineWidth(1);
        GL11.glTranslated(this.offsetX, this.offsetY, 0);
        GL11.glScaled(this.zoom, this.zoom, this.zoom);
        GL11.glColor3f(0, 0, 0);
        GL11.glBegin(GL11.GL_LINE_STRIP);
        this.screenPoints.forEach((p) => GL11.glVertex2f(p.index, p.val));
        GL11.glEnd();
        GL11.glPopMatrix();
    }
    drawAxes() {
        GL11.glPushMatrix();
        GL11.glLineWidth(1);
        GL11.glTranslated(this.offsetX, this.offsetY, 0);
        GL11.glScaled(this.zoom, this.zoom, this.zoom);
        GL11.glColor3f(1, 0, 0);
        GL11.glBegin(GL11.GL_LINES);
        GL11.glVertex2f(this.xAxis[0], this.xAxis[1]);
        GL11.glVertex2f(this.xAxis[2], this.xAxis[3]);
        GL11.glVertex2f(this.yAxis[0], this.yAxis[1]);
        GL11.glVertex2f(this.yAxis[2], this.yAxis[3]);
        GL11.glEnd();
        GL11.glPopMatrix();
    }
    draw() {
        if (!this.gui.isOpen())
            return;
        this.window.draw();
        if (this.changedPos) {
            if (!this.pointList) {
                this.pointList = GL11.glGenLists(1);
            }
            GL11.glNewList(this.pointList, GL11.GL_COMPILE);
            const sr = new ScaledResolution(Client.getMinecraft());
            const scaleFactor = sr.func_78325_e(); // getScaleFactor
            GL11.glScissor(this.left * scaleFactor, this.top * scaleFactor, this.width * scaleFactor, this.height * scaleFactor);
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
            const sr = new ScaledResolution(Client.getMinecraft());
            const scaleFactor = sr.func_78325_e(); // getScaleFactor
            GL11.glScissor(this.left * scaleFactor, this.top * scaleFactor, this.width * scaleFactor, this.height * scaleFactor);
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
    }
    open() {
        this.gui.open();
    }
}
