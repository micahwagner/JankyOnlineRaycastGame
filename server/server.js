var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
const Game = require('./Game');
const Player = require('./player');
const Enemy = require('./enemy');

app.use('/css',express.static(process.cwd() + '/css'));
app.use('/src',express.static(process.cwd() + '/src'));
app.get('/',function(req,res){
    res.sendFile(process.cwd()+'/index.html');
});


var serverPlayerMap = [];
var serverEnemyMap = [];

server.listen(process.env.PORT || 8081, "10.0.0.17", function(){
    console.log('Listening on '+server.address().port);
});

io.on('connection',function(socket){

    // console.log(socket.id);
    //create entity class

    // socket.on("newplayer", playerJoined);
    // socket.on("entityMoved", entityMoved)
    // socket.on("disconnect", playerLeft);

    socket.on('newPlayer',function(data){
        socket.player = {
            id: socket.id,
            x: data.x,
            y: data.y,
            d: data.d,
            isEnemy: false
        };

        //update server player map, emit current ID, emit other players
        serverPlayerMap.push(new Player(socket.player.id, socket.player.x, socket.player.y, 10));
        socket.emit('myID', socket.player.id);
        socket.emit('allplayers',getAllPlayers());
        socket.broadcast.emit('newPlayer',socket.player);

        //broadcast any enemy's that are already in the game
        var enemyIDs = getAllPlayerEnemyID();
        if (serverEnemyMap.length >= 1) {
            socket.emit('loadPlayerEnemys', enemyIDs);
        }

        socket.on('sendPos',function(data){
            socket.player.x = data.x;
            socket.player.y = data.y;
            socket.broadcast.emit('changedTransform',socket.player);


            //update server player map
            var playerIndex = serverPlayerMap.findIndex(p => p.id === socket.player.id);
            if(playerIndex > -1) {
                serverPlayerMap[playerIndex].x = data.x;
                serverPlayerMap[playerIndex].y = data.y;
            }

            //var distFromEnemy = checkDistFromPlayer(data.x, data.y, );

            //if (distFromEnemy > 1);
        });

        socket.on('sendDir',function(data){
            socket.player.d = [data.x, data.y];
            socket.broadcast.emit('changedTransform',socket.player);


            //update server player map
            var playerIndex = serverPlayerMap.findIndex(p => p.id === socket.player.id);
            if(playerIndex > -1) {
                serverPlayerMap[playerIndex].d = [data.x, data.y];
            }

            //var distFromEnemy = checkDistFromPlayer(data.x, data.y, );

            //if (distFromEnemy > 1);
        });

        socket.on('disconnect',function(){
            socket.broadcast.emit('remove',socket.player.id);

            //remove enemy from enemy map when disconnected 
            var enemyIndex = serverEnemyMap.findIndex(p => p.id === socket.player.id);
            if(enemyIndex > -1) {
                serverEnemyMap.splice(enemyIndex, 1);
            }


            //remove player from player map when disconnected
            var playerIndex = serverPlayerMap.findIndex(p => p.id === socket.player.id);
            if(playerIndex > -1) { 
                serverPlayerMap.splice(playerIndex, 1);
            }

        });

        socket.on('becomeEnemy', function(id){
            //transfer data from playerMap to enemyMap
            var playerIndex = serverPlayerMap.findIndex(p => p.id === socket.player.id); 
            serverEnemyMap.push(new Enemy(serverPlayerMap[playerIndex].id, 
                serverPlayerMap[playerIndex].x, 
                serverPlayerMap[playerIndex].y,
                serverPlayerMap[playerIndex].hp
            ));
            serverPlayerMap.splice(playerIndex, 1);
            socket.broadcast.emit('loadPlayerEnemys', getAllPlayerEnemyID());

        });
    });

    socket.on('test',function(){
        console.log('test received');
    });
});

// var game = new Game();
// create method that retreives correct entity from specified map
// create method to add entity to correct entity map (enemymap, playermap, itemmap, etc.....)

// function playerJoined(data) {
//     send all existing entitys to player that joined (items, player, enemys, etc...)
//     game.initializePlayer(this, data);
// }

// function playerLeft() {
//     game.removePlayer(this);
// }

function checkDistPlayer(x, y, x, y) {

    
}

function getAllPlayers(){
    var players = [];
    Object.keys(io.sockets.connected).forEach(function(socketID){
        var player = io.sockets.connected[socketID].player;
        if(player) players.push(player);
    });
    return players;
}

function getAllPlayerEnemyID(){
    var enemyIDs = [];

    serverEnemyMap.forEach(function(enemy) {
        enemyIDs.push(enemy.id);
    });
    return enemyIDs;
}

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}
