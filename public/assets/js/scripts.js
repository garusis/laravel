/**
 * Created by garusis on 16/05/16.
 */
angular
    .module('sw2', ['ngMaterial', 'satellizer', 'ui.router', 'ngMessages', 'md.data.table'])
    .config(function ($mdThemingProvider) {
        $mdThemingProvider.theme('default');
    })
    .config(function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider
            .otherwise(function ($injector, $location) {
                var $state = $injector.get('$state');
                $state.go('home_calendars_list');
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
                abstract: true
            })
            .state('home.calendars', {
                url: 'calendarios/',
                abstract: true
            })
            .state('home_calendars_list', {
                url: '/calendarios/listado',
                templateUrl: 'partials/calendars.list.html'
            })
            .state('home_calendars_new', {
                url: '/calendarios/nuevo',
                templateUrl: 'partials/calendars.new.html'
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
            }
        });
    })
    .controller('LoginController', function ($scope, $auth, $state) {
        $scope.vmLogin = {};

        this.login = function ($form, credentials) {
            $auth
                .login(credentials)
                .then(function () {
                    $state.go('home_calendars_list');
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
    .controller('HomeController', function ($scope) {

    });
