
const Player = require('./player');
class Game {
  constructor() {
    this.sockets = {};
    this.players = {};
    this.bullets = [];
    this.lastUpdateTime = Date.now();
    this.shouldSendUpdate = false;
    setInterval(this.update.bind(this), 1000 / 60);
  }

  addPlayer(socket, data) {
    this.sockets[socket.id] = socket;
    this.players[socket.id] = new Player(socket.id, data.x, data.y);
  }

  removePlayer(socket) {
    delete this.sockets[socket.id];
    delete this.players[socket.id];
  }

  update() {
    console.log("tene wo");
    // Send a game update to each player every other time
    if (this.shouldSendUpdate) {
      console.log("oyo");
      Object.keys(this.sockets).forEach(playerID => {
        const socket = this.sockets[playerID];
        const player = this.players[playerID];
        socket.emit("updatePlayers", this.createUpdate(player));
      });
      this.shouldSendUpdate = false;
    } else {
      this.shouldSendUpdate = true;
    }
  }


  createUpdate(player) {
    const nearbyPlayers = Object.values(this.players).filter(
      p => p !== player
    );

    return {
      t: Date.now(),
      others: nearbyPlayers,
    };
  }
}

module.exports = Game;