// YOUR CODE HERE:
//
//
//
$(document).ready(function(){
app.username = app.getQueryVariable('username');
app.init();
});

var app = {
  friendList: [],
  currentRoom: 'Lobby',
  activeRooms: {}
};

app.init = function(){
  $('#wrapper').prepend($('<form id="send"><input class="message" type="text"><button class="submit">Send</button></form>'));
  var $main = $('#main');
  $main.append($('<div id="chats"></div>'));
  $main.prepend($('<ul id="roomSelect"></ul>'));
  $('#wrapper').append($('<div id="sideBar"><h2>'+ app.username +'</h2><ul id="friendList"></ul></div>'));
  $('#chats').on('click','h2',app.addFriend);
  $('#send').on('submit',app.handleSubmit);
  $('#roomSelect').on('click','li', function(event){
    app.currentRoom = $(event.target).data('roomname');
    $('.activeRoom').removeClass();
    $(event.target).addClass('activeRoom');
    app.fetch('where={"roomname":"'+app.currentRoom+'"}');
  });
};

app.send = function(message){
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      // console.log('chatterbox: Message sent');
      // console.dir(data);
      app.fetch();
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
  $('#main').find('.message').val('');
};

app.fetch = function(constraint){
  constraint = constraint || 'order=-createdAt&limit=40';
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    data: encodeURI(constraint),
    contentType: 'application/json',
    success: function (data) {
      app.extractRooms(data.results);
      app.renderRoomNames();
      app.renderAllMessages(data.results);
      // console.log('chatterbox: Messages fetched');
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to receive messages from server');
    }
  });
};

app.clearMessages = function(selector){
  selector = selector || '#chats';
  $(selector).html('');
};

app.addMessage = function(message){
  message.username = message.username || app.username;
  $('#chats').append('<div class="chat">'
    + '<h2 class="username">' + message.username + '<h2>'
    + '<span class="datestamp">' + message.createdAt + '</span>'
    + '<p>' + message.text + '</p>'
    + '<span class="roomname">' + message.roomname + '</span>'
    + '</div>');
};

app.displayMessages = function(){
  //Will call fetch, possibly with some parameters
  //Can call fetch filtered by room or by friend
      //Filter by:
          //Active Room
          //Active Rooms, highlighting # of new updates on each tab
          //Updates from friends

};

app.renderAllMessages = function(data){
  $('#chats').html('');
  _.each(data, function(chat, index){
      // console.dir("Sent from Render all messages");
      // console.dir(chat);
      var safeChat = {};
      _.each(chat, function(val, key){
        safeChat[app.escapeXSS(key)]= app.escapeXSS(val);
      });
      app.addMessage(safeChat);
  });
};


app.renderExtraMessages = function(){

};
app.extractRooms = function(data){
  _.each(data, function(value){
    app.activeRooms[value.roomname] = true;
  });
};

app.renderRoomNames = function(){
  var roomListHTML = '';
  _.each(app.activeRooms, function(value, key){
    roomListHTML += '<li class="'+ key +'" data-roomname="'+key+'">'+ key + '</li>\n';
  });
  console.log(roomListHTML);
  $('#roomSelect').html($(roomListHTML));
  $('#roomSelect .' + app.currentRoom).attr('class', 'activeRoom');
};

app.addRoom = function(roomname){
  $('#roomSelect').append('<li id="' + roomname + '">' + roomname + '</li>');
};

app.addFriend = function(event) {
  $('#friendList').append($('<li>' + event.target.innerHTML + '</li>'));
};

app.handleSubmit = function(event) {
  event.preventDefault();
  var roomname = app.currentRoom || 'lobby';

  var message = {
    username: app.username,
    text: $('.message').val(),
    roomname: roomname
  };
  app.send(message);

};

// Helpers
app.getQueryVariable = function(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) === variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    // console.log('Query variable %s not found', variable);
};

app.escapeXSS = function(string){
  var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
  };
  return String(string).replace(/[&<>"'\/]/g, function (s) {
    return entityMap[s];
  });
};

