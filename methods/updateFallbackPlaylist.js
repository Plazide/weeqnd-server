const client = require("../util/ApolloClient");
const gql = require("graphql-tag");

async function updateFallbackPlaylist(data, socket){
	try{
		const updateParty = gql`
		mutation {
			partialUpdateParty (id: ${this._id}, data: {
				fallbackPlaylist: "${data}"
			}){
				fallbackPlaylist
			}
		}
		`;

		const updatedParty = await client.mutate({ mutation: updateParty });
		const fallbackPlaylist = updatedParty.data.partialUpdateParty.fallbackPlaylist;

		if(data === fallbackPlaylist){
			this.fallbackPlaylist = fallbackPlaylist;
			socket.emit("success", { type: "fallback_updated" });
			this.io.emit("fallback_updated");
		}else{ socket.emit("err", { type: "fallback_update_failed" }); };
	}catch(err){
		console.error(err);

		socket.emit("err", { type: "fallback_update_failed" });
	}
}

module.exports = updateFallbackPlaylist;
