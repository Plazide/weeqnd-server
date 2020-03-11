const SpotifyWebApi = require("spotify-web-api-node");

// Handlers
const connectionHandler = require("../handlers/connectionHandler");
const spotifyHandler = require("../handlers/spotifyHandler");

// Actions
const addTrack = require("../methods/addTrack");
const removeTrack = require("../methods/removeTrack");
const refresh = require("../methods/refresh");
const getOwner = require("../methods/getOwner");
const updateCurrentTrack = require("../methods/updateCurrentTrack");

require("dotenv").config();

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

class Party extends SpotifyWebApi{
	constructor ({ _id, code, owner, playlist, users, fallbackPlaylist, refreshToken, accessToken, io }){
		super({ clientId, clientSecret, refreshToken, accessToken });

		this._id = _id;
		this.code = code;
		this.owner = owner;
		this.playlist = playlist;
		this.users = users.data;
		this.fallbackPlaylist = fallbackPlaylist;
		this.io = io.of("/" + code);
		this.active = true;

		this.rejectedTokens = [];

		this.start();
	}

	start (){
		this.io.to(this.code);

		spotifyHandler(this);

		this.io.on("connection", socket => {
			connectionHandler(socket, this);
		});
	}
}

Party.prototype.addTrack = addTrack;
Party.prototype.removeTrack = removeTrack;
Party.prototype.refresh = refresh;
Party.prototype.getOwner = getOwner;
Party.prototype.updateCurrentTrack = updateCurrentTrack;

module.exports = Party;
