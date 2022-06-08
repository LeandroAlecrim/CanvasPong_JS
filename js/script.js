const FOREGROUND_COLOR = '#0077aa';
const BACKGROUND_COLOR = '#FFFFFFF';

window.onload = function () {
  //# region Globals
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');

  let ball;
  let playerPaddle;
  let computerPaddle;
  let score;
  let lastTime;
  //#endregion Globals

  // Mostra intro por 2s e roda o jogo
  setTimeout(function () {
    document.getElementById('intro').classList.replace('intro', 'd-none');
    init();
  }, 2000);

  //#region Render
  function render() {
    // limpa o canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // renderiza
    renderBackground();
    renderBall();
    renderPaddle(playerPaddle);
    renderPaddle(computerPaddle);
    renderScore();
  }

  function renderBackground() {
    context.save();
    context.fillStyle = BACKGROUND_COLOR;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.restore();
  }

  function renderBall() {
    context.save();
    context.beginPath();
    context.fillStyle = FOREGROUND_COLOR;
    context.arc(ball.centerX, ball.centerY, ball.radius, 0, 2 * Math.PI);
    context.fill();
    context.restore();
  }

  function renderPaddle(paddle) {
    context.save();
    context.fillStyle = FOREGROUND_COLOR;
    context.fillRect(paddle.posX, paddle.posY, paddle.width, paddle.height);
    context.restore();
  }

  function renderScore() {
    context.save();
    context.fillStyle = FOREGROUND_COLOR;
    context.font = '50px Arial';
    context.textAlign = 'center';
    context.fillText(
      `${score.player} | ${score.computer}`,
      canvas.width / 2,
      75
    );
    context.restore();
  }
  //#endregion Render

  //#region Update
  function update(time) {
    if (lastTime != null) {
      let delta = time / lastTime; // delta padroniza a velocidade de atualização do jogo

      // atualiza posição
      ball.update({
        delta: delta,
        heightLimit: canvas.height,
        paddleRects: [playerPaddle.rect(), computerPaddle.rect()],
      });
      computerPaddle.update({
        delta: delta,
        heightLimit: canvas.height,
        ballCenterY: ball.centerY,
      });

      // checa colisão
      const ballRect = ball.rect();
      if (isLose(ballRect)) handleLose(ballRect);
    }
    lastTime = time;
  }
  //#endregion Update

  //#region Game
  function resizeCanvas() {
    canvas.width = window.innerWidth * 0.99;
    canvas.height = window.innerHeight * 0.97;
  }

  // reposiciona palhetas no centro do eixo Y
  function reset() {
    ball.reset({
      centerX: Math.round(canvas.width / 2),
      centerY: Math.round(canvas.height / 2),
    });

    computerPaddle.reset({
      posX: canvas.width - 2 * PADDLE_WIDTH,
      posY: Math.round(canvas.height / 2),
    });
  }

  function isLose(rect) {
    return rect.right >= canvas.width || rect.left <= 0;
  }

  function handleLose(rect) {
    if (rect.right >= canvas.width) score.player++;
    else if (rect.left <= 0) score.computer++;
    reset();
  }

  function loop(time) {
    update(time);
    render();
    requestAnimationFrame(loop);
  }

  function init() {
    resizeCanvas(canvas);

    ball = new Ball({
      centerX: Math.round(canvas.width / 2),
      centerY: Math.round(canvas.height / 2),
      radius: canvas.height / 100,
    });

    playerPaddle = new Paddle({
      posX: PADDLE_WIDTH,
      posY: Math.round(canvas.height / 2),
      height: canvas.height / 10,
    });

    computerPaddle = new Paddle({
      posX: canvas.width - 2 * PADDLE_WIDTH,
      posY: Math.round(canvas.height / 2),
      height: canvas.height / 10,
    });

    score = new Score();

    loop();
  }
  //#endregion Game

  //#region Events
  canvas.addEventListener('mousemove', (e) => {
    if (!playerPaddle) return;

    // captura posição do mouse
    playerPaddle.posY =
      (e.y / canvas.height) * canvas.height - playerPaddle.height;

    // corrige posição da palheta fora do canvas
    if (playerPaddle.posY < 0) {
      playerPaddle.posY = 0;
    } else if (playerPaddle.posY + playerPaddle.height > canvas.height) {
      playerPaddle.posY = canvas.height - playerPaddle.height;
    }
  });
  //#endregion Events
};
