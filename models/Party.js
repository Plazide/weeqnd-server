const SpotifyWebApi = require("spotify-web-api-node");
const client = require("../util/ApolloClient");
const gql = require("graphql-tag");
require("dotenv").config();

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

class Party extends SpotifyWebApi{
	constructor ({ _id, code, owner, playlist, users, fallbackPlaylist, accessToken, refreshToken, io }){
		super();
		this.clientId = clientId;
		this.clientSecret = clientSecret;

		this._id = _id;
		this.code = code;
		this.owner = owner;
		this.playlist = playlist;
		this.users = users.data;
		this.fallbackPlaylist = fallbackPlaylist;
		this.accessToken = accessToken;
		this.refreshToken = refreshToken;
		this.io = io.of("/" + code);

		this.rejectedTokens = [];

		this.start();
	}

	setAccessToken (token){
		this.accessToken = token;
	}

	setRefreshToken (token){
		this.refreshToken = token;
	}

	start (){
		this.io.to(this.code);

		this.io.on("connection", async (socket) => {
			try{
				const accessToken = socket.handshake.query.accessToken;

				if(this.rejectedTokens.includes(accessToken)){
					socket.disconnect();
					return;
				}

				const spotify = new SpotifyWebApi({ accessToken });
				const me = await spotify.getMe().catch( err => {
					return err;
				});
				if(me.statusCode === 401){
					socket.emit("err", { type: "invalid_token" });
					socket.disconnect();
					return;
				}

				const username = me.body.id;

				const userFound = this.users.find( user => user.name === username);
				if(!userFound){
					this.rejectedTokens.push(accessToken);
					socket.disconnect();
					return;
				}

				socket.username = username;
				socket.join(this.code);

				socket.on("add-track", async data => {
					try{
						const{ trackId } = data;
						const status = await this.addTrack(trackId, socket.username);

						if(status === "conflict")
							socket.emit("err", { type: "track_exists" });

						if(status === "success"){
							this.io.emit("track_added", { trackId });
							socket.emit("success", { type: "track_added" });
						}
					}catch(err){
						console.error(err);
					}
				});
			}catch(err){
				throw new Error(err);
			}
		});
	}

	async refresh (){
		const result = await this.refreshAccessToken();
		const accessToken = result.body["access_token"];
		const refreshToken = result.body["refresh_token"] || this.refreshToken;

		const updateAccessToken = gql`
		mutation {
			partialUpdateParty(id: "${this.ID}", data: {
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

		this.setAccessToken(update.data.updateParty.accessToken);
		this.setRefreshToken(update.data.updateParty.refreshToken);
		return true;
	}

	async addTrack (id, username){
		try{
			if(this.playlist.includes(id))
				return"conflict";

			const track = id + ":" + username;
			this.playlist.push(track);

			const query = gql`
			mutation {
				updatePlaylist ( id: ${this._id}, data: ${track}){
					playlist
				}
			}
			`;

			await client.mutate({ mutation: query });
			return"success";
		}catch(err){
			console.error(err);

			return"error";
		}
	}
}

module.exports = Party;
