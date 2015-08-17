"use strict";

var changeAccountCtrl = function($scope, $rootScope, $http) {
	$scope.test = 222;
	$scope.upd = {
		account: {
			email: $rootScope.account.email,
			passwd: ""
		}
	}
	
}