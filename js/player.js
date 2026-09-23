import {
    MAP_WIDTH,
    MAP_HEIGHT
} from "./config.js";

import {
    ctx,
    player,
    playerSprite
} from "./state.js";

export function updatePlayer(deltaTime) {

    const dx =
        player.targetX - player.x;

    const dy =
        player.targetY - player.y;

    const distance =
        Math.hypot(dx, dy);

    // Not moving
    if (distance < 0.5) {

        player.x =
            player.targetX;

        player.y =
            player.targetY;

        player.frame = 0;
        player.frameTimer = 0;

        return;
    }

    const movement =
        player.speed * deltaTime;

    // Direction
    if (dx > 0) {
        player.directionRow = 1;
    }
    else if (dx < 0) {
        player.directionRow = 0;
    }

    // Animation
    player.frameTimer += deltaTime;

    while (
        player.frameTimer >=
        player.frameSpeed
    ) {

        player.frameTimer -=
            player.frameSpeed;

        player.frame++;

        if (player.frame >= 3) {
            player.frame = 0;
        }
    }

    // Arriving at destination
    if (distance <= movement) {

        player.x =
            player.targetX;

        player.y =
            player.targetY;

        player.frame = 0;
        player.frameTimer = 0;

        return;
    }

    player.x +=
        (dx / distance) * movement;

    player.y +=
        (dy / distance) * movement;
}

export function drawPlayer() {

    if (!playerSprite.complete) {
        return;
    }

    // Target marker
    const moving =
        Math.abs(
            player.x - player.targetX
        ) > 0.5 ||
        Math.abs(
            player.y - player.targetY
        ) > 0.5;

    if (moving) {

        ctx.beginPath();

        ctx.arc(
            player.targetX,
            player.targetY,
            10,
            0,
            Math.PI * 2
        );

        ctx.strokeStyle =
            "rgba(0,255,150,0.45)";

        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();

        ctx.arc(
            player.targetX,
            player.targetY,
            4,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            "rgba(0,255,150,0.8)";

        ctx.fill();
    }

    // Shadow
    ctx.beginPath();

    ctx.ellipse(
        player.x,
        player.y + 70,
        70,
        30,
        0,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "rgba(0,0,0,0.35)";

    ctx.fill();

    // Sprite
    const sourceX =
        player.frame *
        player.spriteWidth;

    const sourceY =
        player.directionRow *
        player.spriteHeight;

    const drawWidth = 360;
    const drawHeight = 480;

    ctx.drawImage(
        playerSprite,

        sourceX,
        sourceY,
        player.spriteWidth,
        player.spriteHeight,

        player.x - drawWidth / 2,
        player.y - drawHeight / 2,

        drawWidth,
        drawHeight
    );
}
