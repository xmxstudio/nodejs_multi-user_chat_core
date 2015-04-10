var chatlineindex = 0;
$(document).ready(function(){
    $('#gcanvas').click(function(){

    })

    $('#chatlinemsg').keyup(function(e){
        if(e.keyCode == 13){
            sendChat();
            $(this).val('');
        };
    });

    $('body').keydown(function(e){

        if(e.keyCode == 37){
            socket.emit('movecmd',{direction: 'Left'});
            ;}
        if(e.keyCode == 38){
            socket.emit('movecmd',{direction: 'Up'});
            ;}
        if(e.keyCode == 39){
            socket.emit('movecmd',{direction: 'Right'});
            ;}
        if(e.keyCode == 40){
            socket.emit('movecmd',{direction: 'Down'});
            ;}
        if(e.keyCode == 87){
            socket.emit('movecmd',{direction: 'Up'});
            ;}
        if(e.keyCode == 65){
            socket.emit('movecmd',{direction: 'Left'});
            ;}
        if(e.keyCode == 83){
            socket.emit('movecmd',{direction: 'Down'});
            ;}
        if(e.keyCode == 68){
            socket.emit('movecmd',{direction: 'Right'});
            ;}


        /*eft arrow: 37
        up arrow: 38
        right arrow: 39
        down arrow: 40*/

    });




});//document.ready

function sendChat(){
    socket.emit('sendchat',{un: username,msg: $('#chatlinemsg').val()});
};

function addChatLine(from, msg){
    $('#chatlog').append("<span id='line" + ++chatlineindex + "' class='chatlinemsg'><span class='chatter'>" + from + "</span><span class='chatmsg'>" + msg + "</span></span>");
    $('#line' + chatlineindex).parent().scrollTop(10000);
}
function addWhisper(from, msg){
    $('#chatlog').append("<span id='line" + ++chatlineindex + "' class='chatlinemsg whisper'><span class='chatter'>" + from + "</span><span class='chatmsg'>" + msg + "</span></span>");
    $('#line' + chatlineindex).parent().scrollTop(10000);
}
function addAnnouncement(announcement){
    if(announcement.indexOf(username)==0) {
        announcement = announcement.replace(username +" has","you have");
    }
    $('#chatlog').append("<span id='line" + ++chatlineindex + "' class='announcement'>" + announcement + "</span>");
    $('#line' + chatlineindex).parent().scrollTop(10000);
}

function updateRosterDisplay(){
    $('#chatroster').html("");
    var html = "<ul>";
    $(roster).sort().each(function(i,v){
        if(v == username) {
            html += "<li class='self'>" + v + "</li>";
        }else{
            html+="<li>"+v+"</li>";
        }
    });//each
    html+="</ul>";
    $('#chatroster').html(html);
}
function spawnPlayers(data){//  [{x,y},{x,y},{x,y}....{x,y}]
    players = data.currentPlayers;
    var game = $('#gamecanvas');
    var c = document.getElementById("gcanvas");
    var ctx = c.getContext("2d");
    ctx.fillStyle = "#0000FF";
    ctx.clearRect(0, 0, ctx.canvas.width , ctx.canvas.height);

   $(data.currentPlayers).each(function(i,v){
          //game.append("<div class=\"player\" id=\"user" + v.id + "\" style=\"top: " + v.y + "px;left: "+ v.x + "px; \">" + v.username + "</div>");
          drawPlayer(v);
   });
};
//{username:data.un,index:sockets.length-1,x:Math.floor(Math.random() * 590),y:Math.floor(Math.random() * 300),hp:100};
function spawnPlayer(data){
    if(data.newPlayer.username != username){
     console.log(" add " + data.newPlayer.username + " to location " + data.newPlayer.x + "," + data.newPlayer.y + " id: " + data.newPlayer.id + " hp: " + data.newPlayer.hp );
        players.push(data.newPlayer);
    }
};
function splicePlayer(player){
    var index;
    players.forEach(function(i,v){
        if(v.username == player.username){
            index=i;
        }
    });
    players.splice(i,1);
    //TODO: remove player from game

}
function drawPlayer(player){
    //p{}
    var c = document.getElementById("gcanvas");
    var ctx = c.getContext("2d");
    //ctx.font="6pt Courier New";
    ctx.fillText(player.username, player.x, player.y);


}


