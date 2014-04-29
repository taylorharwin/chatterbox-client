// YOUR CODE HERE:
//
//
//
$(document).ready(function(){
var app = new App();
app.init();
});

var App = function(){
  this.username = App.prototype.getQueryVariable.call(this,'username');
  this.friendList = [];
  this.currentRoom = 'Lobby';
  this.activeRooms = [];
};

App.prototype.init = function(){
  var $main = $('#main');
  $main.append($('<div id="chats"></div>'));
  $main.append($('<ul id="roomSelect"></ul>'));
  $('#wrapper').append($('<div id="sideBar"><h2>'+ this.username +'</h2><ul id="friendList"></ul></div>'));
  $main.append($('<form id="send"><input class="message" type="text"><button class="submit">Send</button></form>'));
  $('#chats').on('click','h2',this.addFriend);
  $('#send').on('submit',this.handleSubmit);
};

App.prototype.send = function(message){
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
  $(this).find('.message').val('');
};

App.prototype.fetch = function(constraint){
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

App.prototype.clearMessages = function(selector){
  selector = selector || '#chats';
  $(selector).html('');
};

App.prototype.addMessage = function(message){
  $('#chats').append('<div>'
    + '<h2 class="username">' + message.username + '<h2>'
    + '<p>' + message.text + '</p>'
    + '<h3>' + message.roomname + '<h3>'
    + '</div>');
};

App.prototype.displayMessages = function(){
  //Will call fetch, possibly with some parameters
  //Can call fetch filtered by room or by friend
      //Filter by:
          //Active Room
          //Active Rooms, highlighting # of new updates on each tab
          //Updates from friends

}



App.prototype.addRoom = function(roomname){
  $('#roomSelect').append('<li id="' + roomname + '">' + roomname + '</li>');
};

App.prototype.addFriend = function(event) {
  $('#friendList').append($('<li>' + event.target.innerHTML + '</li>'));
};

App.prototype.handleSubmit = function(event) {
  event.preventDefault();
  var roomname = this.currentRoom || 'lobby';

  var message = {
    username: this.username,
    text: $('.message').val(),
    roomname: roomname
  };
  App.prototype.send.call(event.target, message);

};

// Helpers
App.prototype.getQueryVariable = function(variable) {
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
