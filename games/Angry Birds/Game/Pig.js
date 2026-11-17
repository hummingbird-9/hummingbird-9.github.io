class Pig extends BaseClass {
    constructor(x, y) {
        super(x, y, 50, 50);
        this.image = loadImage("./sprites/enemy.png");
        this.Visiblity = 255;
        this.isDead = false;
        this.removed = false;
    }
    display() {
        if (this.body.speed > 3) {
            World.remove(world, this.body);
        } else {
            super.display();
        }
    }
};
