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
    .controller('ListCalendarController', function ($scope, $state, $stateParams, $localStorage, calendaries, CALENDAR_STATUS) {
        var nCalCtrl = this;
        $scope.calendarStatus = CALENDAR_STATUS;
        $scope.calendars = _.map(calendaries, function (calendar) {
            calendar.status = _.find(CALENDAR_STATUS, {value: calendar.status});
            return calendar;
        });
    })
    .controller('NewCalendarController', function ($scope, $state, $mdMedia, $mdDialog, calendary, Calendary, Candidate, CALENDAR_STATUS) {
        var nCalCtrl = this;

        $scope.selectedIndex = 0;

        $scope.calendarStatus = CALENDAR_STATUS;
        var vmCalendar = $scope.vmCalendar = calendary;

        nCalCtrl.save = function (calendarForm, vmCalendar) {
            var promise;
            if (vmCalendar.id) {
                promise = Calendary
                    .update({id: vmCalendar.id}, vmCalendar);
            } else {
                promise = Calendary
                    .create(vmCalendar)
                    .then(function () {
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

        nCalCtrl.removeEvent = function (vmCalendar, $index) {
            vmCalendar.events.splice($index, 1);
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

        nCalCtrl.setTabSelected = function (tab) {
            $scope.selectedIndex = tab;
        };

        nCalCtrl.addCalendar = function (vmCandidate) {
            return Candidate
                .create($stateParams.id, vmCandidate);
        };
    })
    .controller('NewShowCandidateController', function ($scope, $state, $stateParams, $mdMedia, $mdDialog, candidate, Candidate, CANDIDATES_STATUS) {
        var nsCandCtrl = this;

        $scope.candidatesStatus = CANDIDATES_STATUS;
        var vmCandidate = $scope.vmCandidate = candidate;

        nsCandCtrl.save = function (candidateForm, vmCandidate) {
            var promise;
            if (vmCandidate.id) {
                promise = Candidate.update({id: vmCandidate.id}, vmCandidate);
            } else {
                promise = $scope.nCalCtrl
                    .addCalendar()
                    .then(function () {
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
    });