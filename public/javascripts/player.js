var player = null;
function playerReady(thePlayer) {
  player = document.getElementById(thePlayer.id);
  addListeners(); 
}


function addListeners() {
  if (player) { 
    player.addModelListener("STATE", "stateListener");
  } else {
    setTimeout("addListeners()",100);
  }
}

function stateTracker(obj) { alert('the new state is: '+obj.state); };