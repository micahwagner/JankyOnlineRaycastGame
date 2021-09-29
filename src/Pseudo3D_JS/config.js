var blueStone = new Pseudo3D.Color([20, 20, 150]);
var bluestone = new Pseudo3D.Texture("./src/Pseudo3D_JS/pics/bluestone.png", blueStone);
var colorstone = new Pseudo3D.Texture("./src/Pseudo3D_JS/pics/colorstone.png", [100, 100, 100]);
var eagle = new Pseudo3D.Texture("./src/Pseudo3D_JS/pics/eagle.png", [168, 0, 0], 64, 64);
var sky = new Pseudo3D.Texture("./src/Pseudo3D_JS/pics/skybox2.png", [109, 210, 255], 512, 480);
var barrel = new Pseudo3D.Texture("./src/Pseudo3D_JS/pics/barrel.png", [65, 26, 6]);
var wood = new Pseudo3D.Texture("./src/Pseudo3D_JS/pics/wood.png", [110, 74, 29]);
var Dora = new Pseudo3D.Texture("./src/Pseudo3D_JS/pics/Dora.png", [])
var Boonga = new Pseudo3D.Texture("./src/Pseudo3D_JS/pics/Boonga.png")
var Minotaur = new Pseudo3D.Texture("./src/Pseudo3D_JS/pics/Minotaur.png", [], 128, 128);
var Gnome = new Pseudo3D.Texture("./src/Pseudo3D_JS/pics/Gnome.png", [], 121, 213);
var CatacombWall = new Pseudo3D.Texture("./src/Pseudo3D_JS/pics/CatacombWallDirt.png",[],64,64);

var config = {
	floor: {
		texture: bluestone
	},
	skybox: {
		texture: sky,
		repeatAfterAngle: 180,
	},
	lighting: {
		sideLight: 0.6,
		cameraLight: {
			intensity: 0.5,
			maxBrightness: 1.6,
			ambient: 0.05,
			colorBias: [1.3, 1.075, 0]
		}
	}
};

config.worldMap = [
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
	[1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1],
	[1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1],
	[1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1],
	[1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 1, 0, 0, 0, 1, 1, 7, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
	[1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
	[1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
	[1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 3, 3, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 3, 3, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
	[1, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1],
	[1, 0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
	[1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1],
	[1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

config.cellPrefabs = {
	1: {
		texture: colorstone
	},
	3: {
		texture: eagle
	},
	7: {
		texture: wood
	}
};

config.gameObjects = {
	list: [
		new Pseudo3D.Sprite(barrel, [10.5, 12]),
	],
	resolution: [64, 64]
};