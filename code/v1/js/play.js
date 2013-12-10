(function() {
    var context, soundSource, soundBuffer, 
    //url = 'http://thelab.thingsinjars.com/web-audio-tutorial/hello.mp3';
    url = 'http://groovylab.com/leap-noise/code/audio/VCR.mp3';
    
    // Step 1 - Initialise the Audio Context
    // There can be only one!
    function init() {
        if (typeof AudioContext !== "undefined") {
            context = new AudioContext();
        } else if (typeof webkitAudioContext !== "undefined") {
            context = new webkitAudioContext();
        } else {
            throw new Error('AudioContext not supported. :(');
        }
    }

    // Step 2: Load our Sound using XHR
    function startSound() {
        // Note: this loads asynchronously
        var request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.responseType = "arraybuffer";

        // Our asynchronous callback
        request.onload = function() {
            var audioData = request.response;
            audioGraph(audioData);
        };

        request.send();
    }

    // Finally: tell the source when to start

    function playSound() {
        // play the source now
        // noteOne is depecrated?!?
        soundSource.noteOn(context.currentTime);
    }

    function stopSound() {
        // stop the source now
        soundSource.noteOff(context.currentTime);
    }

    // Events for the play/stop bottons
    $('.play').click(startSound);
    $('.stop').click(stopSound);

    function audioGraph(audioData) {
        soundSource = context.createBufferSource();
        soundBuffer = context.createBuffer(audioData, true);
        soundSource.buffer = soundBuffer;

        volumeNode = context.createGainNode();

        //Set the volume
        volumeNode.gain.value = 0.1;

        // Wiring
        soundSource.connect(volumeNode);
        volumeNode.connect(context.destination);

        // Finally
        playSound(soundSource);
    }


    init();


}());