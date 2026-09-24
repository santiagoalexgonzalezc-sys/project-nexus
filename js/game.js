import { updatePlayer } from "./player.js";
import { updateCamera } from "./camera.js";
import { render } from "./renderer.js";

let lastTime = performance.now();

export function animate(currentTime) {
    requestAnimationFrame(animate);

    let deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    // Prevent huge jumps
    deltaTime = Math.min(deltaTime, 0.05);

    // Update
    updatePlayer(deltaTime);
    updateCamera(deltaTime);

    // Render
    render(deltaTime);
}