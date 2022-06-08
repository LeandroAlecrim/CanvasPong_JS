const INITIAL_SPEED = 4;
const SPEED_INCREASE = 0.001;
const PADDLE_WIDTH = 10;

class Paddle {
  /** Cria um objeto Paddle */
  constructor({
    posX = 0,
    posY = 0,
    width = PADDLE_WIDTH,
    height = 50,
    speed = INITIAL_SPEED,
  }) {
    this.width = width;
    this.height = height;
    this.posX = posX;
    this.posY = posY;
    this.speed = speed;
  }

  /** Retorna as posições */
  rect() {
    return {
      left: this.posX,
      right: this.posX + this.width,
      top: this.posY,
      bottom: this.posY + this.height,
    };
  }

  /** Reseta as propriedades deste objeto */
  reset({ posX, posY, speed = INITIAL_SPEED }) {
    this.posX = posX;
    this.posY = posY;
    this.speed = speed;
  }

  /** Atualiza a posição e a direção */
  update({ delta, heightLimit, ballCenterY }) {
    const paddleCenterY = this.posY + this.height / 2;
    const direction = paddleCenterY < ballCenterY ? 1 : -1;
    this.posY += this.speed * delta * direction;

    const rect = this.rect();
    if (rect.top < 0) {
      this.posY = 0;
    } else if (rect.bottom > heightLimit) {
      this.posY = heightLimit - this.height;
    }
  }
}
