const client = require("../util/ApolloClient");
const gql = require("graphql-tag");
const isInPlaylist = require("../util/isInPlaylist");

/**
 * Add track to the playlist.
 * @param {string} id - A spotify track id.
 * @param {string} username - A spotify username.
 * @param {object} party - Instance of a Party
 */
async function addTrack(id, username, party){
	try{
		if(!this.active) return"error";

		const inPlaylist = isInPlaylist(party.playlist, id);

		if(inPlaylist)
			return"conflict";

		const track = id + ":" + username + ":" + Date.now();

		const query = gql`
		mutation {
			updatePlaylist ( id: ${party._id}, data: "${track}"){
				playlist
			}
		}
		`;

		const result = await client.mutate({ mutation: query });
		const newPlaylist = result.data.updatePlaylist.playlist;
		this.playlist = newPlaylist;
		return"success";
	}catch(err){
		console.error(err);

		return"error";
	}
}

module.exports = addTrack;
