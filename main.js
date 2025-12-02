/* Main game file: main.js */
/* Game: [boss fight] */
/* Authors: [Robby and Jaydrien] */
/* Description: [Survive the longest time] */
/* Citations: [List any resources, libraries, tutorials, etc you used here] 
/* Note: If you use significant AI help you should cite that here as well */
/* including summaries of prompts and/or interactions you had with the AI */
/* In addition, of course, any AI-generated code should be clearly maked */
/* in comments throughout the code, though of course when using e.g. CoPilot */
/* auto-complete it maye be impractical to mark every line, which is why you */
/* should also include a summary here */

// Code heavily assisted by Copilot AI.

import "./style.css";

import { GameInterface } from "simple-canvas-library";

let gi = new GameInterface();

/* Variables: Top-Level variables defined here are used to hold game state */
let gameOverState = false;
let points = 0;
let lastScoreTime = 0;
let heart = 1;

let midx = 700;
let midy = 400;
let b = 100;

let px = 100;
let py = 200;

// angle for blips (stupid ass name- robert)
let angle = 0; // in radians

// Collision tracking flags
let wasCollidingPreviousFrame = false;

/* Drawing Functions */
/* Example drawing function: you can add multiple drawing functions
that will be called in sequence each frame. It's a good idea to do 
one function per each object you are putting on screen, and you
may then want to break your drawing function down into sub-functions
to make it easier to read/follow */

//boss and you're dumb
gi.addDrawing(function ({ ctx, width, height, elapsed, stepTime }) {
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(700, 400, 50, 0, Math.PI * 2);
  ctx.fill();
});

//boss attack

gi.addDrawing(function ({ ctx, width, height, elapsed, stepTime }) {
  ctx.fillStyle = "orange";
  // Draw blip at position determined by angle
  // angle, every 20 pixels going out from the center
  // update angle based on elapsed time for smooth animation (slower)
  // increment only once per frame (first attack block runs before the others)
  angle += stepTime * 0.0006;

  // draw small blips along the ray defined by `angle`, stepping outward every 50px
  for (let radius = 50; radius < Math.max(width, height) / 2; radius += 50) {
    const x = midx + Math.cos(angle) * radius;
    const y = midy + Math.sin(angle) * radius;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
  }
  //attack circles around boss
});
//second set of attack circles
gi.addDrawing(function ({ ctx, width, height, elapsed, stepTime }) {
  ctx.fillStyle = "yellow";
  // Draw blip at position determined by angle
  // angle, every 20 pixels going out from the center
  // draw small blips on the 90° rotated ray (no extra angle increment here)
  for (let radius = 50; radius < Math.max(width, height) / 2; radius += 50) {
    const x = midx + Math.cos(angle + Math.PI / 2) * radius;
    const y = midy + Math.sin(angle + Math.PI / 2) * radius;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
  }
  //attack circles around boss
});
//and again more attack
gi.addDrawing(function ({ ctx, width, height, elapsed, stepTime }) {
  ctx.fillStyle = "purple";
  // Draw blip at position determined by angle
  // angle, every 20 pixels going out from the center
  // draw small blips on the 180° rotated ray (opposite side)
  for (let radius = 50; radius < Math.max(width, height) / 2; radius += 50) {
    const x = midx + Math.cos(angle + Math.PI) * radius;
    const y = midy + Math.sin(angle + Math.PI) * radius;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
  }
  //attack circles around boss
});
// fourth side (270°)
gi.addDrawing(function ({ ctx, width, height, elapsed, stepTime }) {
  ctx.fillStyle = "green";
  // draw small blips on the 270° rotated ray
  for (let radius = 50; radius < Math.max(width, height) / 2; radius += 50) {
    const x = midx + Math.cos(angle + (3 * Math.PI) / 2) * radius;
    const y = midy + Math.sin(angle + (3 * Math.PI) / 2) * radius;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
  }
  //attack circles around boss
});
gi.addDrawing(function ({ ctx, width, height, elapsed, stepTime }) {
  // player
  ctx.fillStyle = "blue";
  ctx.beginPath();
  ctx.arc(px, py, 10, 0, Math.PI * 2);
  ctx.fill();
});

// Collision detection: check if player touches blips or boss
gi.addDrawing(function ({ ctx, width, height, elapsed, stepTime }) {
  const playerRadius = 5; // Player collision radius
  const blipRadius = 5; // Blip collision radius
  const bossRadius = 50; // Boss collision radius

  let isCollidingThisFrame = false;

  // Check collision with boss
  const dxBoss = px - midx;
  const dyBoss = py - midy;
  const distanceBoss = Math.sqrt(dxBoss * dxBoss + dyBoss * dyBoss);
  if (distanceBoss < playerRadius + bossRadius) {
    isCollidingThisFrame = true;
  }

  // Check collision with orange blips (angle)
  if (!isCollidingThisFrame) {
    for (let radius = 50; radius < Math.max(width, height) / 2; radius += 50) {
      const x = midx + Math.cos(angle) * radius;
      const y = midy + Math.sin(angle) * radius;
      const dx = px - x;
      const dy = py - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < playerRadius + blipRadius) {
        isCollidingThisFrame = true;
        break;
      }
    }
  }

  // Check collision with yellow blips (angle + PI/2)
  if (!isCollidingThisFrame) {
    for (let radius = 50; radius < Math.max(width, height) / 2; radius += 50) {
      const x = midx + Math.cos(angle + Math.PI / 2) * radius;
      const y = midy + Math.sin(angle + Math.PI / 2) * radius;
      const dx = px - x;
      const dy = py - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < playerRadius + blipRadius) {
        isCollidingThisFrame = true;
        break;
      }
    }
  }

  // Check collision with purple blips (angle + PI)
  if (!isCollidingThisFrame) {
    for (let radius = 50; radius < Math.max(width, height) / 2; radius += 50) {
      const x = midx + Math.cos(angle + Math.PI) * radius;
      const y = midy + Math.sin(angle + Math.PI) * radius;
      const dx = px - x;
      const dy = py - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < playerRadius + blipRadius) {
        isCollidingThisFrame = true;
        break;
      }
    }
  }

  // Check collision with green blips (angle + 3*PI/2)
  if (!isCollidingThisFrame) {
    for (let radius = 50; radius < Math.max(width, height) / 2; radius += 50) {
      const x = midx + Math.cos(angle + (3 * Math.PI) / 2) * radius;
      const y = midy + Math.sin(angle + (3 * Math.PI) / 2) * radius;
      const dx = px - x;
      const dy = py - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < playerRadius + blipRadius) {
        isCollidingThisFrame = true;
        break;
      }
    }
  }

  // Only subtract heart when collision just started (wasn't colliding last frame)
  if (isCollidingThisFrame && !wasCollidingPreviousFrame) {
    heart--;
  }
  wasCollidingPreviousFrame = isCollidingThisFrame;
  // Score update
  function addScore(elapsed) {
    if (elapsed - lastScoreTime >= 1000 && gameOverState === false) {
      points = points + 1;
      lastScoreTime = elapsed; // reset the timer
    }
  }
  // Adds to the score
  addScore(elapsed);
  // Check if game over
  if (
    heart <= 0 ||
    px < 0 ||
    px > width ||
    py < 0 ||
    (py > height && gameOverState === false)
  ) {
    triggerGameOver();
  }

  /// Game over handler function
  function triggerGameOver() {
    gameOverState = true;
    gi.dialog("Game Over!", "Your final score is " + points, () => {
      window.location.reload();
    });
  }
});
//function to prevent player from going off screen

//check for boundary

/* Input Handlers */

/* Example: Mouse click handler (you can change to handle 
any type of event -- keydown, mousemove, etc) */

gi.addHandler("keydown", function ({ event, x, y }) {
  // move down on "s" key
  if (event.key === "s") {
    py += 10;
  } else if (event.key === "w") {
    py -= 10;
  } else if (event.key === "a") {
    px -= 10;
  } else if (event.key === "d") {
    px += 10;
  }
  //diagonal movement by pressing two keys at once
  else {
    console.log("other key: " + event.key);
  }
});

/* Run the game */
gi.run();
