var photoGalleryApp = angular.module('galleryApp', ['photoGalleryService']);

photoGalleryApp.config(function($routeProvider, $locationProvider){
    $locationProvider.html5Mode(false);
	$routeProvider
		.when('/', {controller: galleryCtrl, templateUrl: '/html/photos.html'})
        .when('/photo/upload', { templateUrl: '/html/photo/upload.html' })
		.when('/photo/:photoId', {controller: photoDetailsCtrl, templateUrl: '/html/photo/details.html'})

        .when('/admin', { templateUrl: '/html/admin/admin.html' })
        .when('/admin/users', { controller: adminUsersCtrl, templateUrl: '/html/admin/users.html'})

        .when('/login', { controller: userLoginCtrl, templateUrl: '/html/user/login.html'})
        .when('/register', { controller: userRegisterCtrl, templateUrl: '/html/user/register.html'})

		.otherwise({redirectTo: '/'});
});

function photoDetailsCtrl($scope, $routeParams, $location, Photo, AppConfiguration){
	$scope.photo = Photo.get($routeParams.photoId);
    $scope.config = AppConfiguration.current();

    $scope.delete = function(){
        if (confirm("Вы уверены что хотите удалить это фото?")) {
            Photo.delete($routeParams.photoId);
            $location.path('/');
        }
    }
}

function galleryCtrl($scope, Photo){
	$scope.photos = Photo.list();
}

function userLoginCtrl($scope, $location, User, Notify, AppConfiguration){
    $scope.user = {};

    $scope.login = function(){
        User.login($scope.user, function(data){
            if (data.user == null){
                Notify.warning('Пароль или E-mail не верный');
            } else {
                Notify.success('Вы успешно вошли.');
                AppConfiguration.reset();
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