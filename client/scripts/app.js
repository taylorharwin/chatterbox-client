// YOUR CODE HERE:
var app = {};

app.init = function(){
  var $main = $('#main');
  $main.append($('<div id="chats"></div>'));
  $main.append($('<ul id="roomSelect"></ul>'));
  $main.append($('<ul id="friendList"></ul>'));
  $main.append($('<form id="send"><input id="message" type="text"><button class="submit">Send</button></form>'))
  $('#chats').on('click','h2',this.addFriend);
  $('#send').on('submit',this.handleSubmit);
};

app.send = function(message){
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
      console.dir(data);
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });

};

app.fetch = function(constraint){
  constraint = constraint || 'order=-createdAt&limit=40';
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    data: encodeURI(constraint),
    contentType: 'application/json',
    success: function (data) {
      this.server = console.dir(data);
      console.log('chatterbox: Messages fetched');
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
  $('#chats').append('<div>'
    + '<h2 class="username">' + message.username + '<h2>'
    + '<p>' + message.text + '</p>'
    + '<h3>' + message.roomname + '<h3>'
    + '</div>');
};

app.addRoom = function(roomname){
  $('#roomSelect').append('<li id="' + roomname + '">' + roomname + '</li>');
};

app.addFriend = function(event) {
  $('#friendList').append($('<li>' + event.target.innerHTML + '</li>'));
};

app.handleSubmit = function(event) {
  event.preventDefault();
  console.dir(event);
  var roomname = app.getQueryVariable('roomname') || 'lobby';

  var message = {
    username: app.getQueryVariable('username'),
    text: $('#message').val(),
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
    console.log('Query variable %s not found', variable);
};
