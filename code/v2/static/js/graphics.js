//http://paperjs.org/
var graphicsArr = new Array();
var volumeText;
var statusText;
var xMargin = 5;
var yMargin = 20;
var gRadius = 150;
var dtr = Math.PI/180;	
var xOffset = 200;
var yOffset = 200;
var volumeShape;


var Graphics = {
	init: function() {		
		var canvas = document.getElementById('graphics');		
		paper.setup(canvas);
		xOffset = window.innerWidth/3;
			
	},

	createShape: function(id,x){
		
		var a = x*Math.floor(360/6);
		
		var angle = (a*dtr);
		var x = (gRadius*Math.cos(angle));
		var y = (gRadius*Math.sin(angle));
		

		
		volumeShape = new paper.Path.Circle({
			center: [xOffset, 200],
			radius: 50
		});
		volumeShape.fillColor = 'red';

		volumeText = new paper.PointText({
			point: [xOffset,yOffset+10],
			justification: 'center',
			fontSize: 23,
			fillColor: 'white'
		});
		//volumeText.content = "100";




		graphicsArr[id] = new paper.Path.Rectangle([x+xOffset, y+yOffset], [40, 40]);

		graphicsArr[id]["angle"] = a;

		graphicsArr[id]["text"] = new paper.PointText({
			point: [x+xOffset,y+yOffset],
			justification: 'left',
			fontSize: 13,
			fillColor: 'white'
		});

		graphicsArr[id]["text"].content = id;

		graphicsArr[id].strokeColor = '#ffffff';
		graphicsArr[id].fillColor = 'black';



		paper.view.draw();

		
		paper.view.onFrame = function(event) {			
			//graphicsArr[id].rotate(3);
			//graphicsArr[id].fillColor.hue += 1;

			
			graphicsArr[id]["angle"]+=1;
			var angle = (graphicsArr[id]["angle"]*dtr);
			var x = (gRadius*Math.cos(angle));
			var y = (gRadius*Math.sin(angle));

			//graphicsArr[id].position = [x+xOffset,y+yOffset];
			//graphicsArr[id]["text"].position = [x+xOffset,y+yOffset+40];
		}
		
	},

	updateVolume: function(txt){
		volumeText.content = txt;
		volumeShape.fillColor.hue = txt;
	},

	updateColor: function(id,color){		
		if(graphicsArr[id]){
			graphicsArr[id].fillColor = color;			
		}		
	},
}

Graphics.init();


