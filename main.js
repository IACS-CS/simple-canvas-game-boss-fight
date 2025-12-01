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


import "./style.css";

import { GameInterface } from 'simple-canvas-library';

let gi = new GameInterface();

/* Variables: Top-Level variables defined here are used to hold game state */
let heart=1
let midx= 700
let midy=400
let b=100

let px=200
let py=400

// angle for blips (stupid ass name- robert)
let angle=0; // in radians

/* Drawing Functions */
/* Example drawing function: you can add multiple drawing functions
that will be called in sequence each frame. It's a good idea to do 
one function per each object you are putting on screen, and you
may then want to break your drawing function down into sub-functions
to make it easier to read/follow */



//boss and you're dumb
gi.addDrawing(
function ({ ctx, width, height, elapsed, stepTime }) {
  ctx.fillStyle = "red"
  ctx.beginPath();
  ctx.arc(700,400,50,0, Math.PI * 2);
  ctx.fill();
})

//boss attack

gi.addDrawing(
function ({ ctx, width, height, elapsed, stepTime }) {
  ctx.fillStyle = "orange"
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
  
})
//second set of attack circles
gi.addDrawing(
function ({ ctx, width, height, elapsed, stepTime }) {
  ctx.fillStyle = "yellow"
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
})
//and again more attack
gi.addDrawing(
function ({ ctx, width, height, elapsed, stepTime }) {
  ctx.fillStyle = "purple"
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
})
// fourth side (270°)
gi.addDrawing(
function ({ ctx, width, height, elapsed, stepTime }) {
  ctx.fillStyle = "green"
  // draw small blips on the 270° rotated ray
  for (let radius = 50; radius < Math.max(width, height) / 2; radius += 50) {
    const x = midx + Math.cos(angle + (3 * Math.PI) / 2) * radius;
    const y = midy + Math.sin(angle + (3 * Math.PI) / 2) * radius;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
  }
  //attack circles around boss
})
gi.addDrawing(
  function ({ ctx, width, height, elapsed, stepTime }) {
    // player
    ctx.fillStyle = "blue"
    ctx.beginPath();
    ctx.arc(px, py, 10, 0, Math.PI * 2);
    ctx.fill();
}
)
//hearts

gi.addDrawing(
  function ({ ctx, width, height, elapsed, stepTime }) {
    ctx.fillStyle = "red"
    ctx.moveTo(10,10)
    ctx.arc(10,10,10,0, Math.PI, true);
    ctx.arc(30,10,10,0, Math.PI, true);
    ctx.moveTo(40,10)
    ctx.lineTo(20,30);
    ctx.lineTo(0,10);
    ctx.fill();
}
)
//if player touches blip remove a heart


//
/* Input Handlers */

/* Example: Mouse click handler (you can change to handle 
any type of event -- keydown, mousemove, etc) */

gi.addHandler(
 
 "keydown",
  function ({ event, x, y }) {
    // move down on "s" key
    if (event.key === "s") {
      py += 10 
    } else if (event.key === "w") {
      py -= 10
    } else if (event.key === "a") {
      px -= 10
    } else if (event.key === "d") {
      px += 10
    }
    //diagonal movement by pressing two keys at once

    else {
      console.log("other key: " + event.key)
    }
  //player can leave screen fix later
  }
)


/* Run the game */
gi.run();

