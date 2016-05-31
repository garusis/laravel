/**
 * Created by garusis on 16/05/16.
 */
'use strict';
angular
    .module('sw2')
    .factory('AppService', function (Restangular) {
        var AppService = function (resource) {
            this.serviceResource = resource;
        };
        AppService.prototype.getList = function (filters) {
            return Restangular.all(this.serviceResource).getList(filters);
        };
        AppService.prototype.get = function (id, filters) {
            return Restangular.one(this.serviceResource, id).get(filters);
        };
        AppService.prototype.post = function (data) {
            return Restangular.all(this.serviceResource).post(data);
        };
        AppService.prototype.put = function (id, data) {
            return Restangular.one(this.serviceResource, id).put(data);
        };
        AppService.prototype.remove = function (id) {
            return Restangular.one(this.serviceResource, id).remove();
        };

        return AppService;
    })
    .factory('AppRelation', function (Restangular) {
        var AppRelation = function (fromChainable, resource) {
            this.chain = fromChainable;
            this.relationResource = resource;
        };
        AppRelation.prototype.getList = function (filters) {
            return this.chain.getList(this.relationResource, filters);
        };
        AppRelation.prototype.get = function (id, filters) {
            return this.chain.one(this.relationResource, id).get(filters);
        };
        AppRelation.prototype.post = function (data) {
            return this.chain.post(this.relationResource, data);
        };
        AppRelation.prototype.put = function (id, data) {
            return this.chain.one(this.relationResource, id).put(data);
        };
        AppRelation.prototype.remove = function (id) {
            return this.chain.one(this.relationResource, id).remove();
        };

        return AppRelation;
    })
    .factory('Files', function (Restangular) {
        var resource = 'files';
        return {
            upload: function (file) {
                debugger
            }
        };
    })
    .factory('Calendary', function (AppService, AppRelation, Restangular) {
        var resource = 'calendars';
        var service = new AppService(resource);

        service.getFrom = function (id) {
            return {
                events: function () {
                    return new AppRelation(Restangular.one(resource, id), 'events');
                },
                candidates: function () {
                    return new AppRelation(Restangular.one(resource, id), 'candidates');
                }
            };
        };

        return service;
    });