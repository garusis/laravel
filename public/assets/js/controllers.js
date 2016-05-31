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

        nCalCtrl.save = function (calendarForm, vmCalendar) {
            var promise;
            if (vmCalendar.id) {
                promise = vmCalendar
                    .put()
                    .then(function () {
                        if (removedEvents.length) {
                            return _.map(removedEvents, function (eventId) {
                                return Calendary.getFrom(vmCalendar.id).events().remove(eventId);
                            });
                        }
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
                .then(function (event) {
                    vmCalendar.events.push(event);
                });
        };

        nCalCtrl.removeMinute = function (vmCalendar, minute) {
            var removed = _.remove(vmCalendar.minutes, {$$hashKey: minute.$$hashKey})[0];
            if (removed.id) {
                removedMinutes.push(removed.id);
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
            if (vmCandidate.id) {
                promise = candidate.put();
            } else {
                promise = Calendary
                    .getFrom($stateParams.id)
                    .candidates().post(vmCandidate)
                    .then(function (vmCandidate) {
                        $state.go('home.calendars.show.candidates.show', {id: vmCandidate.id});
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
        $scope.vmEvent = {
            date: new Date(),
            file: null
        };

        AEvtCtrl.addEvent = function (vmEvent) {
            $mdDialog.hide(vmEvent);
        };

        AEvtCtrl.closeDialog = function () {
            $mdDialog.cancel();
        };

        $scope.$watch('vmEvent.file', function (newVal) {
            if (!newVal) return;
            
        });
    });