var DirectionalObject = (function() {

	function remap(x, s1, e1, s2, e2) {
		return (x - s1) * (e2 - s2) / (e1 - s1) + s2;
	}

	function angleBetween(x1, y1, x2, y2) {
		return Math.atan2(y1 - y2, x1 - x2) * (180 / Math.PI);
	}

	function DirectionalObject(array, position, direction, repeat) {
		if (!(this instanceof DirectionalObject)) return new DirectionalObject(array, repeat);

		if (!(array instanceof Array)) {
			console.log("DirectionalObject must recieve one argument of type Array, but did not recieve one");
			return;
		}

		position = position instanceof Array ? position : [];
		direction = direction instanceof Array ? direction : [];

		var posX = typeof position[0] === "number" ? position[0] : 0;
		var posY = typeof position[1] === "number" ? position[1] : 0;

		var dirX = typeof direction[0] === "number" ? direction[0] : 1;
		var dirY = typeof direction[1] === "number" ? direction[1] : 0;

		this.faces = array;
		this.repeat = !!repeat;
		this.face = array[0];
		this.position = {
			x: posX,
			y: posY
		};
		this.direction = {
			x: dirX,
			y: dirY
		};
	}

	DirectionalObject.prototype.orient = function(x, y) {
		var angle = angleBetween(this.position.x, this.position.y, x, y);

		var myAngle = Math.atan2(this.direction.y, this.direction.x) * (180 / Math.PI);
		var offset = Math.floor(remap(myAngle, -180, 180, 0, this.faces.length));
		this.face = this.faces[Math.floor((remap(angle, -180, 180, 0, this.faces.length)) + offset) % this.faces.length];
		return this;
	};

	return DirectionalObject;
})();