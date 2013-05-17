var video = document.querySelector( 'video' );
navigator.getMedia = ( navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
navigator.getMedia( {video: true, audio: true},	// successCallback
	function ( localMediaStream ) {
		video.src = window.URL.createObjectURL( localMediaStream );
		video.onloadedmetadata = function ( e ) {
			// Do something with the video here.
		};
	},
	// errorCallback
	function ( err ) {
		console.log( "The following error occured: " + err );
	}
);
var canvas = document.querySelector( 'canvas' );
var ctx = canvas.getContext( '2d' );
ctx.translate( canvas.width, 0 );
ctx.scale( -1, 1 );
var imageData;
var pix;
window.requestAnimFrame = (function () {
	return  window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function ( callback ) {
			window.setTimeout( callback, 1000 / 60 );
		}
})();
var isClicked = false
var rect_1 = {
	x: 150,
	y: 200,
	w: 30,
	h: 30
}
var lastImageData;
var drwImage = function drwImage () {
	ctx.drawImage( video, 0, 0, video.width, video.height );
//	imageData = ctx.getImageData( 0, 0, canvas.width, canvas.height );
//	pix = imageData.data;
//	var canW = canvas.width,
//		box_1 = {};
//		box_1['x_start'] = ( canW - rect_1.x - rect_1.w ) * 4;
//		box_1['x_end'] = box_1.x_start + rect_1.w*4;
//	console.log( 'box_1[\'x_start\']',box_1['x_end']);


	var width = canvas.width;
	var height = canvas.height;
	// get webcam image data
	var sourceData = ctx.getImageData( 0, 0, width, height );
	// create an image if the previous image doesn’t exist
	if ( !lastImageData ) lastImageData = ctx.getImageData( 0, 0, width, height );
	// create a ImageData instance to receive the blended result
	var blendedData = ctx.createImageData( width, height );
	// blend the 2 images

//		//		if ( pix[i  ] > 250 ){
//		//			pix[i  ] = 0;
//		//		} else{
//		//			pix[i  ] = 255 - pix[i  ]; // red
//		//		} if( )
	differenceAccuracy( blendedData.data, sourceData.data, lastImageData.data );
//
////		if ( ( i % box_1['x_start'] == ( 0 || 1600 ) ) &&  ( i % box_1['x_end'] == ( 0 || 1600)  ) ){
////			pix[i   ] = 255;
////			pix[i + 1] = 0
////			pix[i + 2] = 0
////		}
//		//		pix[i   ] = (pix[i] > 90 && (pix[i] - pix[i + 1]) > 15) ? 255 : 255 - pix[i  ]; //r
//		//		pix[i + 1] = (pix[i + 1] > 40) ? 0 : pix[i+1  ] = 255 - pix[i + 1  ]; //g
//		//		pix[i + 2] = (pix[i + 2] > 20) ? 0 : 255 - pix[i + 2  ];  //b
//		// i+3 is alpha (the fourth element)

//	differenceAccuracy( blendedData.data, sourceData.data, lastImageData.data );
// draw the result in a canvas
	ctx.putImageData( blendedData, 0, 0 );
// store the current webcam image
	lastImageData = sourceData;
//	ctx.putImageData( imageData, 0, 0 );
	ctx.fillStyle = "yellow";
	ctx.fillRect( rect_1.x, rect_1.y, rect_1.w, rect_1.h )
}
function fastAbs ( value ) {
	// funky bitwise, equal Math.abs
	return (value ^ (value >> 31)) - (value >> 31);
}
var drawRectangle = function ( rect ) {
	ctx.clearRect( rect.x, rect.y, rect.w, rect.h );
	ctx.beginPath();
	rect.y -= 1;
	ctx.rect( rect.x, rect.y, rect.w, rect.h );
	ctx.fillStyle = "yellow";
	ctx.fill();
	ctx.closePath();
	if ( isClicked ) {
		requestAnimFrame( function () {
			drawRectangle( rect_1 )
		} );
	}

}
function threshold ( value ) {
	return (value > 0x15) ? 0xFF : 0;
}


function differenceAccuracy ( target, data1, data2, i ) {
	if ( data1.length != data2.length ) return null;
	var i = 0;
	while (i < (data1.length * 0.25)) {
//		if ( data1[i * 4] > 90 && data1[i * 4 + 1] > 40 && data1[i * 4 + 2] > 20 && (data1[i * 4] - data1[i * 4 + 1]) > 15 && data1[i * 4] > data1[i * 4 + 1]){
//			console.log('data ok')
//		}
		var average1 = (data1[4 * i] + data1[i + 1] + data1[4 * i + 2]) / 3;
		var average2 = (data2[4 * i] + data2[ i + 1] + data2[4 * i + 2]) / 3;
		var diff = threshold( fastAbs( average1 - average2 ) );
		target[4 * i] = diff;
		target[4 * i + 1] = diff;
		target[4 * i + 2] = diff;
		target[4 * i + 3] = 0xFF;
		++i;
//		}
	}
}
var pixelInfo = function ( e ) {
	var mouseX, mouseY;
	if ( e.offsetX ) {
		mouseX = e.offsetX;
		mouseY = e.offsetY;
	}
	else if ( e.layerX ) {
		mouseX = e.layerX;
		mouseY = e.layerY;
	}
	var c = ctx.getImageData( mouseX, mouseY, 1, 1 ).data;
	var el = document.getElementById( 'status' )
	el.innerHTML = c[0] + '-' + c[1] + '-' + c[2];
};
var init = function () {

	drwImage();
	requestAnimFrame( init );
}
canvas.addEventListener( 'mousemove', pixelInfo )
canvas.addEventListener( 'click', function () {
	if ( !isClicked ) {
		isClicked = true;
	} else {
		isClicked = false;
	}
	drawRectangle( rect_1 );

} );