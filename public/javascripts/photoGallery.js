var photoGalleryApp = angular.module('galleryApp', ['photoGalleryService']);

photoGalleryApp.config(function($routeProvider){
	$routeProvider
		.when('/', {controller: galleryCtrl, templateUrl: '/html/photos.html'})
		.when('/photo', {controller: photoDetailsCtrl, templateUrl: '/html/details.html'})
		.otherwise({redirectTo: '/'});
});

function photoDetailsCtrl($scope){
	$scope.mf = 'ebana';
}

function galleryCtrl($scope, Photo){
	$scope.photos = Photo.list();
}