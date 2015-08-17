"use strict";

var app = angular.module('application', ['ngRoute', 'ngResource', 'ui.bootstrap']).config(function($routeProvider, $locationProvider) {
	$routeProvider
		.when('/search', {
			templateUrl: '/views/search.html',
			controller: 'searchCtrl'
		})
		.when('/vacansy', {
			templateUrl: '/views/vacansy.html',
			controller: 'vacansyCtrl'
		})
		.when('/office', {
			templateUrl: '/views/office.html',
			controller: 'officeCtrl'
		})
		.when('/office', {
			templateUrl: '/views/office.html',
			controller: 'officeCtrl'
		})
		.when('/profile/:id', {
			templateUrl: '/views/profile.html',
			controller: 'profileCtrl'
		})
		.when('/', { redirectTo: '/search' })
		.otherwise({ redirectTo: '/' });
	$locationProvider.html5Mode({enable:true});
}).run(function(dataSrv, callSrv) {
	dataSrv.init()
});





//BM1393029
//3150380E002PB6
//15.03.1980



