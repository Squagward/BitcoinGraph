import { screenCenterX, screenCenterY } from "./constants";

export class Square {
  public readonly left: number;
  public readonly right: number;
  public readonly top: number;
  public readonly bottom: number;

  public readonly width: number;
  public readonly height: number;

  constructor({ width, height }: { width: number; height: number }) {
    this.width = width;
    this.height = height;

    this.left = screenCenterX - width / 2;
    this.right = screenCenterX + width / 2;
    this.top = screenCenterY - height / 2;
    this.bottom = screenCenterY + height / 2;
  }
}
