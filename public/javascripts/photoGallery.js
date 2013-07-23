var photoGalleryApp = angular.module('galleryApp', ['photoGalleryService']);

photoGalleryApp.config(function($routeProvider, $locationProvider){
    $locationProvider.html5Mode(false);
	$routeProvider
		.when('/', {controller: galleryCtrl, templateUrl: '/html/photos.html'})
        .when('/photo/upload', { templateUrl: '/html/photo/upload.html' })
		.when('/photo/:photoId', {controller: photoDetailsCtrl, templateUrl: '/html/photo/details.html'})
		.otherwise({redirectTo: '/'});
});

function photoDetailsCtrl($scope, $routeParams, $location, Photo, AppConfiguration){
	$scope.photo = Photo.get($routeParams.photoId);
    $scope.config = AppConfiguration.current();

    $scope.delete = function(){
        if (confirm("Are you sure to delete this photo?")) {
            Photo.delete($routeParams.photoId);
            $location.path('/');
        }
    }
}

function galleryCtrl($scope, Photo){
	$scope.photos = Photo.list();
}


// directives
photoGalleryApp.directive('deleteImage', function(){
    return {
        restrict: 'E',
        replace: true,
        template: '<img ng-show="config.isAdmin" ng-click="delete()" class="deleteBtn" src="/img/DeleteRed.png" title="{{ config.isAdmin }}" />',
        link: function($scope, element, attrs){
        }
    }
});