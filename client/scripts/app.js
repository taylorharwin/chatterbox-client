// YOUR CODE HERE:
var app = {};

app.init = function(){
  var $main = $('#main');
  $main.append($('<div id="chats"></div>'));
  $main.append($('<ul id="roomSelect"></ul>'));
  $main.append($('<ul id="friendList"></ul>'))
  $('#chats').on('click','h2',this.addFriend);
};

app.send = function(message){
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });

};

app.fetch = function(){
  var messages = $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      this.server = data;
      console.log('chatterbox: Messages fetched');
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to receive messages from server');
    }
  });
  return messages;
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
