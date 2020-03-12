const client = require("../util/ApolloClient");
const gql = require("graphql-tag");

async function deactivate (socket){
	try{
		const updateParty = gql`
		mutation {
			partialUpdateParty (id: ${this._id}, data: {
				active: false
			}){
				active
			}
		}`;

		const result = await client.mutate({ mutation: updateParty });
		const updatedParty = result.data.partialUpdateParty;

		if(updatedParty.active === false){
			this.active = false;
			this.io.emit("party_deactivated");
		}else{ socket.emit("err", { type: "party_deactivation_failed" }); }
	}catch(err){

	}
}

module.exports = deactivate;
