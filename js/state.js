// state.js

import {
    MAP_WIDTH,
    MAP_HEIGHT,
    cameraConfig
} from "./config.js";

export const canvas =
    document.getElementById("gameCanvas");

export const ctx =
    canvas.getContext("2d");

export const playerSprite =
    new Image();

playerSprite.src =
    "./animations/FullSize/spriteSheet.png";

export const projectiles = [];

export const mouse = {
    x: 0,
    y: 0
};

export const camera = {
    x: 0,
    y: 0,

    edgeThreshold:
        cameraConfig.edgeThreshold,

    edgeSpeed:
        cameraConfig.edgeSpeed,

    locked: false,

    followSpeed:
        cameraConfig.followSpeed
};

export const viewport = {
    width: window.innerWidth,
    height: window.innerHeight
};

export let viewWidth =
    window.innerWidth;

export let viewHeight =
    window.innerHeight;

export function setViewSize(width, height) {
    viewWidth = width;
    viewHeight = height;
    viewport.width = width;
    viewport.height = height;
}

export const cooldowns = {
    Q: 0,
    W: 0,
    E: 0,
    R: 0
};

export const player = {
    x: MAP_WIDTH / 2,
    y: MAP_HEIGHT / 2,

    targetX: MAP_WIDTH / 2,
    targetY: MAP_HEIGHT / 2,

    speed: 450,

    radius: 20,

    color: "#00FFCC",

    spriteWidth: 288,
    spriteHeight: 384,

    frame: 0,
    frameTimer: 0,
    frameSpeed: 0.12,

    directionRow: 0
};

// Initialize camera position
camera.x = player.x - viewport.width / 2;
camera.y = player.y - viewport.height / 2;

// Window resize handler
window.addEventListener("resize", () => {
    viewport.width = window.innerWidth;
    viewport.height = window.innerHeight;
    canvas.width = viewport.width;
    canvas.height = viewport.height;
});

// Mouse tracking
window.addEventListener("mousemove", (event) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
});

// Click to move
window.addEventListener("mousedown", (event) => {
    if (event.button !== 0) return;

    const rect = canvas.getBoundingClientRect();
    const screenX = event.clientX - rect.left;
    const screenY = event.clientY - rect.top;

    // Convert screen to world coordinates
    const worldX = screenX + camera.x;
    const worldY = screenY + camera.y;

    // Keep destination inside map
    player.targetX = Math.max(
        player.radius,
        Math.min(worldX, MAP_WIDTH - player.radius)
    );

    player.targetY = Math.max(
        player.radius,
        Math.min(worldY, MAP_HEIGHT - player.radius)
    );
});

// Space camera lock
window.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        event.preventDefault();
        camera.locked = true;
    }
});

window.addEventListener("keyup", (event) => {
    if (event.code === "Space") {
        event.preventDefault();
        camera.locked = false;
    }
});

// Skill keyboard input
window.addEventListener("keydown", (event) => {
    if (event.code === "Space") return;
    if (event.repeat) return;

    const key = event.key.toUpperCase();
    if (cooldowns[key] !== undefined) {
        // Import dynamically to avoid circular dependency
        import("./skills.js").then(({ fireSkill }) => {
            fireSkill(key);
        });
    }
});
