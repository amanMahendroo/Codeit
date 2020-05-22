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

	$('.htm, .css, .js').keypress(function (event) {
		setTimeout(compile, 100)
	})

	$('.htm, .css, .js').keypress(function (event) {
		if (event.which == 9) {

		}
	})

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
	let html = window.document.getElementById('htm').textContent
	let css = window.document.getElementById('css').textContent.replace(/\s/g, "")
	let js = window.document.getElementById('js').textContent
	let output = window.document.getElementById('view')
	let document = output.contentDocument, style = document.createElement("style"), script = document.createElement("script");
	
	window.document.getElementById('htm').innerHTML = neatHTML(html)
	window.document.getElementById('css').innerHTML = neatCSS(css)

	document.body.innerHTML = html
	style.innerHTML = css
	script.innerHTML = js
	document.body.appendChild(style);
	document.body.appendChild(script);
}

function neatHTML(text) {
	text = text.replace(/(<\/?)([a-zA-Z]+)(\s|[>])/igm, '$1<b>$2</b>$3');
	return text
}

function neatCSS(text) {
	
}