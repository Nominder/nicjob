"use strict";
var app = angular.module('peopleJobs', ['ui-rangeSlider', 'ui.bootstrap', 'ngRoute', 'ngResource']);
app.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/', { redirectTo: '/Search' });
	$routeProvider.when('/Search', {
		templateUrl: 'search.html',
		controller: searchCtrl
	});
	$routeProvider.when('/Office', {
		templateUrl: 'office.html',
		controller: officeCtrl
	});
	$routeProvider.otherwise({ redirectTo: '/' });
}]);

app.run(mainCtrl);

app.controller('menuCtrl', menuCtrl);
app.controller('changeAccountCtrl', changeAccountCtrl);
app.controller('changeProfileCtrl', changeProfileCtrl);
