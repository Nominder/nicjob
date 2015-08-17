"use strict";


app.controller('vacansyCtrl', function($scope, $rootScope, $location, dataSrv) {
	$scope.view = {};
	$scope.view.menu = {
		search:true,
		industry:false,
		part:false,
		education:false,
		language:false,
		more:false
	};
	$scope.view.menuUp = function(key) {
		for(var _i in $scope.view.menu) {
			if(_i == key) $scope.view.menu[_i] = !$scope.view.menu[_i];
		}
	}
	
	$scope.get_avatar_uri = function(data) {
		if(type(data) === 'array' && data[0] && data[0].image) {
			return '/openapi/0.1/images/get?id='+data[0].image+'&size=320';
		} else if(type(data) === 'string' && data.length > 0) {
			return '/openapi/0.1/images/get?id='+data+'&size=320';
		} else {
			return '/img/company.png';
		}
	}
	$scope.results = [];
	dataSrv.findVacansy({}, function(err, data) {
		console.warn(data)
		$scope.results = data;
	});

	var ready = function() {
		if($scope.results.length == 0) {
			$scope.$watch('findObject', function() {
				find(true);
			}, true);
		}
		$scope.lists = dataSrv._lists;
		$scope.account = dataSrv.session;
	}

	if(dataSrv.ready) {
		ready();
	} else {
		$rootScope.$on('ready', function() {
			ready();
		});
	}
});


