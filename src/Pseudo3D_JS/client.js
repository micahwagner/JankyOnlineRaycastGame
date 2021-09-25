/**
 * Created by Jerome on 03-03-17.
 */

var Client = {};
Client.socket = io.connect();

Client.sendTest = function(){
    console.log("test sent");
    Client.socket.emit('test');
};

Client.askNewPlayer = function(x,y){
    Client.socket.emit('newplayer', {x:x, y:y});
};

Client.sendMe = function(x,y){
    Client.socket.emit('newplayer', {x:x, y:y});
};

Client.sendPos = function(x,y){
  Client.socket.emit('sendPos',{x:x,y:y});
};

Client.socket.on('newplayer',function(data){
    addNewPlayer(data.id,data.x,data.y);
});

Client.socket.on('allplayers',function(data){
    for(var i = 0; i < data.length; i++){
        addNewPlayer(data[i].id,data[i].x,data[i].y);
    }

    Client.socket.on('move',function(data){
        moveOtherPlayer(data.id,data.x,data.y);
    });

    Client.socket.on('remove',function(id){
        removePlayer(id);
    });

    Client.socket.on('myID', function(id){
        window.myID = id;
    });
});




