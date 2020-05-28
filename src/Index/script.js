colors()

$(document).ready(function () {
	setInterval(colors, 5000)

	$('.plus').click(function () {
		$(this).toggleClass('plus-clicked');
	})
	$('.minus').click(function () {
		$(this).toggleClass('minus-clicked');
	})
	$('.archive').click(function () {
		$(this).toggleClass('star-clicked');
	})

	$('.feed .new .code').click(function () {
		window.location.href = "webeditor.html"
	})

	$('.feed .new .add').click(function () {
		window.location.href = "editor.html"
	})

	$('.ac').click(function () {
		$('.account').css('z-index', 80)
		$('.feed').css('z-index', 0)
		$('.extra').css('z-index', 0)
	})

	$('.fd').click(function () {
		$('.account').css('z-index', 0)
		$('.feed').css('z-index', 80)
		$('.extra').css('z-index', 0)
	})

	$('.xt').click(function () {
		$('.account').css('z-index', 0)
		$('.feed').css('z-index', 0)
		$('.extra').css('z-index', 80)
	})

	$('.search').click(function () {
		$('.new').toggleClass('new-search')
	})
})

function colors() {
	let root = document.documentElement
	let t = new Date().getHours()
	if (t > 19 || t < 6) {
		root.style.setProperty('--back', '#000')
		root.style.setProperty('--shadow', '#fff3')
		root.style.setProperty('--shade', '#111')
		root.style.setProperty('--hover', '#222')
		root.style.setProperty('--theme', '#a00')
		root.style.setProperty('--text', '#fff')
	} else {
		root.style.setProperty('--back', '#fff')
		root.style.setProperty('--shadow', '#0003')
		root.style.setProperty('--shade', '#eee')
		root.style.setProperty('--hover', '#ddd')
		root.style.setProperty('--theme', '#a00')
		root.style.setProperty('--text', '#000')
	}
}

var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope) {
	$scope.posts = [1, 2, 3, 4, 5]
});