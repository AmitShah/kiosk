    	$(function(){
    		//setup datastore
    		var store = new Persist.Store('mycoupons');
    		var templates = {};
    		$('[type="text/x-handlebars"]').each(function(i,e){
    			var j = $(e);
    			templates[j[0].id] = Handlebars.compile(j.html())
    		});
    		var currentKiosk = null;
    		var status = $('#status');
    		var myCoupons = $('#mycoupons');
    		var currentCoupons = $('#currentCoupons');
    		var debug = $('#debug');
    		
    		myCoupons.delegate('.remove', 'click', function(){
    			var elem = $(this);
    			var barcode = elem.data('remove')+'';
    			store.remove(barcode);
    			$('#mycoupon-'+barcode).remove();
    			
    			//TODO:search coupons, revert button
    			
    		});
    		
    		currentCoupons.delegate('.add', 'click', function(){
    			var elem = $(this);    			
    			var barcode = elem.data('barcode')+'';    			
    			store.set(barcode,1);
    			myCoupons.append(templates['mycoupon']({barcode:barcode}));
				myCoupons.find('#mycoupon-'+barcode+' .barcode').barcode(barcode, "ean13", {barWidth:2});
				
				//TODO: change button 
				
    		});
    		var renderMyCoupons = function(){
    			store.iterate(function(k,v){
    				myCoupons.append(templates['mycoupon']({barcode:k}));
				  	myCoupons.find('#mycoupon-'+k+' .barcode').barcode(k, "ean13", {barWidth:2});
				  	
    			});
    		}
    		var init = function(){
    			
    			
    		
	    		$.ajax({
				  url: "/kiosk",		
				  dataType: "json",
				  success: function(kiosk){
				  	if(currentKiosk!== kiosk){
				  		status.html(kiosk);
				  		currentKiosk = kiosk;
				 		getCoupons();
				 	}
				 	setTimeout(init, 15000); 
				  },
				  error : function(e){
				  	debug.html('error: ' + e.message);
				  	status.html('<div class="glyphicon glyphicon-refresh" style="color:#777777;"></div> waiting for kiosk');
				  	currentCoupons.html('<h2 style="color:#777777;">none</h2>');
				  	currentKiosk = null;
				  	setTimeout(init, 15000);
				  }	  
				});
			};
			
			var getCoupons = function(){			
			   	$.ajax({
				  url: "/coupon",
				  dataType: "json",		
				  success: function(coupons){
				    if(coupons){
				    	currentCoupons.empty();
					  	for(c in coupons){
					  		var coupon = coupons[c];					  		
					  		var color = 'blue';
					  		var icon = 'glyphicon-plus';
					  		if(coupon.barcode && store.get(coupon.barcode)){
					  		 	color = "grey";
					  		 	icon = "glyphicon-ok";
					  		}
					  		currentCoupons.append(
					  			templates['coupon']({
					  				color:color,
					  				icon: icon,
					  				image:coupon.image, 
					  				barcode:coupon.barcode,//"1234567890128"
					  			}));					  		
					  	}
				  	}
				  },
				  error : function(e){
				  	status.html('error retreiving coupons');
				  }	  
				});
			}
			
			renderMyCoupons();
			init();
		})