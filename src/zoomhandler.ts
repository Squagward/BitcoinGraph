import { GL11 } from "./constants";

export class ZoomHandler {
  private zoom: number;
  private offsetX: number;
  private offsetY: number;

  constructor() {
    this.zoom = 1;
    this.offsetX = 0;
    this.offsetY = 0;
  }

  public zoomFunc(mx: number, my: number, dir: number): void {
    this.offsetX -= mx;
    this.offsetY -= my;

    const delta = dir > 0 ? 1.25 : 0.8;
    this.zoom *= delta;

    this.offsetX *= delta;
    this.offsetY *= delta;

    this.offsetX += mx;
    this.offsetY += my;
  }

  public dragFunc(dx: number, dy: number): void {
    this.offsetX += dx;
    this.offsetY += dy;
  }

  public reset(): void {
    this.zoom = 1;
    this.offsetX = 0;
    this.offsetY = 0;
  }

  public translateAndScale(): void {
    GL11.glTranslated(this.offsetX, this.offsetY, 0);
    GL11.glScaled(this.zoom, this.zoom, this.zoom);
  }

  public constrainMouseX(): number {
    return (Client.getMouseX() - this.offsetX) / this.zoom;
  }
}
