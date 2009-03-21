$(function(){

	// Open + close detail element
	$("a.detail_toggle").toggle(
		function(){
			
			// Setup vars
			var currentIndex = $("a.detail_toggle").index(this);
			var openDetail = $(".detail_row").eq(currentIndex);
			openedText = "Close detail";
			closedText = "Display detail";
			
			// Perform actions
			$(this).addClass("close");
			$("span", this).text(openedText);
			$(openDetail).slideDown();
			
		},
		function(){
			
			var currentIndex = $("a.detail_toggle").index(this);
			var openDetail = $(".detail_row").eq(currentIndex);
			
			$(this).removeClass("close");
			$("span", this).text(closedText);
			$(openDetail).slideUp();
		}
	);	

	$("a.album_trig").hover(
		 function(){
			getIndex = $("a.album_trig").index(this);
			popupalbum = $(".albumpop").eq(getIndex);
			albumOffset = $(this).offset();
			$(popupalbum).css("top", albumOffset.top - 163 + "px");
			$(popupalbum).fadeIn();
		},
		function(){
			$(popupalbum).fadeOut();
		}
	);

		
	$("a.discog_trig").hover(
		 function(on){
			getIndex = $("a.discog_trig").index(this);
			popupdiscog = $(".discogpop").eq(getIndex);
			discogOffset = $(this).offset();
			$(popupdiscog).css("top", discogOffset.top - 149 + "px");
			$(popupdiscog).fadeIn();
		},
		function(){
			$(popupdiscog).fadeOut();
		}
	);
	
	
	$("a.venue_trig").hover(
		 function(){
			getIndex = $("a.venue_trig").index(this);
			popupvenue = $(".venuepop").eq(getIndex);
			venueOffset = $(this).offset();
			$(popupvenue).css("top", venueOffset.top - 150 + "px");
			$(popupvenue).fadeIn("slow");
		},
		function(){
			$(popupvenue).fadeOut();
		}
	);
	
	$("a.buytickets_trig").hover(
		 function(){
			getIndex = $("a.buytickets_trig").index(this);
			popupbuytickets = $(".buyticketspop").eq(getIndex);
			buyticketsOffset = $(this).offset();
			$(popupbuytickets).css("top", buyticketsOffset.top - 159 + "px");
			$(popupbuytickets).fadeIn("slow");
		},
		function(){
			$(popupbuytickets).fadeOut();
		}
	);

});


