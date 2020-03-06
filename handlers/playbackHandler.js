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

	console.log(currentPlaylist);

	const paddingTime = 2000;

	if(!party.active){
		console.log("❌  Party is not active, do not do anything.");
		return;
	}

	if(!deviceId){
		console.log("❌  No device id was found, cannot play anything.");
		return;
	}

	if(!playbackActive && party.active){
		if(currentPlaylist.length > 0){
			console.log("✔️  Playing the current playlist and transferring playback to selected device.");

			await party.play({
				uris: currentPlaylist,
				offset: { uri: currentPlaylist[0] },
				device_id: deviceId
			});
		}

		if(currentPlaylist.length === 0){
			console.log("✔️  Playing the fallback playlist and transferring playback to selected device.");

			await party.play({
				context_uri: `spotify:playlist:${listId}`,
				device_id: deviceId
			});
		}

		return;
	}

	if(remaining < paddingTime || progress < paddingTime){
		if(currentPlaylist.length > 0){
			console.log("✔️  Track ended, playing current playlist.");

			const trackList = [...currentPlaylist, ...fallbackPlaylist];
			await party.play({ uris: trackList, offset: { uri: currentPlaylist[0] } });
		}

		/* if(currentPlaylist.length === 0){
			console.log("✔️  Track ended, playing fallback playlist.");
			await party.play({ context_uri: `spotify:playlist:${listId}` });
		} */

		return;
	}

	console.log("✔️  No action required, a track is currently playing");
}

module.exports = playbackHandler;
