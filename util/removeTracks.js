const client = require("../util/ApolloClient");
const gql = require("graphql-tag");
const findTrackById = require("../util/findTrackById");

async function removeTracks (party, { currentPlaylist, id }){
	const currentTrackIndex = currentPlaylist.findIndex( track => {
		const parts = track.split(":");
		const trackId = parts[2];

		return trackId === id;
	});

	const deletedItems = currentTrackIndex > -1 ? currentPlaylist.splice(0, currentTrackIndex + 1) : [];
	await removePlayedTracks(deletedItems, party);
}

async function removePlayedTracks (trackIds, party){
	try{
		console.log("");
		console.log("Trying to remove tracks...");

		if(trackIds.length === 0){
			console.log("Empty array provided. Not removing anything.");
			console.log("");
			return;
		}

		const tracks = trackIds.map( track => {
			const id = track.split(":")[2];

			return findTrackById(party.playlist, id);
		});

		const query = gql`
		mutation {
			removeFromPlaylist (id: ${party._id}, data: ${JSON.stringify(tracks)}){
				playlist
			}
		}`;

		const result = await client.mutate({ mutation: query });

		const playlist = result.data.removeFromPlaylist.playlist;
		party.playlist = playlist;

		party.io.emit("track_removed", { trackId: "", playlist });
		console.log(`Removed ${trackIds.length} tracks from playlist.`);
		console.log("");
	}catch(err){
		console.error(err);
	}
}

module.exports = removeTracks;
