module.exports = function user(){
    this.name = "player";
    this.socket = null;
    this.xposition= 0;
    this.yposition= 0;
    var hp = 100;
    var socket;
    this.init = function(s){
        this.socket = s;
        socket = s;
        //LOAD UP EVERYTHIGN!!! chat.. games.. ERRRTING
        hp = 100;
    }


    this.player = {
        getPosition:  function () {
            return  {x: this.xposition, y: this.yposition};
        },
        getHP: function(){
            return hp;
        },
        name: function(){
            return 'SILLY GOAT';
        },
        hurt: function(amt){
            hp = hp - amt;
        }
    }
    this.game = {
        welcomebanner: function(){
            socket.emit('whisper',{from: 'taco',msg: 'HI! from taco!'});
        }
    }
    this.chat = {
        announce: function(announcement){
          socket.emit('chatannouncement',{announcement: announcement});
            return;
        },
        sendmsg: function(msg){
            socket.emit('chatmsg',{from:'taco',msg: msg});
        }
    }
}
