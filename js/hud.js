import {
    skills
} from "./config.js";

import {
    ctx,
    camera,
    cooldowns,
    viewport
} from "./state.js";

export function drawHUD() {

    const size = 50;
    const gap = 4;

    const keys = [
        "Q",
        "W",
        "E",
        "R"
    ];

    const totalWidth =
        size * keys.length +
        gap * (keys.length - 1);

    let startX =
        viewport.width / 2 -
        totalWidth / 2;

    const y =
        viewport.height -
        size -
        25;

    const now =
        performance.now();

    keys.forEach(key => {

        const skill =
            skills[key];

        const coolingDown =
            now < cooldowns[key];

        const timeLeft =
            coolingDown
                ? (
                    (
                        cooldowns[key] -
                        now
                    ) / 1000
                ).toFixed(1)
                : "";

        ctx.fillStyle =
            skill.color;

        ctx.globalAlpha =
            0.65;

        ctx.fillRect(
            startX,
            y,
            size,
            size
        );

        ctx.globalAlpha = 1;

        if (coolingDown) {

            ctx.fillStyle =
                "rgba(0,0,0,0.60)";

            ctx.fillRect(
                startX,
                y,
                size,
                size
            );

            ctx.fillStyle =
                "#FFFFFF";

            ctx.font =
                "bold 18px sans-serif";

            ctx.textAlign =
                "center";

            ctx.textBaseline =
                "middle";

            ctx.fillText(
                timeLeft,
                startX + size / 2,
                y + size / 2
            );
        }

        ctx.strokeStyle =
            coolingDown
                ? "#555555"
                : "#C8AA6E";

        ctx.lineWidth = 3;

        ctx.strokeRect(
            startX,
            y,
            size,
            size
        );

        // Key background
        ctx.fillStyle =
            "rgba(0,0,0,0.75)";

        ctx.fillRect(
            startX + 2,
            y + 2,
            17,
            17
        );

        // Key label
        ctx.fillStyle =
            "#C8AA6E";

        ctx.font =
            "bold 12px sans-serif";

        ctx.textAlign =
            "left";

        ctx.textBaseline =
            "top";

        ctx.fillText(
            key,
            startX + 5,
            y + 4
        );

        startX +=
            size + gap;
    });

    // Camera lock indicator
    if (camera.locked) {

        ctx.fillStyle =
            "rgba(0,0,0,0.65)";

        ctx.fillRect(
            20,
            viewport.height - 60,
            165,
            32
        );

        ctx.fillStyle =
            "#00FFCC";

        ctx.font =
            "bold 13px sans-serif";

        ctx.textAlign =
            "left";

        ctx.textBaseline =
            "middle";

        ctx.fillText(
            "● CAMERA LOCKED",
            30,
            viewport.height - 44
        );
    }
}

export function drawDebug() {

    ctx.fillStyle = "white";

    ctx.font =
        "14px monospace";

    ctx.textAlign =
        "left";

    ctx.textBaseline =
        "top";

    ctx.fillText(
        `Camera: ${Math.round(camera.x)}, ${Math.round(camera.y)}`,
        20,
        20
    );
}

