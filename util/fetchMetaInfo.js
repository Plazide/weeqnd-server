const extractFromTrack = require("../util/extractFromTrack");

async function fetchMetaInfo (party){
	const listParts = party.fallbackPlaylist.split("/");
	const listId = listParts[listParts.length - 1];

	const[{ body: { devices } }, fbPlaylist, currentPlayback] = await Promise.all(
		[
			party.getMyDevices(),
			party.getPlaylistTracks(listId),
			party.getMyCurrentPlaybackState()
		]
	)
		.catch( err => {
			throw err;
		});

	const fallbackPlaylist = fbPlaylist.body.items.map( item => item.track.uri);

	const playlistAsObjects = [...party.playlist].map( item => {
		const id = extractFromTrack("id", item);
		const username = extractFromTrack("username", item);
		const timeAdded = parseInt(extractFromTrack("timeAdded", item));

		return{ id, username, timeAdded };
	});

	const sortedPlaylist = playlistAsObjects.sort( (a, b) => {
		const aTime = parseInt(a.timeAdded);
		const bTime = parseInt(b.timeAdded);

		return aTime - bTime;
	});

	const currentPlaylist = sortedPlaylist.map( track => {
		const id = track.id;

		return`spotify:track:${id}`;
	});

	// eslint-disable-next-line camelcase
	const{
		progress_ms: progress,
		item: { duration_ms: duration, uri, id } = "",
		is_playing: isPlaying
	} = currentPlayback.body;
	const deviceId = devices[0].id;

	return{
		listId,
		deviceId,
		fallbackPlaylist,
		duration,
		id,
		isPlaying,
		progress,
		currentPlaylist,
		uri
	};
}

module.exports = fetchMetaInfo;
