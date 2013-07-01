/**
 * Created with JetBrains WebStorm.
 * User: gelya-o
 * Date: 01.07.13
 * Time: 12:17
 * To change this template use File | Settings | File Templates.
 */

angular.module('photoGalleryService', ['ngResource']).factory('Photo', function($resource){
    return $resource('/photo/:photoId', {}, {
        list: { method: 'GET', isArray: true },
        get: { method: 'GET' }
    });
});
