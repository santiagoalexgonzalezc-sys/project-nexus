import {
    MAP_WIDTH,
    MAP_HEIGHT
} from "./config.js";

import {
    canvas,
    mouse,
    camera,
    player,
    cooldowns
} from "./state.js";

import {
    screenToWorld
} from "./camera.js";

import {
    fireSkill
} from "./skills.js";

export function setupInput() {

    // ========================================================
    // FULLSCREEN
    // ========================================================

    canvas.addEventListener(
        "click",
        async () => {

            try {
                await canvas.requestFullscreen();
            }
            catch (err) {
                console.error(
                    "Error entering fullscreen:",
                    err
                );
            }
        }
    );

    // ========================================================
    // MOUSE
    // ========================================================

    window.addEventListener(
        "mousemove",
        event => {

            const rect =
                canvas.getBoundingClientRect();

            mouse.x =
                event.clientX - rect.left;

            mouse.y =
                event.clientY - rect.top;
        }
    );

    // ========================================================
    // CLICK TO MOVE
    // ========================================================

    window.addEventListener(
        "mousedown",
        event => {

            if (event.button !== 0) {
                return;
            }

            const rect =
                canvas.getBoundingClientRect();

            const screenX =
                event.clientX - rect.left;

            const screenY =
                event.clientY - rect.top;

            const world =
                screenToWorld(
                    screenX,
                    screenY
                );

            player.targetX =
                Math.max(
                    player.radius,
                    Math.min(
                        world.x,
                        MAP_WIDTH -
                        player.radius
                    )
                );

            player.targetY =
                Math.max(
                    player.radius,
                    Math.min(
                        world.y,
                        MAP_HEIGHT -
                        player.radius
                    )
                );
        }
    );

    // ========================================================
    // KEYBOARD
    // ========================================================

    window.addEventListener(
        "keydown",
        event => {

            // Space
            if (
                event.code === "Space"
            ) {

                event.preventDefault();

                camera.locked = true;

                return;
            }

            // Don't repeatedly fire
            if (event.repeat) {
                return;
            }

            const key =
                event.key.toUpperCase();

            if (
                cooldowns[key] !== undefined
            ) {

                fireSkill(key);
            }
        }
    );

    window.addEventListener(
        "keyup",
        event => {

            if (
                event.code !== "Space"
            ) {
                return;
            }

            event.preventDefault();

            camera.locked = false;
        }
    );
}
