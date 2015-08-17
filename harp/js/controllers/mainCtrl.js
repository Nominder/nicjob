"use strict";

var mainCtrl = function($rootScope, $resource, $http) {
	
	$rootScope.account = JSON.parse(localStorage.account || '{"auth":false,"email":"","id":""}');
	$rootScope.Errors = {};
	var errors = $resource("/openapi/0.1/errors");
	errors.get({},function(data) {
		if(!data.error||1) $rootScope.Errors = data.result; else console.warn(data.error);
	});
	$http.post("/openapi/0.1/account/checkAuth").success(function(data) {
		!data.error ? $rootScope.account = JSON.parse(localStorage.account = JSON.stringify(data.result)) : console.warn(data);
	}).error(function(data) {
		console.warn("Error: request checkAuth");
	});

	var WebRTC = new customWRTC();

	var init = function() {
		WebRTC.init({
			mySelector: '.videocall .my-video',
			selector: '.videocall .their-video',
			id: $rootScope.account.id
		});
		$rootScope.iscall=false;
	}
	$rootScope.$on('ready', function() {
		init();
	})

	$rootScope.startCall = function(id) {
		WebRTC.startCall({id: id, selector: '.videocall .their-video'})
		$rootScope.iscall=true;
	}

	$rootScope.endCall = function() {
		WebRTC.endCall();
		$rootScope.iscall=false;
	}
}
.run(function($rootScope) {
			});