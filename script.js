const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const playerSprite = new Image();

playerSprite.src = "./animations/FullSize/spriteSheet.png";

playerSprite.onload = () => {
    alert(
        "Sprite size: " +
        playerSprite.naturalWidth +
        " x " +
        playerSprite.naturalHeight
    );
};



// ============================================================
// WORLD
// ============================================================

const MAP_WIDTH = 5000;
const MAP_HEIGHT = 5000;

// ============================================================
// PROJECTILES
// ============================================================

const projectiles = [];

// ============================================================
// MOUSE
// ============================================================

// Mouse is always SCREEN coordinates.
const mouse = {
    x: 0,
    y: 0
};

// ============================================================
// CAMERA
// ============================================================

const camera = {
    x: 0,
    y: 0,

    // Edge scrolling
    edgeThreshold: 35,
    edgeSpeed: 900,

    // Space camera lock
    locked: false,

    // Camera follow smoothness
    followSpeed: 12
};

// ============================================================
// CANVAS SIZE
// ============================================================

let viewWidth = window.innerWidth;
let viewHeight = window.innerHeight;

// ============================================================
// COOLDOWNS
// ============================================================

const cooldowns = {
    Q: 0,
    W: 0,
    E: 0,
    R: 0
};

// ============================================================
// SKILLS
// ============================================================

const skills = {
    Q: {
        label: "Q",
        cd: 3000,
        color: "#FF3333",
        name: "Fast Fire",
        speed: 900,
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

// ============================================================
// PLAYER
// ============================================================

const player = {

    // WORLD coordinates
    x: MAP_WIDTH / 2,
    y: MAP_HEIGHT / 2,

    targetX: MAP_WIDTH / 2,
    targetY: MAP_HEIGHT / 2,

    speed: 450,

    radius: 20,

    color: "#00FFCC",

    // ========================================================
    // SPRITE
    // ========================================================

    spriteWidth: 288,
    spriteHeight: 384,

    // Current animation frame
    frame: 0,

    // Animation timer
    frameTimer: 0,

    // Seconds between frames
    frameSpeed: 0.12,

    // 0 = top row
    // 1 = bottom row
    directionRow: 0
};


// ============================================================
// CANVAS RESIZE
// ============================================================

function resizeCanvas() {

    viewWidth = window.innerWidth;
    viewHeight = window.innerHeight;

    canvas.width = viewWidth;
    canvas.height = viewHeight;

    clampCamera();
}

window.addEventListener(
    "resize",
    resizeCanvas
);

resizeCanvas();

// ============================================================
// CAMERA INITIAL POSITION
// ============================================================

camera.x =
    player.x -
    viewWidth / 2;

camera.y =
    player.y -
    viewHeight / 2;

clampCamera();

// ============================================================
// SCREEN -> WORLD
// ============================================================

// THIS IS THE ONLY CONVERSION WE NEED.
//
// The canvas will later translate the entire world by
// -camera.x / -camera.y.
//
// Therefore a mouse click at screen X/Y corresponds to:
//
// worldX = screenX + camera.x
// worldY = screenY + camera.y

function screenToWorld(screenX, screenY) {

    return {
        x: screenX + camera.x,
        y: screenY + camera.y
    };
}

// ============================================================
// CAMERA BOUNDS
// ============================================================

function clampCamera() {

    // If viewport is smaller than map,
    // normal camera boundaries apply.

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

        // Map is smaller than screen.
        // Keep map centered.
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

// ============================================================
// MOUSE TRACKING
// ============================================================

window.addEventListener(
    "mousemove",
    (event) => {

        const rect =
            canvas.getBoundingClientRect();

        mouse.x =
            event.clientX - rect.left;

        mouse.y =
            event.clientY - rect.top;
    }
);

// ============================================================
// CLICK TO MOVE
// ============================================================

window.addEventListener(
    "mousedown",
    (event) => {

        if (event.button !== 0) {
            return;
        }

        const rect =
            canvas.getBoundingClientRect();

        // Exact screen position of click
        const screenX =
            event.clientX - rect.left;

        const screenY =
            event.clientY - rect.top;

        // Convert ONCE from screen to world.
        const world =
            screenToWorld(
                screenX,
                screenY
            );

        // Keep destination inside map.
        player.targetX = Math.max(
            player.radius,
            Math.min(
                world.x,
                MAP_WIDTH - player.radius
            )
        );

        player.targetY = Math.max(
            player.radius,
            Math.min(
                world.y,
                MAP_HEIGHT - player.radius
            )
        );
    }
);

// ============================================================
// PLAYER MOVEMENT
// ============================================================

function updatePlayer(deltaTime) {

    const dx =
        player.targetX - player.x;

    const dy =
        player.targetY - player.y;

    const distance =
        Math.hypot(dx, dy);

    // ========================================================
    // NOT MOVING
    // ========================================================

    if (distance < 0.5) {

        player.x =
            player.targetX;

        player.y =
            player.targetY;

        // Reset animation to first frame
        player.frame = 0;
        player.frameTimer = 0;

        return;
    }

    // ========================================================
    // MOVING
    // ========================================================

    const movement =
        player.speed * deltaTime;

    // Determine horizontal direction.
    //
    // If your top row is RIGHT
    // and bottom row is LEFT,
    // this will select the appropriate row.

    if (dx > 0) {

        // Moving RIGHT
        player.directionRow = 1;

    } else if (dx < 0) {

        // Moving LEFT
        player.directionRow = 0;
    }

    // ========================================================
    // ANIMATION
    // ========================================================

    player.frameTimer += deltaTime;

    while (
        player.frameTimer >=
        player.frameSpeed
    ) {
    
        player.frameTimer -=
            player.frameSpeed;
    
        player.frame++;
    
        // We have 3 frames per row.
        if (player.frame >= 3) {
            player.frame = 0;
        }
    }


    // ========================================================
    // MOVEMENT
    // ========================================================

    if (distance <= movement) {

        player.x = player.targetX;
        player.y = player.targetY;
    
        player.frame = 0;
        player.frameTimer = 0;
    
        return;
    }


    player.x +=
        (dx / distance) *
        movement;

    player.y +=
        (dy / distance) *
        movement;
}


// ============================================================
// CAMERA FOLLOW TARGET
// ============================================================

function getCameraTarget() {

    let targetX =
        player.x -
        viewWidth / 2;

    let targetY =
        player.y -
        viewHeight / 2;

    // If screen is larger than map,
    // keep the map centered.

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

// ============================================================
// CAMERA UPDATE
// ============================================================

function updateCamera(deltaTime) {

    // ========================================================
    // SPACE = CENTER CAMERA ON PLAYER
    // ========================================================

    if (camera.locked) {

        const target =
            getCameraTarget();

        // Smooth frame-rate independent interpolation.
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

    // ========================================================
    // NORMAL EDGE SCROLL
    // ========================================================

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

    // Normalize diagonal movement.
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

// ============================================================
// SPACE CAMERA LOCK
// ============================================================

window.addEventListener(
    "keydown",
    (event) => {

        if (
            event.code !== "Space"
        ) {
            return;
        }

        event.preventDefault();

        camera.locked = true;
    }
);

window.addEventListener(
    "keyup",
    (event) => {

        if (
            event.code !== "Space"
        ) {
            return;
        }

        event.preventDefault();

        camera.locked = false;
    }
);

// ============================================================
// PROJECTILE
// ============================================================

class Projectile {

    constructor(
        x,
        y,
        radius,
        color,
        velocity
    ) {

        // WORLD coordinates
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

        // IMPORTANT:
        // Do NOT convert to screen coordinates here.
        //
        // The camera transformation already handles it.

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

// ============================================================
// FIRE SKILL
// ============================================================

function fireSkill(key) {

    const now =
        performance.now();

    if (
        now < cooldowns[key]
    ) {
        return;
    }

    const skill =
        skills[key];

    // Mouse is SCREEN coordinates.
    // Convert to WORLD exactly once.

    const mouseWorld =
        screenToWorld(
            mouse.x,
            mouse.y
        );

    const angle =
        Math.atan2(
            mouseWorld.y - player.y,
            mouseWorld.x - player.x
        );

    // ========================================================
    // Q / W
    // ========================================================

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

    // ========================================================
    // E
    // ========================================================

    else if (
        key === "E"
    ) {

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

    // ========================================================
    // R
    // ========================================================

    else if (
        key === "R"
    ) {

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

// ============================================================
// ABILITY KEYBOARD
// ============================================================

window.addEventListener(
    "keydown",
    (event) => {

        if (
            event.code === "Space"
        ) {
            return;
        }

        // Don't repeatedly fire while
        // holding a key.
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

// ============================================================
// MAP
// ============================================================

function drawMap() {

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

// ============================================================
// PLAYER
// ============================================================

function drawPlayer() {

    if (!playerSprite.complete) {
        return;
    }

    // ========================================================
    // TARGET MARKER
    // ========================================================

    const moving =
        Math.abs(
            player.x -
            player.targetX
        ) > 0.5 ||
        Math.abs(
            player.y -
            player.targetY
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

    // ========================================================
    // PLAYER SHADOW
    // ========================================================

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

    // ========================================================
    // SPRITE
    // ========================================================

    const sourceX =
        player.frame *
        player.spriteWidth;

    const sourceY =
        player.directionRow *
        player.spriteHeight;

    // Draw sprite centered on player's WORLD position.
    const drawWidth = 360;
    const drawHeight = 480;

        
    ctx.drawImage(
        
        playerSprite,
        
        sourceX,
        sourceY,
        player.spriteWidth,
        player.spriteHeight,
        
        player.x -
            drawWidth / 2,
        
        player.y -
            drawHeight / 2,
        
        drawWidth,
        drawHeight
    );

}


// ============================================================
// HUD
// ============================================================

function drawHUD() {

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
        viewWidth / 2 -
        totalWidth / 2;

    const y =
        viewHeight -
        size -
        25;

    const now =
        performance.now();

    keys.forEach(
        key => {

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

            // Ability background
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

            // Cooldown overlay
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

            // Border
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

            // Key label background
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
        }
    );

    // ========================================================
    // CAMERA LOCK INDICATOR
    // ========================================================

    if (camera.locked) {

        ctx.fillStyle =
            "rgba(0,0,0,0.65)";

        ctx.fillRect(
            20,
            viewHeight - 60,
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
            viewHeight - 44
        );
    }
}

// ============================================================
// OPTIONAL DEBUG
// ============================================================

function drawDebug() {

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

    ctx.fillText(
        `Player: ${Math.round(player.x)}, ${Math.round(player.y)}`,
        20,
        40
    );

    ctx.fillText(
        `Target: ${Math.round(player.targetX)}, ${Math.round(player.targetY)}`,
        20,
        60
    );
}

// ============================================================
// GAME LOOP
// ============================================================

let lastTime =
    performance.now();

function animate(currentTime) {

    requestAnimationFrame(
        animate
    );

    // Delta time in seconds.
    let deltaTime =
        (
            currentTime -
            lastTime
        ) / 1000;

    lastTime =
        currentTime;

    // Prevent huge jumps after
    // returning to the browser tab.
    deltaTime =
        Math.min(
            deltaTime,
            0.05
        );

    // ========================================================
    // UPDATE
    // ========================================================

    updatePlayer(
        deltaTime
    );

    updateCamera(
        deltaTime
    );

    // ========================================================
    // CLEAR SCREEN
    // ========================================================

    ctx.clearRect(
        0,
        0,
        viewWidth,
        viewHeight
    );

    // ========================================================
    // WORLD RENDERING
    // ========================================================

    ctx.save();

    // THIS is the camera.
    //
    // Everything below is WORLD coordinates.
    // We do NOT convert objects to screen coordinates.

    ctx.translate(
        -camera.x,
        -camera.y
    );

    drawMap();

    // Projectiles
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

        // Remove outside map
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

    drawPlayer();

    ctx.restore();

    // ========================================================
    // SCREEN SPACE
    // ========================================================

    // HUD is NOT affected by camera.
    drawHUD();

    // Uncomment this if you want coordinates.
    // drawDebug();
}

// ============================================================
// START GAME
// ============================================================

// ============================================================
// START GAME
// ============================================================

requestAnimationFrame(animate);