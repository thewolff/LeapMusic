
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
	loops.push(new Loop({mp3:'loops/01_Lessons_0.mp3', muted:false, volume:.4, hands:1, pointables:1}));
	loops.push(new Loop({mp3:'loops/01_Lessons_1.mp3', muted:true, volume:0, hands:1, pointables:2}));
	loops.push(new Loop({mp3:'loops/01_Lessons_2.mp3', muted:false, volume:.4, hands:1, pointables:3}));
	loops.push(new Loop({mp3:'loops/01_Lessons_3.mp3', muted:true, volume:0, hands:1, pointables:4}));
	/*loops.push(new Loop({mp3:'loops/piano_loop_3.mp3', muted:false, volume:.4, hands:1, pointables:3}));
	loops.push(new Loop({mp3:'loops/string_loop_1.mp3', muted:false, volume:.2, hands:1, pointables:4}));
	loops.push(new Loop({mp3:'loops/string_loop_2.mp3', muted:false, volume:1, hands:1, pointables:5}));
	//loops.push(new Loop({mp3:'loops/string_loop_3.mp3', muted:true, volume:1, hands:2, pointables:6}));*/

	Controller.init();
	
	var counter = 0;

	Leap.loop(function(frame) { 

		var fingerUp;
		var fingerNum = frame.pointables.length;

		counter++;

		if (counter>99) {

			if(frame.pointables.length) {
				$('.box').each(function( index ) {
	  					
					if ($(this).data('pointables') === fingerNum) {
						Controller.control($(this).attr('id'));
					}

				});
			}

			counter = 0;
		}
		
	});



	

	

