$(document).ready(function () {
	colors()
	$('.reg').click(function () {
		$('.first').css('display', 'none')
		$('.second').css('display', 'block')
	})

	$('.back').click(function () {
		$('.first').css('display', 'block')
		$('.second').css('display', 'none')
	})
})

function colors() {
	let root = document.documentElement
	let t = new Date().getHours()
	if (t > 19 || t < 6) {
		root.style.setProperty('--back', '#000')
		root.style.setProperty('--shade', '#fff1')
		root.style.setProperty('--text', '#fff')
		$('#logo img').attr('src', 'dark.png')
	} else {
		root.style.setProperty('--back', '#fff')
		root.style.setProperty('--shade', '#1111')
		root.style.setProperty('--text', '#000')
		$('#logo img').attr('src', 'light.png')
	}
}