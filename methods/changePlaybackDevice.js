const client = require("../util/ApolloClient");
const gql = require("graphql-tag");

async function changePlaybackDevice(data, socket){
	console.log(data);

	try{
		const updateParty = gql`
		mutation {
			partialUpdateParty (id: ${this._id}, data: {
				playbackDevice: "${data}"
			}){
				playbackDevice
			}
		}
		`;

		const updatedParty = await client.mutate({ mutation: updateParty });
		const playbackDevice = updatedParty.data.partialUpdateParty.playbackDevice;

		console.log(data);

		if(data === playbackDevice){
			await this.transferMyPlayback( { deviceIds: [data], play: true });

			this.playbackDevice = playbackDevice;
			socket.emit("success", { type: "playback_device_updated" });
			this.io.emit("playback_device_updated");
		}else{ socket.emit("err", { type: "playback_device_update_failed" }); };
	}catch(err){
		console.error(err);

		socket.emit("err", { type: "playback_device_update_failed" });
	}
}

module.exports = changePlaybackDevice;
