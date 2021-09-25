var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

app.use('/css',express.static(__dirname + '/css'));
app.use('/src',express.static(__dirname + '/src'));

app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
});

server.lastPlayderID = 0;

server.listen(process.env.PORT || 8081, "10.0.0.17", function(){
    console.log('Listening on '+server.address().port);
});

io.on('connection',function(socket){

    socket.on('newplayer',function(data){
        socket.player = {
            id: server.lastPlayderID++,
            x: data.x,
            y: data.y
        };
        socket.emit('allplayers',getAllPlayers());
        socket.emit('myID', socket.player.id);
        socket.broadcast.emit('newplayer',socket.player);

        socket.on('sendPos',function(data){
            socket.player.x = data.x;
            socket.player.y = data.y;
            io.emit('move',socket.player);
        });

        socket.on('disconnect',function(){
            io.emit('remove',socket.player.id);
        });
    });

    socket.on('test',function(){
        console.log('test received');
    });
});

function getAllPlayers(){
    var players = [];
    Object.keys(io.sockets.connected).forEach(function(socketID){
        var player = io.sockets.connected[socketID].player;
        if(player) players.push(player);
    });
    return players;
}

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}
