import {
    canvas,
    ctx,
    camera,
    viewport
} from "./state.js";

import {
    drawMap
} from "./world.js";

import {
    drawPlayer
} from "./player.js";

import {
    updateProjectiles
} from "./projectile.js";

import {
    drawHUD
} from "./hud.js";

export function resizeCanvas() {

    viewport.width =
        window.innerWidth;

    viewport.height =
        window.innerHeight;

    canvas.width = viewport.width;
    canvas.height = viewport.height;
}

export function render(deltaTime) {

    // Clear screen
    ctx.clearRect(
        0,
        0,
        viewport.width,
        viewport.height
    );

    // World rendering
    ctx.save();

    // Camera transformation
    ctx.translate(
        -camera.x,
        -camera.y
    );

    drawMap();
    updateProjectiles(deltaTime);
    drawPlayer();

    ctx.restore();

    // Screen space rendering
    drawHUD();
}
