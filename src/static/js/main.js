    	$(function(){
    		var currentKiosk = null;
    		var status = $('#status');
    		var container = $('#coupons');
    		
    		var init = function(){
	    		$.ajax({
				  url: "/kiosk",		
				  dataType: "json",
				  success: function(kiosk){
				  	if(currentKiosk!== kiosk){
				  		status.html(kiosk);
				  		currentKiosk = kiosk;
				 		//getCoupons();
				 	}
				 	setTimeout(init, 10000); 
				  },
				  error : function(e){
				  	status.html('error: ' + e.message);
				  }	  
				});
			};
			
			var getCoupons = function(){			
			   	$.ajax({
				  url: "/coupon",		
				  success: function(coupons){
				  	container.empty();
				  	coupons.each(function(index,coupon){
				  		container.append('<img src=/static/coupon/"'+ coupon  +'"');
				  	});
				  },
				  error : function(e){
				  	status.html('error retreiving coupons');
				  }	  
				});
			}
			
			init();
		})