var photoGalleryApp = angular.module('galleryApp', ['photoGalleryService']);

photoGalleryApp.config(function($routeProvider, $locationProvider){
    $locationProvider.html5Mode(false);
	$routeProvider
		.when('/', {controller: galleryCtrl, templateUrl: '/html/photos.html'})
		.when('/photo/:photoId', {controller: photoDetailsCtrl, templateUrl: '/html/details.html'})
		.otherwise({redirectTo: '/'});
});

function photoDetailsCtrl($scope, $routeParams, Photo){
	$scope.currentPhoto = Photo.get({photoId: $routeParams.photoId });
}

function galleryCtrl($scope, Photo){
	$scope.photos = Photo.list();
}