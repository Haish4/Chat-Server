var ws = null;
	
	let connect = document.getElementById("start");
	let send = document.getElementById("send");
	
	
	connect.addEventListener("click", function(){
		let id = document.getElementById("id").value;
		startServer(id);
	});
	
	send.addEventListener("click", function(){
		let message = document.getElementById("message").value;
		let to = document.getElementById("to").value;
		
		if(ws != null){
			ws.send(JSON.stringify({
				message: message,
				to: to
			}));
		}else{
			alert("No connection started");
	}
	});
	
	
	
	function startServer(id = ""){
		let res = document.getElementById("response");
		ws = new WebSocket("ws://localhost:8000/"+ id);
		
		ws.onopen = function(){
			res.innerHTML += ws.url.substring(20) + " is online.<br />";
		};
		
		ws.onmessage = function(data){
		let m = data.data;
		res.innerHTML += m + "<br />";
		};
		
		ws.onclose = function(){
		res.innerHTML += "Disconnect from server<br />";
		};
		
		ws.onerror = function(){
		res.innerHTML += "Error<br />";
		};
	}
	
	