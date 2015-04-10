//TODO: implement chat spam protection
//TODO: remove player {} p from players and chatTimes onDisconnect

var app = require('http').createServer(handler)
    , io = require('socket.io').listen(app)
    , fs = require('fs');
    //, red = require('redis').createClient( '6379', 'localhost');

app.listen(8080);






/*
var p = new player();
p.name = 'test';
p.socketid = 1;
p.xposition = 2;
p.yposition =4;
p.hp= 100;
*/

    //console.log(p.getPosition().x);



console.log ("server is up at http://localhost/");
    var sockets = [];
    var roster = [];
    var chatTimes = [];
    var players= [];
    var tacos =  ["https://38.media.tumblr.com/3d61e24ed05f7e12f9d16152b954d74d/tumblr_n9biwafTc11s00daco1_400.gif","http://media.giphy.com/media/11VATENd1pYySk/giphy.gif","http://media3.giphy.com/media/3KAxGKtEQpTmo/giphy.gif","http://www.animateit.net/data/media/august2009/th_dance.gif","http://blendernpr.org/toonery/wp-content/uploads/2012/12/TacoDance.gif","http://www.kimwerker.com/wp-content/uploads/2012/11/TacoDance-11f.gif"];
    var tacoIndex =0;

function handler(req, res) {
    switch(req.url) {
        case '/':
            fs.readFile(__dirname + '/index.html',
                function (err, data) {
                if (err) {
                    res.writeHead(500);
                    return res.end('Error Loading index.html');
                }
                res.writeHead(200);
                res.end(data);
            });
            break;
        case '/style.css':
            fs.readFile(__dirname + '/style.css',
                function (err, data) {
                    if (err) {
                        res.writeHead(500);
                        return res.end('Error Loading index.html');
                    }
                    res.writeHead(200);
                    res.end(data);
                });//readfile
            break;
        case '/main.js':
            fs.readFile(__dirname + '/main.js',
                function (err, data) {
                    if (err) {
                        res.writeHead(500);
                        return res.end('Error Loading main.js');
                    }
                    res.writeHead(200);
                    res.end(data);
                });//readfile
            break;
        case '/user.js':
            fs.readFile(__dirname + '/user.js',
                function (err, data) {
                    if (err) {
                        res.writeHead(500);
                        return res.end('Error Loading user.js');
                    }
                    res.writeHead(200);
                    res.end(data);
                });//readfile
            break;
        case '/gamecontrols.html':
            fs.readFile(__dirname + '/gamecontrols.html',
                function (err, data) {
                    if (err) {
                        res.writeHead(500);
                        return res.end('Error Loading gamecontrols.html');
                    }
                    res.writeHead(200);
                    res.end(data);
                });//readfile
            break;
        }//switch
}//handler


io.sockets.on('connect' , function(socket){

    /*var user=  require('./user');
    var usr = new  user()
    usr.init(socket);*/
    //usr.game.welcomebanner();
    /*usr.chat.sendmsg( usr.player.name() + " has " + usr.player.getHP() + " hp left!");
    usr.player.hurt(45);
    usr.chat.sendmsg(usr.player.getHP());*/




    console.log('identity requested');
    socket.emit('identify');
    socket.on('identify',function(data){
        console.log('identity received');
        sockets.push(socket);
        roster.push(data.un);
        chatTimes.push(new Date());
        var p = {username:data.un,index:sockets.length-1,x:Math.floor(Math.random() * 590),y:Math.floor(Math.random() * 300),hp:100};
        players.push(p);


        socket.emit('updateRoster',{roster: roster});
        socket.emit('currentPlayers',{currentPlayers:players});

        io.sockets.emit('playerJoined',{newPlayer: p});
        io.sockets.emit('userarrived',{un: data.un});
        io.sockets.emit('chatannouncement', {announcement: data.un + ' has entered the room'});
    });//identify
    socket.on('disconnect',function(){
        var i = sockets.indexOf(socket);
        sockets.splice(i,1);
        var u = roster[i];
        io.sockets.emit('userdeparted', {un: u});
        io.sockets.emit('chatannouncement', {announcement: u + ' has left the room'});
        roster.splice(i,1);
        players.splice(i,1);
        chatTimes.splice(i,1);

    });//
    socket.on('sendchat',function(data){
        console.log(data);
        var i = sockets.indexOf(socket);
        var user = roster[i];
        console.log('user: ' + user + ' received user: ' + data.un + ' msg: ' + data.msg);
        parseChat(data,socket);
    });//sendchat

    socket.on('movecmd',function(data){
        var index = sockets.indexOf(socket);
        var p = players[index];

        switch(data.direction){
            case "Up":
                if (p.y < 10 ){
                    p.y = 295;
                }else{
                    p.y -= 5;
                }
                break;
            case "Down":
                if(p.y > 290){
                    p.y  = 5;
                }else{
                    p.y += 5;
                }
                break;
            case "Left":
                if(p.x < 5){
                    p.x = 540;
                }else{
                    p.x -= 5;
                }
                break;
            case "Right":
                if(p.x > 540){
                    p.x = 0 ;
                }else{
                    p.x += 5;
                }
                break;
            default:

        }
        players[index] = p;
        io.sockets.emit('currentPlayers',{currentPlayers:players});
    })


});//io.sockets.on('connect'....

function parseChat(data,socket){
    var un = data.un;
    var msg = data.msg.trim();
    var userIndex =  sockets.indexOf(socket);
//enable chat spam protection
    //check the last time since their message
    //if its less than threshold... increment a counter
    //if the counter > WarningNum  then sendwarning
    //if the counter > maxNum then sendblock (informs of [duration] ban)


    if(msg.length > 0){
        if (msg.substr(0,1)=="/"){
            //it's a command
            var args = msg.substr(1).split(" ");
            console.log(args);
            console.log(args[0]+"<-");
            switch(args[0]){
                case 'whisper':
                    sockets[roster.indexOf(args[1])].emit('whisper', {from: "»" + un,msg: args.join(" ").substr(args[1].length + 9)});
                    socket.emit('whispersent', {to: "«"+ args[1],msg: args.join(" ").substr(args[1].length + 9)});
                    break;
                case 'roll':
                    io.sockets.emit('chatannouncement', {announcement: data.un + ' has rolled a ' + Math.floor(Math.random()* 100) });
                    break;
                case 'chattime':
                    socket.emit('chatannouncement', {announcement: data.un + ' entered the room at: ' + chatTimes[userIndex] });
                    break;
                case 'taco':
                   io.sockets.emit('chatmsg', {from: 'Taco GOD',msg: '<img height="100px" src="' + tacos[tacoIndex] + '">' });
                   if(++tacoIndex > tacos.length - 1){
                       tacoIndex = 0;
                   }
                   break;
                case 'nick':
                    // /nick taco
                    //args[1] new nick
                    console.log("OMG" + roster);
                    var i = sockets.indexOf(socket);
                /*    var p =roster[i];
                    p.username = args[1];
                    roster[i] = p;*/
                    roster[i] = args[1];
                    console.log(roster + "OMG");
                    io.sockets.emit('chatannouncement', {announcement: data.un + ' has changed their nick to ' + args[1] });
                    io.sockets.emit('nickchange', {oldnick: data.un , newnick: args[1]});
                    console.log("sending old nick " +data.un + " new " + args[1] );

                    break;
                default:

            }//switch
        }else{
            io.sockets.emit('chatmsg',{from: sanitize(roster[sockets.indexOf(socket)]),msg: sanitize(data.msg)});
        }
    }
}
function sanitize(input){
    return input.replace("<","&lt;");
}