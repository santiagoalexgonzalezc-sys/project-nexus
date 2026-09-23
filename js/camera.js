import {
    MAP_WIDTH,
    MAP_HEIGHT
} from "./config.js";

import {
    camera,
    player,
    mouse,
    viewWidth,
    viewHeight
} from "./state.js";

export function screenToWorld(
    screenX,
    screenY
) {
    return {
        x: screenX + camera.x,
        y: screenY + camera.y
    };
}

export function clampCamera() {

    if (viewWidth < MAP_WIDTH) {

        const maxX =
            MAP_WIDTH - viewWidth;

        camera.x = Math.max(
            0,
            Math.min(
                camera.x,
                maxX
            )
        );
    }
    else {

        camera.x =
            (MAP_WIDTH - viewWidth) / 2;
    }

    if (viewHeight < MAP_HEIGHT) {

        const maxY =
            MAP_HEIGHT - viewHeight;

        camera.y = Math.max(
            0,
            Math.min(
                camera.y,
                maxY
            )
        );
    }
    else {

        camera.y =
            (MAP_HEIGHT - viewHeight) / 2;
    }
}

export function getCameraTarget() {

    let targetX =
        player.x -
        viewWidth / 2;

    let targetY =
        player.y -
        viewHeight / 2;

    if (viewWidth >= MAP_WIDTH) {

        targetX =
            (MAP_WIDTH - viewWidth) / 2;
    }

    if (viewHeight >= MAP_HEIGHT) {

        targetY =
            (MAP_HEIGHT - viewHeight) / 2;
    }

    return {
        x: targetX,
        y: targetY
    };
}

export function updateCamera(deltaTime) {

    if (camera.locked) {

        const target =
            getCameraTarget();

        const smooth =
            1 -
            Math.exp(
                -camera.followSpeed *
                deltaTime
            );

        camera.x +=
            (target.x - camera.x) *
            smooth;

        camera.y +=
            (target.y - camera.y) *
            smooth;

        clampCamera();

        return;
    }

    let moveX = 0;
    let moveY = 0;

    if (
        mouse.x <=
        camera.edgeThreshold
    ) {
        moveX = -1;
    }

    if (
        mouse.x >=
        viewWidth -
        camera.edgeThreshold
    ) {
        moveX = 1;
    }

    if (
        mouse.y <=
        camera.edgeThreshold
    ) {
        moveY = -1;
    }

    if (
        mouse.y >=
        viewHeight -
        camera.edgeThreshold
    ) {
        moveY = 1;
    }

    const length =
        Math.hypot(
            moveX,
            moveY
        );

    if (length > 0) {

        moveX /= length;
        moveY /= length;

        camera.x +=
            moveX *
            camera.edgeSpeed *
            deltaTime;

        camera.y +=
            moveY *
            camera.edgeSpeed *
            deltaTime;
    }

    clampCamera();
}
