var chatlineindex = 0;
$(document).ready(function(){


    $('#chatlinemsg').keyup(function(e){
        if(e.keyCode == 13){

            sendChat();
            $(this).val('');
        ;}
    });








});//document.ready
function addChatLine(from, msg){
    $('#chatlog').append("<span id='line" + ++chatlineindex + "' class='chatlinemsg'><span class='chatter'>" + from + "</span><span class='chatmsg'>" + msg + "</span></span>");
    console.log('FROM: '+ from + ' msg: ' + msg);
    $('#line' + chatlineindex).parent().scrollTop(10000);
}
function addWhisper(from, msg){
    $('#chatlog').append("<span id='line" + ++chatlineindex + "' class='chatlinemsg whisper'><span class='chatter'>" + from + "</span><span class='chatmsg'>" + msg + "</span></span>");
    console.log('FROM: '+ from + ' msg: ' + msg);
    $('#line' + chatlineindex).parent().scrollTop(10000);
}
function addAnnouncement(announcement){
    if(announcement.indexOf(username)==0) {
        announcement = announcement.replace(username +" has","you have");
    }
    $('#chatlog').append("<span id='line" + ++chatlineindex + "' class='announcement'>" + announcement + "</span>");
    $('#line' + chatlineindex).parent().scrollTop(10000);
}
function sendChat(){
    socket.emit('sendchat',{un: username,msg: $('#chatlinemsg').val()});
};

function updateRosterDisplay(){
    var html = "<ul>";
    $(roster).sort().each(function(i,v){
        if(v == username) {
            html += "<li class='self'>" + v + "</li>";
        }else{
            html+="<li>"+v+"</li>";
        }


    });
    html+="</ul>";
    $('#chatroster').html(html);

}