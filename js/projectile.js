import {
    MAP_WIDTH,
    MAP_HEIGHT
} from "./config.js";

import {
    ctx,
    projectiles
} from "./state.js";

export class Projectile {

    constructor(
        x,
        y,
        radius,
        color,
        velocity
    ) {
        this.x = x;
        this.y = y;

        this.radius = radius;
        this.color = color;

        this.velocity = velocity;
    }

    update(deltaTime) {

        this.x +=
            this.velocity.x *
            deltaTime;

        this.y +=
            this.velocity.y *
            deltaTime;
    }

    draw() {

        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            this.radius,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            this.color;

        ctx.fill();
    }
}

export function updateProjectiles(deltaTime) {

    for (
        let i = projectiles.length - 1;
        i >= 0;
        i--
    ) {

        const projectile =
            projectiles[i];

        projectile.update(
            deltaTime
        );

        if (
            projectile.x +
                projectile.radius < 0 ||
            projectile.x -
                projectile.radius >
                MAP_WIDTH ||
            projectile.y +
                projectile.radius < 0 ||
            projectile.y -
                projectile.radius >
                MAP_HEIGHT
        ) {

            projectiles.splice(
                i,
                1
            );

            continue;
        }

        projectile.draw();
    }
}

