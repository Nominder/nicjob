"use strict";
app.controller('createInterview', function($scope, $rootScope, $http, dataSrv) {
	$scope.date = {};
	var init = function(data) {
		$scope.user = data;
		$scope.date = {};
		dataSrv.getVacansy({}, function(err, data) {
			$scope.vacansy = data;
			console.warn(data);
		})
	}
	$scope._add = {};
	$scope.save = function() {
		var dates = [];
		for(var _i in $scope.date) {
			dates.push(coolDateTime($scope.date[_i]));
		};
		dataSrv.inviteInterview({
			comp_id: $scope.user.id,
			vac_id: $scope._add.sVacansy,
			times: JSON.stringify(dates)
		}, function(err, data) {
			$rootScope.modal(false);
		});
	}
	$rootScope.$on('modal', function(target, data) {
		if(data.type == 'createInterview') {
			if($rootScope._data.session.type == "employer") {
				init(data.data);
			} else {
				$rootScope.modal(false);
			}
		}
	});
});


















