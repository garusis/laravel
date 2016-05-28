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
                },
                resolve: {
                    calendaries: function (Calendary) {
                        return Calendary.list();
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
                },
                resolve: {
                    calendary: function ($localStorage, CALENDAR_STATUS) {
                        return $localStorage.currentCalendar = {
                            status: CALENDAR_STATUS.active.value,
                            events: []
                        };
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
                },
                resolve: {
                    calendary: function (Calendary, $state, $stateParams, $q, $mdDialog) {
                        var promise = Calendary
                            .one({id: Number($stateParams.id)});
                        promise
                            .catch(function (err) {
                                $mdDialog.show(
                                    $mdDialog.alert()
                                        .title('El Calendario no existe')
                                        .textContent('No existe ningun Calendario con el ID especificado')
                                        .ok('Aceptar')
                                );
                            });
                        return promise;
                    }
                }
            })
            .state('home.calendars.show.candidates', {
                url: 'candidatos/',
                abstract: true,
                views: {
                    'candidates@home.calendars.show': {
                        template: '<md-content class="md-padding" ui-view=""></md-content>',
                        controller: ['$scope', function ($scope) {
                            $scope.nCalCtrl.setTabSelected(1);
                        }]
                    }
                }
            })
            .state('home.calendars.show.candidates.list', {
                url: 'listado/',
                views: {
                    '@home.calendars.show.candidates': {
                        templateUrl: 'partials/home.calendars.candidates.list.html',
                        controller: 'ListCalendarController',
                        controllerAs: 'lCalCtrl'
                    }
                }
            })
            .state('home.calendars.show.candidates.new', {
                url: 'nuevo/',
                views: {
                    '@home.calendars.show.candidates': {
                        templateUrl: 'partials/home.calendars.candidates.new.html',
                        controller: 'NewShowCandidateController',
                        controllerAs: 'nCalCtrl'
                    }
                },
                candidate: function (CANDIDATES_STATUS) {
                    return {
                        status: CANDIDATES_STATUS.disqualify.value
                    };
                }
            })
            .state('home.calendars.show.candidates.show', {
                url: 'ver/:candidateId/',
                views: {
                    '@home.calendars.show.candidates': {
                        templateUrl: 'partials/home.calendars.new.html',
                        controller: 'NewCalendarController',
                        controllerAs: 'nCalCtrl'
                    }
                },
                resolve: {
                    candidate: function (Candidate, $state, $stateParams) {
                        var promise = Candidate
                            .one({
                                calendarId: Number($stateParams.id),
                                id: Number($stateParams.candidateId)
                            });
                        promise
                            .catch(function (err) {
                                $mdDialog.show(
                                    $mdDialog.alert()
                                        .title('El Calendario no existe')
                                        .textContent('No existe ningun Calendario con el ID especificado')
                                        .ok('Aceptar')
                                );
                            });
                        return promise;
                    }
                }
            });
    })
    .config(function ($authProvider) {
        //$authProvider.loginUrl = location.hostname === 'localhost' ? 'http://localhost/sw2/public/' : '/';
        $authProvider.loginUrl = location.hostname === 'localhost' ? 'http://localhost/sw2_final_proyect/public/' : '/';
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
    .filter('allAsDate', function () {
        return function (list, property) {
            var propertyString = 'elem.' + property;
            var assingExpression = propertyString + ' = new Date(val)';


            return _.map(list, function (elem) {
                var val = eval(propertyString);
                if (!_.isDate(val)) {
                    eval(assingExpression);
                }
                return elem;
            });
        };
    })
    .constant('CALENDAR_STATUS', {
        active: {label: 'Activo', value: 'a'},
        finished: {label: 'Culminado', value: 'c'},
        cancel: {label: 'Cancelado', value: 'cc'}
    })
    .constant('CANDIDATES_STATUS', {
        pending: {label: 'Pendiente', value: 'p'},
        aproved: {label: 'Aprobado', value: 'a'},
        disqualify: {label: 'Inhabilitado', value: 'i'}
    });