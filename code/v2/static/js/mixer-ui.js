var MixerUI = {

	createBox: function(id, pointables) {

		this.$contentBox = $('<div/>', {
		    id: id,
		    html: '<div class="content">'+id+'</div>',
		    'data-pointables' : pointables,
		    class: 'box'
		}).appendTo("#mixer");

		this.$contentBox.click(function(){
			Controller.control(id);
		});
		
		return (this.$contentBox);

	},

	createCanvas: function() {
		var canvas = $('#canvas')[0];
		canvas.width = $('#mixer').width();
		canvas.height = $('#mixer').height();

		var c = canvas.getContext('2d');
		return c;
	},
	
	playing: function(el){
		//console.log('playing id: ' + id);
		$(el).addClass('playing');
		
	},

	muted: function(el){
		
		$(el).removeClass('playing');
			
	}
};