"use strict";


app.factory('callSrv', function($http, $resource, $rootScope, dataSrv) {

	var WebRTC = new customWRTC();

	var init = function() {
		WebRTC.init({
			mySelector: '.videocallmodal .my-video',
			selector: '.videocallmodal .their-video',
			id: dataSrv.session.id,
			query: function(cb) {
				if(confirm("Вам предлагают собеседование, ответить?")) {
					$rootScope.iscall=true;
					$rootScope.$apply()
					cb(true);
				} else {
					cb(false)
				}
			},
			discon: function() {
				$rootScope.iscall=false;
				$rootScope.$apply()
			}
		});
		$rootScope.iscall=false;
	}
	$rootScope.$on('ready', function() {
		if(dataSrv.session.auth) {
			init();
		}
	})

	$rootScope.startCall = function(id) {
		if(dataSrv.session.auth) {
			WebRTC.startCall({id: id,
			mySelector: '.videocallmodal .my-video',
			selector: '.videocallmodal .their-video'})
			$rootScope.iscall=true;
		}
	}

	$rootScope.endCall = function() {
		if(dataSrv.session.auth) {
			WebRTC.endCall();
			$rootScope.iscall=false;
		}
	}


	return {};

})





