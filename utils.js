var isString = (str) => {
	return typeof str === 'string' && str.trim().length > 0;
};

var sendMessage = (name, message) => {

	return {
		'name': name,
		'message' : message
	};
};

module.exports = {
	isString,
	sendMessage
};