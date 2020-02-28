const client = require("../util/ApolloClient");
const gql = require("graphql-tag");

/**
 * Refresh access token of provided party.
 * @param {object} party Instance of party to refresh.
 */
async function refresh (party){
	const result = await party.refreshAccessToken();
	const accessToken = result.body["access_token"];
	const refreshToken = result.body["refresh_token"] || party.refreshToken;

	const updateAccessToken = gql`
		mutation {
			partialUpdateParty(id: "${party.ID}", data: {
				accessToken: "${accessToken}"
				refreshToken: "${refreshToken}"
			}){
				accessToken
				refreshToken
				owner
			}
		}
		`;

	const update = await client.mutation({ mutate: updateAccessToken });

	party.setAccessToken(update.data.updateParty.accessToken);
	party.setRefreshToken(update.data.updateParty.refreshToken);
	return true;
}

module.exports = refresh;
