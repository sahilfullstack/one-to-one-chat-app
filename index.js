var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
const {Users} = require('./users.js');
const {isString, sendMessage} = require('./utils.js');
var users = new Users();

server.listen(3000);
console.log("Server is listening to port 3000");
var user = 'User:';

app.get('/', function(request, response) {
	response.sendFile(__dirname +'/public/index.html');
});

app.get('/chat', function(request, response) {
	response.sendFile(__dirname +'/public/chat.html');
});



io.on('connection', function(socket) {
	console.log('A connection was made');
	

	socket.on('join', (params, callback) => {

		if (!isString(params.name) && !isString(params.room)) {

			return callback('Name and Room name are required');
		}


		socket.join(params.room)

		//remopve the user if already exist to maintain the uniqueness
		users.removeUser(socket.id);	
		users.addUser(socket.id, params.name, params.room);	


		io.to(params.room).emit('updateUserList', users.getUserList(params.room));

		socket.emit('newMessage', sendMessage('Admin', 'Welcome to the chat App'));

		socket.to(params.room).emit('newMessage', sendMessage('Admin', `${params.name} has joined.`));

		callback();
	});


	socket.on('createMessage', (message, callback) =>  {

		var user = users.getUser(socket.id);

		if (user && isString(message)) {

			io.to(user.room).emit('newMessage', sendMessage( user.name,  message));
		}

		console.log('New Message', message);
		callback();
	});

	socket.on('disconnect', (message) => {
		var user = users.removeUser(socket.id);
		if (user) {

			io.to(user.room).emit('updateUserList', users.getUserList(user.room));
			io.to(user.room).emit('newMessage', sendMessage('Admin', `${user.name} has left the chat room.`));
		}
		console.log('User Disconnected');
	});

});