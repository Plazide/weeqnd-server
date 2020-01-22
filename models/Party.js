const SpotifyWebApi = require("spotify-web-api-node");
const client = require("../util/ApolloClient");
const gql = require("graphql-tag");
require("dotenv").config();

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

class Party extends SpotifyWebApi{
	constructor ({ _id, code, owner, users, fallbackPlaylist, ws }){
		super();
		this._id = _id;
		this.code = code;
		this.owner = owner;
		this.users = users;
		this.fallbackPlaylist = fallbackPlaylist;
		this.ws = ws;
		this.clientId = clientId;
		this.clientSecret = clientSecret;

		this.start();
	}

	start (){
		this.ws.on("connection", (socket) => {
			console.log("Client connected!");
		});
	}

	async refresh (){
		const result = await this.refreshAccessToken();
		const accessToken = result.body["access_token"];
		const refreshToken = result.body["refresh_token"] || this.refreshToken;

		const updateAccessToken = gql`
		mutation {
			updateParty(id: "${this.ID}", data: {
				accessToken: "${accessToken}"
				refreshToken: "${refreshToken}"
				owner: "${this.owner}"
				code: ${this.code}
				fallbackPlaylist: "${this.fallbackPlaylist}"
			}){
				accessToken
				refreshToken
			}
		}
		`;

		const update = await client.mutation({ mutate: updateAccessToken });

		this.setAccessToken(update.data.updateParty.accessToken);
		this.setRefreshToken(update.data.updateParty.refreshToken);
		return true;
	}
}

module.exports = Party;
