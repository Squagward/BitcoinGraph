import { screenCenterX, screenCenterY } from "./constants";
export class Square {
    constructor({ width, height }) {
        this.width = width;
        this.height = height;
        this.left = screenCenterX - width / 2;
        this.right = screenCenterX + width / 2;
        this.top = screenCenterY - height / 2;
        this.bottom = screenCenterY + height / 2;
    }
}
