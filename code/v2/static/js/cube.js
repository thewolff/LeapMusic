var volOutputX = 0;
var volOutputY = 0;
var volOutputZ = 0;	
var yThreshold = 300.0;//max out at millimeters away from sensor
var yVal = 0;

var Cube = {
	init : function(param){
		
	},

	loop: function(frame){		
		var hand = frame.hands[0];//not accounting for two hands - not sure what Bryan's intention was
	    
		if(hand && hand.palmPosition){
			yVal = hand.palmPosition;
	  		if(yVal && yVal[1]){
	  			var volChangeX = parseFloat(yVal[0].toFixed(1));
	  			volOutputX = volChangeX/yThreshold;

	  			var volChangeY = parseFloat(yVal[1].toFixed(1));
	  			volOutputY = volChangeY/yThreshold;

	  			var volChangeZ = parseFloat(yVal[2].toFixed(1));
	  			volOutputZ = volChangeZ/yThreshold;
	  		}
		}		

		var x = volOutputX*360;
	    var y = volOutputY*360;	
	    var z = volOutputZ*360;	    

		$('#cube').css('-webkit-transform', 'rotate3d('+x+', '+y+', '+z+', '+x+'deg)');
		$('#cube').css('-webkit-transform', 'rotate3d('+x+', '+y+', '+z+', '+y+'deg)');
		$('#cube').css('-webkit-transform', 'rotate3d('+x+', '+y+', '+z+', '+z+'deg)');
		
		/*
		$('#cube').css('-moz-transform', 'rotate3d('+x+', '+y+', '+z+', '+z+'deg)');
		$('#cube').css('-ms-transform', 'rotate3d('+x+', '+y+', '+z+', '+z+'deg)');
		$('#cube').css('-o-transform', 'rotate3d('+x+', '+y+', '+z+', '+z+'deg)');
		$('#cube').css('transform', 'rotate3d('+x+', '+y+', '+z+', '+z+'deg)');
		*/
	}
}

Cube.init();

Leap.loop(function(frame) { 
	Cube.loop(frame);	
});




