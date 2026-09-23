// state.js

import { CONFIG } from "./config.js";
import { Camera } from "./camera.js";
import { HUD } from "./hud.js";
import { Input } from "./input.js";
import { Player } from "./player.js";
import { Projectile } from "./projectile.js";
import { Renderer } from "./renderer.js";
import { Skills } from "./skills.js";
import { World } from "./world.js";


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

export let viewWidth =
    window.innerWidth;

export let viewHeight =
    window.innerHeight;

export function setViewSize(width, height) {
    viewWidth = width;
    viewHeight = height;
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
