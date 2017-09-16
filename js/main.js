window.onload = function () {

	//Define variables
	var status, url, picture, x = 0;
	var twitchStreamers = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];

	//Define functions
	function updateHTML (section) {
		$(section).append('<div class="twitch"><div class="row"><div class="one-third column"><div class="image-holder" id="user-image-' + x + '"></div></div><div class="two-thirds column"><span class="status-message">' + status + '</span></div></div></div>');		
		if (section == ".online" || section == ".offline") { //If users are online or offline, load profile images
			$("#user-image-" + x).css({
				background: picture,
				'background-size': '55px'
			});
		}
		x++;
	}

	function updateOfflineUsers () { //If users are offline, make new ajax request to find user info
		$.ajax({
			url: "https://wind-bow.gomix.me/twitch-api/channels/" + url,
			dataType: "jsonp",
			data: {format: "json"},
			success: function (json) {
				status = "Channel " + "'<a href='" + json.url + "' target='_blank'" + "'>" + json.display_name + "</a>'" + " is currently offline";
				if (json.logo !== null) {
					picture = 'url("' + json.logo + '")';
				}
				else {
					picture = 'url("https://cdn.rawgit.com/ayoisaiah/freeCodeCamp/master/twitch/images/placeholder-2.jpg")';
				}
				updateHTML(".offline");
			}
		});
	}
	
	function fetchData (data) {
		console.log(data);
		if (data.stream === null) {
			url = data._links.channel.substr(38);
			updateOfflineUsers();
		}

		else if (data.status == 422 || data.status == 404) {
			status = data.message;
			updateHTML(".unavailable");
		}

		else {
			if (data.stream.channel.logo !== null) {
				picture = 'url("' + data.stream.channel.logo + '")';
			}

			else {
				picture = 'url("https://cdn.rawgit.com/ayoisaiah/freeCodeCamp/master/twitch/images/placeholder-2.jpg")';
			}
			url = data._links.channel.substr(38);
			status = "<a href='https://twitch.tv/" + url + "' target='_blank'" + "'>" + data.stream.channel.display_name +  "</a>" + " is currently streaming " + data.stream.game;
			updateHTML(".online");
		}
	}

	function ajax () {
		$.ajax({
			url: "https://wind-bow.gomix.me/twitch-api/streams/" + twitchStreamers[i] + "?callback=?",
			dataType: "jsonp",
			data: {
				format: "json"
			},

			success: function (data) {
				fetchData(data);
			},

			error: function () {
				console.log("unable to access json");
			}
		});
	}

	function showOnline () { //Show only online users
		$(".offline-users, .all-users").removeClass('focus');
		$(".online-users").addClass('focus');
		$(".offline, .unavailable").addClass('hidden');
		$(".online").removeClass('hidden');
	}

	function showOffline () { //Show only offline users
		$(".online-users, .all-users").removeClass('focus');
		$(".offline-users").addClass('focus');
		$(".offline, .unavailable").removeClass('hidden');
		$(".online").addClass('hidden');
	}

	function showAll () { //Show all users
		$(".offline-users, .online-users").removeClass('focus');
		$(".all-users").addClass('focus');
		$(".online, .offline, .unavailable").removeClass('hidden');	
	}

	//Loop
	for (var i = 0; i < twitchStreamers.length; i++) {
		ajax();
	}

	//Search Function	
	function search () {
		$(".online, .offline, .unavailable").empty();
		showAll();	
		var searchQuery = $(".search-twitch").val();
		var user = searchQuery.replace(/[^A-Z0-9_]/ig, "");
		$.ajax({
			url: "https://wind-bow.gomix.me/twitch-api/streams/" + user,
			dataType: "jsonp",
			data: {
				format: "json"
			},

			success: function (data) {
				fetchData(data);					
			}
		});
	}

	$(".search-twitch-btn").click(function () {
		search();
	});

	$(".search-twitch").keypress(function(event) {
		if (event.keyCode === 13) {
			event.preventDefault();
			search();
		}
	});

	//Buttons
	$(".online-users").click(function () {
		showOnline();
	});

	$(".offline-users").click(function () {
		showOffline();
	});

	$(".all-users").click(function () {
		showAll();
	});
};