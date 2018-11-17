class Users {

	constructor () {
		this.users = [];
	}
	getUser (id) {
		return this.users.filter((user) => user.id === id)[0]
	}

	getUserList (room) {

		var users = this.users.filter((user) =>{

			return user.room === room
		});

		var names = users.map((user) => {
			return user.name
		});

		return names;
	}

	addUser (id, name, room) {

		var user = {id, name, room};
		this.users.push(user);
		
		return user;
	}

	removeUser (id) {

		var user = this.getUser(id);
		if (user) {

			this.users = this.users.filter((user) => user.id !== id);
		}

		return user;
	}
}

module.exports = {

	Users
};