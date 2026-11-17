class Screen {
    constructor(x, y, width, height, img) {
        var options = {
            isStatic: true
        }
        this.body = Bodies.rectangle(x, y, width, height, img, options);
        this.width = width;
        this.height = height;
        this.image = loadImage("./sprites/" + img);
        World.add(world, this.body);
    }
    display() {
        var pos = this.body.position;

        imageMode(CENTER);
        fill("black");
        image(this.image, pos.x, pos.y, this.width, this.height);
    }
};
