function isInPlaylist (playlist, id){
	return undefined !== playlist.find( item => {
		const trackId = item.split(":")[0];

		return trackId === id;
	});
}

module.exports = isInPlaylist;
