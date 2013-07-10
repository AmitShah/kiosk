var menu_open = false;

function toggleMenu() {
	if (menu_open) {
		closeMenu();
	}
	else {
		openMenu();
	}
}

function openMenu() {
	var header_height = $('.header-outer').outerHeight(true);
	var height = $('#collectedCoupons').outerHeight(true);
	$('.available-coupons').css("top", height + header_height);
	$('#collectedCoupons').css("bottom", -1*height);
	$('.expand-arrow').addClass("expanded");

	menu_open = true;
}

function closeMenu() {
	var header_height = $('.header-outer').outerHeight(true);
	var height = $('#collectedCoupons').outerHeight(true);

	$('.available-coupons').css("top", header_height);
	$('#collectedCoupons').css("bottom", 0);
	$('.expand-arrow').removeClass("expanded");

	menu_open = false;
}