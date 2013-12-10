var socket = null;
var counter = 0;
/*
if(window.location.host.toString().indexOf("jtubert-leap.herokuapp.com") > -1){
	socket = io.connect(window.location.host.toString());
}
*/

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

			
			Graphics.createShape(audio.id,counter);

			counter++;
		},

		

		play : function(id) {
			
			if (id !== this.id) {
				this.audio.play();
			} else {
				this.changeState(false);
			}
			this.audio.volume = 0.4;
			this.pausing = false;
			Graphics.updateColor(id,"red");

			if(socket){
				socket.emit("playSong",id);
			}

			document.getElementById('status').innerHTML = "play " + this.audio.volume;
			
		},

		pause : function(id) {
			
			if (this.pausing) {
				return;
			}

			this.pausing = true;

			Graphics.updateColor(id,"black");
				
			document.getElementById('status').innerHTML = "pause: " + id + " "  + this.audio.volume;

			var sound = this;

			var volTimer=setInterval(function(){volDecrease()},1000);

			function volDecrease() {
				
				if (sound.audio.volume <= 0) {
					clearInterval(volTimer);
					sound.pausing = false;
					sound.changeState(true);
					
				} else {
					sound.audio.volume = ((sound.audio.volume)*10 - 1)/10;
				}

				document.getElementById('status').innerHTML = "inside: " + id + " " + sound.audio.volume;

			}
			
			if(socket){
				socket.emit("pauseSong",id);
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

		init	: function(loops)
		{
			for (var i = loops.length; i--; ) {
				this.loops[loops[i].id] = loops[i];
				if (loops[i].param.pointables) {
					this.pointables[loops[i].param.pointables].push(loops[i].id);
				}
			}
		},

		play	: function(id)
		{
			this.changeState('play', id);			
		},

		pause	: function(id)
		{
			this.changeState('pause', id);
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

		getFrame : function(frame) {
			if(socket){
				//socket.emit("status",{hands:frame.hands.length, pointables:frame.pointables.length});
			}

			//document.getElementById('status').innerHTML = 'Hands: ' + frame.hands.length + ', Pointables: ' + frame.pointables.length;
			this.raiseEvent(frame.pointables.length);
			this.setGlobalVolume(frame, frame.pointables.length);

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

					this.loops[loop].play(loop);

				} else {
					//pause
					this.loops[loop].pause(loop);
				}
			}
		},

		//Sets global volume of all loops by raising and lowering your hand over the Leap
		//Taken from Bryan's implementataion and retrofitted to work for all loops
		setGlobalVolume : function(frame, pointables){
			var yThreshold = 300.0;//max out at millimeters away from sensor
			var volOutput = 0;
			var playing = [];

			for (var i = 0; i < frame.hands.length; i++) {
	      		var hand = frame.hands[0];//not accounting for two hands - not sure what Bryan's intention was
	      		var volChange = 0;
	      		var yVal = 0;

	      		yVal = hand.palmPosition;
	      		if(yVal && yVal[1]){
	      			volChange = parseFloat(yVal[1].toFixed(1));
	      			volOutput = volChange/yThreshold;
	      		}
	      		
    		}	

    		if (volOutput > 1) 
    			volOutput = 1;

    		for (var p = 1; p <= pointables; ++p) {
				for (var i = 0, l = this.pointables[p].length; i < l; ++i) {
					playing.push(this.pointables[p][i]);
				}
			}

			for (var loop in this.loops) {
				if (playing.indexOf(loop) != -1) {
					//console.log("volume " + this.loops[loop].volume)
					//this.loops[loop].volume = volOutput;
					//this.loops[loop].audio.volume = volOutput;

					if(socket){
						//socket.emit("volume",Math.round(volOutput*100));
					}
					//document.getElementById('volume').innerHTML = 'Volume: ' + Math.round(volOutput*100);

					
					//Graphics.updateVolume(Math.round(volOutput*100));
				} 
			}
		}


	}

	var loops = [];
	loops.push(new Loop({mp3:'loops/01_Lessons_1.mp3', muted:false, volume:.4, hands:1, pointables:1}));
	loops.push(new Loop({mp3:'loops/01_Lessons_0.mp3', muted:true, volume:.4, hands:1, pointables:2}));
	/*loops.push(new Loop({mp3:'loops/piano_loop_3.mp3', muted:true, volume:.4, hands:1, pointables:3}));
	loops.push(new Loop({mp3:'loops/string_loop_1.mp3', muted:true, volume:.2, hands:1, pointables:4}));
	loops.push(new Loop({mp3:'loops/string_loop_2.mp3', muted:true, volume:1, hands:1, pointables:5}));
	loops.push(new Loop({mp3:'loops/string_loop_3.mp3', muted:true, volume:1, hands:2, pointables:6}));*/

	Controller.init(loops);


	var counter = 0;

	Leap.loop(function(frame) { 
		Controller.getFrame(frame);

		//console.log(frame);

		if(socket){
			var obj = {};
			obj.pointables = {};
			obj.pointables.length = frame.pointables.length;
			obj.hands = [];
			obj.hands[0] = {};
			//obj.hands.length = frame.hands.length;
			if(frame.hands[0]){
				obj.hands[0].palmPosition = [];
				obj.hands[0].palmPosition[0] = {};
				obj.hands[0].palmPosition[1] = {};
				if(frame.hands[0].palmPosition){
					if(frame.hands[0].palmPosition[1]){
						obj.hands[0].palmPosition[1]  = frame.hands[0].palmPosition[1];
					}
				}				
			}


			
			//socket.emit("frame",obj);
		} 
	});

	

	
	/*
	socket.on('message', function (data) {
		console.log("socket.on: " + data);
	});

	socket.on('pauseSong', function (data) {
		console.log("socket.on: " + data);
	});

	socket.on('connections', function (data) {
		document.getElementById('connections').innerHTML = 'Connections: ' + data;
	});
	*/
	if(socket){
		socket.on('playSong', function (data) {
			//console.log("socket.on: " + data);
		});

		socket.on('status', function (data) {
			//document.getElementById('status').innerHTML = 'Hands: ' + data.hands + ', Pointables: ' + data.pointables;
		});

		socket.on('volume', function (data) {
			//document.getElementById('volume').innerHTML = 'Volume: ' + data;
			//Graphics.updateCircle(data);
		});

		socket.on('frame', function (data) {
			//console.log("data: ",data);
			Controller.getFrame(data);
		});
	}

	

	

	

