"use strict";


app.factory('callSrv', function($http, $resource, $rootScope, dataSrv) {

	var WebRTC = new customWRTC();

	var init = function() {
		WebRTC.init({
			mySelector: '.videocallmodal .my-video',
			selector: '.videocallmodal .their-video',
			id: $rootScope._data.session.id,
			query: function(cb) {
				if(confirm("Вам предлагают собеседование, ответить?")) {
					$rootScope.iscall=true;
					$rootScope.modal('videocall');
					cb(true);
				} else {
					cb(false)
				}
			},
			discon: function() {
				$rootScope.iscall=false;
				$rootScope.modal(false);
			}
		});
		$rootScope.iscall=false;
		$rootScope.modal(false);
	}
	$rootScope.$on('ready', function() {
		if($rootScope._data.session.auth) {
			init();
		}
	})

	$rootScope.startCall = function(id) {
		if($rootScope._data.session.auth) {
			WebRTC.startCall({id: id,
			mySelector: '.videocallmodal .my-video',
			selector: '.videocallmodal .their-video'})
			$rootScope.iscall=true;
			$rootScope.modal('videocall');
		}
	}

	$rootScope.endCall = function() {
		if($rootScope._data.session.auth) {
			WebRTC.endCall();
			$rootScope.iscall=false;
			$rootScope.modal(false);
		}
	}


	return {};

})





