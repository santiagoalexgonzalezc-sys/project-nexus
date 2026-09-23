export const MAP_WIDTH = 5000;
export const MAP_HEIGHT = 5000;

export const PLAYER_SPRITE_SRC =
    "./animations/FullSize/spriteSheet.png";

export const skills = {
    Q: {
        label: "Q",
        cd: 2000,
        color: "#FF3333",
        name: "Fast Fire",
        speed: 1000,
        radius: 12,
        count: 1
    },

    W: {
        label: "W",
        cd: 6000,
        color: "#E2B659",
        name: "Heavy Shot",
        speed: 500,
        radius: 35,
        count: 1
    },

    E: {
        label: "E",
        cd: 8000,
        color: "#33FF33",
        name: "Triple Fan",
        speed: 700,
        radius: 15,
        count: 3
    },

    R: {
        label: "R",
        cd: 15000,
        color: "#BF33FF",
        name: "Nova Burst",
        speed: 400,
        radius: 18,
        count: 16
    }
};

export const cameraConfig = {
    edgeThreshold: 35,
    edgeSpeed: 900,
    followSpeed: 12
};

