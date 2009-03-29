var trackList={};
var currentTrack = 0;
var currentUrl;

var isReady = 0;
var playerStatus = "";
var playerDisplayed = "normal";

// for scrobbling and other play-related activities
var playback_event_timeout = 0;
var playback_event_count;
var player_position;
var player_duration;

var notificationTimeout = 0;

var master_ord;
var master_passback;

function setCurrentTrack(id) {
	
	stopTrack();
	currentTrack = id;
	playTrack();
   
	return false;
	
}

function setPlaying(id) {
	$("#track_"+currentTrack).removeClass('notplaying');	
	$("#track_"+currentTrack).addClass('playing');
}

function setNotPlaying(id) {
	$("#track_"+currentTrack).removeClass('playing');	
	$("#track_"+currentTrack).addClass('notplaying');
}

function playTrack () {
	
  if (currentTrack===undefined) { return false; }
  currentUrl = trackList[currentTrack].url;
  setPlaying(currentTrack);
  player.sendEvent('LOAD', currentUrl); 
  player.sendEvent('PLAY');	
			
}

function stopTrack () {

	if (currentTrack===undefined) { return false; }
    setNotPlaying(currentTrack);
    player.sendEvent('STOP');				
		
}

function nextTrack() {
		
	stopTrack();
 
	currentTrack++;

	if (trackList[currentTrack]) {
		if (trackList[currentTrack].url != "") { playTrack(); return true; }
		else { nextTrack(); }
	} else { 
		return false;
	}

}

function prevTrack() {
		
	stopTrack();
	
	while(currentTrack>0 && typeof(trackList[currentTrack - 1]) != "undefined") {
		currentTrack--;
		if (trackList[currentTrack].url !== "") { playTrack(); return false; }
	}
	
	return false;

}

var player = null;
function playerReady(thePlayer) {
  player = document.getElementById(thePlayer.id);
  addListeners(); 
}

function stateTracker(obj) { 
	// alert('the new mute state is: '+obj);
	if (obj.newstate == 'COMPLETED') { nextTrack();}
};

function addListeners() {
  if (player) { 
	player.addModelListener("STATE","stateTracker");
  } else {
    setTimeout("addListeners()",100);
  }
}