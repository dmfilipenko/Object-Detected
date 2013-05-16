var video = document.querySelector( 'video' );
navigator.getMedia = ( navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
navigator.getMedia( {video: true,audio: true},	// successCallback
	function ( localMediaStream ){
		video.src = window.URL.createObjectURL( localMediaStream );
		video.onloadedmetadata = function ( e ){
			// Do something with the video here.
		};
	},
	// errorCallback
	function ( err ){
		console.log( "The following error occured: " + err );
	}
);
var canvas = document.querySelector( 'canvas' );
var ctx = canvas.getContext('2d');
var imageData;
var pix;
function drwImage(){
	ctx.drawImage(video,0,0,video.width, video.height );
	imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	pix = imageData.data;
	for (var i = 0, n = pix.length; i < n; i += 4) {
		pix[i  ] = 255 - pix[i  ]; // red
		pix[i+1] = 255 - pix[i+1]; // green
		pix[i+2] = 255 - pix[i+2]; // blue
		// i+3 is alpha (the fourth element)
	}
	ctx.putImageData(imageData, 0, 0);
}

var pixelInfo = function(e){
	var mouseX, mouseY;
	if(e.offsetX) {
		mouseX = e.offsetX;
		mouseY = e.offsetY;
	}
	else if(e.layerX) {
		mouseX = e.layerX;
		mouseY = e.layerY;
	}
	var c = ctx.getImageData(mouseX, mouseY, 1, 1).data;
	var el = document.getElementById('status')
	el.innerHTML = c[0]+'-'+c[1]+'-'+c[2];
};

canvas.addEventListener('mousemove',pixelInfo)
//canvas.drawImage(img,0,0);
canvas.addEventListener('click',drwImage);