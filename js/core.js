var video = document.querySelector( 'video' );
navigator.getMedia = ( navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
navigator.getMedia( {video: true, audio: true},	// successCallback
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
var ctx = canvas.getContext( '2d' );
ctx.translate( canvas.width, 0 );
ctx.scale( -1, 1 );
var imageData;
var pix;
window.requestAnimFrame = (function (){
	return  window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function ( callback ){
			window.setTimeout( callback, 1000 / 60 );
		}
})();
var isClicked = false
var rect_1 = {
	x: 150,
	y: 200,
	w: 70,
	h: 70
}
var lastImageData;

function fastAbs( value ){
	// funky bitwise, equal Math.abs
	return (value ^ (value >> 31)) - (value >> 31);
}
var drawRectangle = function ( rect, stat ){
	if ( stat ){
		ctx.clearRect( rect.x, rect.y, rect.w, rect.h );
		rect.x += 0.4;
		requestAnimFrame( function (){
			drawRectangle( rect_1 )
		} );
	}

//	if ( !isClicked ) {
//		requestAnimFrame( function (){
//			drawRectangle( rect_1 )
//		} );
//	}

}
function threshold( value ){
	return (value > 0x15) ? 0xFF : 0;
}
function differenceAccuracy( target, data1, data2, count ){
	if ( data1.length != data2.length ) return null;
	var average1 = (data1[4 * count] + data1[count * 4 + 1] + data1[4 * count + 2]) / 3;
	var average2 = (data2[4 * count] + data2[ count * 4 + 1] + data2[4 * count + 2]) / 3;
	var diff = threshold( fastAbs( average1 - average2 ) );
	target[4 * count] = diff;
	target[4 * count + 1] = diff;
	target[4 * count + 2] = diff;
	target[4 * count + 3] = 0xFF;
}
var drwImage = function drwImage(){
	ctx.drawImage( video, 0, 0, video.width, video.height );
	var width = canvas.width;
	var height = canvas.height;
	var sourceData = ctx.getImageData( 0, 0, width, height );
	if ( !lastImageData ) lastImageData = ctx.getImageData( 0, 0, width, height );
	var blendedData = ctx.createImageData( width, height );
	var i = 0;
	var blendedArray = [];
	while ( i < (sourceData.data.length * 0.25) ) {
		blendedData.data[4 * i] = 0;
		blendedData.data[4 * i + 1] = 0;
		blendedData.data[4 * i + 2] = 0;
		blendedData.data[4 * i + 3] = 0xFF;
		if ( sourceData.data[i * 4] > 90 && sourceData.data[i * 4 + 1] > 40 && sourceData.data[i * 4 + 2] > 20 && (sourceData.data[i * 4] - sourceData.data[i * 4 + 1]) > 15 && sourceData.data[i * 4] > sourceData.data[i * 4 + 1] ) {
			differenceAccuracy( blendedData.data, sourceData.data, lastImageData.data, i );
			blendedArray.push(i*4);
		}
		++i;
	}

	ctx.putImageData( blendedData, 0, 0 );
	lastImageData = sourceData;
	var editCanvasCtx = ctx.getImageData( 0, 0, width, height );
	var cubeCoordRight = [], cubeCoordLeft = [];
	for (var i = 0; i < editCanvasCtx.data.length; i+=4){
		if( i % 1600 >= 1600 - rect_1.x*4 - rect_1.w*4 && i % 1600 < 1600 - ( rect_1.x*4 ) && i >= rect_1.y*1600 && i < (rect_1.y + rect_1.h)*1600){ //x coordinate
			editCanvasCtx.data[i] = 255;
			editCanvasCtx.data[i+1] = 0;
			editCanvasCtx.data[i+2] = 0;
			if( i % (rect_1.w*4 -1) == 0 ){
				cubeCoordRight.push(i);
			}
			if( i % (rect_1.w*4) == 0 ){
				cubeCoordLeft.push(i);
			}
		}
	}

	for ( var i = 0, length = cubeCoordRight.length; i < length; i++){
		if ( _.indexOf(blendedArray, cubeCoordRight[i] ) != -1){
			isClicked = true;
		}
	}
//	for ( var i = 0, length = cubeCoordLeft.length; i < length; i++){
//		if ( _.indexOf(blendedArray, cubeCoordLeft[i] ) != -1){
//			isClicked = false;
//		}
//	}
	drawRectangle( rect_1, isClicked );
	ctx.putImageData( editCanvasCtx, 0, 0 );



//	ctx.fillStyle = "yellow";
//	ctx.fillRect( rect_1.x, rect_1.y, rect_1.w, rect_1.h );


}
var init = function (){
	drwImage();
	requestAnimFrame( init );
}
canvas.addEventListener( 'click', function (){
	if ( !isClicked ) {
		isClicked = true;
	} else {
		isClicked = false;
	}
	drawRectangle( rect_1 );

} );