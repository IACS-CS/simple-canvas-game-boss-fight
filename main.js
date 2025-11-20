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


/* Drawing Functions */
/* Example drawing function: you can add multiple drawing functions
that will be called in sequence each frame. It's a good idea to do 
one function per each object you are putting on screen, and you
may then want to break your drawing function down into sub-functions
to make it easier to read/follow */
let px=200
let py=400
gi.addDrawing(
  function ({ ctx, width, height, elapsed, stepTime }) {
    // player
    ctx.beginPath();
    ctx.fillStyle = "blue"
    ctx.arc(px, py, 10, 0, Math.PI * 2);
    ctx.fill();
  
}
)

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
    else {
      console.log("other key: " + event.key)
    }
  
  }
)


/* Run the game */
gi.run();


