/**
 * Created with JetBrains WebStorm.
 * User: gelya-o
 * Date: 01.07.13
 * Time: 12:17
 * To change this template use File | Settings | File Templates.
 */

angular.module('photoGalleryService', ['ngResource'])
    .factory('Photo', function($resource, $cacheFactory, $timeout){
        var photos = $resource('/photo/:photoId', {}, {
            list: { method: 'GET', isArray: true },
            get: { method: 'GET' },
            delete: {method: 'DELETE'}
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
            }
        }
}).factory("User", function($resource){
        return $resource('/user/:userId', {}, { });
}).factory('AppConfiguration', function($resource, $cacheFactory){
        var config = $resource('/configuration', {}, {
            get: {method: 'GET'}
        });

        var configCache = $cacheFactory('appConfiguration');

        return {
            current: function(){
                var cachedConfiguration = configCache.get('appConfiguration');

                if (cachedConfiguration == undefined) {
                    cachedConfiguration = config.get();
                    configCache.put('appConfiguration', cachedConfiguration);
                }
                return cachedConfiguration;
            }
        }
    });