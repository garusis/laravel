/**
 * Created by garusis on 16/05/16.
 */
angular
    .module('sw2')
    .controller('LoginController', function ($scope, $auth, $state) {
        $scope.vmLogin = {};

        this.login = function ($form, credentials) {
            $auth
                .login(credentials)
                .then(function () {
                    $state.go('home.calendars.list');
                })
                .catch(function () {
                    $form.username.$setValidity('match', false);

                    var $unwatch = $scope.$watch(function () {
                        return JSON.stringify($scope.vmLogin);
                    }, function (newValue, oldValue) {
                        if (oldValue !== newValue) {
                            $form.username.$setValidity('match', true);
                            $unwatch();
                        }
                    });
                });
        };
    })
    .controller('ListCalendarController', function ($scope, calendaries, CALENDAR_STATUS) {
        var nCalCtrl = this;
        $scope.calendarStatus = CALENDAR_STATUS;
        $scope.calendars = _.map(calendaries, function (calendar) {
            calendar.status = _.find(CALENDAR_STATUS, {value: calendar.status});
            return calendar;
        });
    })
    .controller('NewCalendarController', function ($scope, $state, $mdMedia, $mdDialog, $localStorage, currentCalendary, Calendary, CALENDAR_STATUS) {
        var nCalCtrl = this;

        $scope.selectedIndex = 0;

        $scope.calendarStatus = CALENDAR_STATUS;
        var vmCalendar = $scope.vmCalendar = currentCalendary;

        var removedEvents = [];
        var removedMinutes = [];
        var removedFiles = [];

        nCalCtrl.save = function (calendarForm, vmCalendar) {
            var promise;
            if (vmCalendar.id) {
                promise = vmCalendar
                    .put()
                    .then(function () {
                        var promises = [];
                        if (removedEvents.length) {
                            _.forEach(removedEvents, function (eventId) {
                                var p = Calendary.getFrom(vmCalendar.id).events().remove(eventId);
                                promises.push(p);
                            });
                        }
                        if (removedMinutes.length) {
                            _.forEach(removedMinutes, function (minuteId) {
                                var p = Calendary.getFrom(vmCalendar.id).minutes().remove(minuteId);
                                promises.push(p);
                            });
                        }
                        if (removedFiles.length) {
                            _.forEach(removedFiles, function (eventId) {
                                var p = Calendary.getFrom(vmCalendar.id).files().remove(eventId);
                                promises.push(p);
                            });
                        }
                        return promises;
                    });
            } else {
                promise = Calendary
                    .post(vmCalendar)
                    .then(function (vmCalendar) {
                        delete $localStorage.currentCalendar;
                        $state.go('home.calendars.show', {id: vmCalendar.id});
                    });
            }
            promise
                .then(function () {
                    return $mdDialog.show(
                        $mdDialog.confirm()
                            .title('Cambios guardados')
                            .textContent('Sus cambios se han guardado correctamente')
                            .ok('Aceptar')
                    );
                })
        };

        nCalCtrl.removeEvent = function (vmCalendar, event) {
            var removed = _.remove(vmCalendar.events, {$$hashKey: event.$$hashKey})[0];
            if (removed.id) {
                removedEvents.push(removed.id);
            }
        };

        nCalCtrl.addEvent = function (ev) {
            $mdDialog
                .show({
                    controller: 'AddEventController',
                    controllerAs: 'AEvtCtrl',
                    templateUrl: 'partials/home.calendars.add-event.html',
                    parent: angular.element(document.getElementById('event-table')),
                    targetEvent: ev,
                    clickOutsideToClose: true
                })
                .then(function (event) {
                    vmCalendar.events.push(event);
                });
        };

        nCalCtrl.addMinute = function (ev) {
            $mdDialog
                .show({
                    controller: 'AddMinuteController',
                    controllerAs: 'AMinCtrl',
                    templateUrl: 'partials/home.calendars.add-minute.html',
                    targetEvent: ev,
                    clickOutsideToClose: true
                })
                .then(function (minute) {
                    vmCalendar.minutes.push(minute);
                });
        };

        nCalCtrl.removeMinute = function (vmCalendar, minute) {
            var removed = _.remove(vmCalendar.minutes, {$$hashKey: minute.$$hashKey})[0];
            if (removed.id) {
                removedMinutes.push(removed.id);
            }
        };

        nCalCtrl.addFile = function (ev) {
            $mdDialog
                .show({
                    controller: 'AddFileController',
                    controllerAs: 'AMinCtrl',
                    templateUrl: 'partials/home.calendars.add-file.html',
                    targetEvent: ev,
                    clickOutsideToClose: true
                })
                .then(function (file) {
                    vmCalendar.files.push(file);
                });
        };

        nCalCtrl.removeFile = function (vmCalendar, file) {
            var removed = _.remove(vmCalendar.files, {$$hashKey: file.$$hashKey})[0];
            if (removed.id) {
                removedFiles.push(removed.id);
            }
        };

        nCalCtrl.setTabSelected = function (tab) {
            $scope.selectedIndex = tab;
        };
    })
    .controller('ListCandidateController', function ($scope, candidates, CANDIDATES_STATUS) {
        var nCalCtrl = this;
        $scope.candidatesStatus = CANDIDATES_STATUS;
        $scope.candidates = _.map(candidates, function (canditate) {
            canditate.status = _.find(CANDIDATES_STATUS, {value: canditate.status});
            return canditate;
        });
    })
    .controller('NewShowCandidateController', function ($scope, $state, $stateParams, $mdMedia, $mdDialog, candidate, Calendary, CANDIDATES_STATUS) {
        var nsCandCtrl = this;

        $scope.candidatesStatus = CANDIDATES_STATUS;
        var vmCandidate = $scope.vmCandidate = candidate;

        nsCandCtrl.save = function (candidateForm, vmCandidate) {
            var promise;
            var files = vmCandidate.files;
            if (vmCandidate.id) {
                delete vmCandidate.files;
                promise = candidate.put();
                vmCandidate.files = files;
            } else {
                promise = Calendary
                    .getFrom($stateParams.id)
                    .candidates().post(vmCandidate)
                    .then(function (vmCandidate) {
                        $state.go('home.calendars.show.candidates.show', {
                            id: vmCandidate.calendar_id,
                            candidateId: vmCandidate.id
                        });
                    });
            }
            promise
                .then(function () {
                    $mdDialog.show(
                        $mdDialog.confirm()
                            .title('Cambios guardados')
                            .textContent('Sus cambios se han guardado correctamente')
                            .ok('Aceptar')
                    )
                });
        };

        nsCandCtrl.addFile = function (ev) {
            $mdDialog
                .show({
                    controller: 'AddFileController',
                    controllerAs: 'AMinCtrl',
                    templateUrl: 'partials/home.calendars.add-file.html',
                    targetEvent: ev,
                    clickOutsideToClose: true
                })
                .then(function (file) {
                    vmCandidate.files.push(file);
                });
        };

        nsCandCtrl.removeFile = function (vmCalendar, file) {
            var removed = _.remove(vmCalendar.files, {$$hashKey: file.$$hashKey})[0];
            if (removed.id) {

            }
        };
    })
    .controller('AddEventController', function ($scope, $mdDialog) {
        var AEvtCtrl = this;
        $scope.vmEvent = {
            date: new Date()
        };

        AEvtCtrl.addEvent = function (vmEvent) {
            $mdDialog.hide(vmEvent);
        };

        AEvtCtrl.closeDialog = function () {
            $mdDialog.cancel();
        };
    })
    .controller('AddMinuteController', function ($scope, Files, $mdDialog) {
        var AEvtCtrl = this;
        $scope.vmMinute = {};

        AEvtCtrl.addMinute = function (vmMinute) {
            $mdDialog.hide(vmMinute);
        };

        AEvtCtrl.closeDialog = function () {
            $mdDialog.cancel();
        };

        $scope.$watchCollection('files', function (files) {
            if (!$scope.files || !$scope.files.length) return;
            Files
                .upload($scope.files[0])
                .then(function (filePath) {
                    $scope.vmMinute.filePath = filePath;
                });
        });
    })
    .controller('AddFileController', function ($scope, Files, $mdDialog) {
        var AEvtCtrl = this;
        $scope.vmFile = {};

        AEvtCtrl.addFile = function (vmFile) {
            $mdDialog.hide(vmFile);
        };

        AEvtCtrl.closeDialog = function () {
            $mdDialog.cancel();
        };

        $scope.$watchCollection('files', function (files) {
            if (!$scope.files || !$scope.files.length) return;
            Files
                .upload($scope.files[0])
                .then(function (filePath) {
                    $scope.vmFile.filePath = filePath;
                });
        });
    });