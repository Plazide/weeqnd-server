const fetchMetaInfo = require("../util/fetchMetaInfo");
const playbackHandler = require("./playbackHandler");
const removeTracks = require("../util/removeTracks");

async function spotifyHandler (party){
	console.log("Starting Spotify handler...");
	const defaultWait = 1000 * 30;
	party.previousPlaylist = [];

	const handler = async () => {
		try{
			const{
				listId,
				duration,
				progress,
				isPlaying,
				currentPlaylist,
				fallbackPlaylist,
				id,
				deviceId,
				playbackActive
			} = await fetchMetaInfo(party);
			const remaining = duration - progress;

			await Promise.all([
				removeTracks(party, { currentPlaylist, id }),
				playbackHandler(party, {
					isPlaying,
					remaining,
					progress,
					listId,
					currentPlaylist,
					fallbackPlaylist,
					deviceId,
					playbackActive
				})
			]);

			party.updateCurrentTrack();
			const wait = isPlaying ? (remaining || defaultWait) : defaultWait;
			console.log("\n⏰  Waiting", wait / 1000, "seconds...");
			setTimeout(handler, wait);
		}catch(err){
			console.error("An error occurred", err);

			if(err.statusCode === 401 || err.statusCode === 403){
				const success = await party.refresh();
				if(success)
					handler();
				else
					throw Error("Could not refresh access token");
			}
		}
	};

	const init = async () => {
		const reqs = [
			party.setShuffle({ state: false }),
			party.setRepeat({ state: "off" })
		];

		await Promise.all(reqs).catch( err => {
			console.warn("Cannot set shuffle or repeat.", err);
		});
	};

	await init();
	handler();
}

module.exports = spotifyHandler;
