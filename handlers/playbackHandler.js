async function playbackHandler (party,
	{
		isPlaying,
		remaining,
		progress,
		listId,
		currentPlaylist,
		deviceId,
		playbackActive
	}){
	const paddingTime = 2000;

	if(!deviceId){
		console.log("No device id was found, cannot play anything.");
		return;
	}

	if(!playbackActive && !party.active)
		return;

	console.log("Trying to play tracks...");
	if(!isPlaying && party.active){
		if(currentPlaylist.length > 0)
			await party.play({
				uris: currentPlaylist,
				offset: { uri: currentPlaylist[0] },
				device_id: deviceId
			});

		if(currentPlaylist.length === 0)
			await party.play({
				context_uri: `spotify:playlist:${listId}`,
				device_id: deviceId
			});

		return;
	}

	if(remaining < paddingTime || progress < paddingTime){
		if(currentPlaylist.length > 0)
			await party.play({ uris: currentPlaylist, offset: { uri: currentPlaylist[0] } });

		if(currentPlaylist.length === 0)
			await party.play({ context_uri: `spotify:playlist:${listId}` });
	}
}

module.exports = playbackHandler;
