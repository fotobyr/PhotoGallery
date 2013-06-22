var photoGalleryApp = angular.module('galleryApp', []);

photoGalleryApp.config(function($routeProvider){
	$routeProvider
		.when('/', {controller: galleryCtrl, templateUrl: '/html/photos.html'})
		.when('/photo', {controller: photoDetailsCtrl, templateUrl: '/html/details.html'})
		.otherwise({redirectTo: '/'});
});

function photoDetailsCtrl($scope){
	$scope.mf = 'ebana';
}

function galleryCtrl($scope){
	$scope.photos = [
		{ name: 'photo 1', src: '/images/1.png', desc: 'description 111'},
		{ name: 'photo 2', src: '/images/2.png', desc: 'description 222'},
		{ name: 'photo 3', src: '/images/3.png', desc: 'description 333'},
        { name: 'photo 666', src: '/images/3.png', desc: 'description 333'},
	];
}