class Boat {
  constructor(x, y, width, height, boatPos, boatAnimation) {
   
    this.animation = boatAnimation;
    this.speed = 0.05;
    this.body = Bodies.rectangle(x, y, width, height);
    this.width = width;
    this.height = height;

    this.boatPosition = boatPos;
    this.isBroken = false;
    this.life = 100;

    World.add(world, this.body);
  }
  animate() {
    this.speed += 0.05;
  }

  remove(index) {
    this.animation = brokenBoatAnimation;
    this.speed = 0.05;
    this.width = 300;
    this.height = 300;
    this.isBroken = true;
    setTimeout(() => {
      Matter.World.remove(world, boats[index].body);
      boats.splice(index, 1);
    }, 2000);
  }

  display() {
    var angle = this.body.angle;
    var pos = this.body.position;
    var index = floor(this.speed % this.animation.length);

    push();
    translate(pos.x, pos.y);
    rotate(angle);
    imageMode(CENTER);
    image(this.animation[index], 0, this.boatPosition, this.width, this.height);
    noTint();
    pop();
  }

  showLife() {
    if(this.life >= 0){
      push();
      fill("white");
      rect((this.body.position.x - 50), (this.body.position.y - 150), 100, 10);
      fill("red");
      rect((this.body.position.x - 50), (this.body.position.y - 150), this.life, 10)
      pop();
    }
  }
}

