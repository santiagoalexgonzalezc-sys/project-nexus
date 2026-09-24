import { canvas, viewport } from "./state.js";
import { animate } from "./game.js";

// Initialize canvas size
canvas.width = viewport.width;
canvas.height = viewport.height;

// Start game loop
requestAnimationFrame(animate);