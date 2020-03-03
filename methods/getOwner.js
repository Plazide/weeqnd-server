function getOwner (){
	const party = this;

	const sockets = party.io.sockets;
	const clients = Object.keys(sockets);
	const ownerClient = clients.find( client => {
		if(sockets[client].username === party.owner)
			return true;
	});

	const ownerSocket = sockets[ownerClient];
	return ownerSocket;
}

module.exports = getOwner;
