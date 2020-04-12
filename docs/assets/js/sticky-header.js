$(window).scroll(function(){
	if($(window).scrollTop() >= 260) {
		$('nav').addClass('sticky');
	} else {
		$('nav').removeClass('sticky');
	}
});

$('nav a').click(function(event) {
	var id = $(this).attr("href");
	var offset = 150;
	var target = $(id).offset().top - offset;
	$('html, body').animate({
		scrollTop: target}, 300);
});