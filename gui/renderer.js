$(document).ready(function() {
	var username = "";
	var users= {};
	var nr = 0;
	var	user_id = "";
	var name = "";
	var decoder = new TextDecoder("utf-8");
	var interlocutor = "";
	var PORT = 3000;
	var HOST = '224.0.0.224';
	var dgram = require('dgram');

	$(".title").fadeIn(800, function() {
    	$("#enter-username").fadeIn(600, function() {
  		});
  	});

	$("#confirm-user").click(function (){
		username = $("#username").val();
		if (isInvalidUsername(username)){
			alert("Username is in invalid form Or is too long")
		}
		else{
			$("#username-page").fadeOut(600);
			start_server();
			$("#chat").fadeIn(600);
			document.title =  username + " LAN CHAT " ;
			var effects = document.createElement('script');
			effects.setAttribute('src','linkers/effect.js');
			document.head.appendChild(effects);
		}
	})

    function start_server(){
    	var spawn = require('child_process').spawn,
		py = spawn('python', ['../chat/chat.py'])
		py.stdout.on('data', function(data){
			val = decoder.decode(data).replace(/\n/g, "");
			if (nr == 0){
				user_id = val
				sendMessage(username,"all", "online")
			}else{
				try{
					
					var messages = val.split("|END|");

					for (j = 0; j < messages.length; ++j){
						var message = parseMessage(messages[j]);
						//console.dir(message);

					if (message.type == "simple"){
						users[message.from].messages.push(message);
						if (message.from == interlocutor){
							messageToHtml(message, "from");
						}
					} else if (message.type == "online"){
						if (message.to == "all"){
    						sendMessage(username, message.from, "online");
						}
						addUser(message.msg, message.from);
					}
				}	
			}
				catch(err){
					//console.dir(err);
				}
			}
			nr++;
			//console.log(val);
			//console.log(users);
		})
    }

    $("#send").click(function(){
    	var text = $("#msg-input").val();
    	$("#msg-input").val("");
    	if (text.length > 0){
    		var message = {};

    		text = text.replace(/\|/g, ' ')

    		message.msg = text;
			message.to = interlocutor;
			message.from = user_id;
			message.type = "simple";
			message.time = new Date().toLocaleString();
    		sendMessage(text, interlocutor, "simple", message.time);
			users[message.to].messages.push(message);
    		messageToHtml(message, "to");
    	}
    })

    function messageToHtml(message, type){
    	var html = '<div class="message-' + type + '">' +
			 message.msg + 
			'<div class="time">' + message.time + ' </div>' + 
			'</div>' + 
			'<br><br><br><br><br>';
		$('#message-list').append(html);
		$('#message-list').scrollTop($('#message-list')[0].scrollHeight);
    }


    function displayMessages(interlocutor){
    	$('#message-list').html("");
    	var messages = users[interlocutor].messages;
    	for (i = 0; i < messages.length; ++i) {
    		if (!$.isEmptyObject(messages[i])){
    			if (messages[i].from == user_id){
    			messageToHtml(messages[i], "to");
    		}
    		else {
    			messageToHtml(messages[i], "from");
    		}
    	}
    }
}

    $('body').on('click', '.user-badge', function() {
    	$("#chat-windows").show();
    	$('.user-badge').removeClass("selected");
    	$(this).addClass("selected");
    	interlocutor = $(this).children("input:hidden").val();
    	//console.dir(interlocutor);
    	displayMessages(interlocutor);
    });

    function parseMessage(val){
    	var elements = val.split("|");
		var message = {};

		message.msg = elements[0];
		message.to = elements[1];
		message.from = elements[2];
		message.type = elements[3];
		message.time = elements[4];
		return message;
    }

    $('input').keypress(function (e) {
	  if (e.which == 13) {
	    if ($("#msg-input").is(':focus')){
	    	$("#send").click();
	    }
	    else if ($("#username").is(':focus')){
	    	$("#confirm-user").click();
	    }
	  }
	});

    function sendMessage(msg, to, type, time){
    	if (time == null || time == "undefined"){
			time = new Date().toLocaleString();
		}
		var message = msg + "|" + to + "|" + user_id + "|" + type + "|" + time;
			to_send = new Buffer(message);

		var client = dgram.createSocket('udp4');
		client.send(message, 0, message.length, PORT, HOST, function(err, bytes) {
			if (err) throw err;
			//console.log('UDP message sent to ' + HOST +':'+ PORT);
			client.close();
		});
    }
	
	$('#testam').click(function (){
		var spawn2 = require('child_process').spawn
		var py2 = spawn2('python', ['../chat/sender.py'])
		var to = document.getElementById("to").value;
		var msg = document.getElementById("msg").value;

		py2.stdin.write(msg + "|" + to + "|" + user_id + "|" + "simple");
		py2.stdin.end();
	})

	function addUser(username, id){
		users[id] = {"username" : username,
					 "messages" : [{}]};

		var html = '<div class="user-badge">' +
			'<i class="fas fa-user" style="font-size:23px;"></i>' + 
			' <b>' + username + '</b>' + 
			'<input type="hidden" value="' +  id + '">'
			'</div>'

		$('#users').append(html);
		//console.log(users[id]);
	}

	function isInvalidUsername(username){
		if (typeof(username) == "undefined" ||
		username == null ||
		username.length == 0 ||
		username.length > 9 ||
		/\s/.test(username) ||
		/[^a-zA-Z0-9_]/.test(username) ||
		/^[0-9]/.test(username)){
		return true;
		}
	}

});