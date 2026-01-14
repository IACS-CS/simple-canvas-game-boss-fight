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

// AI has created the code for drawing the blips across the screen, as well as making them circle around the center of the screen. It has also created the distance formula code, helped the game over function work, made invincibility frames work, and fixed the controls for the blue circle.

import "./style.css";

import { GameInterface } from "simple-canvas-library";

let gi = new GameInterface();

/* Variables: Top-Level variables defined here are used to hold game state */
let gameOverState = false;
let points = 0;
let cheater = false;
let lastScoreTime = 0;
let heart = 3;
let gameOverText = "You did awful!";
let iframe = 0; //invincibility frame timer
//sizes of the gaps between blips
let green = 45;
let yellow = 40;
let purple = 50;
let orange = 35;
//boss position (will be set to center of canvas)
let bossX = 0;
let bossY = 0;
//player position
let px = 100;
let py = 200;
let ps = 12; //player speed
//collision checks
let keysDown = {
  // an object to keep track of what keys are currently pressed...
  w: false,
  a: false,
  s: false,
  d: false,
  // fill in...
};

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

//boss
gi.addDrawing(function ({ ctx, width, height, elapsed, stepTime }) {
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(width / 2, height / 2, 50, 0, Math.PI * 2);
  ctx.fill();
});
gi.addDrawing(function ({ ctx, width, height, elapsed, stepTime }) {
  //changes opinion text that appears in game over dialog based on score
  if (points >= 3) {
    gameOverText = "You did bad.";
  } else if (points >= 10) {
    gameOverText = "You did okay.";
  } else if (points >= 20) {
    gameOverText = "You did good!";
  } else if (points >= 30) {
    gameOverText = "You did great!";
  }
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
  for (
    let radius = 50;
    radius < Math.max(width, height) / 2;
    radius += orange
  ) {
    const x = width / 2 + Math.cos(angle) * radius;
    const y = height / 2 + Math.sin(angle) * radius;
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
  for (
    let radius = 50;
    radius < Math.max(width, height) / 2;
    radius += yellow
  ) {
    const x = width / 2 + Math.cos(angle + Math.PI / 2) * radius;
    const y = height / 2 + Math.sin(angle + Math.PI / 2) * radius;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
  }
  //attack circles around boss
});
//Purple set of blips
gi.addDrawing(function ({ ctx, width, height, elapsed, stepTime }) {
  ctx.fillStyle = "purple";
  // Draw blip at position determined by angle
  // angle, every 20 pixels going out from the center
  // draw small blips on the 180° rotated ray (opposite side)
  for (
    let radius = 50;
    radius < Math.max(width, height) / 2;
    radius += purple
  ) {
    const x = width / 2 + Math.cos(angle + Math.PI) * radius;
    const y = height / 2 + Math.sin(angle + Math.PI) * radius;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
  }
  //attack circles around boss
});
// fourth side of blips (270°)
gi.addDrawing(function ({ ctx, width, height, elapsed, stepTime }) {
  ctx.fillStyle = "green";
  // draw small green blips on the 270° rotated ray
  for (let radius = 50; radius < Math.max(width, height) / 2; radius += green) {
    const x = width / 2 + Math.cos(angle + (3 * Math.PI) / 2) * radius;
    const y = height / 2 + Math.sin(angle + (3 * Math.PI) / 2) * radius;
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
gi.addDrawing(function ({ ctx, width, height, elapsed, stepTime }) {
  // Your drawing code here...
  ctx.fillStyle = "green";
  ctx.font = "20px Arial";
  ctx.fillText(`Score - ${points}`, 20, 20);
  ctx.fillText(`Health - ${heart}`, 20, 50);
  if (px >= width || px <= 0 || py >= height || py <= 0) {
    cheater = true;
    ctx.fillText(`Get back here.`, width / 2, height / 2);
  } else {
    cheater = false;
  } if (points <= 10) {
    ctx.fillText(`Use WASD or Arrow keys to move!`, width / 2 - 100, height - 20);
  }
});
//timer that prevents damage being dealt every frame
function iframeTimer(stepTime) {
  if (iframe > 0) {
    iframe -= stepTime / 10;
    if (iframe < 0) iframe = 0;
  }
}
// call iframeTimer every frame to decrease iframe
gi.addDrawing(function ({ stepTime }) {
  iframeTimer(stepTime);
});
// Collision detection: check if player touches blips or boss
gi.addDrawing(function ({ ctx, width, height, elapsed, stepTime }) {
  const playerRadius = 5; // Player collision radius
  const blipRadius = 5; // Blip collision radius
  const bossRadius = 50; // Boss collision radius

  let isCollidingThisFrame = false;

  // Only check for collisions if invincibility frames are not active
  if (iframe === 0) {
    // Update boss position to center of canvas
    bossX = width / 2;
    bossY = height / 2;

    // Check collision with boss (recalculate distance each frame)
    const dxBoss = px - bossX;
    const dyBoss = py - bossY;
    const distanceBoss = Math.sqrt(dxBoss * dxBoss + dyBoss * dyBoss);

    if (distanceBoss < playerRadius + bossRadius) {
      isCollidingThisFrame = true;
    }

    // Check collision with orange blips (angle)
    if (!isCollidingThisFrame) {
      for (
        let radius = 50;
        radius < Math.max(width, height) / 2;
        radius += orange
      ) {
        const x = bossX + Math.cos(angle) * radius;
        const y = bossY + Math.sin(angle) * radius;
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
      for (
        let radius = 50;
        radius < Math.max(width, height) / 2;
        radius += yellow
      ) {
        const x = bossX + Math.cos(angle + Math.PI / 2) * radius;
        const y = bossY + Math.sin(angle + Math.PI / 2) * radius;
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
      for (
        let radius = 50;
        radius < Math.max(width, height) / 2;
        radius += purple
      ) {
        const x = bossX + Math.cos(angle + Math.PI) * radius;
        const y = bossY + Math.sin(angle + Math.PI) * radius;
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
      for (
        let radius = 50;
        radius < Math.max(width, height) / 2;
        radius += green
      ) {
        const x = bossX + Math.cos(angle + (3 * Math.PI) / 2) * radius;
        const y = bossY + Math.sin(angle + (3 * Math.PI) / 2) * radius;
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
      iframe = 60; // Set invincibility frames (adjust value as needed)
    }
  } else {
    // Still update boss position even during invincibility
    bossX = width / 2;
    bossY = height / 2;
  }

  // Always update wasCollidingPreviousFrame, even during iframes
  wasCollidingPreviousFrame = isCollidingThisFrame;

  // Score update
  function addScore(elapsed) {
    if (
      elapsed - lastScoreTime >= 1000 &&
      gameOverState === false &&
      !cheater
    ) {
      points = points + 1;
      lastScoreTime = elapsed; // reset the timer
    }
  }
  // Adds to the score
  addScore(elapsed);
  // Check if game over
  if (heart <= 0 && !gameOverState) {
    triggerGameOver();
  }
});

/// Game over handler function
function triggerGameOver() {
  gameOverState = true;
  gi.pause();
  gi.dialog(
    "Game Over!",
    `Your final score is ${points}. ${gameOverText}`,
    () => {
      window.location.reload();
    }
  );
}
//function to prevent player from going off screen

//check for boundary

/* Input Handlers */

/* Set up keyboard event handlers to track which keys are pressed (AI generated) */
gi.addHandler("keydown", ({ event }) => {
  const key = event.key.toLowerCase();
  if (key === "w") keysDown.w = true;
  if (key === "a") keysDown.a = true;
  if (key === "s") keysDown.s = true;
  if (key === "d") keysDown.d = true;
  if (event.key === "ArrowUp") keysDown.w = true;
  if (event.key === "ArrowLeft") keysDown.a = true;
  if (event.key === "ArrowDown") keysDown.s = true;
  if (event.key === "ArrowRight") keysDown.d = true;
});

gi.addHandler("keyup", ({ event }) => {
  const key = event.key.toLowerCase();
  if (key === "w") keysDown.w = false;
  if (key === "a") keysDown.a = false;
  if (key === "s") keysDown.s = false;
  if (key === "d") keysDown.d = false;
  if (event.key === "ArrowUp") keysDown.w = false;
  if (event.key === "ArrowLeft") keysDown.a = false;
  if (event.key === "ArrowDown") keysDown.s = false;
  if (event.key === "ArrowRight") keysDown.d = false;
});

/* Handle player movement (AI generated) */
gi.addDrawing(function ({ stepTime, width, height }) {
  // Handle upward movement
  if (keysDown.w) {
    py -= (ps * 10) / stepTime;
  }
  // Handle downward movement
  if (keysDown.s) {
    py += (ps * 10) / stepTime;
  }
  // Handle left movement
  if (keysDown.a) {
    px -= (ps * 10) / stepTime;
  }
  // Handle right movement
  if (keysDown.d) {
    px += (ps * 10) / stepTime;
  }
  // Reset speed if it's been boosted
  if (ps > 12) {
    ps -= stepTime / 10;
    if (ps < 12) {
      ps = 12;
    }
  }
});

/* Run the game */
gi.run();
