import { GL11 } from "./constants";
export class ZoomHandler {
    constructor() {
        this.zoom = 1;
        this.offsetX = 0;
        this.offsetY = 0;
    }
    zoomFunc(mx, my, dir) {
        this.offsetX -= mx;
        this.offsetY -= my;
        const delta = dir > 0 ? 1.25 : 0.8;
        this.zoom *= delta;
        this.offsetX *= delta;
        this.offsetY *= delta;
        this.offsetX += mx;
        this.offsetY += my;
    }
    dragFunc(dx, dy) {
        this.offsetX += dx;
        this.offsetY += dy;
    }
    reset() {
        this.zoom = 1;
        this.offsetX = 0;
        this.offsetY = 0;
    }
    translateAndScale() {
        GL11.glTranslated(this.offsetX, this.offsetY, 0);
        GL11.glScaled(this.zoom, this.zoom, this.zoom);
    }
    constrainMouseX() {
        return (Client.getMouseX() - this.offsetX) / this.zoom;
    }
}
