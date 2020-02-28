const authorize = require("./authorize");
const addTrack = require("./addTrack");
const removeTrack = require("./removeTrack");

/**
 * Assign events to a new connection.
 * @param {object} socket - The socket passed generated on a new connection
 * @param {object} party Instance of Party.
 */
async function connectionHandler (socket, party){
	try{
		await authorize(socket, party);

		socket.on("add-track", function (data){ addTrack(data, socket, party); });
		socket.on("remove-track", function (data){ removeTrack(data, socket, party); });
	}catch(err){
		throw new Error(err);
	}
}

module.exports = connectionHandler;
