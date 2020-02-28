async function addTrack (data, socket, party){
	try{
		const{ trackId } = data;
		const status = await party.addTrack(trackId, socket.username, party);

		if(status === "conflict")
			socket.emit("err", { type: "track_exists" });

		if(status === "success"){
			party.io.emit("track_added", { trackId, playlist: party.playlist });
			socket.emit("success", { type: "track_added" });
		}
	}catch(err){
		socket.emit("err", { type: "unknown" });

		console.error(err);
	}
}

module.exports = addTrack;
