const uWS = require("uWebSockets.js");
const mysql = require("mysql");
const port = 8000;

var users = {};

const db = mysql.createConnection({
	host: "127.0.0.1",
	user: "root",
	password: "",
	database: "uws"
});

db.connect(function(err){
	if(err){
		console.log("fail to connect to db")
	}else{
		console.log("db connected");
		startServer();
	}
	
});

function startServer(){
	const app = uWS.App()
	.ws("/*",{
		compression: uWS.SHARED_COMPRESSOR,
		maxPayloadLength: 16 * 1024 * 1024,
		idleTimeout: 10,
		upgrade: (res, req, context) => {
			res.upgrade({
				url: req.getUrl(),
			},
			req.getHeader("sec-websocket-key"),
			req.getHeader("sec-websocket-protocol"),
			req.getHeader("sec-websocker-extensions"),
			context
			);
		},
		open: async (ws) => {
			users[ws.url] = ws;
			console.log(ws.url.substring(1) + " connected to server. ");
		},
		message: async (ws, message, isBinary) => {
			let decoder = new TextDecoder("utf-8");
			let m = decoder.decode(message);
			let mobj = JSON.parse(m);
			let from = ws.url;
			let to = "/" + mobj.to;
			console.log("Message received from: "+ from.substring(1) + " to " + to + " --> " + m)
			
			if(to == "/"){
					for(let i in users){
							users[i].send(from.substring(1) + " said: " + m);
						}
				}else{
				users[from].send(from.substring(1) + " said: " + m);
				
				if(users[to] != undefined){
						users[to].send(from.substring(1) + " said: " + m);
				}
			}
		},
		close: async (ws) => {
			console.log(ws.url.substring(1) + " disconnected from server");
		},
	})
	.listen(port, (token) => {
		if (token){
			console.log('listening to port ' + port);
		}else{
			console.log('failed to listen to port ' + port);
		};
	});
	
}