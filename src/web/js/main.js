$(document).ready(function() {
	var couponsButton = $("#my-coupon-btn");
	var myCouponsOpen = false;

	// Move the main container to the proper location
	$('#main').css("top", $('#header-container').outerHeight(true));

	// On My Coupons click, open or close the coupons menu
	couponsButton.on("click", function() {
		var navbarHeight = $("#header-container").outerHeight(true);
		var content = $('#main');
		var myCoupons = $('#my-coupons');
		var myCouponsHeight = myCoupons.outerHeight(true);

		// If the coupons drawer is already open, then close it
		if (myCouponsOpen) {
			myCoupons.css("top", navbarHeight);
			content.css("top", navbarHeight + myCouponsHeight);
			myCoupons.animate({
				top: navbarHeight - myCouponsHeight
			});
			content.animate({
				top: navbarHeight
			});
			myCouponsOpen = false;
		}
		else {
			myCoupons.css("top", navbarHeight - myCouponsHeight);
			content.css("top", navbarHeight);
			myCoupons.animate({
				top: navbarHeight
			});
			content.animate({
				top: navbarHeight + myCouponsHeight
			});
			myCouponsOpen = true;
		}
	});
});