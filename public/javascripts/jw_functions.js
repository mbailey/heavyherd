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
	$('#player_button span').addClass('pause');
}

function setPaused(id) {
	$("#track_"+currentTrack).removeClass('playing');	
	$("#track_"+currentTrack).addClass('notplaying');
	$('#player_button span').removeClass('pause');
}

function setNotPlaying(id) {
	$("#track_"+currentTrack).removeClass('playing');	
	$("#track_"+currentTrack).addClass('notplaying');
	$('#player_button span').removeClass('pause');
}

function showTrackDetails(currentTrack) {
  $("#currently_playing .artist").text(trackList[currentTrack].artist + ' -')
  $("#currently_playing .track").text(trackList[currentTrack].song)
}

function loadTrack() {
  currentUrl = trackList[currentTrack].url;
  showTrackDetails(currentTrack);
  player.sendEvent('LOAD', currentUrl);	
}

function playTrack() {
  if (currentTrack===undefined) { return false; }
  currentUrl = trackList[currentTrack].url;
  setPlaying(currentTrack);
  showTrackDetails(currentTrack);
  player.sendEvent('LOAD', currentUrl); 
  player.sendEvent('PLAY');			
}

function pauseTrack () {
	if (currentTrack===undefined) { return false; }
    setNotPlaying(currentTrack);
    player.sendEvent('PLAY', false);					
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
  $("#player_button span").bind("click", function(e) {player.sendEvent('PLAY'); return false;});
  loadTrack();
}

function stateTracker(obj) { 
	if (obj.newstate == 'BUFFERING') { setPlaying(currentTrack); }
	if (obj.newstate == 'PLAYING') { setPlaying(currentTrack); }
	if (obj.newstate == 'PAUSED') { setPaused(currentTrack); }
	if (obj.newstate == 'COMPLETED') { nextTrack(); }
}

function addListeners() {
  if (player) { 
	player.addModelListener("STATE", "stateTracker");
  } else {
    setTimeout("addListeners()",100);
  }
}