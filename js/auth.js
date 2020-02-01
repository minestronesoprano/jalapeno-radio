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