"use strict";
app.controller('confirmPhone', function($scope, $rootScope, $http, dataSrv) {
	var to = {};
	var init = function(data) {
		$scope.phone = data.phone;
		to = data.obj;
		$scope.sendCode();
	}
	$scope.sendCode = function() {
		dataSrv.phoneGetCode($scope.phone, function(err, data) {
			console.warn(err, data);
		})
	}
	$scope.confirm = function(code) {
		console.log($scope.code||code);
		dataSrv.phoneConfirm($scope.code||code, function(err, data) {
			console.warn(err, data);
			if(!err && data) {
				to.confirmed = true;
				$rootScope.modal(false);
				$rootScope.message({title:"Телефон подтверждён.", type:'info'})
			} else if(err) {
				$rootScope.message({title:$rootScope._data.errors[err], type:'error'})
			}
		})
	}
	$rootScope.$on('modal', function(target, data) {
		if(data.type == 'confirmPhone') {
			init(data.data);
		}
	});
});



















