import {
    ctx
} from "./state.js";

import {
    MAP_WIDTH,
    MAP_HEIGHT
} from "./config.js";

export function drawMap() {

    // Background
    ctx.fillStyle =
        "#17221c";

    ctx.fillRect(
        0,
        0,
        MAP_WIDTH,
        MAP_HEIGHT
    );

    // ========================================================
    // GRID
    // ========================================================

    const gridSize = 100;

    ctx.strokeStyle =
        "rgba(255,255,255,0.045)";

    ctx.lineWidth = 1;

    ctx.beginPath();

    for (
        let x = 0;
        x <= MAP_WIDTH;
        x += gridSize
    ) {

        ctx.moveTo(x, 0);
        ctx.lineTo(
            x,
            MAP_HEIGHT
        );
    }

    for (
        let y = 0;
        y <= MAP_HEIGHT;
        y += gridSize
    ) {

        ctx.moveTo(0, y);
        ctx.lineTo(
            MAP_WIDTH,
            y
        );
    }

    ctx.stroke();

    // ========================================================
    // MAP BORDER
    // ========================================================

    ctx.strokeStyle =
        "#C8AA6E";

    ctx.lineWidth = 8;

    ctx.strokeRect(
        0,
        0,
        MAP_WIDTH,
        MAP_HEIGHT
    );
}