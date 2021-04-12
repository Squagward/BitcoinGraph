const GL11 = Java.type("org.lwjgl.opengl.GL11");

abstract class CustomShape {
  constructor(
    protected r: number,
    protected g: number,
    protected b: number,
    protected a: number = 1
  ) {}

  abstract draw(): void;
  abstract toString(): string;

  setColor(r: number, g: number, b: number, a: number = 1) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  protected beginDraw() {
    GL11.glPushMatrix();
    GL11.glEnable(GL11.GL_BLEND);
    GL11.glDisable(GL11.GL_TEXTURE_2D);
  }

  protected endDraw() {
    GL11.glEnable(GL11.GL_TEXTURE_2D);
    GL11.glDisable(GL11.GL_BLEND);
    GL11.glPopMatrix();
  }
}

class Point extends CustomShape {
  constructor(
    public x: number,
    public y: number,
    public thickness: number,
    protected r: number = 1,
    protected g: number = 1,
    protected b: number = 1,
    protected a: number = 1
  ) {
    super(r, g, b, a);
  }

  setPos(x: number, y: number) {
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
    return (
      "Point{" +
      `x: ${this.x}, y: ${this.y},` +
      `thickness: ${this.thickness}, color: [${this.r}, ${this.g}, ${this.b}, ${this.a}]}`
    );
  }
}

class Line extends CustomShape {
  constructor(
    public x1: number,
    public y1: number,
    public x2: number,
    public y2: number,
    public thickness: number,
    public r: number,
    public g: number,
    public b: number,
    public a: number = 1
  ) {
    super(r, g, b, a);
  }

  setStartPos(x1: number, y1: number) {
    this.x1 = x1;
    this.y1 = y1;
  }

  setEndPos(x2: number, y2: number) {
    this.x2 = x2;
    this.y2 = y2;
  }

  setThickness(thickness: number) {
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
    return (
      "Line{" +
      `x1: ${this.x1}, y1: ${this.y1}, x2: ${this.x2}, y2: ${this.y2}, ` +
      `thickness: ${this.thickness}, color: [${this.r}, ${this.g}, ${this.b}, ${this.a}]}`
    );
  }
}

export { Line, Point };
