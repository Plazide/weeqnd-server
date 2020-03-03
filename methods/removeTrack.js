const client = require("../util/ApolloClient");
const gql = require("graphql-tag");
const isInPlaylist = require("../util/isInPlaylist");

/**
 *
 * @param {object} data - The track data passed from the client.
 * @param {string} data.id - A spotify track id.
 * @param {string} data.username - A spotify username.
 * @param {string|number} data.timeAdded - A unix timestamp for when the track was added to the playlist.
 * @param {string} storedUsername - The username stored in the connected socket.
 * @param {object} party - An instance of a Party.
 */
async function removeTrack (data, storedUsername, party){
	try{
		const{ id, username, timeAdded } = data;
		const trackId = id + ":" + username + ":" + timeAdded;
		const inPlaylist = isInPlaylist(party.playlist, id);

		if(username !== storedUsername)
			return"not_allowed";

		if(!inPlaylist)
			return"conflict";

		// Update playlist in database.
		const query = gql`
		mutation {
			removeFromPlaylist( id: ${party._id}, data: "${trackId}"){
				playlist
			}
		}
		`;

		const result = await client.mutate({ mutation: query });
		const newPlaylist = result.data.removeFromPlaylist.playlist;
		party.playlist = newPlaylist;
		return"success";
	}catch(err) {
		console.error(err);

		return"error";
	}
}

module.exports = removeTrack;
