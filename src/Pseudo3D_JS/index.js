var playerMap = {};

// Pseudo3D declarations
var scene = new Pseudo3D.Scene(config);

var renderer = new Pseudo3D.Renderer(900, 600, 0.666);
document.body.appendChild(renderer.canvas);
renderer.canvas.style.border = "8px solid rgb(210, 210, 210)";

var camera = new Pseudo3D.Camera({
	type: Pseudo3D.RenderTypes.RAY,
	nearClippingPlane: 0,
	planeLength: 0.75,
	x: Math.random() * 24,
	y: Math.random() * 24,
});

// update loop variable declarations
var stop = false;
var fps = 60, // can only be a factor of 60 when below 30, and when above 30 can only be 60 - fps factor of 60 to work. 
	frameCount = 0,
	skipFrames,
	frameRate = 0;
// list of valid values for fps are: 1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 40, 45, 48, 50, 54, 55, 56, 57, 58, 59, 60

if (fps > 30) {
	skipFrames = 60 / (60 - fps);
} else if (fps <= 30) {
	skipFrames = 60 / fps;
}

var q = 0;

function start() {
	Client.sendMe(camera.position.x, camera.position.y);
}

start();

// main update loop
function animate() {
	var pos = [camera.position.x, camera.position.y];
	if (stop) {
		return;
	}

	requestAnimationFrame(animate);

	if ((fps >= 30 && frameCount % skipFrames !== 0) || (fps < 30 && frameCount % skipFrames === 0)) {
		if (keysDown["a"]) {
			camera.rotate(270 / fps);
		}
		if (keysDown["d"]) {
			camera.rotate(-270 / fps);
		}
		if (keysDown["w"]) {
			var incrementX = camera.direction.x * (4 / fps + 0.2);
			var incrementY = camera.direction.y * (4 / fps + 0.2);

			var worldX = Math.floor(camera.position.x);
			var worldY = Math.floor(camera.position.y);

			var checkX = Math.floor(camera.position.x + incrementX);
			var checkY = Math.floor(camera.position.y + incrementY);

			if (scene.worldMap[checkX] !== undefined && scene.worldMap[checkX][worldY] !== undefined && scene.worldMap[checkX][worldY] === 0)
				camera.position.x += camera.direction.x * (4 / fps);
			if (scene.worldMap[worldX] !== undefined && scene.worldMap[worldX][checkY] !== undefined && scene.worldMap[worldX][checkY] === 0)
				camera.position.y += camera.direction.y * (4 / fps);
		}
		if (keysDown["s"]) {
			var incrementX = camera.direction.x * (4 / fps + 0.2);
			var incrementY = camera.direction.y * (4 / fps + 0.2);

			var worldX = Math.floor(camera.position.x);
			var worldY = Math.floor(camera.position.y);

			var checkX = Math.floor(camera.position.x - incrementX);
			var checkY = Math.floor(camera.position.y - incrementY);

			if (scene.worldMap[checkX] !== undefined && scene.worldMap[checkX][worldY] !== undefined && scene.worldMap[checkX][worldY] === 0)
				camera.position.x -= camera.direction.x * (4 / fps);
			if (scene.worldMap[worldX] !== undefined && scene.worldMap[worldX][checkY] !== undefined && scene.worldMap[worldX][checkY] === 0)
				camera.position.y -= camera.direction.y * (4 / fps);
		}

		if (keysDown["h"]) {
			q += 0.01;
			q = Pseudo3D.Math.constrain(q, 0, 1);
			renderer.resize(900, 600, q)
		}
		if (keysDown["l"]) {
			q -= 0.01;
			q = Pseudo3D.Math.constrain(q, 0, 1);
			renderer.resize(900, 600, q)
		}
		renderer.drawingContext.fillRect(0, 0, 900, 600);
		renderer.render(scene, camera);


		if (pos[0] !== camera.position.x || pos[1] !== camera.position.y) {
			Client.sendPos(camera.position.x, camera.position.y)
		}
	}
	frameCount++;
}
// key press code
var keysDown = {};
window.addEventListener("keydown", (e) => {
	keysDown[e.key] = "a";
});

window.addEventListener("keyup", (e) => {
	delete keysDown[e.key];
});

animate();

function addNewPlayer(id, x, y) {
	var player = new Pseudo3D.Sprite(Boonga, [x, y]);
	player.partialAlpha = false;
	playerMap[id] = player;
	scene.add(player)
}

function removePlayer(id) {
	var player = playerMap[id];
	delete playerMap[id];
	scene.remove(player);
}

function moveOtherPlayer(id, x, y) {
	if (id === window.myID) {
		return;
	}
	playerMap[id].position.x = x;
	playerMap[id].position.y = y;
}