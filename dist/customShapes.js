const GL11 = Java.type("org.lwjgl.opengl.GL11");
class CustomShape {
    constructor(r, g, b, a = 1) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    setColor(r, g, b, a = 1) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    beginDraw() {
        GL11.glPushMatrix();
        GL11.glEnable(GL11.GL_BLEND);
        GL11.glDisable(GL11.GL_TEXTURE_2D);
    }
    endDraw() {
        GL11.glEnable(GL11.GL_TEXTURE_2D);
        GL11.glDisable(GL11.GL_BLEND);
        GL11.glPopMatrix();
    }
}
class Point extends CustomShape {
    constructor(x, y, thickness, r = 1, g = 1, b = 1, a = 1) {
        super(r, g, b, a);
        this.x = x;
        this.y = y;
        this.thickness = thickness;
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    setPos(x, y) {
        this.x = x;
        this.y = y;
    }
    draw() {
        this.beginDraw();
        GL11.glPointSize(this.thickness);
        GL11.glBegin(GL11.GL_POINTS);
        GL11.glColor4f(this.r, this.g, this.b, this.a);
        GL11.glVertex2f(this.x, this.y);
        GL11.glEnd();
        this.endDraw();
    }
    toString() {
        return ("Point{" +
            `x: ${this.x}, y: ${this.y},` +
            `thickness: ${this.thickness}, color: [${this.r}, ${this.g}, ${this.b}, ${this.a}]}`);
    }
}
class Line extends CustomShape {
    constructor(x1, y1, x2, y2, thickness, r, g, b, a = 1) {
        super(r, g, b, a);
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.thickness = thickness;
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    setStartPos(x1, y1) {
        this.x1 = x1;
        this.y1 = y1;
    }
    setEndPos(x2, y2) {
        this.x2 = x2;
        this.y2 = y2;
    }
    setThickness(thickness) {
        this.thickness = thickness;
    }
    draw() {
        this.beginDraw();
        GL11.glLineWidth(this.thickness);
        GL11.glBegin(GL11.GL_LINES);
        GL11.glColor4f(this.r, this.g, this.b, this.a);
        GL11.glVertex2f(this.x1, this.y1);
        GL11.glVertex2f(this.x2, this.y2);
        GL11.glEnd();
        this.endDraw();
    }
    toString() {
        return ("Line{" +
            `x1: ${this.x1}, y1: ${this.y1}, x2: ${this.x2}, y2: ${this.y2}, ` +
            `thickness: ${this.thickness}, color: [${this.r}, ${this.g}, ${this.b}, ${this.a}]}`);
    }
}
export { Line, Point };
