var backgroundImg;
var state = "HOME";
var ball, ballImg, isMoving = false;
var hole, holeImg, ghost;
var startButton, startButtonImg, controlsButton, controlsButtonImg;
var launchAngle = 0;
var startTime = 0, endTime = startTime, isPressable = true;
var edges;
var score = 0;
var power = 10, powerSprite;
var bruh;
var song, isLooped = false;

function preload() {
  backgroundImg = loadImage("./assets/golf_background.jpg");
  ballImg = loadImage("./assets/golfball.png");
  holeImg = loadImage("./assets/hole.png");
  startButtonImg = loadImage("./assets/start.png");
  controlsButtonImg = loadImage("./assets/controlsbutton.png");
  bruh = loadImage('./assets/golfballcourse.png');

  song = loadSound('./assets/golf-song.wav');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  ball = createSprite(windowWidth / 4, windowHeight / 2, windowHeight / 8, windowHeight / 8);
  ball.addImage(ballImg);
  ball.scale = 0.6;
  // ball.debug = true;
  ball.setCollider("circle", 0, 0, 55)

  hole = createSprite(windowWidth / 4 * 3, windowHeight / 2, windowHeight / 8, windowHeight / 8);
  hole.addImage(holeImg);
  hole.scale = 1.5;
  hole.depth = ball.depth - 1;
  // hole.debug = true;
  ghost = createSprite(hole.x, hole.y, hole.getScaledWidth(), hole.getScaledHeight());
  ghost.depth = hole.depth - 1;
  ghost.shapeColor = "rgba(21%,100%,15%,0)";

  powerSprite = createSprite(windowWidth / 2, 50, power * 100, 50);
  powerSprite.visible = false;

  startButton = createSprite(windowWidth / 2, windowHeight / 2 + 65);
  startButton.addImage(startButtonImg);
  startButton.scale = 0.5;

  controlsButton = createSprite(windowWidth / 2, windowHeight / 2 + 230);
  controlsButton.addImage(controlsButtonImg);
  controlsButton.scale = 0.75;

  r = 255;
  g = 0;
  b = 0;
  song.play();
  console.dir(song)
}

function draw() {
  background('#fae');

  if (state === "HOME") {
    background(backgroundImg, 10);
    ball.visible = false;
    hole.visible = false;
    ghost.visible = false;
    powerSprite.visible = false;
    controlsButton.visible = true;
    startButton.visible = true;

    fill("black");
    textSize(100);
    textAlign(CENTER, TOP);
    text("Golf\nSimulator", windowWidth / 2, 10);

    if (mousePressedOver(startButton)) {
      state = "GAME";
    }

    if (mousePressedOver(controlsButton)) {
      state = "CONTROLS";
    }
  }

  if (state === "CONTROLS") {
    // background('rgba(21%,100%,15%,0.89)');
    startButton.visible = false;
    controlsButton.visible = false;

    textAlign(CENTER, CENTER);
    textSize(50)
    fill("black");
    text(`Use the arrow keys to change the angle of the ball\n
    Use the \"W\" and \"S\" keys to change the power of the ball\n
    Use the enter key to launch the ball\n
    Press escape to go back to the title screen`, windowWidth / 2, windowHeight / 2);

    if (keyWentDown("esc")) {
      state = "HOME";
    }
  }

  if (state === "GAME") {
    background(bruh);
    ball.visible = true;
    hole.visible = true;
    // powerSprite.visible = true;
    startButton.visible = false;
    controlsButton.visible = false;
    edges = createEdgeSprites();
    ball.bounceOff(edges);
    if (!isLooped) {
      song.loop()
      isLooped = true;
    }

    if (isPressable) {
      if (keyDown("left")) {
        if (launchAngle >= 0 && launchAngle < 180) {
          launchAngle += 5;
        }
        else if (launchAngle <= 360 && launchAngle > 180) {
          launchAngle -= 5;
        }
      }
      if (keyDown("right")) {
        if (launchAngle >= 180 && launchAngle < 360) {
          launchAngle += 5;
        }
        else if (launchAngle < 180 && launchAngle > 0) {
          launchAngle -= 5;
        }
      }
      if (keyDown("up")) {
        if (launchAngle >= 0 && launchAngle < 90) {
          launchAngle += 5;
        } else if (launchAngle > 90 && launchAngle <= 270) {
          launchAngle -= 5;
        } else if (launchAngle > 270 && launchAngle < 360) {
          launchAngle += 5;
        }
      }
      if (keyDown("down")) {
        if (launchAngle > 0 && launchAngle <= 90) {
          launchAngle -= 5;
        } else if (launchAngle > 90 && launchAngle < 270) {
          launchAngle += 5;
        } else if (launchAngle > 270 && launchAngle <= 360) {
          launchAngle -= 5;
        }
      }
    }

    if (keyWentDown("enter") && isPressable) {
      startTime = millis();
      endTime = startTime + 1000;
      moveBall(launchAngle);
      isPressable = false
    }
    if (isPressable && keyDown("W") && power >= 0 && power < 30) {
      power += 2
    }
    if (isPressable && keyDown("S") && power > 0 && power <= 30) {
      power -= 2
    }
    powerSprite.width = power * 30;

    if (power >= 20) {
      powerSprite.shapeColor = "red";
    }
    else if (power >= 10) {
      powerSprite.shapeColor = "orange";
    }
    else if (power >= 0) {
      powerSprite.shapeColor = "yellow";
    }
    if (millis() > endTime) {
      ball.setVelocity(0, 0);
      isPressable = true;
    }

    if (keyWentDown("space")) {
      song.stop();
    }
    if (keyWentDown("esc")) {
      state = "HOME";
      song.stop();
      isLooped = false;
    }
    if (ball.isTouching(hole)) {
      ball.setVelocity(0, 0);
      respawnHole();
      score++;
      console.log({ score })
      isPressable = true;
    }


    strokeWeight(10)
    if (power >= 20) {
      stroke("red");
    }
    else if (power >= 10) {
      stroke("orange");
    }
    else if (power >= 0) {
      stroke("yellow");
    }
    if (isPressable)
      line(ball.x, ball.y, ball.x + power * 7.5 * cos(launchAngle), ball.y - power * 7.5 * sin(launchAngle));
    fill("black");
    textSize(100);
    noStroke()
    textAlign(LEFT, TOP);
    text(launchAngle, 0, 0);
    textAlign(RIGHT, TOP)
    text(score, windowWidth, 0);
  }

  drawSprites();
}

function moveBall(angle) {
  var maximumX = power * cos(angle);
  var maximumY = -power * sin(angle);

  switch (angle) {
    case 90: maximumX = 0;
      break;
    case 180: maximumY = 0;
      break;
    case 270: maximumX = 0;
      break;
    case 360: maximumY = 0;
      break;
  }

  ball.velocityX = maximumX;
  ball.velocityY = maximumY;
}

function respawnHole() {
  var randomX = random(ball.getScaledWidth() / 2, windowWidth - ball.getScaledWidth() / 2);
  var randomY = random(ball.getScaledHeight() / 2 + 100, windowHeight - ball.getScaledHeight() / 2);
  ghost.x = randomX;
  ghost.y = randomY;
  if (ghost.isTouching(ball)) {
    respawnHole();
  } else {
    hole.x = randomX;
    hole.y = randomY;
  }
}