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
			var albumIndex = $("a.album_trig").index(this);
			var popupalbum = $(".albumpop").eq(albumIndex);
			$(popupalbum).fadeIn();
		},
		function(){
			var albumIndex = $("a.album_trig").index(this);
			var popupalbum = $(".albumpop").eq(albumIndex)
			$(popupalbum).fadeOut();
		}
	);

		
	$("a.discog_trig").hover(
		 function(on){
			var discogIndex = $("a.discog_trig").index(this);
			var popupdiscog = $(".discogpop").eq(discogIndex);

			$(popupdiscog).fadeIn();
		},
		function(){
			var discogIndex = $("a.discog_trig").index(this);
			var popupdiscog = $(".discogpop").eq(discogIndex);
			$(popupdiscog).fadeOut();
		}
	);
	
	
	$("a.venue_trig").hover(
		 function(){
			var venueIndex = $("a.venue_trig").index(this);
			var popupvenue = $(".venuepop").eq(venueIndex);

			$(popupvenue).fadeIn("slow");
		},
		function(){
			var venueIndex = $("a.venue_trig").index(this);
			var popupvenue = $(".venuepop").eq(venueIndex);
			$(popupvenue).fadeOut();
		}
	);
	
	$("a.buytickets_trig").hover(
		 function(){
			var ticketIndex = $("a.buytickets_trig").index(this);
			var popupbuytickets = $(".buyticketspop").eq(ticketIndex);

			$(popupbuytickets).fadeIn("slow");
		},
		function(){
			var ticketIndex = $("a.buytickets_trig").index(this);
			var popupbuytickets = $(".buyticketspop").eq(ticketIndex);
			$(popupbuytickets).fadeOut();
		}
	);

});


