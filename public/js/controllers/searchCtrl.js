"use strict";


app.controller('searchCtrl', function($scope, $rootScope, dataSrv) {
	$scope.view = {};
	$scope.view.menu = {
		search:true,
		industry:false,
		part:false,
		education:false,
		language:false,
		more:false
	};
	

	$scope.findObject = {}


	$scope.get_current_age = function (date) {
		date = hotDate(date||coolDate(new Date));
		return ((new Date().getTime() - new Date(date)) / (24 * 3600 * 365.25 * 1000)) | 0;
	}
	
	$scope.get_avatar_uri = function(data) {
		if(type(data) === 'array' && data[0] && data[0].image) {
			return '/openapi/0.1/images/get?id='+data[0].image+'&size=320';
		} else if(type(data) === 'string') {
			return '/openapi/0.1/images/get?id='+data+'&size=320';
		} else {
			return '/img/avatar.png';
		}
	}
	

	$scope.getFromList = function(name, id) {
		return dataSrv.getFromListSync(name, id);
	}



	$scope.view.menuUp = function(key) {
		for(var _i in $scope.view.menu) {
			if(_i == key) $scope.view.menu[_i] = !$scope.view.menu[_i];
		}
	}


	$scope.type = "competitor";
	$scope.qbased = {
		type:"competitor"
	}
	$scope.page = 0;
	$scope.findObject = clone($scope.qbased);
	$scope.oq = $scope.findObject;
	$scope.results = $rootScope.findResults||[];

	($scope.refind = function() {
			$scope.findObject = clone($scope.qbased);
		})()


	var find = function(cleary) {
		dataSrv.findProfiles({q:$scope.findObject}, function(err, data) {
			console.log(data);
			if(!cleary/*||angular.equals($scope.findObject, $scope.oq)*/) {
				$rootScope.findResults = ($rootScope.findResults||[]).concat(data);
				console.log('a', cleary, $scope.findObject)
			} else {
				console.log('b', cleary, $scope.findObject)
				$rootScope.findResults = data;
				$scope.oq = $scope.findObject;
			}
			$scope.results = $rootScope.findResults||[];
		});
		$scope.account = dataSrv.session;
	}

	$rootScope.$on('sessionUpdate', function(a, session) {
		session = session||{};
		$scope.account = session;
		console.warn($scope.account)
	});



	var ready = function() {
		$scope.$watch('findObject', function() {
			find(true);
		}, true);
		//find();
		$scope.lists = dataSrv._lists;
		$scope.account = dataSrv.session;
		console.warn($scope.account)
	}

	if($scope.results.length == 0) {
		if(!dataSrv.ready) {
			$rootScope.$on('ready', function() {
				ready();
			});
		} else {
			ready()
		}
	} else {
		ready()
	}





});









