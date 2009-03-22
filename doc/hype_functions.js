var trackList={};
var activeList = document.location.href;
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
function set_ad_vars() {

	window.master_ord = Math.random()*10000000000000000;
	if (document.location.hash.search(/\/\d\//)!=-1) { window.master_passback = document.location.hash.substr(2,1); }
	else if (document.location.hash == "/") { window.master_passback = 1; }
	else if (document.location.pathname.search(/\/\d\//)!=-1) { window.master_passback = document.location.pathname.substr(1,1); }
	else if (document.location.pathname == "/") { window.master_passback = 1; }

}



// ------ cookie functions -------- //
function get_cookie( name ) {
    var start = document.cookie.indexOf( name + "=" );
        var len = start + name.length + 1;
        if ( ( !start ) && ( name != document.cookie.substring( 0, name.length ) ) ) { return null;     }
        if ( start == -1 ) { return null; }
        var end = document.cookie.indexOf( ";", len );
        if ( end == -1 ) { end = document.cookie.length; }
        return unescape( document.cookie.substring( len, end ) );
}

function set_cookie( name, value, expires, path, domain, secure ) {
        // set time, it's in milliseconds
        var today = new Date();
        today.setTime( today.getTime() );
        
        // in days
        if ( expires ) { expires = expires * 1000 * 60 * 60 * 24; }
        var expires_date = new Date( today.getTime() + (expires) );
        
        document.cookie = name + "=" +escape( value ) +
        ( ( expires ) ? ";expires=" + expires_date.toGMTString() : "" ) + 
        ( ( path ) ? ";path=" + path : "" ) + 
        ( ( domain ) ? ";domain=" + domain : "" ) +
        ( ( secure ) ? ";secure" : "" );
}

function hide_notice(cookie_key) {      
        $('top-notice').style.display = 'none';
        set_cookie ( cookie_key, 'true', '30', '/', '', '');
}
// ------ end cookie functions -------- //

// ------   utility functions ------ //


function trim(str){
        return str.replace(/^\s*|\s*$/g,"");
}

window.debug = function(q,w,e,r){  
    try { if (typeof console != 'undefined') { console.log.apply(console,arguments); }} 
    catch(err){ if (typeof console != 'undefined') { console.log(q,w,e,r); }}
};

function get_unix_time() {
	var date_obj = new Date(); // Generic JS date object
	return parseInt(date_obj.getTime() / 1000); // Returns milliseconds since the epoch
}

function toggleLayer( whichLayer )
{
  var elem, vis;
  if( document.getElementById ) { // this is the way the standards work
    elem = document.getElementById( whichLayer );
  } else if( document.all ){ // this is the way old msie versions work
      elem = document.all[whichLayer];
  } else if( document.layers ) { // this is the way nn4 works
    elem = document.layers[whichLayer];
  }
  vis = elem.style;
  // if the style.display value is blank we try to figure it out here
  if(vis.display==''&&elem.offsetWidth!=undefined&&elem.offsetHeight!=undefined)
    vis.display = (elem.offsetWidth!=0&&elem.offsetHeight!=0)?'block':'none';
  vis.display = (vis.display==''||vis.display=='block')?'none':'block';
}

// ------ end utility functions ------ //



// ------ JS for player -------- //

	
function sendEvent(typ,prm) { 
	if( isReady === 1) {	thisMovie('hypePlayer').sendEvent(typ,prm); }
	else {	setTimeout( function() { sendEvent(typ,prm); } , 500); } // try a second later	
}

// this must be a separate function so that we can properly 
// init player on first page load.
function initImeem () {

	if (thisMovie('imeemPlayer') === undefined || Object.isFunction(thisMovie('imeemPlayer').load) === false) {
	
		setTimeout( function() { initImeem(); } , 500);
		
	} else {
		
		$('imeemPlayer').style.right="29px";
		$('imeemPlayer').style.width="258px";
		$('imeemPlayer').style.height="80px";

		e = new Effect.Morph('hypePlayer', { style: { top: '32px' }, duration: '0.5' });
		e = new Effect.Morph('imeemPlayer', { style: { top: '-50px' }, duration: '0.5' });
		playerDisplayed="imeem";
				
		thisMovie('imeemPlayer').load(trackList[activeList][currentTrack].imeem_id);
		playerStatus = "STOP_ON_LOAD"; // this is to prevent the player from playing onload if it's the first track
	
	}

}

function thisMovie(movieName) {	

    var win = window;
	if (win.document[movieName]) {
	    return win.document[movieName];
	} 
	else if ((navigator.appName.indexOf("Microsoft Internet") === -1) &&
	    (win.document.embeds && win.document.embeds[movieName])) {
	    return win.document.embeds[movieName];
	} 

}

function playerReady(obj) {
	var id = obj.id;
	var version = obj.version;
	var client = obj.client;
	isReady = 1;

	//alert("hype player READY");

	player_obj = $(id);
	player_obj.addModelListener('ERROR','handlePlayError');	
	player_obj.addModelListener('STATE','updatePlayerState');
	player_obj.addModelListener('TIME', 'updatePlayerPosition');

}

function updatePlayerState(obj) {

	playerStatus = obj.newstate;
	
	if ( obj.newstate=="PAUSED" && activeList==document.location.href) {	
		if ( $('player') ) { $('player-main-button' ).className=""; }
		if ( $('play_track_' + currentTrack )) { $('play_track_' + currentTrack ).className="play"; }
	} else if ( obj.newstate=="PLAYING" && activeList==document.location.href ) { 
		if ( $('player') ) { $('player-main-button' ).className="pause"; }
		if ($('play_track_' + currentTrack )) { $('play_track_' + currentTrack ).className="pause"; }
		set_track_bg(currentTrack, "green");
	} else if ( obj.newstate=="COMPLETED" ) { 
		debug("About to execute nextTrack...");
		nextTrack();
	}
	
	debug("status: " + obj.newstate + " currentTrack: " + currentTrack);
	//alert("status: " + obj.newstate + " currentTrack: " + currentTrack);
	
}

function updatePlayerPosition(obj) {
	player_position = obj.position;
	player_duration = obj.duration;	
}
	
function handlePlayError(obj) {
	
	alert(obj.message + " YOU MAY NEED TO ENABLE COOKIES FOR hypem.com");

}
	
function imeem_onPlayClick() {
	playerStatus="PLAYING";
	if ( $('play_track_' + currentTrack ) && activeList==document.location.href ) {	
		$('play_track_' + currentTrack ).className="pause"; 		
		if ( $('player') ) { $('player-main-button' ).className="pause"; }
		set_track_bg (currentTrack, "green");
	}
}

function imeem_onPauseClick() {
	playerStatus="PAUSED";
	if ( $('play_track_' + currentTrack ) && activeList==document.location.href ) {	
		$('play_track_' + currentTrack ).className="play";  
		if ( $('player') ) { $('player-main-button' ).className=""; }
	}
}
 
function imeem_onPlayerReady() {
	if(playerStatus!="STOP_ON_LOAD") {
		thisMovie('imeemPlayer').playTrack();
	} else {
		playerStatus = "STOPPED";
	}
}

function imeem_onMediaStart() {
	debug("imeem_onMediaStart fired");
	playerStatus="PLAYING";
}

function imeem_onMediaEnd() {
	playerStatus = "COMPLETED";
	nextTrack();
}

function updateImeemPlayerInfo() {
}

function imeem_onMediaBuffering() {
}

function imeem_onMediaDoneBuffering() {
}


function togglePlay (id) {
	
	if (id===undefined) { id = currentTrack; }

	if (id === currentTrack && currentTrack !== undefined && playerStatus !== "" && activeList==document.location.href && playerStatus!="STOPPED") { 
	
		if(playerStatus === "PAUSED") { //toggle pause->play
		
			if ( $('player-main-button') ) { $('player-main-button').className="pause"; }
		
			if (trackList[activeList][currentTrack].type=="normal") {
	
				if ( $('play_track_' + id ) ) {	$('play_track_' + id ).className="pause"; }
				sendEvent('PLAY', true);
			
			} else if (trackList[activeList][currentTrack].type=="imeem") {
			
				if ( $('play_track_' + id ) ) {	$('play_track_' + id ).className="pause"; }
				thisMovie('imeemPlayer').resumeTrack();
			
			}
			
		} else {
	
			if ( $('player-main-button') ) { $('player-main-button').className=""; }
	
			if (trackList[activeList][currentTrack].type=="normal") {
							
				if ( $('play_track_' + id ) ) {	$('play_track_' + id ).className="play"; }
				sendEvent('PLAY', false);
			
			} else if (trackList[activeList][currentTrack].type=="imeem") {
		
				if ( $('play_track_' + id ) ) {	$('play_track_' + id ).className="play"; }
				thisMovie('imeemPlayer').pauseTrack();
			
			}
			
			
		}
		
	} else {
	
		stopTrack();
		
		if (activeList!=document.location.href) { 
			trackList[activeList] = Array(); // free memory, yay!
			if (activeList.search('/radio$')!=-1) { // disable radio updater
				clearInterval(radio_notificationTimeout);
				radio_notificationTimeout=0;
			} 
			activeList = document.location.href;
			$('player-page').style.visibility = "hidden"; // now we are again in sync with page
		}
		
		currentTrack = id;
		
		playTrack();
	
	}
	
	return false;
	
}

	
function stopTrack () {

	if (currentTrack===undefined) { return false; }
	if (trackList[activeList]===undefined) { return false; }
	
	if (activeList==document.location.href) {
		set_track_bg (currentTrack, "");
		if ( $('play_track_' + currentTrack ) ) {	$('play_track_' + currentTrack ).className="play"; }
		if ( $('player-main-button') ) { $('player-main-button').className=""; }
	}
	
	disable_playback_check();

	if (trackList[activeList][currentTrack].type=="normal") {
	
		sendEvent('STOP');
		document.title = trackList[activeList].title;
			
	} else if (trackList[activeList][currentTrack].type=="imeem") {			
	
		thisMovie('imeemPlayer').stopTrack();
		document.title = trackList[activeList].title;
		
	} else {
	
		return false; 
	
	}
		
}

function playTrack () {
	
	debug("fired playTrack");
	
	if (activeList.search('/radio') == -1) {
		$('playerPrev').show();
		$('playerNext').show();
		
		playback_event_count = 0; 
		enable_playback_check(); // dont try to scrobble our radio
		
	} else {
		$('playerPrev').hide();
		$('playerNext').hide();
		currentTrack = 0; // always 0 on radio pages
	}

	if (activeList==document.location.href) {
		set_track_bg(currentTrack,"green");
		if ( $('play_track_' + currentTrack ) ) {	$('play_track_' + currentTrack ).className="pause"; }
		if ( $('player') ) { $('player-main-button' ).className="pause"; }
	}
		
	set_now_playing_info(currentTrack);

	if (trackList[activeList][currentTrack].type=="normal" || activeList.search('/radio$')!= -1) {

		if (playerDisplayed=="imeem") {
		
			e = new Effect.Morph('imeemPlayer', { style: { top: '32px' }, duration: '0.5' });
			e = new Effect.Morph('hypePlayer', { style: { top: '0px' }, duration: '0.5' });
			playerDisplayed="normal";
			
		}
	
		if (activeList.search('/radio$') != -1) {
			sendEvent("LOAD",{file:"http://stream.hypem.com/hype.mp3"});
		} else {
			sendEvent("LOAD",{file:"/serve/play/" + trackList[activeList][currentTrack].id + "/" + trackList[activeList][currentTrack].key,type:"mp3", duration: trackList[activeList][currentTrack].time});
		}
		sendEvent('PLAY',true);	
	
	} else if (trackList[activeList][currentTrack].type=="imeem") {
	
		if (playerDisplayed=="normal") {
		
			$('imeemPlayer').style.right="29px";
			$('imeemPlayer').style.width="258px";
			$('imeemPlayer').style.height="80px";
			
			e = new Effect.Morph('hypePlayer', { style: { top: '32px' }, duration: '0.5' });
			e = new Effect.Morph('imeemPlayer', { style: { top: '-50px' }, duration: '0.5' });
			playerDisplayed="imeem";
			
		}
		
		playerStatus = "PLAYING";
		thisMovie('imeemPlayer').load(trackList[activeList][currentTrack].imeem_id);
		//setTimeout( function() { thisMovie('imeemPlayer').playTrack(); } , 1000);
		//thisMovie('imeemPlayer').play();
		
	}
	
				
}

function nextTrack() {
	
	debug("NEXT event detected");
	
	stopTrack();
	debug("about to check tracks... now @ " + currentTrack);
 
	currentTrack++;

	if (trackList[activeList][currentTrack]) {
		debug("checking track #" + currentTrack);
		if (trackList[activeList][currentTrack].type != "") { playTrack(); return true; }
		else { nextTrack(); }
	} else { 
		return false;
	}

}

function prevTrack() {
	
	//debug("PREV event detected");
	
	stopTrack();
	
	while(currentTrack>0 && typeof(trackList[activeList][currentTrack - 1]) != "undefined") {
		currentTrack--;
		if (trackList[activeList][currentTrack].type !== "") { playTrack(); return false; }
	}
	
	return false;

}
// ------ end JS for player --------

// ------ UI mgmt functions --------

// set the background of a given track-cell to a color
function set_track_bg(id, color) {

	// exception for sxsw pg
	if (document.location.href.search(/sxsw2009/) != -1) { return false; }

	if (color=="green" && $('track_name_' + id) ) {
		if ( $('track_name_' + id).parentNode.id.match(/section/) ) {
			$('track_name_' + id).parentNode.className = $('track_name_' + id).parentNode.className + ' active-playing-green';
		} else if ($('track_name_' + id).parentNode.parentNode.id.match(/section/) ) {
			$('track_name_' + id).parentNode.parentNode.className = $('track_name_' + id).parentNode.parentNode.className + ' active-playing-green';
		} else {
			alert("Could not change back color for parents of item id = track_name_"  + id);
		}
		
	} else if ($('track_name_' + id)) {
	
		if ( $('track_name_' + id).parentNode.id.match(/section/) ) {
			$('track_name_' + id).parentNode.className = $('track_name_' + id).parentNode.className.replace(/active\-playing\-green/g,'');
		} else if ( $('track_name_' + id).parentNode.parentNode.id.match(/section/) ) {
			$('track_name_' + id).parentNode.parentNode.className = $('track_name_' + id).parentNode.parentNode.className.replace(/active\-playing\-green/g,'');
		} else {
			alert("Could not change back color for parents of item id = track_name_"  + id);
		}
	
	}

}

function set_now_playing_info() {

	// make the artist-track bit of text	
	if(trackList[activeList][currentTrack].artist) {
		now_playing_txt = '<a onclick="load_url(this.href);return false;" href="/artist/' + 
			escape(trackList[activeList][currentTrack].artist) + '/1/">' + 
			trackList[activeList][currentTrack].artist + '</a> - ' +
			'<a onclick="load_url(this.href);return false;" href="/track/' +
			trackList[activeList][currentTrack].id + '">' +
			trackList[activeList][currentTrack].song + '</a>';
	} else {
		now_playing_txt = '<a onclick="load_url(this.href);return false;" href="/track/' +
			trackList[activeList][currentTrack].id + '">' +
			trackList[activeList][currentTrack].song + '</a>';
	}
	
	// generate the track favoriting code
	fav_link_txt = '<a id="fav_track_' + trackList[activeList][currentTrack].id + '" ';
	if(trackList[activeList][currentTrack].fav === 1) { fav_link_txt+= ' class="fav-on" ';} 
	else { fav_link_txt+= ' class="fav-off" '; }
	fav_link_txt += ' onclick="toggle_favorite(\'track\', \'' + trackList[activeList][currentTrack].id + '\');return false;" title = "Add (or remove) to your favorite tracks"	href="">Favorite<span></span></a>';
	
	if (activeList.search('/radio$') != -1) {
		$('player-nowplaying').innerHTML = "<span class='player-onair'>ON AIR: </span>" + now_playing_txt + fav_link_txt;
	} else {
		$('player-nowplaying').innerHTML = now_playing_txt + fav_link_txt;
	}
	
	if(trackList[activeList][currentTrack].artist) {
		now_playing_title = trackList[activeList][currentTrack].artist + ' - ' + trackList[activeList][currentTrack].song + ' / The Hype Machine';
	} else {
		now_playing_title = trackList[activeList][currentTrack].song + ' / The Hype Machine';
	}
	
	// sometimes this is called when player is not playing, so we must 
	// accommodate
	if (playerStatus=="PLAYING") { document.title = now_playing_title; }
	
	link_txt = "";
	if (trackList[activeList][currentTrack].amazon) {
		link_txt = '<a onclick="load_url(this.href);return false;" href="' + trackList[activeList][currentTrack].amazon + '"><img src="/images/player-amazon.png" alt="Get this song on Amazon" /></a>';
	}	
	if (trackList[activeList][currentTrack].itunes) {
		link_txt += ' <a onclick="load_url(this.href);return false;" href="' + trackList[activeList][currentTrack].itunes + '"><img src="/images/player-itunes.png" alt="Get this song on iTunes" /></a>';	
	}
	blog_link_txt = ' <a onclick="load_url(this.href);return false;" id="read-post" href="/go/track/' + trackList[activeList][currentTrack].id + '"><img src="/images/player-read-post.png" /></a>';
		
  	$('player-links').innerHTML = blog_link_txt + link_txt;
  	
  	page_playing_txt = "<a href='" + document.location.href.replace('/#', '') + "' onclick='load_url(this.href);return false;'><strong>&laquo;</strong> THIS SONG IS PLAYING FROM A PREVIOUS PAGE</a>";
  	$('player-page').innerHTML = page_playing_txt;
  	
}


function toggle_favorite(type, id, gray, skip_prompt) {
	
	if (loggedin==0 && !get_cookie("dontprompt") && !skip_prompt) {
		if(! $('box') ) { Lightbox.init(); }
		Lightbox.showBoxByAJAX('/inc/lb_signup_info.php?type=' + type + '&val=' + id, 350, 200);
		return false;
	}
	

	$$('#fav_' + type + "_" + id).each(function(elt) { 	elt.className="fav-load"; });
	
	r = new Ajax.Request('/inc/user_action.php?act=toggle_favorite&ts=' + get_unix_time() + '&type=' + type + '&val=' + id + '&current_url=' + Base64.encode(location.href), 
		{ method:'get',
		
		  onSuccess: function(transport){
  				
  				var response = transport.responseText || "no response text";
  				
  				var activeclass;
  				var activecolor;
  				var favcount_change;
  				
  				if (response == "1") { // don't compare this as number, it shows up as a string
  					activeclass="fav-on"; activecolor=""; 
  					favcount_class="favcount-on"; favcount_change = 1;
  				} else 	{ 
  					activeclass="fav-off"; activecolor="#ccc"; 
  					favcount_class="favcount-off"; favcount_change = -1;
  				}

				// queries are base64 to avoid nonsense :)
				if (type=="query") { id = Base64.encode(id); }
				
				$$('#fav_' + type + "_" + id).each(function(elt) { 
					elt.className=activeclass; 
					
					if ( elt.parentNode.tagName.match(/LI/) && elt.parentNode.className == "") { // this happens in sidebars
						if (elt.parentNode.childNodes[3]) {	elt.parentNode.childNodes[3].style.color  = activecolor; }
					}
						
				});
				
				$$('#favcount_' + id).each(function(elt) {	
  					elt.innerHTML = (parseInt(elt.innerHTML) + favcount_change);		
  					elt.className=favcount_class;
				});
					  				
			},
		
		   onFailure: function(){ alert('We couldn\'t add your favorite! :( One of our systems is unavailable and will return shortly.'); }	
		}
		
	);
	
}


function show_all_tracks (elt) {
	
	var elementList = elt.parentNode.childNodes;
	
	var i=0;
	while (elementList[i]) {

		if (elementList[i].className === "same-post") {
			elementList[i].style.display = "";
		}
		
		i++;
	}	
	
}

function show_buy (pos) {
	e = new Effect.BlindDown('buy' + pos, { duration: 0.2 });
	if ($('meta' + pos)) { $('meta'+pos).style.display=""; }
}

function expand_hyped(list_parent) {

	// this can all be replaced by a line of prototype, but what line? :)
	var elementList = $(list_parent).getElementsByTagName('li');
	
	var tmp = '';
	var i=0;

	while (elementList[i]) {
	
		if (elementList[i].className === "hyped-6" && elementList[i].style.display=='none') {
			elementList[i].style.display='';
		} else if( elementList[i].className === "hyped-6" && elementList[i].style.display==='' ) {
			elementList[i].style.display='none';
		}
		
		i++;
	
	}
	
	if ( $('mbx') ) {
		if ( $('mbx').innerHTML.indexOf("EXPAND") !== -1) { $('mbx').innerHTML="HIDE &uarr;"; } 
		else { $('mbx').innerHTML="EXPAND &darr;"; }
	}
}

function enable_notification_check () {

	if (notificationTimeout!=0) { 		
		debug("Attempting to disable autoupdater in enable_notification_check");
		clearInterval(notificationTimeout);
		notificationTimeout = 0;
	}
	
	if (trackList[document.location.href] !== undefined) {

		setTimeout( function() {
		
			if (trackList[document.location.href][0].ts !== undefined) { 
			
			debug("Enabling autoupdater for: " + document.location.href);
		 	notificationTimeout = window.setInterval(check_notification, 60000); 
			
			}
					
		}, 60000);
	
	} else {
		return false;
	}
		
}

function check_notification() {
	u = new Ajax.Updater('track-notification', '/inc/serve_track_notification.php', 
			{ 
				parameters: 'page=' + escape(document.location.href) + '&latest=' + trackList[document.location.href][0].ts + '&ts=' +  get_unix_time(),
				method: 'get',
		        asynchronous: true,
		        evalScripts: true
			}
		);
}

function disable_notification_check () {

	if (notificationTimeout!==0) {
		debug("Attempting to disable autoupdater in disable_notification_check");
		clearInterval(notificationTimeout);
		notificationTimeout=0;
		return true;
	} else {
		return false;
	}
	
}

function enable_playback_check() {

	if (playback_event_timeout !== 0) {
		debug("playback_check already running!");
		return false;
	} else {
		playback_event_timeout = window.setInterval(playback_check, 5000);
		return true;
	}
		
}

function playback_check() {

	var pos = 0;
	var dur = 0;

	if (playerStatus == "PLAYING") {

		if (playerDisplayed=="normal") {
			
			pos = Math.round(player_position);
			dur = Math.round(player_duration);
	
		} else if (playerDisplayed=="imeem") {
	
			pos = Math.round(thisMovie('imeemPlayer').getTrackPosition());
			dur = Math.round(thisMovie('imeemPlayer').getTrackLength()); 
		
		}

		debug("playback_check detected: " + pos + "/" + dur);
		
		if (playback_event_count == 0 && pos >= 30 && pos < 45 ) {
			r = new Ajax.Request('/inc/user_action.php?act=log_action&type=listen&ts=' + get_unix_time() + '&val=' + trackList[activeList][currentTrack].id + '&pos=' + pos + '&rem=' + (dur - pos) + '&vendor=' + playerDisplayed + '&current_url=' + Base64.encode(location.href), { method:'get' } );
			playback_event_count++;
		} else if (playback_event_count == 1 && (pos/dur) > (2/3)) {
			r = new Ajax.Request('/inc/user_action.php?act=log_action&type=listen&ts=' + get_unix_time() + '&val=' + trackList[activeList][currentTrack].id + '&pos=' + pos + '&rem=' + (dur - pos) + '&vendor=' + playerDisplayed + '&current_url=' + Base64.encode(location.href), { method:'get' } );
			playback_event_count++;
		}
		
	}

}

function disable_playback_check () {
	if (playback_event_timeout!=undefined) { clearInterval(playback_event_timeout); playback_event_timeout = 0; return true; }
	else { return false; }
}


function toggle_item_activity (type, pos, page) {

	if ($('act_info_' + pos ).style.display !== "none") {
		e = new Effect.BlindUp('act_info_' + pos, { duration: 0.4 });
	} else if ($('act_info_' + pos ).innerHTML !== "") {
		e = new Effect.BlindDown('act_info_' + pos, { duration: 0.3 });
		$('act_info_' + id ).style.display = "none";
	} else {
		load_item_activity(type, trackList[activeList][pos].id, pos, page);
	}


}

function load_item_activity(type, id, pos, page) {

	if ($('act_info_loading_' + pos )) {
		$('act_info_loading_' + pos ).style.display = "";
		// Effect.Appear('act_info_loading_ ' + pos, { duration: 0.5 });
	}

	u = new Ajax.Updater('act_info_' + pos, '/inc/serve_activity_info.php', 
		{ 
			parameters: 'type=' + type + '&id=' + id + '&pos=' + pos + '&page=' + page + '&ts=' +  get_unix_time(),
			method: 'get',
	        asynchronous: true,
	        evalScripts: true
		}
		);

}


function show_sidebar_info(uid,method,section) {

var element = $(section);

if (element.style.display !== "none") {

	$(section).BlindUp();
	$('show_'+method).update('Show all &darr;');
	
} else {

	u = new Ajax.Updater (section,'../inc/serve_sidebar_profile_items.php',
		{ 
			parameters: 'uid=' + uid + '&method=' + method,
			method: 'get',
	        asynchronous: true,
	        evalScripts: true,
	        onCreate: function(request) {
	     	    $('loading_' + method).show();
	        },
	        onComplete:function(request){
	    		$('loading_' + method).hide();	    	
		        e = new Effect.toggle(section,'blind');
		        $(section).BlindDown();
		        $('show_'+method).update('Collapse &uarr;');
		        
	        }
		}
	
	);

}

}


function set_nav_item_active(eltid) {

	$$("li.active").each(function(elt) { elt.className = elt.className.replace(/active/,'');} );
	if ($('menu-item-username')) { $('menu-item-username').className = $('menu-item-username').className.replace(/active/,''); }

	// if we are given an element id, lets do something
	if ( eltid !== "" && $(eltid) ) { $(eltid).className = $(eltid).className + " active"; }

}

function setup_player_bar() {

	var playableCount = 0;
	if (typeof(trackList[document.location.href]) != 'undefined') {
		for (var i = 0; typeof(trackList[document.location.href][i]) != 'undefined'; i++) {
			if (trackList[document.location.href][i].type != "") { playableCount++;}
		}
	}
	
	debug("Detected " + playableCount + " tracks on this page: " + document.location.href);
	
	if (playerStatus!="PLAYING") { 
	
		if (trackList[document.location.href] === undefined || trackList[document.location.href].length === 0 || playableCount==0) {
		
			if ( $('player') ) { $('player' ).style.visibility = "hidden"; }
			hide_player_bar();
			return false;
			
		} else if ($('player-container').style.height=="0px") {
			show_player_bar();
		}
		
		if (activeList!=document.location.href) { 
			trackList[activeList] = Array(); // free memory, yay!
			if (activeList.search('/radio$')!=-1) { // disable radio updater
				clearInterval(radio_notificationTimeout);
				radio_notificationTimeout=0;
			} 
			activeList = document.location.href;
		}
		
		currentTrack = 0;
	
		set_now_playing_info(currentTrack);
	
		if (trackList[activeList][currentTrack].type=="normal" || document.location.href.search('/radio$')!= -1 ) { // radio is never in imeem

			if (playerDisplayed=="imeem") {
			
				e = new Effect.Morph('imeemPlayer', { style: { top: '32px' }, duration: '0.5' });
				e = new Effect.Morph('hypePlayer', { style: { top: '0px' }, duration: '0.5' });
				playerDisplayed="normal";
				
			}
			
			if (activeList.search('/radio$') != -1) {
				sendEvent("LOAD",{file:"http://stream.hypem.com/hype.mp3"});
			} else {
				sendEvent("LOAD",{file:"/serve/play/" + trackList[activeList][currentTrack].id + "/" + trackList[activeList][currentTrack].key,type:"mp3", duration: trackList[activeList][currentTrack].time});
			}
				
		} else if (trackList[activeList][currentTrack].type=="imeem") {
		
			if (playerDisplayed=="normal") {
			
				initImeem();			
				
			} else {

				playerStatus = "STOP_ON_LOAD"; // this is to prevent the player from playing onload if it's the first track
				thisMovie('imeemPlayer').load(trackList[activeList][currentTrack].imeem_id);

			}
						
		}
		
		$('player-page').style.visibility = "hidden";

		if (document.location.href.search('/radio$') != -1) {
			$('playerPrev').hide();
			$('playerNext').hide();
		}
		
	} else if (playerStatus=="PLAYING" && activeList == document.location.href) {

		set_track_bg(currentTrack,"green");
		if ( $('play_track_' + currentTrack ) ) {	$('play_track_' + currentTrack ).className="pause"; }
		if ( $('player') ) { $('player-main-button' ).className="pause"; }
		$('player-page').style.visibility = "hidden"; // now we are again in sync with page

	} else if (playerStatus=="PLAYING" && activeList != document.location.href) {
		
		$('player-page').style.visibility = "visible";
		
	}

}

function hide_player_bar() {
	e = new Effect.Morph('player-container', { style: { height: '0px' }, duration: '0.5' });

	$('player-page').style.display="none";
	
	if (playerDisplayed=="imeem") {
		e = new Effect.Morph('imeemPlayer', { style: { top: '32px' }, duration: '0.5' });
		e = new Effect.Morph('hypePlayer', { style: { top: '0px' }, duration: '0.5' });
		playerDisplayed = "normal";
	}
	
}

function show_player_bar() {
	e = new Effect.Morph('player-container', { style: { height: '32px' }, duration: '0.5' });
}

// ---- radio code ----- //

function radio_update() {

    if ((radio_counter + 1000) >= radio_timeout) {
        	            
    	r = new Ajax.Request('/inc/serve_radio_now_playing?ts=' + get_unix_time(), 
		{ method:'get',
			onSuccess: function(transport){
				var response = transport.responseText;
				
				radio_now_data = response.evalJSON();
				
				if (radio_now_data.remaining < 5000) {
					radio_timoeut = 5000;
				} else {
					radio_timeout = radio_now_data.remaining;
				}
				
				if (radio_now_data.id != radio_now_fileid && document.location.href.search('/radio$')!= -1) { // current track changed and we are still on that page
				
			        u = new Ajax.Updater('recently-posted', '/radio?now=1&ax=1&ts=' + get_unix_time(),
			        {
						method: 'get', asynchronous: true, evalScripts: true
					});
			
				} else if (radio_now_data.id != radio_now_fileid) { // we are off-page but should still update the info
				
					trackList[activeList][0] = radio_now_data;
					set_now_playing_info(currentTrack);
									
				}
				
			},
			onFailure: function() { radio_timeout = 15000; }
		});
		
		radio_counter = 0;
		
    } else {
    	radio_counter += 500;
    }
}


// ---- zeitgeist code ----- //
function load_imeem_player(pos,imeem_id) {

	stopTrack();
	hide_player_bar();

    if (document.getElementById('album-player' + pos).innerHTML === "") {

		var flashvars = {
			r: "web",
			aa: "0",
			ak: imeem_id,
			primaryColor: 'ffffff',
			at: 'musicPlaylist',
			autoStart: 'true',
			tile: '1',
			pm: 'p',
			autoShuffle: 'false',
			isStandalone: 'true',
			pid: imeem_id,
			backColor: '000000',
			linkColor: '51A001',
			secondaryColor: '777777'
		};
		
		var params = {
			allowscriptaccess: "always",
			wmode: "transparent"
		};
		
		var attributes = {
		  id: 'album-art' + pos,
		  name: 'album-art' + pos,
		  styleclass: 'album-art' + pos
		};
	
		swfobject.embedSWF('http://resources-p2.imeem.com/resources/versioned/131/flash/audio_player3.swf', 'album-player' + pos, "360","330", "8.0.0", false, flashvars, params, attributes);
	
		e = new Effect.SlideUp('album-art' + pos, { duration: 1.5 }); 
		e = new Effect.Morph('album' + pos, { style: { height:'330px'}}); 
		e = new Effect.SlideUp('album-player-link' + pos);

	
	}
	
}

function next_review(pos) {
	
	if (album_r_curr[pos] + 1 > (album_rs[pos].length - 1)) {
		album_r_curr[pos] = 0;
		show_review(pos);
	} else if (album_r_curr[pos]===0 || album_r_curr[pos]===undefined) {
		album_r_curr[pos] = 1;
		show_review(pos);
	} else {
		album_r_curr[pos]++;
		show_review(pos);
	}

}

function prev_review(pos) {

	if (album_r_curr[pos] - 1 < 0 || album_r_curr[pos]===undefined) {
		album_r_curr[pos] =  album_rs[pos].length - 1;
		show_review(pos);
	} else {
		album_r_curr[pos]--;
		show_review(pos);
	}
	
}

function show_review(pos) {
	document.getElementById('album-review' + pos).style.display="none";
	document.getElementById('album-review-text' + pos).innerHTML = album_rs[pos][album_r_curr[pos]].rbody;
	e = new Effect.Appear('album-review' + pos, 0.5);
}


//
// acct creation lightbox
// <3 twitter.com
//
function updateUrl(value) {
	$('username_url').innerHTML = value;
}

function checkPw() {
	if ($("user_password_confirmation").value !== $("user_password").value) {
		$("nomatch").style.display = "inline";
		$("submitlogin").disabled=true;
		return 1;
	} else {
		$("nomatch").style.display = "none";
		$("submitlogin").disabled=false;
		return false;
	}
}

// acct creation

function create_account(type, id) {
	
	if (checkPw()) { 
		$("submitlogin").disabled=false; 
		$("submitlogin").value="Save";
		return false; 
	} 
	
r = new Ajax.Request('/inc/user_action.php', 
		{ evalScripts:true, 
				parameters:'act=create_user&user=' + $("user_screen_name").value + '&pass=' + Base64.encode($("user_password").value) +
				'&email=' + $("user_email").value + '&newsletter=' + $("user_news").value,
				
			onSuccess: function(transport){
  				
  				var response = transport.responseText || "no response received from auth server";
	
  				if (response === "OK") { 
  					
					// using the things we get passed along, mark this under the new/logged in account  					
  					if (type && id) {
  						loggedin=1;
  						r = new Ajax.Request('/inc/user_action.php?act=toggle_favorite&ts=' + get_unix_time() + '&type=' + type + '&val=' + id + '&current_url=' + Base64.encode(location.href), 
						{ method:'get',
							onSuccess: function(transport){ window.location.href = unescape(window.location.pathname);	},
							onFailure: function(){ window.location.href = unescape(window.location.pathname); }		
						});
  					} else {   					
  						window.location.href = unescape(window.location.pathname);
  					}
  					
  				} else if (response === "BADEMAIL") { 
  					$("bademail").style.display = "block";
  					Element.update("bademail", "This is an invalid email address");
					$("user_email").background = "#ff3333";
					$("submitlogin").disabled=false;
  					$("submitlogin").value="Sign up";
				} else if (response === "EXISTS") { 
  					$("bademail").style.display = "block";
  					Element.update("bademail", "This email or username is taken");
  					$("user_email").background = "#ff3333";
  					$("submitlogin").disabled=false;
  					$("submitlogin").value="Sign up";
  				} else {
  					alert("We've encountered a problem creating your account.  Please try again.  Error was: " + response ); 
  					$("submitlogin").disabled=false;
  					$("submitlogin").value="Sign up";
  				}
				  				
			},
		
			onFailure: function(){ 
					alert("We've encountered a problem creating your account.  An alert has been created.  Please try again in a few minutes."); 
					$("submitlogin").disabled=false; 
			}	
			
			})(); // end request 

}

function user_login(type,id) {
	
r = new Ajax.Request('/inc/user_action.php', 
		{ evalScripts:true, 
			parameters:'act=login&user=' + $("user_screen_name").value + '&pass=' + Base64.encode($("user_password").value),
			
			onSuccess:function(transport){
  				
  				var response = transport.responseText || "no response received from auth server";
	
  				if (response === "OK") { 
					
					// using the things we get passed along, mark this under the new/logged in account  					
  					if (type && id) {
  						loggedin=1;
  						r = new Ajax.Request('/inc/user_action.php?act=toggle_favorite&ts=' + get_unix_time() + '&type=' + type + '&val=' + id + '&current_url=' + Base64.encode(location.href), 
						{ method:'get',
							onSuccess: function(transport){ window.location.href = unescape(window.location.pathname);	},
							onFailure: function(){ window.location.href = unescape(window.location.pathname); }		
						});
  					} else {   					
  						//window.location.href = unescape(window.location.pathname);
	  					location.reload(true);
  					}
  					
  				} else {
  					$("formmsg").style.display = "block";
  					
					$("user_password").background = "#ff3333"; 
					$("submitlogin").disabled=false; 
					$("submitlogin").value="Sign in";
  				}
				  				
			},
		
			onFailure: function(){ 
				$("formmsg").style.display = "block";
				
				$("user_password").background = "#ff3333"; 
				$("submitlogin").disabled=false; 
				$("submitlogin").value="Sign in";
			}	
			
		});

	return false;

}

function change_password (oldpw,newpw,key) {
	
	if (checkPw()) { 
		$("submitlogin").disabled=false; 
		$("submitlogin").value="Save";
		return false; 
	} 
	
r = new Ajax.Request('/inc/user_action.php', 
		{ evalScripts:true, 
			parameters:'act=change_password&oldpw=' + Base64.encode(oldpw) + '&newpw=' + Base64.encode(newpw) + '&key=' +  key,
			
			onSuccess:function(transport) {
  				
  				var response = transport.responseText || "no response received from auth server";
	
  				if (response === "OK") { 
					$("defaultform").style.display="none";
					
					$("formmsg").style.color = "green"; 
					Element.update("formmsg", "Your password has been changed! You are ready to play!<br/><a href='#' onclick='Lightbox.hideBox();return false;'>[close this box]</a>");
					$("formmsg").style.display="";

  					
  				} else if (response === "BADOLDPASSWORD"){
					$("formmsg").style.color = "red"; 
					Element.update("formmsg", "The current password you've provided is incorrect"); 
					$("formmsg").style.display="";

					$("submitlogin").disabled=false;
					$("submitlogin").value="Save";
  				} else if (response === "BADKEY"){
					$("formmsg").style.color = "red"; 
					Element.update("formmsg", "We can't find your password reset request.  Please try requesting again by clicking Login -> Recover Password<br/><a href='#' onclick='Lightbox.hideBox();return false;'>[close this box]</a>"); 
					$("formmsg").style.display="";

					$("submitlogin").disabled=false;
					$("submitlogin").value="Save";
  				} else {
  					$("formmsg").style.color = "red"; 
					Element.update("formmsg", "Could not reset your password, error was:" + response); 
					$("formmsg").style.display="";
					
					$("submitlogin").disabled=false;
					$("submitlogin").value="Save";
				}
				  				
			},
		
			onFailure: function() { 
					$("formmsg").style.color = "red"; 
					Element.update("formmsg", "Could not reset your password, error was:" + response); 
					$("formmsg").style.display="";
					
					$("submitlogin").disabled=false; 
					$("submitlogin").value="Save";
			
			}
		});

	return false;

}

function user_logout() {
	
	r = new Ajax.Request('/inc/user_action.php', 
			{ evalScripts:true, 
				parameters:'act=logout',
				
			onSuccess: function(transport){
  				
  				var response = transport.responseText || "no response received from auth server";
	
  				if (response === "OK") { 
  					// window.location.href = "http://hypem.com/";
  					location.reload(true);
  				} else {
  					alert("We've encountered a problem logging you out. :( Please tell us about the error.  It was " + response); 
  				}
				  				
			},
		
			onFailure: function(){ 
				alert("We've encountered a problem logging you out, but it's probably ok. :("); 
			}	
			});

}

function user_forgot() {
	
r = new Ajax.Request('/inc/user_action.php', 
		{ evalScripts:true, 
			parameters:'act=forgot&email=' + $("user_email").value,
			
			onSuccess:function(transport){
  				
  				var response = transport.responseText || "no response received from auth server";
	
  				if (response === "OK") { 
					$("defaultform").style.display="none";
					
					$("formmsg").style.color = "green"; 
					Element.update("formmsg", "Instructions on resetting your password have been sent!<br/><a href='#' onclick='Lightbox.hideBox();return false;'>[close this box]</a>");
					$("formmsg").style.display = "block";
					
					// $("submitlogin").value="Sign in";
			
  				} else {
  					$("formmsg").style.color = "red"; 
					Element.update("formmsg", "We can't find your email. Try another?");
  					$("formmsg").style.display = "block";
								
					$("submitlogin").disabled=false; 
					$("submitlogin").value="Reset Password";
  				}
				  				
			},
		
			onFailure: function(){ 
					$("formmsg").style.color = "red"; 
					Element.update("formmsg", "We ran into an error resetting your password.  Try again?");
					$("formmsg").style.display = "block";
					
					$("submitlogin").disabled=false; 
					$("submitlogin").value="Reset Password";
			}	
			
		});

	return false;

}

function save_iam() {
	
	u = new Ajax.Updater ('iam','../inc/save_status.php', {
	parameters: 'form=account&uid='+ $('uid').getValue() +
				'&iam=' + $('iam_input').getValue(),				
	method: 'post',
	onComplete:function(request) {
		//	$('iam_form').hide();
		//	$('iam').show();
		$('save_iam').style.visibility='hidden';
		$('cancel_iam').style.visibility='hidden';
		$('iam').className='iam-show';
	}
	});
}

function save_location() {
	
	u = new Ajax.Updater ('location','../inc/save_status.php', {
	parameters: 'form=account&uid='+ $('uid').getValue() +
				'&location=' + $('location_input').getValue(),
				
	method: 'post',
	onComplete:function(request) {
	$('location_form').hide();
	$('location').show();
	}
	});
}

function UploadToS3()
{
  var s3form = $("form1");
  s3form.target="fileframe";
  s3form.action="inc/img_upload.php";
  $('current_img').update('New image will be:');
  s3form.submit();
}

function update_user_img() {

//var id = window.frames.fileframe.$('new_img_id').value;

r = new Ajax.Request('/inc/get_img_memcache.php',
{
onComplete:function(transport) {
var response = transport.responseText;

$('avatar-mini').src='http://faces-s3.hypem.com/'+response+'_25.png';
$('avatar').src='http://faces-s3.hypem.com/'+response+'_75.png';

}
});
}

function update_usr_url() {

r = new Ajax.Request('/inc/get_url_memcache.php', {
	onComplete:function(transport) {
		var response = transport.responseText;
		$('usr_url').update(''+response);
			}
		}
	);

}

function save_account () {

		r = new Ajax.Request('/inc/user_action.php', 
		{ evalScripts:true, 
			parameters:'act=update_profile&form=account&fullname=' + $('user_fullname').value + 
							'&username=' + $('user_screen_name').value + 
							'&email=' + $('user_email').value +
							'&url=' + $('user_url').value +
							'&iam=' + $('user_iam').value +
							'&location=' + $('user_location').value +
							'&news=' + $('user_news').checked,
			
			onSuccess:function(transport){
	
				var response = transport.responseText || "unable to contact twitter.com";

				if (response === "OK") { 
					// turn off the form
					$("defaultform").style.display="none";
					
					// show the msg
					$("formmsg").style.color = "green"; 
					Element.update("formmsg", "Your information was updated!<br/><a href='#' onclick='Lightbox.hideBox();update_usr_url();return false;'>[close this box]</a>");
					$("formmsg").style.display = "block";
				
				} else if (response === "NOCOOKIE") {
					$("formmsg").style.color = "red"; 
					Element.update("formmsg", "We ran into a problem updating your account.  Please make sure you allow cookies from hypem.com.");
					$("formmsg").style.display = "block";
					
					$("submitlogin").disabled=false; 
					$("submitlogin").value="Save";	
					
				} else if (response === "USEREXISTS") {
					$("formmsg").style.color = "red"; 
					Element.update("formmsg", "This username exists, please choose another.");
					$("formmsg").style.display = "block";
					
					$("submitlogin").disabled=false; 
					$("submitlogin").value="Save";	
					
				} else if (response === "EMAILEXISTS") {
					$("formmsg").style.color = "red"; 
					Element.update("formmsg", "This email is either invalid or taken.  Please enter another.");
					$("formmsg").style.display = "block";
					
					$("submitlogin").disabled=false; 
					$("submitlogin").value="Save";	
					
				
				} else {
					$("formmsg").style.color = "red"; 
					Element.update("formmsg", "An error occurred saving your info. It was:" + response);
					$("formmsg").style.display = "block";
					
					$("submitlogin").disabled=false; 
					$("submitlogin").value="Save";				
				}
			},
			
			onFailure: function(){ 
				$("formmsg").style.color = "red"; 
				Element.update("formmsg", "An error occurred saving your info. Please try again later.");
				$("formmsg").style.display = "block";
				
				$("submitlogin").disabled=false; 
				$("submitlogin").value="Save";
			}	
		
		
	});
				
	return false;

}


function save_twitter() {

$("formmsg").style.color = "green"; 
Element.update("formmsg", "We are checking your twitter credentials, please wait.  This can take a minute or two at most.");
$("formmsg").style.display = "block";

r = new Ajax.Request('/inc/user_action.php', 
		{ evalScripts:true, 
			parameters:'act=check_twitter&tw_username=' + $("tw_username").value + '&tw_password=' + Base64.encode($("tw_password").value),
			
			onSuccess:function(transport){
  				
  				var response = transport.responseText || "unable to contact twitter.com";
	
  				if (response === "OK" || response === "EMPTY") { 
  									
  					r = new Ajax.Request('/inc/user_action.php', 
					{ evalScripts:true, 
						parameters:'act=update_profile&form=twitter&tw_ok=1&tw_username=' + $('tw_username').value + 
										'&tw_password=' + Base64.encode($('tw_password').value) + 
										'&tw_share_track=' + $('tw_share_track').checked +
										'&tw_share_blog=' + $('tw_share_blog').checked +
										'&tw_share_search=' + $('tw_share_search').checked +
										'&tw_share_person=' + $('tw_share_person').checked,
						
						onSuccess:function(transport){
  				
	  						var response = transport.responseText || "Could not your twitter account information";
		
	  						if (response === "OK") { 
	  					
								$("defaultform").style.display="none";
								
								$("formmsg").style.color = "green"; 
								Element.update("formmsg", "Great! Twitter settings updated!<br/><a href='#' onclick='Lightbox.hideBox();return false;'>[close this box]</a>");
								$("formmsg").style.display = "block";
							
							} else if (response === "EMPTY") { 
	  					
								$("defaultform").style.display="none";
								
								$("formmsg").style.color = "green"; 
								Element.update("formmsg", "Cool! We've erased your twitter credentials from our servers!<br/>PS. We still like you. <a href='/inc/lb_sharing.php' onclick='Lightbox.hideBox();Lightbox.showBoxByAJAX(\"/inc/lb_sharing.php\", 350, 450);return false;'>click to re-enter your twitter info</a><br/><br/><a href='#' onclick='Lightbox.hideBox();return false;'>[close this box]</a>");
								$("formmsg").style.display = "block";
							
							
							} else {
								$("formmsg").style.color = "red"; 
								Element.update("formmsg", "An error occurred contacting twitter. Please try again later.");
								$("formmsg").style.display = "block";
								
								$("submitlogin").disabled=false; 
								$("submitlogin").value="Save";				
							}
						},
						
						onFailure: function(){ 
							$("formmsg").style.color = "red"; 
							Element.update("formmsg", "An error occurred saving your twitter info. Please try again later.");
							$("formmsg").style.display = "block";
							
							$("submitlogin").disabled=false; 
							$("submitlogin").value="Save";
						}	
					
					
				});
					
			
  				} else {
  					$("formmsg").style.color = "red"; 
					Element.update("formmsg", "The username and password were not accepted by twitter");
  					$("formmsg").style.display = "block";
								
					$("submitlogin").disabled=false; 
					$("submitlogin").value="Save";
  				}
				  				
			},
		
			onFailure: function(){ 
					$("formmsg").style.color = "red"; 
					Element.update("formmsg", "An error occurred contacting twitter. Please try again later.");
					$("formmsg").style.display = "block";
					
					$("submitlogin").disabled=false; 
					$("submitlogin").value="Save";
			}	
			
		});

	return false;

}

function save_lastfm () {

$("formmsg").style.color = "green"; 
Element.update("formmsg", "We are checking your Last.fm credentials, please wait.  This can take a minute or two at most.");
$("formmsg").style.display = "block";

r = new Ajax.Request('/inc/user_action.php', 
		{ evalScripts:true, 
			parameters:'act=check_lastfm&lf_username=' + $("lf_username").value + '&lf_password=' + Base64.encode($("lf_password").value),
			
			onSuccess:function(transport){
  				
  				var response = transport.responseText || "unable to contact last.fm. they recommend a cup of tea";
	
  				if (response === "OK" || response === "EMPTY") { 
  									
  					r = new Ajax.Request('/inc/user_action.php', 
					{ evalScripts:true, 
						parameters:'act=update_profile&form=lastfm&lf_ok=1&lf_username=' + $('lf_username').value + 
										'&lf_password=' + Base64.encode($('lf_password').value) + 
										'&lf_scrobble_track=' + $('lf_scrobble_track').checked,
						
						onSuccess:function(transport){
  				
	  						var response = transport.responseText || "Could not save your last.fm information";
		
	  						if (response === "OK") { 
	  					
								$("defaultform").style.display="none";
								
								$("formmsg").style.color = "green"; 
								Element.update("formmsg", "Great! Scrobbling settings updated!<br/><a href='#' onclick='Lightbox.hideBox();return false;'>[close this box]</a>");
								$("formmsg").style.display = "block";
							
							} else if (response === "EMPTY") { 
	  					
								$("defaultform").style.display="none";
								
								$("formmsg").style.color = "green"; 
								Element.update("formmsg", "Cool! We've erased your last.fm credentials from our servers!<br/>PS. We still like you.<br/><a href='/inc/lb_lastfm.php' onclick='Lightbox.hideBox();Lightbox.showBoxByAJAX(\"/inc/lb_lastfm.php\", 350, 450);return false;'>click to re-enter your lastfm info</a><br/><br/><a href='#' onclick='Lightbox.hideBox();return false;'>[close this box]</a>");
								$("formmsg").style.display = "block";
							
							} else {
								$("formmsg").style.color = "red"; 
								Element.update("formmsg", "An error occurred contacting last.fm. Please try again later.");
								$("formmsg").style.display = "block";
								
								$("submitlogin").disabled=false; 
								$("submitlogin").value="Save";				
							}
						},
						
						onFailure: function(){ 
							$("formmsg").style.color = "red"; 
							Element.update("formmsg", "An error occurred saving your last.fm info. Please try again later.");
							$("formmsg").style.display = "block";
							
							$("submitlogin").disabled=false; 
							$("submitlogin").value="Save";
						}	
					
					
				});
					
			
  				} else {
  					$("formmsg").style.color = "red"; 
					Element.update("formmsg", "The username and password were not accepted by last.fm");
  					$("formmsg").style.display = "block";
								
					$("submitlogin").disabled=false; 
					$("submitlogin").value="Save";
  				}
				  				
			},
		
			onFailure: function(){ 
					$("formmsg").style.color = "red"; 
					Element.update("formmsg", "An error occurred contacting last.fm. Please try again later.");
					$("formmsg").style.display = "block";
					
					$("submitlogin").disabled=false; 
					$("submitlogin").value="Save";
			}	
			
		});

	return false;

}


function show_all_blogs() {

	if ($('jumpMenu').getValue() === "Blog listings") {

		u = new Ajax.Updater('blogs_list','inc/serve_all_blogs_listbox.php',{
			onCreate:function(request) {
			$('blog_name').show();
			$('blogs_list').update('<option>Please wait...</option>');
			}
		});
	
	} else {
	$('blog_name').hide();

	}
}

function generate_blog_code(siteid) {

u = new Ajax.Updater('code','inc/serve_html_blog_claim.php',{method: 'get',
parameters: 'siteid='+siteid,
onComplete:function(transport) {
		var response = transport.responseText;
		$('code').value=response;
		},
onCreate: function(request) {
		$('code').value='Please wait...';

}
});
}

function claim_blog() {

r = new Ajax.Request('inc/check_blog_claim.php',
	{method: 'get', 
	 parameters: 'blog='+$('blogpick').getValue(),
	 onCreate: function(request) {
	//$('activate').disabled=true;
		$('activate').value='Please wait...';
	},
	onComplete:function(transport) {
		var response = transport.responseText;
		if (response === "ok") {
			$('activate').value='OK';
		} else {
			$('activate').value=response;
		}
	}
	}
	);

}


function save_blog_edit(siteid) {

r = new Ajax.Request('inc/save_blog_edit.php',{method:'get', 
				parameters: 'siteid='+siteid+'&description=' + $('description').getValue() + '&id3_1=' + $('tags1').getValue() + '&id3_2=' + $('tags2').getValue() + '&id3_3=' + $('tags3').getValue(),
				onComplete: function(request) {
				$('submit').disabled = false;
				$('submit').value = 'Save';
				$('msg').update('Blog information was updated successfuly');
				$('msg').fade({delay:2});
				}
				});

}




/*
function show_rectangle_ad(page_num) {

if (typeof ord=='undefined') {ord=Math.random()*10000000000000000;}
//document.write('<script language="JavaScript" src="http://ad.doubleclick.net/adj/buz.hypem/page5;tile=1;sz=728x90;ord=' + ord + '?" type="text/javascript"><\/script>');

debug("attempting to insert rectangle ad");
// this is 
if($('ad-rectangle')) {
    script = new Element('script', { id: "js_ad_recntangle", type: 'text/javascript', src: 'http://ad.doubleclick.net/adj/buz.hypem/page' + page_num + ';tile=2;sz=300x250;ord=' + ord + '?'});
    $('ad-rectangle').replaceChild(script, $('ad-rectangle-inner'));
}


}*/
