var photoGalleryApp = angular.module('galleryApp', ['photoGalleryService', 'ngRoute']);

photoGalleryApp.config(function($routeProvider, $locationProvider){
    $locationProvider.html5Mode(false);
	$routeProvider
		.when('/', {controller: galleryCtrl, templateUrl: '/html/photos.html'})
        .when('/photo/upload', { templateUrl: '/html/photo/upload.html' })
		.when('/photo/:photoId', {controller: photoDetailsCtrl, templateUrl: '/html/photo/details.html'})
        .when('/awarded', { controller: awardedCtrl, templateUrl: '/html/photo/awarded.html' })

        .when('/admin', { templateUrl: '/html/admin/admin.html' })
        .when('/admin/users', { controller: adminUsersCtrl, templateUrl: '/html/admin/users.html'})

        .when('/login', { controller: userLoginCtrl, templateUrl: '/html/user/login.html'})
        .when('/register', { controller: userRegisterCtrl, templateUrl: '/html/user/register.html'})

        .when('/about', { templateUrl: '/html/about.html' })
        .when('/feedback', { controller: feedbackCtrl, templateUrl: '/html/feedback.html' })

		.otherwise({redirectTo: '/'});
});

function mainMenuCtrl($scope, $location, AppConfiguration, User){
    $scope.mf = 'ebana';
    $scope.config = AppConfiguration.current();
    $scope.userName = '666';
    $scope.logoutText = '[ Выход ]';

    $scope.$watch(AppConfiguration.current, function(){
        $scope.config = AppConfiguration.current();
    })

    $scope.logOut = function(){
        User.logout({}, function(){
            AppConfiguration.refresh();
        });
    }

    $scope.isActive = function(path){
        return path == '/'
            ? $location.path() == '/'
            : $location.path().indexOf(path) > -1;
    }
}

function feedbackCtrl(){

}

function awardedCtrl($scope){

}

function photoDetailsCtrl($scope, $routeParams, $location, Photo, AppConfiguration){
	$scope.photo = Photo.get($routeParams.photoId);
    $scope.config = AppConfiguration.current();

    $scope.delete = function(){
        if (confirm("Вы уверены что хотите удалить это фото?")) {
            Photo.delete($routeParams.photoId);
            $location.path('/');
        }
    }

    $scope.voted = function(vote) {
        var fakePhoto = Photo.create();
        fakePhoto.vote = vote;
        fakePhoto.$vote({photoId: $scope.photo._id});

        $scope.photo.yourVote = vote;
    }
}

function galleryCtrl($scope, Photo){
	$scope.photos = Photo.list();
    $scope.topRatedPhotos = Photo.listTopRated();
}

function userLoginCtrl($scope, $location, User, Notify, AppConfiguration){
    $scope.user = {};

    $scope.login = function(){
        User.login($scope.user, function(data){
            if (data.user == null){
                Notify.warning('Пароль или E-mail не верный');
            } else {
                Notify.success('Вы успешно вошли.');
                AppConfiguration.refresh();
                $location.path('/');
            }
        }, function(err){
            Notify.error(err.data);
        });
    }
}

function userRegisterCtrl($scope, $location, User, Notify){
    $scope.newUser = new User();

    $scope.register = function(){
        $scope.newUser.$save(function(){
            Notify.success('Теперь вы можете войти' ,'Пользователь успешно зарегистрирован.')
            $location.path('/');
        },function(err){
            Notify.error(err.data);
        });
    }
}

function adminUsersCtrl($scope, User){
    $scope.users = User.query();

    $scope.delete = function(userId, index){
        if(confirm("Вы уверены?")){
            User.delete({userId: userId}, function(){
                $scope.users.splice(index, 1);
            });
        }
    }
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

photoGalleryApp.directive('vote', function(){
    return {
        link: function(scope, element, attrs){

        },
        restrict: 'E',
        replace: true,
        template:   '<div class="btn-group">' +
                    '<button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">' +
                    'Ваш голос <span class="caret"></span>' +
                    '</button>' +
                    '<ul class="dropdown-menu">'+
                    '<li ng-repeat="n in [1,2,3,4,5,6,7,8,9,10]"><a href ng-click="voted(n)">{{ n }}</a></li>'+
                    '</ul>'+
                    '</div>'
    }
});