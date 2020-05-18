let result = '';

$(document).ready(function () {
	$('html, body').keypress(function (event) {
		console.log(event)
		if (event.which == 101) {
			if ($('.output').hasClass('full')) {
				$('.output').removeClass('full')
				$('.output').addClass('editor')
			}
		}
		setTimeout(function () {
			let html = $('.htm').text()
			let css = $('.css').text()
			let js = $('.js').text()
			let code = '<html><head></head><body><style scoped>' + css + '</style><script>' + js + '</script>' + html + '</body></html>'
			result = $.parseHTML(code)
			$('.output .view').empty()
			$('.output .view').append(result)
		}, 50)
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