async function updateCurrentTrack (){
	function run (party){
		setTimeout( async () => {
			const playback = await party.getMyCurrentPlaybackState();
			const currentTrack = playback.body || {};

			party.io.emit("current_track", currentTrack);
		}, 2000);
	}

	run(this);
}

module.exports = updateCurrentTrack;
