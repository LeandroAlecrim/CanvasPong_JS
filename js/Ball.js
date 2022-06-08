const INITIAL_VELOCITY = 5;
const VELOCITY_INCREASE = 0.5;

class Ball {
  /** Cria um objeto Ball */
  constructor({ centerX, centerY, radius }) {
    this.radius = radius;
    this.reset({ centerX, centerY });
  }

  /** Retorna as posições do quadrado externo a este objeto */
  rect() {
    return {
      left: this.centerX - this.radius,
      right: this.centerX + this.radius,
      top: this.centerY - this.radius,
      bottom: this.centerY + this.radius,
    };
  }

  /** Reseta as propriedades deste objeto */
  reset({ centerX, centerY }) {
    this.centerX = centerX;
    this.centerY = centerY;
    this.velocity = INITIAL_VELOCITY;
    this.direction = { x: 0 };

    while (
      Math.abs(this.direction.x) <= 0.2 ||
      Math.abs(this.direction.x) >= 0.9
    ) {
      const heading = randomNumberBetween(0, 2 * Math.PI);
      this.direction = { x: Math.cos(heading), y: Math.sin(heading) };
    }
  }

  /** Atualiza a posição e a direção */
  update({ delta, heightLimit, paddleRects }) {
    this.centerX += this.direction.x * this.velocity * delta;
    this.centerY += this.direction.y * this.velocity * delta;

    // "Quica" a bola no eixo Y
    const rect = this.rect();
    if (rect.bottom >= heightLimit || rect.top <= 0) {
      this.direction.y *= -1;
    }

    // se houver colisão com alguma palheta, inverte a direção no eixoX e
    // muda aleatoriamente a direção no eixo Y
    if (paddleRects.some((r) => isCollision(r, rect))) {
      this.direction.x *= -1;
      this.direction.y = randomNumberBetween(-1, 1);
      this.velocity += VELOCITY_INCREASE;
    }
  }
}

//#region Functions
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
//#endregion Functions
