const client = require("../util/ApolloClient");
const gql = require("graphql-tag");
const spotifyHandler = require("../handlers/spotifyHandler");

async function activate(socket){
	try{
		const updateParty = gql`
		mutation {
			partialUpdateParty (id: ${this._id}, data: {
				active: true
			}){
				active
			}
		}`;

		const result = await client.mutate({ mutation: updateParty });
		const updatedParty = result.data.partialUpdateParty;

		if(updatedParty.active){
			this.active = true;
			this.io.emit("party_activated");

			spotifyHandler(this);
		}else{ socket.emit("err", { type: "party_activation_failed" }); }
	}catch(err){
		console.error(err);
	}
}

module.exports = activate;
