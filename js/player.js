// Get the access info
var result = location.hash.split("&");
	// result[0] = access_token=###
	// result[1] = token_type=###
	// result[2] = expires_in=###
	// result[3] = state=###

	var access_token = result[0].split("=")[1];
	var token_type = result[1].split("=")[1];
	var expires_in = result[2].split("=")[1];
//var state = result[3].split("=")[1];

fetch("https://api.spotify.com/v1/audio-analysis/6EJiVf7U0p1BBfs0qqeb1f", {
	method: "GET",
	headers: {
		Authorization: `Bearer ${access_token}`
	}
})
.then(response => { console.debug(response.json()) });

buttonPP = document.getElementById('playpause');

function updatePlayPauseIcon(state) {
	iconStyle = document.getElementById('option-icons').selectedOptions[0].value;
	buttonPP.innerHTML = "";

	if (iconStyle == "d6016") {
		buttonPP.appendChild(document.createElement("img"));
		if (state.paused)	buttonPP.children[0].src = "images/jalaplay.png";
		else				buttonPP.children[0].src = "images/jalapause.png";
	} else if (iconStyle == "emoji") {
		if (state.paused)	buttonPP.innerHTML = "▶️";
		else				buttonPP.innerHTML = "⏸️";
	} else { //iconStyle == "FA"
		if (state.paused)	buttonPP.innerHTML = '<i class="fas fa-play-circle"></i>';
		else				buttonPP.innerHTML = '<i class="fas fa-pause-circle"></i>';
	}
}

var player;

window.onSpotifyWebPlaybackSDKReady = () => {
	player = new Spotify.Player({
		name: "Jalapeño - Spicy Radio",
		getOAuthToken: callback => { callback(access_token); }
	});

	// Error handling
	player.addListener('initialization_error',	({ message }) => { console.error(message); });
	player.addListener('authentication_error',	({ message }) => { console.error(message); });
	player.addListener('account_error',			({ message }) => { console.error(message); });
	player.addListener('playback_error',		({ message }) => { console.error(message); });

	// Playback status updates
	player.addListener('player_state_changed', state => {
		console.log(state);

		updatePlayPauseIcon(state);

		var track_title		= state.track_window.current_track.name;
		var track_album 	= state.track_window.current_track.album.name;
		var track_album_art = state.track_window.current_track.album.images[0].url;
		var track_artist	= state.track_window.current_track.artists[0].name;

		document.getElementById("track").innerHTML	= track_title;
		document.getElementById("artist").innerHTML	= track_artist;
		document.getElementById("album").innerHTML	= track_album;
		document.getElementById("art").src			= track_album_art;
		document.getElementById("art").hidden		= false;

		document.title = track_artist + " - " + track_title;
	});

	// Ready
	player.addListener('ready', ({ device_id }) => {
		console.log('Ready with Device ID', device_id);

		fetch("https://api.spotify.com/v1/me/player", {
			method: "PUT",
			headers: {
				Authorization: `Bearer ${access_token}`
			},
			body: `{"device_ids":["${device_id}"]}`
		});

		v_slider = document.getElementById('volume');
		v_label = document.getElementById('vol_label');

		v_slider.onchange = function () {
			if (v_slider.value > 50) v_label.innerHTML = "<i class='fas fa-volume-up'></i>";
			else if (v_slider.value == 0) v_label.innerHTML = "<i class='fas fa-volume-off'></i>";
			else v_label.innerHTML = "<i class='fas fa-volume-down'></i>";

			player.setVolume(v_slider.value / 100);
		}
	});

	// Not Ready
	player.addListener('not_ready', ({ device_id }) => {
		console.log('Device ID has gone offline', device_id);
	});

	document.getElementById("prev").onclick = () => {
		player.previousTrack().then(() => console.log('Set to previous track'));
	}

	document.getElementById("next").onclick = () => {
		player.nextTrack().then(() => console.log("Set to next track."));
	}

	buttonPP.onclick = () => {
		player.togglePlay().then(() => console.log('Toggled playback'));
	};

	// Connect to the player!
	player.connect();
};

buttonPV = document.getElementById('prev');
buttonNX = document.getElementById('next');

function changeIcons() {
	player.getCurrentState().then(state => {
		updatePlayPauseIcon(state);
	});

	iconStyle = document.getElementById('option-icons').selectedOptions[0].value;
	buttonPV.innerHTML = "";
	buttonNX.innerHTML = "";

	if (iconStyle == "d6016") {
		buttonPV.appendChild(document.createElement("img"));
		buttonNX.appendChild(document.createElement("img"));
		buttonPV.children[0].src = "images/jalaback.png";
		buttonNX.children[0].src = "images/jalaforward.png";
	} else if (iconStyle == "emoji") {
		buttonPV.innerHTML = "⏮️";
		buttonNX.innerHTML = "⏭️";
	} else { //iconStyle == "FA"
		buttonPV.innerHTML = '<i class="fas fa-step-backward"></i>';
		buttonNX.innerHTML = '<i class="fas fa-step-forward"></i>';
	}
}

document.getElementById('options').oninput = changeIcons;
changeIcons();