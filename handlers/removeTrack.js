async function removeTrack (data, socket, party){
	try{
		const status = await party.removeTrack(data, socket.username, party);
		const trackId = data.id + ":" + data.username + ":" + data.timeAdded;

		if(status === "not_allowed")
			socket.emit("err", { type: "wrong_track_user" });

		if(status === "conflict"){
			party.io.emit("track_removed", { trackId, playlist: party.playlist });
			socket.emit("success", { type: "track_already_gone" });
		}

		if(status === "success"){
			party.io.emit("track_removed", { trackId, playlist: party.playlist });
			socket.emit("success", { type: "track_removed" });
		}
	}catch(err) {
		socket.emit("err", { type: "unknown" });

		console.error(err);
	}
}

module.exports = removeTrack;
