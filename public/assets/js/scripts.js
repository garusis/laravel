/**
 * Created by garusis on 16/05/16.
 */
angular
    .module('sw2', ['ngMaterial', 'satellizer', 'ui.router', 'ngMessages', 'md.data.table', 'ngStorage', 'angular-loading-bar'])
    .config(function ($mdThemingProvider) {
        $mdThemingProvider.theme('default');
    })
    .config(function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider
            .otherwise(function ($injector, $location) {
                var $state = $injector.get('$state');
                $state.go('home.calendars.list');
            });

        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'partials/users.login.html',
                controller: 'LoginController',
                controllerAs: 'loginCtrl'
            })
            .state('home', {
                url: '/',
                abstract: true,
                templateUrl: 'partials/home.html'
            })
            .state('home.calendars', {
                url: 'calendarios/',
                abstract: true,
                views: {
                    '@home': {
                        templateUrl: 'partials/home.calendars.html'
                    }
                }
            })
            .state('home.calendars.list', {
                url: 'listado/',
                views: {
                    'breadcrumbs@home.calendars': {
                        template: '<md-button ui-sref="home.calendars.list">Inicio</md-button> <i class="material-icons">keyboard_arrow_right</i> <md-button ui-sref="home.calendars.list">Calendarios</md-button> <i class="material-icons">keyboard_arrow_right</i> <md-button ui-sref="home.calendars.list">Listado</md-button>'
                    },
                    'content@home.calendars': {
                        templateUrl: 'partials/home.calendars.list.html',
                        controller: 'ListCalendarController',
                        controllerAs: 'lCalCtrl'
                    }
                }
            })
            .state('home.calendars.new', {
                url: 'nuevo/',
                views: {
                    'breadcrumbs@home.calendars': {
                        template: '<md-button ui-sref="home.calendars.list">Inicio</md-button> <i class="material-icons">keyboard_arrow_right</i> <md-button ui-sref="home.calendars.list">Calendarios</md-button> <i class="material-icons">keyboard_arrow_right</i> <md-button ui-sref="home.calendars.new">Nuevo</md-button>'
                    },
                    'content@home.calendars': {
                        templateUrl: 'partials/home.calendars.new.html',
                        controller: 'NewCalendarController',
                        controllerAs: 'nCalCtrl'
                    }
                }
            })
            .state('home.calendars.show', {
                url: 'ver/:id/',
                views: {
                    'breadcrumbs@home.calendars': {
                        template: '<md-button ui-sref="home.calendars.list">Inicio</md-button> <i class="material-icons">keyboard_arrow_right</i> <md-button ui-sref="home.calendars.list">Calendarios</md-button> <i class="material-icons">keyboard_arrow_right</i> <md-button ui-sref="home.calendars.show">ver</md-button>'
                    },
                    'content@home.calendars': {
                        templateUrl: 'partials/home.calendars.new.html',
                        controller: 'NewCalendarController',
                        controllerAs: 'nCalCtrl'
                    }
                }
            });
    })
    .config(function ($authProvider) {
        $authProvider.loginUrl = location.hostname === 'localhost' ? 'http://localhost/sw2/public/' : '/';
        $authProvider.loginUrl = $authProvider.loginUrl + 'index.php/api/authenticate';
    })
    .run(function ($rootScope, $auth, $state) {
        $rootScope.$state = $state;

        $rootScope.$on('$stateChangeStart', function (e, toState, toParams, fromState, fromParams) {
            if (toState.name !== 'login' && !$auth.isAuthenticated()) {
                e.preventDefault();
                $state.go('login');
            } else if (toState.name === 'login' && $auth.isAuthenticated()) {
                e.preventDefault();
                $state.go('home.calendars.list');
            }
        });
    })
    .constant('CALENDAR_STATUS', {
        active: {label: 'Activo', value: 'a'},
        finished: {label: 'Culminado', value: 'c'},
        cancel: {label: 'Cancelado', value: 'cc'}
    })
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
    .controller('ListCalendarController', function ($scope, $state, $stateParams, $localStorage, CALENDAR_STATUS) {
        var nCalCtrl = this;

        $scope.calendarStatus = CALENDAR_STATUS;
        $scope.calendars = _.map($localStorage.calendars, function (calendar) {
            calendar = _.cloneDeep(calendar);
            calendar.status = _.find(CALENDAR_STATUS, {value: calendar.status});
            return calendar;
        });
    })
    .controller('NewCalendarController', function ($scope, $state, $stateParams, $localStorage, $mdMedia, $mdDialog, CALENDAR_STATUS) {
        var nCalCtrl = this;

        $scope.calendarStatus = CALENDAR_STATUS;
        var vmCalendar;
        if ($state.current.name === 'home.calendars.new') {
            vmCalendar = $scope.vmCalendar = $localStorage.currentCalendar;
            if (!vmCalendar) {
                vmCalendar = $scope.vmCalendar = $localStorage.currentCalendar = {
                    status: CALENDAR_STATUS.active.value,
                    events: []
                };
            }
        } else {
            vmCalendar = $scope.vmCalendar = _.find($localStorage.calendars, {id: Number($stateParams.id)});
            if (!vmCalendar) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .title('El Calendario no existe')
                        .textContent('No existe ningun Calendario con el ID especificado')
                        .ok('Aceptar')
                ).then(function () {
                    $state.go('home.calendars.list');
                });
            }
        }

        nCalCtrl.save = function (calendarForm, vmCalendar) {
            var calendars = $localStorage.calendars;
            if (!calendars) {
                calendars = $localStorage.calendars = [];
            }

            if ($state.current.name === 'home.calendars.new') {
                vmCalendar.id = Date.now();
                calendars.push(vmCalendar);
                //delete $localStorage.currentCalendar;
                $state.go('home.calendars.show', {id: vmCalendar.id});
            } else {
                $mdDialog.show(
                    $mdDialog.confirm()
                        .title('Cambios guardados')
                        .textContent('Sus cambios se han guardado correctamente')
                        .ok('Aceptar')
                ).then(function () {
                });
            }
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