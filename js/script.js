window.onload = function () {
  //# region Globals
  const FOREGROUND_COLOR = '#0077aa';
  const BACKGROUND_COLOR = '#FFFFFFF';
  const PADDLE_WIDTH = 10;

  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');

  let ball;
  let playerPaddle;
  let computerPaddle;
  let score;
  let lastTime;
  //#endregion Globals

  // Run Game
  init();

  //#region Render
  function render() {
    // clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // render
    renderBackground();
    renderBall();
    renderPlayerPaddle();
    renderComputerPaddle();
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

  function renderPlayerPaddle() {
    context.save();
    context.fillStyle = FOREGROUND_COLOR;
    context.fillRect(
      playerPaddle.posX,
      playerPaddle.posY,
      playerPaddle.width,
      playerPaddle.height
    );
    context.restore();
  }

  function renderComputerPaddle() {
    context.save();
    context.fillStyle = FOREGROUND_COLOR;
    context.fillRect(
      computerPaddle.posX,
      computerPaddle.posY,
      computerPaddle.width,
      computerPaddle.height
    );
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
      // standardize the movement speed
      let delta = time / lastTime;

      ball.update(delta, canvas, [playerPaddle.rect(), computerPaddle.rect()]);
      computerPaddle.update(delta, canvas, ball.centerY);

      if (isLose()) handleLose();
    }
    lastTime = time;
  }
  //#endregion Update

  //#region Game
  function resizeCanvas() {
    canvas.width = window.innerWidth * 0.99;
    canvas.height = window.innerHeight * 0.97;
  }

  function reset() {
    ball.reset(canvas);
    computerPaddle.reset(canvas, {
      posX: canvas.width - 20,
      posY: 0,
      width: 10,
      height: canvas.height / 10,
    });
  }

  function isLose() {
    const rect = ball.rect();
    return rect.right >= canvas.width || rect.left <= 0;
  }

  function handleLose() {
    const rect = ball.rect();
    if (rect.right >= canvas.width) {
      score.player++;
    } else {
      score.computer++;
    }
    reset();
  }

  function loop(time) {
    update(time);
    render();
    requestAnimationFrame(loop);
  }

  function init() {
    resizeCanvas(canvas);

    ball = new Ball(canvas);
    playerPaddle = new Paddle(canvas, {
      posX: PADDLE_WIDTH,
      posY: 0,
      width: PADDLE_WIDTH,
      height: canvas.height / 10,
    });
    computerPaddle = new Paddle(canvas, {
      posX: canvas.width - 2 * PADDLE_WIDTH,
      posY: 0,
      width: PADDLE_WIDTH,
      height: canvas.height / 10,
    });
    score = new Score();

    loop();
  }
  //#endregion Game

  //#region Events
  window.addEventListener('mousemove', (e) => {
    playerPaddle.posY =
      (e.y / canvas.height) * canvas.height - playerPaddle.height;

    if (playerPaddle.posY < 0) {
      playerPaddle.posY = 0;
    }

    if (playerPaddle.posY + playerPaddle.height > canvas.height) {
      playerPaddle.posY = canvas.height - playerPaddle.height;
    }
  });
  //#endregion Events
};
