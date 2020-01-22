const ApolloClient = require("apollo-boost").default;
const fetch = require("node-fetch");
require("dotenv").config();

const faunaUri = "https://graphql.fauna.com/graphql";

const client = new ApolloClient({
	uri: faunaUri,
	fetch,
	request: operation => {
		operation.setContext({
			headers: {
				"Authorization": `Bearer ${process.env.FAUNADB_SECRET}`
			}
		});
	}
});

module.exports = client;
