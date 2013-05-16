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
	w: 30,
	h: 30
}
var drwImage = function drwImage(){
	ctx.drawImage( video, 0, 0, video.width, video.height );
	imageData = ctx.getImageData( 0, 0, canvas.width, canvas.height );
	pix = imageData.data;
	var canW = canvas.width,
		box_1 = {};
		box_1['x_start'] = ( canW - rect_1.x - rect_1.w ) * 4;
		box_1['x_end'] = box_1.x_start + rect_1.w*4;
	console.log( 'box_1[\'x_start\']',box_1['x_end']);
	for ( var i = 0, n = pix.length; i < n; i += 4 ) {
		//		if ( pix[i  ] > 250 ){
		//			pix[i  ] = 0;
		//		} else{
		//			pix[i  ] = 255 - pix[i  ]; // red
		//		} if( )
		if ( pix[i] > 90 && pix[i + 1] > 40 && pix[i + 2] > 20 && (pix[i] - pix[i + 1]) > 15 && pix[i] > pix[i + 1] ) {
			pix[i   ] = 255
			pix[i + 1] = 255
			pix[i + 2] = 255
		} else {
			pix[i   ] = 0
			pix[i + 1] = 0
			pix[i + 2] = 0
		}

//		if ( ( i % box_1['x_start'] == ( 0 || 1600 ) ) &&  ( i % box_1['x_end'] == ( 0 || 1600)  ) ){
//			pix[i   ] = 255;
//			pix[i + 1] = 0
//			pix[i + 2] = 0
//		}
		//		pix[i   ] = (pix[i] > 90 && (pix[i] - pix[i + 1]) > 15) ? 255 : 255 - pix[i  ]; //r
		//		pix[i + 1] = (pix[i + 1] > 40) ? 0 : pix[i+1  ] = 255 - pix[i + 1  ]; //g
		//		pix[i + 2] = (pix[i + 2] > 20) ? 0 : 255 - pix[i + 2  ];  //b
		// i+3 is alpha (the fourth element)
	}

	ctx.putImageData( imageData, 0, 0 );
	ctx.fillStyle = "yellow";
	ctx.fillRect(rect_1.x,rect_1.y,rect_1.w,rect_1.h)
}
var drawRectangle = function( rect ){
		ctx.clearRect ( rect.x , rect.y , rect.w , rect.h );
		ctx.beginPath();
		rect.y -= 1;
		ctx.rect( rect.x, rect.y, rect.w, rect.h );
		ctx.fillStyle = "yellow";
		ctx.fill();
		ctx.closePath();
	if (isClicked){
		requestAnimFrame(function(){
			drawRectangle( rect_1 )
		} );
	}

}
var pixelInfo = function ( e ){
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
var init = function(){

	drwImage();
	requestAnimFrame( init );
}
canvas.addEventListener( 'mousemove', pixelInfo )
canvas.addEventListener( 'click', function(){
	if (!isClicked){
		isClicked = true;
	} else{
		isClicked = false;
	}
	drawRectangle( rect_1 );

} );