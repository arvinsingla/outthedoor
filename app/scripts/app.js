'use strict';

/**
 * @ngdoc overview
 * @name outthedoorApp
 * @description
 * # outthedoorApp
 *
 * Main module of the application.
 */
angular
  .module('outthedoorApp', [
    'ngRoute'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
