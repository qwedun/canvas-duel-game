class Circle {
    constructor(x, y, dy, dx, radius, color) {
        this.x = x;
        this.dx = dx;
        this.y = y;
        this.dy = dy;
        this.radius = radius;
        this.color = color;
    }

    checkCollision(height, width) {
        if (this.y + this.dy + this.radius > height || this.y + this.dy - this.radius < 0)
            this.dy = -this.dy
        if (this.x + this.radius > width || this.x - this.radius < 0)
            this.dx = -this.dx
    }

    static isHeroTouched(hero, x, y) {
        return Math.sqrt(Math.pow(Math.abs(x - hero.x), 2) + Math.pow(Math.abs(y - hero.y), 2)) <= hero.radius
    }
}

export default Circle;