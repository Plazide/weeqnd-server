const SpotifyWebApi = require("spotify-web-api-node");

/**
 * Authorize connection for the provided party.
 * @param {object} socket - The socket generated from connection.
 * @param {object} party - Instance of a Party.
 */
async function authorize (socket, party){
	try{
		const accessToken = socket.handshake.query.accessToken;

		if(party.rejectedTokens.includes(accessToken)){
			socket.disconnect();
			return;
		}

		const spotify = new SpotifyWebApi({ accessToken });
		const me = await spotify.getMe().catch( err => {
			return err;
		});
		if(me.statusCode === 401){
			socket.emit("err", { type: "invalid_token" });
			socket.disconnect();
			return;
		}

		const username = me.body.id;

		const userFound = party.users.find( user => user.name === username);
		if(!userFound){
			this.rejectedTokens.push(accessToken);
			socket.disconnect();
			return;
		}

		socket.username = username;
		socket.join(party.code);
	}catch(err){
		console.error(err);
	}
}

module.exports = authorize;
