/**
 * Created by garusis on 16/05/16.
 */
'use strict';
angular
    .module('sw2')
    .factory('Calendary', function ($q, $timeout, $localStorage) {
        return {
            one: function (where) {
                return $q(function (resolve, reject) {
                    $timeout(function () {
                        var instance = _.find($localStorage.calendars, where);
                        instance ? resolve(instance) : reject({status: 404});
                    });
                });
            },
            create: function (body) {
                return $q(function (resolve, reject) {
                    $timeout(function () {
                        var calendars = $localStorage.calendars;
                        if (!calendars) {
                            calendars = $localStorage.calendars = [];
                        }
                        body.id = Date.now();
                        calendars.push(body);
                        delete $localStorage.currentCalendar;
                        resolve(body);
                    });
                });
            },
            update: function (where, body) {
                return $q(function (resolve, reject) {
                    $timeout(function () {
                        resolve(body);
                    });
                });
            },
            list: function (where) {
                return $q(function (resolve, reject) {
                    $timeout(function () {
                        resolve(_.cloneDeep($localStorage.calendars));
                    });
                });
            }
        };
    })
    .factory('Candidate', function ($q, $timeout, $localStorage) {
        return {
            one: function (where) {
                return $q(function (resolve, reject) {
                    $timeout(function () {
                        var calendars = $localStorage.calendars;
                        if (!calendars) {
                            calendars = $localStorage.calendars = [];
                        }
                        var calendar = _.find(calendars, {id: Number(where.calendarId)});
                        if (!calendar) {
                            return reject({status: 404});
                        }
                        if (!calendar.candidates) {
                            calendar.candidates = [];
                        }
                        var instance = _.find(calendar.candidates, {id: where.id});
                        instance ? resolve(instance) : reject({status: 404});
                    });
                });
            },
            create: function (calendarId, body) {
                return $q(function (resolve, reject) {
                    $timeout(function () {
                        var calendars = $localStorage.calendars;
                        if (!calendars) {
                            calendars = $localStorage.calendars = [];
                        }
                        var calendar = _.find(calendars, {id: Number(calendarId)});
                        if (!calendar.candidates) {
                            calendar.candidates = [];
                        }

                        body.id = Date.now();
                        calendar.candidates.push(body);
                        resolve(body);
                    });
                });
            },
            update: function (where, body) {
                return $q(function (resolve, reject) {
                    $timeout(function () {
                        resolve(body);
                    });
                });
            },
            list: function (where) {
                return $q(function (resolve, reject) {
                    $timeout(function () {
                        resolve(_.cloneDeep($localStorage.calendars));
                    });
                });
            }
        };
    });