    	$(function(){
    		
			$('.navbar-link').click(function(e){			
				e.preventDefault();
			})
    		//setup datastore
    		var store = new Persist.Store('mycoupons');
    		var couponCount= 0;
    		var templates = {};
    		$('[type="text/x-handlebars"]').each(function(i,e){
    			var j = $(e);
    			templates[j[0].id] = Handlebars.compile(j.html())
    		});
    		var currentKiosk = null;
    		var status = $('#status');
    		var myCoupons = $('#mycoupons');
    		var currentCoupons = $('#currentCoupons');
    		var pillCount = $('#couponCount');
    		var debug = $('#debug');
    		
    		myCoupons.delegate('.remove', 'click', function(){
    			try{
	    			var elem = $(this);
	    			var barcode = elem.data('remove')+'';
	    			store.remove(barcode);
	    			$('#mycoupon-'+barcode).remove();
	    			if(couponCount === 1){
	    				myCoupons.html(templates['mycouponEmpty']());
	    			}
	    			couponCount--;	
	    			currentCoupons.find('#coupon-'+barcode+' .grey')
	    				.removeClass('grey').addClass('add').addClass('blue')
	    				.find('span').removeClass('glyphicon-ok').addClass('glyphicon-plus');
	    			pillCount.html(couponCount);
	    			  	    			  			
	    		}catch(e){
	    		
	    		}	
    			
    		});
    		
    		currentCoupons.delegate('.add', 'click', function(){
    			try{
	    			var elem = $(this);    			
	    			var barcode = elem.data('barcode')+'';    			
	    			store.set(barcode,1);
	    			if(couponCount === 0){
						myCoupons.empty();//remove empty text	
					}
	    			couponCount++;	    			
	    			myCoupons.append(templates['mycoupon']({barcode:barcode}));
					myCoupons.find('#mycoupon-'+barcode+' .barcode').barcode(barcode, "ean8", {barWidth:2});					
					elem.removeClass('blue').removeClass('add').addClass('grey').find('span').removeClass('glyphicon-plus').addClass('glyphicon-ok');
					pillCount.html(couponCount);
				}catch(e){
				
				}
				//TODO: change button 
				
    		});
    		var renderMyCoupons = function(){
    			store.iterate(function(k,v){
    				myCoupons.append(templates['mycoupon']({barcode:k}));
				  	myCoupons.find('#mycoupon-'+k+' .barcode').barcode(k, "ean8", {barWidth:2});
				  	couponCount++;				  	
    			});
    			if (couponCount ===0){
    				myCoupons.html(templates['mycouponEmpty']());
    			}
    			pillCount.html(couponCount);
    		}
    		var init = function(){
    			$.ajax({
				  url: "/kiosk",		
				  dataType: "json",
				  cache:false,
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
				  cache:false,	
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