"use strict";


app.controller('searchTeamsCtrl', function($scope, $rootScope, dataSrv) {
	$rootScope._data.header.active = 'teams';
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
	var testPage = function() {
		console.log(123);
		if(window.scrollY+window.screen.height+100 > document.body.offsetHeight) {
			$rootScope.search(null, true);
		} else {
			setTimeout(function() {
				if($rootScope._data.header.active == 'team') {
					testPage();
				}
			}, 100);
		}
	}
	$rootScope.search();
	testPage();
});