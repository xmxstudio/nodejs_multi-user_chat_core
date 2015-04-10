var app = require('http').createServer(handler)
    , io = require('socket.io').listen(app)
    , fs = require('fs');
    //, red = require('redis').createClient( '6379', 'localhost');

app.listen(80);
console.log ("server is up at http://localhost/");

var sockets = [];
var roster = [];
var chatTimes = [];
//var game = {};
var players = [];



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
        }//switch
};//handler




io.sockets.on('connect' , function(socket){
    console.log('identity requested');
    socket.emit('identify');

    socket.on('identify',function(data){
        console.log('identity received');
        sockets.push(socket);
        roster.push(data.un);
        chatTimes.push(new Date());
        socket.emit('updateRoster',{roster: roster});
        io.sockets.emit('userarrived',{un: data.un});
        io.sockets.emit('chatannouncement', {announcement: data.un + ' has entered the room'});
    })//identify
    socket.on('disconnect',function(){
        var i = sockets.indexOf(socket);
        sockets.splice(i,1);
        var u = roster[i];
        io.sockets.emit('userdeparted', {un: u});
        io.sockets.emit('chatannouncement', {announcement: u + ' has left the room'});
        console.log(u + ' has left the chat');
        roster.splice(i,1);
    })//

    socket.on('sendchat',function(data){
        console.log(data);
        var i = sockets.indexOf(socket);
        var user = roster[i];
        console.log('user: ' + user + ' received user: ' + data.un + ' msg: ' + data.msg);
        parseChat(data,socket);
    });//sendchat



});//io.sockets.on('connect'....


function parseChat(data,socket){
    var un = data.un;
    var msg = data.msg.trim();
    var userIndex =  sockets.indexOf(socket);

    if(msg.length > 0){

        //    /command arg1 argextra
        if (msg.substr(0,1)=="/"){
            //it's a command
            var args = msg.substr(1).split(" ");
            console.log(args);
            console.log(args[0]+"<-");
            switch(args[0]){
                case 'whisper':
                    sockets[roster.indexOf(args[1])].emit('whisper', {from: "»" + un,msg: args.join(" ").substr(args[1].length + 9)})
                    socket.emit('whispersent', {to: "«"+ args[1],msg: args.join(" ").substr(args[1].length + 9)})
                    break;
                case 'roll':
                    io.sockets.emit('chatannouncement', {announcement: data.un + ' has rolled a ' + Math.floor(Math.random()* 100) });
                    break;
                case 'chattime':
                    socket.emit('chatannouncement', {announcement: data.un + ' entered the room at: ' + chatTimes[userIndex] });
                    break;
                default:

            }//switch
        }else{
            io.sockets.emit('chatmsg',{from: data.un,msg: sanitize(data.msg)});
        }








    }
}

function sanitize(input){
    return input.replace("<","&lt;");
}