let result = '';

$(document).ready(function () {
	$('html, body').keypress(function (event) {
		if (event.which == 101) {
			if ($('.output').hasClass('full')) {
				$('.output').removeClass('full')
				$('.output').addClass('editor')
			}
		}
	})

	setInterval(compile, 1000)

	$('.buttons .view').click(function () {
		$(this).toggleClass('opened')
	})

	$('.buttons .view .p').click(function () {
		console.log(1)
		$('.output').removeClass('phone')
		$('.output').removeClass('editor')
		$('.output').removeClass('full')
		$('.output').addClass('phone')
	})

	$('.buttons .view .f').click(function () {
		console.log(1)
		$('.output').removeClass('phone')
		$('.output').removeClass('editor')
		$('.output').removeClass('full')
		$('.output').addClass('full')
	})

	$('.buttons .view .e').click(function () {
		console.log(1)
		$('.output').removeClass('phone')
		$('.output').removeClass('editor')
		$('.output').removeClass('full')
		$('.output').addClass('editor')
	})

	$('.htm').css('z-index', 100)

	$('.buttons .h').click(function () {
		$('.buttons .h, .buttons .c, .buttons .j').removeClass('active')
		$('.buttons .h').addClass('active')
		$('.htm, .css, .js').css('z-index', 0)
		$('.htm').css('z-index', 100)
	})
	
	$('.buttons .c').click(function () {
		$('.buttons .h, .buttons .c, .buttons .j').removeClass('active')
		$('.buttons .c').addClass('active')
		$('.htm, .css, .js').css('z-index', 0)
		$('.css').css('z-index', 100)
	})
	
	$('.buttons .j').click(function () {
		$('.buttons .h, .buttons .c, .buttons .j').removeClass('active')
		$('.buttons .j').addClass('active')
		$('.htm, .css, .js').css('z-index', 0)
		$('.js').css('z-index', 100)
	})
})

function compile() {
	let html = window.document.getElementById('htm')
	let css = window.document.getElementById('css')
	let js = window.document.getElementById('js')
	let output = window.document.getElementById('view')

	var document = output.contentDocument, style=document.createElement("style"), script=document.createElement("script");
	document.body.innerHTML=html.textContent;
	style.innerHTML=css.textContent.replace(/\s/g,"");
	script.innerHTML=js.textContent;
	document.body.appendChild(style);
	document.body.appendChild(script);
}