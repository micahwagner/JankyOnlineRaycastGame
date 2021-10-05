class Enemy {
	constructor(id, x, y, hp) {
		this.id = id;
		this.x = x;
		this.y = y;
		this.hp = hp;
		this.isEnemy = true;
	}
}

module.exports = Enemy;