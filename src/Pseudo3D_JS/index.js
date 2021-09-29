var playerMap = [];

// Pseudo3D declarations
var scene = new Pseudo3D.Scene(config);
var moveSpeed = 2.5;

var renderer = new Pseudo3D.Renderer(900, 600, 0.444);
document.body.appendChild(renderer.canvas);
renderer.canvas.style.border = "8px solid rgb(210, 210, 210)";

var camera = new Pseudo3D.Camera({
	type: Pseudo3D.RenderTypes.RAY,
	nearClippingPlane: 0,
	planeLength: 0.75,
	x: 10.5,
	y: 12,
	spriteSettings: {
		partialAlpha: false
	}
});

renderer.canvas.requestPointerLock = renderer.canvas.requestPointerLock ||
	renderer.canvas.mozRequestPointerLock;

renderer.canvas.onclick = function() {
	renderer.canvas.requestPointerLock();
}

// update loop variable declarations
var stop = false;
var fps = 60, // can only be a factor of 60 when below 30, and when above 30 can only be 60 - fps factor of 60 to work. 
	frameCount = 0,
	skipFrames,
	frameRate = 60,
	fc = 0,
	f = 0;
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

function becomeEnemy() {
	Client.becomeEnemy();
}

// main update loop
function animate() {
	var pos = [camera.position.x, camera.position.y];
	if (stop) {
		return;
	}

	requestAnimationFrame(animate);

	if ((fps >= 30 && frameCount % skipFrames !== 0) || (fps < 30 && frameCount % skipFrames === 0)) {
		if (keysDown["a"]) {
			moveCamera(camera.plane.clone().scale(-1), moveSpeed);
		}
		if (keysDown["d"]) {
			moveCamera(camera.plane, moveSpeed);
		}
		if (keysDown["w"]) {
			moveCamera(camera.direction, moveSpeed);
		}
		if (keysDown["s"]) {
			moveCamera(camera.direction.clone().scale(-1), moveSpeed);
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
		fc++;

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

function moveCamera(nextPos, moveSpeed) {
	var incrementX = nextPos.x * (moveSpeed / fps + 0.2);
	var incrementY = nextPos.y * (moveSpeed / fps + 0.2);

	var worldX = Math.floor(camera.position.x);
	var worldY = Math.floor(camera.position.y);

	var checkX = Math.floor(camera.position.x + incrementX);
	var checkY = Math.floor(camera.position.y + incrementY);

	if (scene.worldMap[checkX] !== undefined && scene.worldMap[checkX][worldY] !== undefined && scene.worldMap[checkX][worldY] === 0)
		camera.position.x += nextPos.x * (moveSpeed / fps);
	if (scene.worldMap[worldX] !== undefined && scene.worldMap[worldX][checkY] !== undefined && scene.worldMap[worldX][checkY] === 0)
		camera.position.y += nextPos.y * (moveSpeed / fps);
}


//doesn't work rn
function addEnemy(id) {
	for (var prop in playerMap) {
		var enemyIDNum = id.indexOf(prop);
		// If property doesn't exist in array...
		if (id.indexOf(prop) > -1) {
			console.log(id[id.indexOf(prop)]);
			playerMap[id[enemyIDNum]].setTexture(Minotaur);
			playerMap[id[enemyIDNum]].size = 1;
			playerMap[id[enemyIDNum]].position.z = (playerMap[id[enemyIDNum]].height / scene.gameObjects.resolution[1]) / 4;
		}
	}
}

function addNewPlayer(id, x, y) {
	var player = new Pseudo3D.Sprite(Gnome, [x, y]);
	player.partialAlpha = false;
	playerMap[id] = player;
	playerMap[id].size = 0.2;
	playerMap[id].position.z = -0.15;
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

setInterval(() => {
	frameRate = fc - f;
	f = fc
}, 1000);

var mouseX = 0;
var mouseY = 0;
window.addEventListener("mousemove", (e) => {
	mouseX += e.movementX;
	mouseY += e.movementY;
	var angle = Pseudo3D.Math.remap(mouseX, 0, 900, 75, -75);
	camera.setRotation(angle);
	camera.pitch = renderer.renderHeight - mouseY;
});