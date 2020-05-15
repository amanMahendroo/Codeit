$(document).ready(function () {
	$('.plus').click(function () {
		$(this).toggleClass('plus-clicked');
	})
	$('.minus').click(function () {
		$(this).toggleClass('minus-clicked');
	})
	$('.archive').click(function () {
		$(this).toggleClass('star-clicked');
	})
})

var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope) {
    $scope.posts = [new Post(new User("https://bit.ly/2WQwgJo", "AlphaBeta"), "https://bit.ly/35Yol0S", ["HTML", "CSS", "JS"])]
});
