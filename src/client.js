/**
 * Created by Jerome on 03-03-17.
 */

var Client = {};
Client.socket = io.connect();

Client.sendTest = function(){
    console.log("test sent");
    Client.socket.emit('test');
};

// Client.askNewPlayer = function(x,y){
//     Client.socket.emit('newplayer', {x:x, y:y});
// };

Client.sendMe = function(x,y, dir){
    Client.socket.emit('newPlayer', {x:x, y:y, d:dir});
};

Client.sendPos = function(x,y){
  Client.socket.emit('sendPos',{x:x,y:y});
};

Client.becomeEnemy = function(id){
    Client.socket.emit('becomeEnemy', window.myID);
};

Client.sendDir = function(x, y){
    Client.socket.emit('sendDir', {x:x, y:y});
};

Client.socket.on('newPlayer',function(data){
    addNewPlayer(data.id,data.x,data.y,data.d);
});

Client.socket.on('myID', function(id){
    window.myID = id;
});

Client.socket.on('updatePlayers', function(data){
    console.log(data)
});

Client.socket.on('loadPlayerEnemys', function(ids){
    addEnemy(ids);
});

Client.socket.on('allplayers',function(data){
    for(var i = 0; i < data.length; i++){
        if(data[i].id !== window.myID) {
            addNewPlayer(data[i].id,data[i].x,data[i].y,data[i].d);
        }
    }

    Client.socket.on('changedTransform',function(data){
        updatePlayerTransform(data.id,data.x,data.y,data.d);
    });

    Client.socket.on('remove',function(id){
        removePlayer(id);
    });
});




