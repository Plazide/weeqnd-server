function findTrackById (playlist, id){
	return playlist.find( item => {
		const parts = item.split(":");
		const trackId = parts[0];

		return trackId === id;
	});
}

module.exports = findTrackById;
