var app = require('http').createServer(handler)
    , io = require('socket.io').listen(app)
    , fs = require('fs');
    //, red = require('redis').createClient( '6379', 'localhost');

app.listen(80);
console.log ("server is up at http://localhost/");

var sockets = [];
var roster = [];

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
    //console.log('identity requested');

    socket.on('identify',function(data){
        console.log('identity received');
        sockets.push(socket);
        roster.push(data.un);
        socket.emit('updateRoster',{roster: roster});
        io.sockets.emit('userarrived',{un: data.un});
        io.sockets.emit('chatannouncement', {announcement: data.un + ' has entered the room'});
    })//identify


    socket.on('sendchat',function(data){
        console.log(data);
        var i = sockets.indexOf(socket);
        var user = roster[i];
        console.log('user: ' + user + ' received user: ' + data.un + ' msg: ' + data.msg);
        if(data.msg.trim().length > 0){
            io.sockets.emit('chatmsg',{from: user,msg: sanitize(data.msg)});
        }
    });//sendchat

    socket.on('disconnect',function(){
        var i = sockets.indexOf(socket);
        sockets.splice(i,1);
        var u = roster[i];
        io.sockets.emit('userdeparted', {un: u});
        io.sockets.emit('chatannouncement', {announcement: u + ' has left the room'});
        console.log(u + ' has left the chat');
        roster.splice(i,1);
    })//

});//io.sockets.on('connect'....

function sanitize(input){
    return input.replace("<","&lt;");
}