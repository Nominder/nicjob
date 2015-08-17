"use strict";

var officeCtrl = function($scope, $rootScope, $location) {
	if(!$rootScope.account.auth) $location.path("/");
	var years = [], dates = [], months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
	for(var i=1; i < 31; i++) dates.push(i);
	for(var i=2010; i > 1940; i--) years.push(i);
	$scope.dates = dates;
	$scope.months = months;
	$scope.years = years;
}
