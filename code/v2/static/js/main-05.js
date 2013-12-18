
var counter = 0;

var Loop = function(param) {
		this.init(param);
	}

	Loop.prototype = {
		mp3 		: '',
		audio 		: null,
		mediagroup	: 'mediagroup',
		muted		: true,
		loop		: true,
		controller	: null,
		id			: '',
		state		: 0,
		states		: ['pause', 'play'],
		param		: null,
		volume		: 1,
		pausing		: false,
		mixerBox	: '',

		init : function(param)
		{
			this.mp3 			= param.mp3;
			
			var audio 			= new Audio(this.mp3);
			audio.mediagroup 	= param.mediagroup || this.mediagroup;
			audio.muted 		= param.muted || param.muted === false ? param.muted : this.muted;
			audio.loop			= param.loop || param.loop === false ? param.loop : this.loop;
			this.id 			= this.mp3.substring(this.mp3.lastIndexOf('/') + 1, this.mp3.lastIndexOf('.'));
			audio.id			= this.id;
			audio.volume		= param.volume || this.volume;

			this.audio 			= audio;
			this.param			= param;

			//console.log(audio); 	
			this.mixerBox = MixerUI.createBox(audio.id, param.pointables);

			if (this.audio.muted) {
				MixerUI.muted(this.mixerBox);
				this.muteToggle(audio.id);
			} else {
				MixerUI.playing(this.mixerBox);
			}

			counter++;
		},

		play : function(id) {
			
			if (id !== this.id) {
				this.audio.play();
			} else {
				this.changeState(false);
			}
			// this gets tricky if it were to happen more than once;
			this.audio.volume = this.param.volume;
			this.pausing = false;

		},

		pause : function(id) {
			
			if (this.pausing) {
				return;
			}

			this.changeState(true);

		},

		muteToggle : function(id) {
			//console.log(this.audio.volume);
			if (this.audio.volume === 0) {
				this.audio.volume = 0.4;
				this.audio.muted = false;
				this.pausing = false;

				MixerUI.playing(this.mixerBox);

			} else {
				this.audio.volume = 0;
				this.pausing = true;
				this.audio.muted = true;
				MixerUI.muted(this.mixerBox);
			}

		},

		toggle : function(id) {
			this[this.states[1 - this.state]](id);
		},

		changeState : function(isMuted) {
			this.audio.muted = isMuted;
			this.state = 1 - this.state;
		}
	}

	var Controller = {
		loops		: {},
		state		: 0,
		states		: ['pause', 'play'],
		pointables	: [[], [], [], [], [], [], [], [], [], [], [], [], [], []],

		init	: function()
		{
			/*for (var i = loops.length; i--; ) {
				this.loops[loops[i].id] = loops[i];
				if (loops[i].param.pointables) {
					this.pointables[loops[i].param.pointables].push(loops[i].id);
				}
			}*/

			this.loopEm();
			this.keyPress();


		},

		keyPress : function() {
			$(window).keypress(function(ev) {
		       var key = ev.keyCode || ev.which;
		       key = String.fromCharCode(key);
		       //console.log(key);
		       $('.box').each(function( index ) {
  					
  					if (($(this).data('pointables')).toString() === key) {
  						console.log('hit it');
  						Controller.control($(this).attr('id'));
  					}

			   });

		   });
		},

		play	: function(id)
		{
			this.changeState('play', id);			
		},

		pause	: function(id)
		{
			this.changeState('pause', id);
		},

		mute	: function(id)
		{
			this.changeState('mute', id);
		},

		toggle	: function(id)
		{
			if (id) {
				this.loops[id].toggle(id);
			}
		},

		changeState	: function(state, id) {
			for (var i = 0, l = loops.length; i < l; ++i) {
				loops[i][state](id);
			}

			this.state = state;
		},

		control : function(id) {

			for (var i = 0, l = loops.length; i < l; ++i) {

				if (loops[i].id === id) {
					loops[i].muteToggle();
				}

			}

		},

		getFrame : function(frame) {
			//document.getElementById('status').innerHTML = 'Hands: ' + frame.hands.length + ', Pointables: ' + frame.pointables.length;
			this.raiseEvent(frame.pointables.length);
			
			if (!this.status && frame.hands.length && frame.pointables.length) this.play();
		},

		raiseEvent : function(pointables) {
			var playing = [];

			for (var p = 1; p <= pointables; ++p) {
				for (var i = 0, l = this.pointables[p].length; i < l; ++i) {
					playing.push(this.pointables[p][i]);
				}
			}

			for (var loop in this.loops) {
				if (playing.indexOf(loop) != -1) {
					//this.loops[loop].play(loop);

				} else {
					//pause
					//this.loops[loop].pause(loop);
				}
			}
		},

		loopEm : function() {
			//console.log(this);
			this.play();
		}



	}
	//if muted
	var loops = [];
	loops.push(new Loop({mp3:'loops/01_Lessons_0.mp3', muted:true, volume:.4, hands:1, pointables:1}));
	loops.push(new Loop({mp3:'loops/01_Lessons_1.mp3', muted:true, volume:0, hands:1, pointables:2}));
	loops.push(new Loop({mp3:'loops/01_Lessons_2.mp3', muted:true, volume:.4, hands:1, pointables:3}));
	loops.push(new Loop({mp3:'loops/01_Lessons_3.mp3', muted:true, volume:0, hands:1, pointables:4}));
	/*loops.push(new Loop({mp3:'loops/piano_loop_3.mp3', muted:false, volume:.4, hands:1, pointables:3}));
	loops.push(new Loop({mp3:'loops/string_loop_1.mp3', muted:false, volume:.2, hands:1, pointables:4}));
	loops.push(new Loop({mp3:'loops/string_loop_2.mp3', muted:false, volume:1, hands:1, pointables:5}));
	//loops.push(new Loop({mp3:'loops/string_loop_3.mp3', muted:true, volume:1, hands:2, pointables:6}));*/

	Controller.init();

	var c = MixerUI.createCanvas();
	var canvasWidth = $('#canvas').width();
	var canvasHeight = $('#canvas').height();
	var frame;
	console.log(c);

	function leapToScene(leapPos ){

	  // Gets the interaction box of the current frame
	  var iBox = frame.interactionBox;

	  // Gets the left border and top border of the box
	  // In order to convert the position to the proper
	  // location for the canvas
	  var left = iBox.center[0] - iBox.size[0]/2;
	  var top = iBox.center[1] + iBox.size[1]/2;

	  // Takes our leap coordinates, and changes them so
	  // that the origin is in the top left corner 
	  var x = leapPos[0] - left;
	  var y = leapPos[1] - top;

	  // Divides the position by the size of the box
	  // so that x and y values will range from 0 to 1
	  // as they lay within the interaction box
	  x /= iBox.size[0];
	  y /= iBox.size[1];

	  // Uses the height and width of the canvas to scale
	  // the x and y coordinates in a way that they 
	  // take up the entire canvas
	  x *= canvasWidth;
	  y *= canvasHeight;

	  // Returns the values, making sure to negate the sign 
	  // of the y coordinate, because the y basis in canvas 
	  // points down instead of up
	  return [ x , -y ];

	}

	function onSwipe(gesture) {
		var $mixer = $('#mixer'), e = $.Event('keypress'),
		char_codes = [49, 50, 51, 52];

		if(gesture.state == 'stop') {
			console.log('swipe')
			for(var i = 0, len = char_codes.length; i < len; i ++) {
				e.keyCode = char_codes[i];
				$mixer.trigger(e);
			}
		}

	}

	function onTap () {
		console.log(frame);
		console.log('tap');
		var gesturePos = leapToScene(frame.hands[0].palmPosition);
		//console.log(gesturePos[0]);
		var e = $.Event('keypress');

		checkBounds(gesturePos[0]);
		// check the x position of the gesture to see which boxes bounds
		// it falls within
		/*
		if(gesturePos[0] > $('#01_Lessons_0').offset().left && gesturePos[0] <  $('#01_Lessons_0').offset().left + $('#01_Lessons_0').width()) {
			console.log('BOX 1');
			e.keyCode = 49;
		} else if(gesturePos[0] > $('#01_Lessons_1').offset().left && gesturePos[0] <  $('#01_Lessons_1').offset().left + $('#01_Lessons_0').width()) {
			console.log('BOX 2');
			e.keyCode = 50;
		} else if(gesturePos[0] > $('#01_Lessons_2').offset().left && gesturePos[0] <  $('#01_Lessons_2').offset().left + $('#01_Lessons_0').width()) {
			console.log('BOX 3');
			e.keyCode = 51;
		} else if(gesturePos[0] > $('#01_Lessons_3').offset().left && gesturePos[0] <  $('#01_Lessons_3').offset().left + $('#01_Lessons_0').width()) {
			console.log('BOX 4');
			e.keyCode = 52;
		}
		$('#mixer').trigger(e);
		*/
	}

	// check to see if a gesture is within the bounds of one or more boxes

	function checkBounds (pos) {
		var $box1 = $('#01_Lessons_0'), $box2 = $('#01_Lessons_1'), 
		$box3 = $('#01_Lessons_2'), $box4 = $('#01_Lessons_3'),
		$mixer = $('#mixer'), e = $.Event('keypress');

		console.log('pos:',pos);
		if(pos > $box1.offset().left && pos < $box1.offset().left + $box1.width()) {
			console.log('box 1');
			e.keyCode = 49;
			$mixer.trigger(e);
		} if(pos > $box2.offset().left && pos < $box2.offset().left + $box2.width()) {
			console.log('box 2');
			e.keyCode = 50;
			$mixer.trigger(e);
		} if(pos > $box3.offset().left && pos < $box3.offset().left + $box3.width()) {
			console.log('box 3');
			e.keyCode = 51;
			$mixer.trigger(e);
		} if(pos > $box4.offset().left && pos < $box4.offset().left + $box4.width()) {
			console.log('box 4');
			e.keyCode = 52;
			$mixer.trigger(e);
		}
	}

	var leapController = new Leap.Controller({enableGestures: true});

	leapController.on('frame', function(data){

		frame = data;
		// so we don't clutter things up
		c.clearRect(0,0, canvasWidth, canvasHeight);

		// Let's loop through some hands, yo.
		for(var i =0, len = frame.hands.length; i < len; i++) {
			
			// well give the man a hand
			var hand = frame.hands[i];

			// let's get the position, for drawing goodness
			var handPos = leapToScene(hand.palmPosition);
			
			// Loop through all the fingers of this hand
			/*for(var j = 0; j < hand.fingers.length; j++) {

				// Define the finger we're on
				var finger = hand.fingers[j];

				// get it's position in Canvas
				var fingerPos = leapToScene(finger.tipPosition)

				// LET'S GET DRAWING
				// stroke styles
				c.strokeStyle = "#FFA040";
				c.lineWidth = 3;

				// DRAWING TIME
				c.beginPath();

				// Move out to the hand position
				c.moveTo(handPos[0], handPos[1]);

				// Draw a line to the finger pos
				c.lineTo(fingerPos[0], fingerPos[1]);

				c.closePath();
				c.stroke();

				//Finger #2
				c.strokeStyle = "#39AECF";
				c.lineWidth = 5;

				// Create the path for the finger circle
				c.beginPath();

				// Draw a full circle of radius 6 at the finger position
				c.arc(fingerPos[0], fingerPos[1], 20, 0, Math.PI*2);

				c.closePath();
				c.stroke();
			}*/

			// Let's draw the hand now, k? k.
			c.fillStyle = "#FF5A40";

			// Creating the path for the hand circle of doom
			c.beginPath();

			// Draw a full circle of radios 10 at the hand pos

			c.arc(handPos[0], handPos[1], 40, 0, Math.PI*2);

			c.closePath();
			c.fill();

		}

		// GESTURE TIME - go on tell your friends

		for( var i =  0; i < frame.gestures.length; i++){

		    var gesture  = frame.gestures[i];
		    var type = gesture.type;
		    if(type == 'swipe') {
		    	onSwipe(gesture);
		    }
		    if(type == 'keyTap') {
		    	if(frame.hands[0] !== 'undefined') {
		    		onTap();
		    	}
		    }

		  }
	});

	leapController.connect();
	
	/*var counter = 0;

	Leap.loop(function(frame) { 

		var fingerUp;
		var fingerNum = frame.pointables.length;
		var xPos, yPos;

		counter++;

		if (counter>99) {
			console.log('counted')
			if(frame.hands.length) {
				//console.log(frame.hands)
				//console.log(frame.hands[0]._translation)
				xPos = frame.hands[0]._translation[0];
				yPos = frame.hands[0]._translation[1];
				console.log(Leap.InteractionBox.normalizePoint)
				//console.log(Leap.interactionBox.normalizePoint(xPos), Leap.interactionBox.normalizePoint(yPos));
				
				$('.box').each(function( index ) {
	  					
					if ($(this).data('pointables') === fingerNum) {
						Controller.control($(this).attr('id'));
					}

				});
				
			}

			counter = 0;
		}
		
	});*/


