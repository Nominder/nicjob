"use strict"

app.controller('profileCtrl', function($scope, $rootScope, $routeParams, dataSrv) {
	var ready = function() {
		dataSrv.getProfileById({id:$routeParams.id}, function(err, data) {
			console.warn(data);
			$scope.lists = dataSrv._lists;
			$scope.profile = data;
			NodeList.prototype.forEach = Array.prototype.forEach;
			setTimeout(function() {
				document.querySelectorAll(".xvideoiframe").forEach(function(e) {
					e.setAttribute('src', e.getAttribute('x-code'));
				});
			}, 500);
		})
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
	$scope.get_current_age = function (date) {
		date = hotDate(date||coolDate(new Date));
		return ((new Date().getTime() - new Date(date)) / (24 * 3600 * 365.25 * 1000)) | 0;
	}
	$scope.getFromList = function(name, id) {
		return dataSrv.getFromListSync(name, id);
	}

	if(dataSrv.ready) {
		ready();
	} else {
		$rootScope.$on('ready', function() {
			ready();
		});
	}
})

