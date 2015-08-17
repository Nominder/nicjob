"use strict";


app.controller('headerCtrl', function($scope, $rootScope, $location, dataSrv) {
	$scope.account = dataSrv.session;
	$scope.login = function(data) {
		dataSrv.login(data, function(err, data) {
			if(!err) {
				$rootScope.modal(false);
				$location.path('/office');
			} else {
				$rootScope.message({title:$rootScope._data.errors[err], type:'error'})
			}
		});
	}
	$scope.signup = function(data) {
		dataSrv.register(data, function(err, data) {
			if(!err) {
				$rootScope.modal(false);
				$location.path('/office');
			} else {
				$rootScope.message({title:$rootScope._data.errors[err], type:'error'})
			}
		});
	}
	$scope.remind = function(data) {
		var email = data.email;
		dataSrv.remind(data, function(err, data) {
			if(!err) {
				$rootScope.modal(false);
				$rootScope.message({title:'На Ваш email отправлины новые учётные данные.', timeout:30000, type:'info', buttons: [{text:'Проверить email', callback: function(id) {
					window.open('//'+email.toString().match(/\@(.*)$/)[1], '_blank');
					$rootScope.removeMessage(id);
				}}]})
			} else {
				$rootScope.message({title:$rootScope._data.errors[err], type:'error'})
			}
		});
	}
	$scope.logout = function(data) {
		dataSrv.exit();
		$rootScope.modal(false);
		$location.path('/');
	}
	$rootScope.$on('sessionUpdate', function(a, session) {
		session = session||{};
		$scope.account = session;
	});
});


