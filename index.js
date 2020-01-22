const server = require("http").createServer();
const io = require("socket.io")(server);
const controller = require("./controller");

require("dotenv").config();

const port = process.env.PORT;

server.listen(port, (err) => {
	if(err) throw new Error(err);

	controller.init(io);
	console.log("Server listening to port", port);
});
