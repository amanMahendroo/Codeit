colors()

$(document).ready(function () {
	setInterval(colors, 5000)

	$('html').click(function(e) {                    
		if(!$(e.target).hasClass('console') && !$(e.target).hasClass('run')) {
			$('.console').removeClass('console-open') 
		}
	})

	$('.run').click(function () {
		$('.console').addClass('console-open')
	})
})

function colors() {
	let root = document.documentElement
	let t = new Date().getHours()
	if (t > 19 || t < 6) {
		root.style.setProperty('--back', '#000')
		root.style.setProperty('--shade', '#111')
		root.style.setProperty('--hover', '#222')
		root.style.setProperty('--active', '#333')
		root.style.setProperty('--text', '#fff')
	} else {
		root.style.setProperty('--back', '#eee')
		root.style.setProperty('--shade', '#ddd')
		root.style.setProperty('--hover', '#ccc')
		root.style.setProperty('--active', '#bbb')
		root.style.setProperty('--text', '#000')
	}
}