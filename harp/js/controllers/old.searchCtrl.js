"use strict";
var searchCtrl = function($scope, $rootScope, $http) {
	
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
	
	$scope.signup = function(type) {
		var type = type || "competitor";
		$rootScope.reg.type = type;
		jQuery('.ng-modal .tabs .head .item').removeClass('action');
		jQuery('.ng-modal .tabs .head .item:nth-child(2)').addClass('action');
		jQuery('.ng-modal .tabs .body .item').hide();
		jQuery('.ng-modal .tabs .body .item:nth-child(2)').show();
		jQuery('.ng-modal').show(500);
	}
	$scope.age = {
		min: 20,
		max: 30
	};
	$scope.pay = {
		min: 10000,
		max: 100000
	};


	$scope.results = [];

	$scope.selectType = function(type) {
		$scope.type = type||'competitor';
		$http.get("/openapi/0.1/find/"+$scope.type,{page:0}).success(function(data) {
			console.warn(data);
			$scope.results = data.result;
		}).error(function(data) {
			console.warn(data);
		});
	}
	$scope.selectType();
}