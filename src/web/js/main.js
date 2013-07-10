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
	var height = $('#collected-coupons').outerHeight(true);
	$('.available-coupons').css("top", height + header_height);
	$('#collected-coupons').css("bottom", -1*height);
	$('.expand-arrow').addClass("expanded");

	menu_open = true;
}

function closeMenu() {
	var header_height = $('.header-outer').outerHeight(true);
	var height = $('#collected-coupons').outerHeight(true);

	$('.available-coupons').css("top", header_height);
	$('#collected-coupons').css("bottom", 0);
	$('.expand-arrow').removeClass("expanded");

	menu_open = false;
}