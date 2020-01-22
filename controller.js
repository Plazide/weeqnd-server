const gql = require("graphql-tag");
const client = require("./util/ApolloClient");
const Party = require("./models/Party");

class Controller{
	constructor (){
		this.parties = [];
		this.io = null;
	}

	async init (io){
		this.io = io;

		const allParty = gql`
		query {
			allParty{
				data{
					code
					owner
					users
					fallbackPlaylist
					playlist
					accessToken
					refreshToken
					_id
				}
			}
		}`;

		const result = await client.query({ query: allParty });
		const parties = result.data.allParty.data;
		parties.forEach( item => {
			const party = new Party({ ...item, ws: this.io });
			this.parties.push(party);
			// console.log(this.parties);
		});
	}
}

const controller = new Controller();

module.exports = controller;
