const INITIAL_VELOCITY = 5;
const VELOCITY_INCREASE = 0.25;

class Ball {
  constructor(canvas) {
    this.reset(canvas);
  }

  rect() {
    return {
      left: this.centerX - this.radius,
      right: this.centerX + this.radius,
      top: this.centerY - this.radius,
      bottom: this.centerY + this.radius,
    };
  }

  reset(canvas) {
    this.centerX = Math.round(canvas.width / 2);
    this.centerY = Math.round(canvas.height / 2);
    this.radius = canvas.height / 100;

    this.direction = { x: 0 };
    while (
      Math.abs(this.direction.x) <= 0.2 ||
      Math.abs(this.direction.x) >= 0.9
    ) {
      const heading = randomNumberBetween(0, 2 * Math.PI);
      this.direction = { x: Math.cos(heading), y: Math.sin(heading) };
    }

    this.velocity = INITIAL_VELOCITY;
  }

  update(delta, canvas, paddleRects) {
    this.centerX += this.direction.x * this.velocity * delta;
    this.centerY += this.direction.y * this.velocity * delta;

    const rect = this.rect();

    if (rect.bottom >= canvas.height || rect.top <= 0) {
      this.direction.y *= -1;
    }

    if (paddleRects.some((r) => isCollision(r, rect))) {
      this.direction.x *= -1;
      this.velocity += VELOCITY_INCREASE;
    }
  }
}

function randomNumberBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function isCollision(rect1, rect2) {
  return (
    rect1.left <= rect2.right &&
    rect1.right >= rect2.left &&
    rect1.top <= rect2.bottom &&
    rect1.bottom >= rect2.top
  );
}
