const client = require("../util/ApolloClient");
const gql = require("graphql-tag");

/**
 * Refresh access token of provided party.
 */
async function refresh (){
	const result = await this.refreshAccessToken().catch( err => err);
	const accessToken = result.body["access_token"];
	const refreshToken = result.body["refresh_token"] || this.refreshToken;

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

	const update = await client.mutate({ mutation: updateAccessToken });

	this.setAccessToken(update.data.partialUpdateParty.accessToken);
	this.setRefreshToken(update.data.partialUpdateParty.refreshToken);
	return true;
}

module.exports = refresh;
