const canvas = document.getElementById("simCanvas");
const ctx = canvas.getContext("2d");

let square1, square2;
let running = false;
let animationId = null;

function drawSquare(obj) {
    ctx.fillStyle = obj.color;
    ctx.fillRect(obj.x, obj.y, obj.size, obj.size);

    ctx.fillStyle = "black";
    ctx.font = "14px Arial";
    ctx.fillText(`${obj.mass} kg`, obj.x, obj.y - 20);
    ctx.fillText(`${obj.vel.toFixed(2)} m/s`, obj.x, obj.y - 5);
}

function detectCollision() {
    return square1.x + square1.size >= square2.x &&
           square1.x <= square2.x + square2.size;
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    square1.x += square1.vel;
    square2.x += square2.vel;

    if (square1.x <= 0) {
        square1.x = 0;
        square1.vel *= -1;
    } else if (square1.x + square1.size >= canvas.width) {
        square1.x = canvas.width - square1.size;
        square1.vel *= -1;
    }

    if (square2.x <= 0) {
        square2.x = 0;
        square2.vel *= -1;
    } else if (square2.x + square2.size >= canvas.width) {
        square2.x = canvas.width - square2.size;
        square2.vel *= -1;
    }

    if (detectCollision()) {
        const u1 = square1.vel;
        const u2 = square2.vel;
        const m1 = square1.mass;
        const m2 = square2.mass;

        const v1Final = (u1 * (m1 - m2) + 2 * m2 * u2) / (m1 + m2);
        const v2Final = (u2 * (m2 - m1) + 2 * m1 * u1) / (m1 + m2);
        square1.vel = v1Final;
        square2.vel = v2Final;

        if (square1.x < square2.x) {
            square1.x = square2.x - square1.size;
        } else {
            square2.x = square1.x - square2.size;
        }
    }

    drawSquare(square1);
    drawSquare(square2);

    if (running) animationId = requestAnimationFrame(update);
}

function startSimulation() {
    if (animationId) cancelAnimationFrame(animationId);
    running = false;

    square1 = {
        x: 100,
        y: 100,
        size: 40,
        color: "red",
        mass: parseFloat(document.getElementById("m1").value),
        vel: parseFloat(document.getElementById("v1").value)
    };
    square2 = {
        x: 600,
        y: 100,
        size: 40,
        color: "blue",
        mass: parseFloat(document.getElementById("m2").value),
        vel: parseFloat(document.getElementById("v2").value)
    };

    running = true;
    update();
}
