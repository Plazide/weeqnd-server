const client = require("../util/ApolloClient");
const gql = require("graphql-tag");

/**
 * Refresh access token of provided party.
 */
async function refresh (){
	try{
		console.log("Refreshing access token...");

		const result = await this.refreshAccessToken().catch( err => {
			console.error(err);

			return err;
		});

		const accessToken = result.body["access_token"];
		const refreshToken = result.body["refresh_token"] || this.getRefreshToken();

		this.setAccessToken(accessToken);
		this.setRefreshToken(refreshToken);

		const updateAccessToken = gql`
			mutation {
				partialUpdateParty(id: "${this._id}", data: {
					accessToken: "${accessToken}"
					refreshToken: "${refreshToken}"
				}){
					accessToken
					refreshToken
					owner
				}
			}
			`;
		await client.mutate({ mutation: updateAccessToken });

		// Notify owner of the party that access token changed.
		const ownerSocket = this.getOwner();
		ownerSocket.emit("refreshed_token", { accessToken });

		console.log("Access token refreshed!");
		return true;
	}catch(err){
		if(err)	throw Error("Failed to refresh access token", err);

		return false;
	}
}

module.exports = refresh;