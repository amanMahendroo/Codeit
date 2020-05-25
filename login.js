$(document).ready(function () {
	colors()
	$('.reg').click(function () {
		$('.first').css('display', 'none')
		$('.second').css('display', 'block')
	})

	$('.facebook, .google, .submit').click(function () {
		window.location.href = "index.html"
	})
})

function colors() {
	let root = document.documentElement
	let t = new Date().getHours()
	if (t > 22 || t < 6) {
		root.style.setProperty('--back', '#000')
		root.style.setProperty('--shade', '#fff1')
		root.style.setProperty('--text', '#fff')
		$('#logo').attr('src', 'dark.png')
	} else {
		root.style.setProperty('--back', '#fff')
		root.style.setProperty('--shade', '#1111')
		root.style.setProperty('--text', '#000')
		$('#logo').attr('src', 'light.png')
	}
}