async function playbackHandler (party,
	{
		isPlaying,
		remaining,
		progress,
		listId,
		currentPlaylist,
		previousPlaylist
	}){
	const paddingTime = 2000;
	console.log("remaining", remaining);

	if(!isPlaying && !party.active)
		return;

	console.log("Trying to play tracks...");
	if(remaining < paddingTime || progress < paddingTime){
		if(currentPlaylist.length > 0)
			await party.play({ uris: currentPlaylist, offset: { uri: currentPlaylist[0] } });

		if(currentPlaylist.length === 0)
			await party.play({ context_uri: `spotify:playlist:${listId}` });
	}
}

module.exports = playbackHandler;
