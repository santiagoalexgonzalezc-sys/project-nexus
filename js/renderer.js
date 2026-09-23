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
