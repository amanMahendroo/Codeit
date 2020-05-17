let result = '';

$(document).ready(function () {
	$('html, body').keypress(function () {
		setTimeout(function () {
			let html = $('.htm').text()
			let css = $('.css').text()
			let js = $('.js').text()
			let code = '<html><head></head><body><style scoped>' + css + '</style><script>' + js + '</script>' + html + '</body></html>'
			result = $.parseHTML(code)
			console.log(result)
			$('.output').empty()
			$('.output').append(result)
		}, 50)
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