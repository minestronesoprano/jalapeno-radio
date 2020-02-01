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

window.onSpotifyWebPlaybackSDKReady = () => {
	  const player = new Spotify.Player({
	    name: "Spotify Web Playback SDK",
	    getOAuthToken: callback => { callback(access_token); }
	  });

	  // Error handling
	  player.addListener('initialization_error', ({ message }) => { console.error(message); });
	  player.addListener('authentication_error', ({ message }) => { console.error(message); });
	  player.addListener('account_error', ({ message }) => { console.error(message); });
	  player.addListener('playback_error', ({ message }) => { console.error(message); });

	   // Playback status updates
	  player.addListener('player_state_changed', state => {
	  	console.log(state);
	  	if (state.paused) {
	  		document.getElementByID("playpause").innerHTML = "▶️"
	  	} else {
	  		document.getElementByID("playpause").innerHTML = "⏸️"
	  	}
	  });

	  // Ready
	  player.addListener('ready', ({ device_id }) => {
	    console.log('Ready with Device ID', device_id);
	  });

	  // Not Ready
	  player.addListener('not_ready', ({ device_id }) => {
	    console.log('Device ID has gone offline', device_id);
	  });

	  // Connect to the player!
	  player.connect();
	};