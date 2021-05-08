/// <reference types="../../CTAutocomplete/index" />
/// <reference lib="es2015" />
import * as Elementa from "../../Elementa/index";
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
        const { x: xZero, y: yZero } = this.graphToScreen(0, 0);
        this.xAxis = [this.left, yZero, this.right, yZero];
        this.yAxis = [xZero, this.top, xZero, this.bottom];
        this.changed = true;
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
            this.updateRanges();
        });
        register("dragged", (dx, dy, mx, my, btn) => {
            if (!this.gui.isOpen())
                return;
            this.offsetX -= dx / this.zoom;
            this.offsetY += dy / this.zoom;
            this.updateAxes();
            this.updatePoints();
            this.updateRanges();
        });
    }
    fixupRanges(x, y) {
        const outX = (x + this.offsetX * this.zoom) / (this.zoom + this.scaleX * this.zoom);
        const outY = (this.screenHeight - y + this.offsetY * this.zoom) / (this.zoom + this.scaleY * this.zoom);
        return { x: outX, y: outY };
    }
    updateRanges() {
        const topLeft = this.fixupRanges(this.left, this.top);
        const bottomRight = this.fixupRanges(this.right, this.bottom);
        this.xMin = topLeft.x / this.zoom;
        this.xMax = bottomRight.x / this.zoom;
        this.yMin = bottomRight.y / this.zoom;
        this.yMax = topLeft.y / this.zoom;
    }
    graphToScreen(x, y) {
        const outX = (x - this.offsetX) * this.zoom + this.scaleX * this.zoom * x;
        const outY = this.screenHeight - ((y - this.offsetY) * this.zoom + this.scaleY * this.zoom * y);
        return { x: outX, y: outY };
    }
    screenToGraph(x, y) {
        const outX = (x - this.scaleX * this.zoom * x) / this.zoom + this.offsetX;
        const outY = (this.screenHeight - y - this.scaleY * this.zoom * y) / this.zoom + this.offsetY;
        return { x: outX, y: outY };
    }
    updateAxes() {
        const { x: xZero, y: yZero } = this.graphToScreen(0, 0);
        this.xAxis = [this.left, yZero, this.right, yZero];
        this.yAxis = [xZero, this.top, xZero, this.bottom];
    }
    updatePoints() {
        this.screenPoints = [];
        this.plotPoints.forEach((pt) => {
            const { x, y } = this.graphToScreen(pt[0], pt[1]);
            this.screenPoints.push([x, y]);
        });
        this.changed = true;
    }
    addPoint(x, y) {
        this.plotPoints.push([x, y]);
        const { x: newX, y: newY } = this.graphToScreen(x, y);
        this.screenPoints.push([newX, newY]);
    }
    addPoints(points) {
        points.forEach((pt) => this.addPoint(pt[0], pt[1]));
    }
    draw() {
        if (!this.gui.isOpen())
            return;
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
            GL11.glScissor(this.left * scaleFactor, this.top * scaleFactor, this.width * scaleFactor, this.height * scaleFactor);
            GL11.glLineWidth(1);
            GL11.glColor3f(1, 1, 1);
            GL11.glBegin(GL11.GL_LINE_STRIP);
            this.screenPoints.forEach((p) => {
                GL11.glVertex2f(p[0], p[1]);
            });
            GL11.glEnd();
            GL11.glLineWidth(1);
            GL11.glColor3f(1, 0, 0);
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
