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
            get: { method: 'GET' }
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
            }
        }
});
