async function playbackHandler (party,
	{
		isPlaying,
		remaining,
		progress,
		listId,
		currentPlaylist,
		fallbackPlaylist,
		deviceId,
		playbackActive
	}){
	console.log("");
	console.log("⏲️  Trying to play tracks...");

	const paddingTime = 2000;
	const trackList = [...currentPlaylist, ...fallbackPlaylist];
	const oldLength = party.previousPlaylist.length;
	const newLength = currentPlaylist.length;

	if(!party.active){
		console.log("❌  Party is not active, do not do anything.");
		return;
	}

	if(!deviceId){
		console.log("❌  No device id was found, cannot play anything.");
		return;
	}

	if(!playbackActive && party.active){
		console.log("✔️  Playing the current playlist and transferring playback to selected device.");

		await party.play({
			uris: trackList,
			offset: { uri: trackList[0] },
			device_id: deviceId
		});

		return;
	}

	if((remaining < paddingTime || progress < paddingTime) && newLength > oldLength){
		console.log("✔️  Track ended, playing current playlist.");

		await party.play({ uris: trackList, offset: { uri: trackList[0] } });
	}

	party.previousPlaylist = currentPlaylist;
	// console.log("✔️  No action required, a track is currently playing");
}

module.exports = playbackHandler;
