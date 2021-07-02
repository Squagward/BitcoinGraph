export class Square {
    constructor(width, height) {
        const screenCenterX = Renderer.screen.getWidth() / 2;
        const screenCenterY = Renderer.screen.getHeight() / 2;
        this.width = width;
        this.height = height;
        this.left = screenCenterX - width / 2;
        this.right = screenCenterX + width / 2;
        this.top = screenCenterY - height / 2;
        this.bottom = screenCenterY + height / 2;
    }
}
