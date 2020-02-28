const SpotifyWebApi = require("spotify-web-api-node");
const connectionHandler = require("../handlers/connectionHandler");

// Actions
const addTrack = require("../actions/addTrack");
const removeTrack = require("../actions/removeTrack");
const refresh = require("../actions/refresh");

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

		this.io.on("connection", socket => {
			connectionHandler(socket, this);
		});
	}
}

Party.prototype.addTrack = addTrack;
Party.prototype.removeTrack = removeTrack;
Party.prototype.refresh = refresh;

module.exports = Party;
