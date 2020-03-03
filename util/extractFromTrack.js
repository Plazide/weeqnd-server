function extractFromTrack (part, trackId){
	const indices = {
		"id": 0,
		"username": 1,
		"timeAdded": 2
	};

	return trackId.split(":")[indices[part]];
}

module.exports = extractFromTrack;
