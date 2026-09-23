
import {
    skills
} from "./config.js";

import {
    cooldowns,
    player,
    projectiles,
    mouse,
    camera
} from "./state.js";

import {
    Projectile
} from "./projectile.js";

export function fireSkill(key) {

    const now =
        performance.now();

    if (
        now < cooldowns[key]
    ) {
        return;
    }

    const skill =
        skills[key];

    const mouseWorld = {
        x: mouse.x + camera.x,
        y: mouse.y + camera.y
    };

    const angle =
        Math.atan2(
            mouseWorld.y - player.y,
            mouseWorld.x - player.x
        );

    // Q / W
    if (
        key === "Q" ||
        key === "W"
    ) {

        const velocity = {
            x:
                Math.cos(angle) *
                skill.speed,

            y:
                Math.sin(angle) *
                skill.speed
        };

        projectiles.push(
            new Projectile(
                player.x,
                player.y,
                skill.radius,
                skill.color,
                velocity
            )
        );
    }

    // E
    else if (key === "E") {

        const angles = [
            angle - 0.2,
            angle,
            angle + 0.2
        ];

        angles.forEach(
            projectileAngle => {

                const velocity = {
                    x:
                        Math.cos(
                            projectileAngle
                        ) *
                        skill.speed,

                    y:
                        Math.sin(
                            projectileAngle
                        ) *
                        skill.speed
                };

                projectiles.push(
                    new Projectile(
                        player.x,
                        player.y,
                        skill.radius,
                        skill.color,
                        velocity
                    )
                );
            }
        );
    }

    // R
    else if (key === "R") {

        for (
            let i = 0;
            i < skill.count;
            i++
        ) {

            const projectileAngle =
                (
                    Math.PI * 2 /
                    skill.count
                ) * i;

            const velocity = {
                x:
                    Math.cos(
                        projectileAngle
                    ) *
                    skill.speed,

                y:
                    Math.sin(
                        projectileAngle
                    ) *
                    skill.speed
            };

            projectiles.push(
                new Projectile(
                    player.x,
                    player.y,
                    skill.radius,
                    skill.color,
                    velocity
                )
            );
        }
    }

    cooldowns[key] =
        now + skill.cd;
}
