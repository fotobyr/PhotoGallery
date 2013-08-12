/**
 * Created with JetBrains WebStorm.
 * User: gelya-o
 * Date: 01.07.13
 * Time: 12:17
 * To change this template use File | Settings | File Templates.
 */

angular.module('photoGalleryService', ['ngResource'])
    .factory('Photo', function($resource, $cacheFactory, $timeout){
        var photos = $resource('/photos/:photoId', {}, {
            list: { method: 'GET', isArray: true },
            get: { method: 'GET' },
            delete: { method: 'DELETE'},
            vote: { method: 'POST', url: '/photos/:photoId/vote' }
        });

        var photosCache = $cacheFactory('photos');
        var timer;

        return {
            list: function(){

                if (timer == undefined)
                {
                    timer = $timeout(function(){
                        photosCache.put('list', null);
                        timer = null;
                    }, 60000);
                }

                var photosList = photosCache.get('list');

                if (photosList == undefined){
                    photosList = photos.list();
                    photosCache.put('list', photosList);
                }

                return photosList;
            },
            get: function(photoId){
                return photos.get({photoId: photoId});
            },
            delete: function(photoId){
                photos.delete({photoId: photoId});
                photosCache.put('list', null);
            },
            create: function(){
                return new photos();
            }
        }
}).factory("User", function($resource){
        return $resource('/users/:userId', {}, {
            login: {method: 'POST', url: '/users/login'}
        });
}).factory('Notify', function(){
        return {
            info: function(msg, title){
                toastr.info(msg, title);
            },
            warning: function(msg, title){
                toastr.warning(msg, title);
            },
            success: function(msg, title){
                toastr.success(msg, title);
            },
            error: function(msg, title){
                toastr.error(msg, title);
            }
        }
}).factory('AppConfiguration', function($resource){
        var config = $resource('/configuration', {}, {
            get: {method: 'GET'}
        });

        var cfg = null;

        return {
            current: function(){
                if (cfg == null) {
                    cfg = config.get();
                }
                return cfg;
            },
            reset: function(){
                cfg = null;
            }
        }
    });