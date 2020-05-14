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
    $scope.posts = [1, 2, 3, 4, 5]
});