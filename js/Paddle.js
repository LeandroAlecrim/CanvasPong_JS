const INITIAL_SPEED = 4;
const SPEED_INCREASE = 0.001;

class Paddle {
  constructor(canvas, options) {
    this.reset(canvas, options);
  }

  rect() {
    return {
      left: this.posX,
      right: this.posX + this.width,
      top: this.posY,
      bottom: this.posY + this.height,
    };
  }

  reset(canvas, options) {
    this.width = options.width;
    this.height = options.height;
    this.posX = options.posX;
    this.posY = options.posY + Math.round(canvas.height / 2);
    this.speed = INITIAL_SPEED;
  }

  update(delta, canvas, ballCenterY) {
    if (this.posY + this.height / 2 < ballCenterY) {
      this.posY += this.speed * delta;
    } else if (this.posY + this.height / 2 > ballCenterY) {
      this.posY -= this.speed * delta;
    }

    if (this.posY < 0) {
      this.posY = 0;
    }

    if (this.posY + this.height > canvas.height) {
      this.posY = canvas.height - this.height;
    }
  }
}
