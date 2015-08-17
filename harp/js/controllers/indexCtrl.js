"use strict";
var indexCtrl = function($scope) {
	$scope.menu = {
		search:true,
		country:false,
		industry:false,
		part:false,
		education:false,
		language:false,
		more:false
	};
	$scope.menuUp = function(key) {
		for(var _i in $scope.menu) {
			if(_i == key) $scope.menu[_i] = !$scope.menu[_i];
		}
	}
	$scope.age = {
		min: 20,
		max: 30
	};
	$scope.pay = {
		min: 10000,
		max: 100000
	};
	$scope.hello = "hello";
}