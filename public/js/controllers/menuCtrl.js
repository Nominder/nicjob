"use strict";


app.controller('menuCtrl', function($scope, $rootScope, $location, $modal, dataSrv) {
	$scope.account = dataSrv.session;
	$scope.showLoginForm = false;
	$scope.isCollapsed = true;
	$scope._showLoginForm = function() {
		$scope.showLoginForm = true;
	}
	$scope._hideLoginForm = function() {
		$scope.showLoginForm = false;
	}
	var modal = null;
	$rootScope.modalOpen = function(id) {
		$rootScope.mt = id||1;
		modal = $modal.open({
			templateUrl: 'myModalContent.html'
		})
	}

	var errornHandler = function(form) {
		console.warn('!!!!ERROR!!!!')
		for(var i in form.$error) {
			var desc = '';
			switch(i) {
				case "email": desc = 'Укажите правилный email'; break;
				case "passwd": desc = 'Укажите пароль'; break;
				case "required": desc = 'Заполнены не все поля'; break;
			}
			$rootScope.$emit('notification', {
				title: 'Внимание!',
				desc: desc,
				type: 'warn'
			})
		}
	}
	$rootScope.login = function(data, form) {
		if(!form.$valid) errornHandler(form); else dataSrv.login(data, function(err, data) {
			if(!err) {
				$scope.showLoginForm = false;
					$location.path('/office');
					if(modal) modal.dismiss('cancel')
				setTimeout(function() {
				}, 1500);
			}
		});
		console.warn(data, form);
	}
	$scope.reg = {};
	$rootScope.signup = function(data, form) {
		if(!form.$valid) errornHandler(form); else dataSrv.register(data, function(err, data) {
			if(!err) {
				$scope.showLoginForm = false;
					if(modal) modal.dismiss('cancel')
					$location.path('/office');
				setTimeout(function() {
				}, 1500);
			}
		});
		console.warn(data, form);
	}
	$rootScope.logout = function(data, form) {
		dataSrv.exit();
	}
	$rootScope.$on('sessionUpdate', function(a, session) {
		session = session||{};
		console.log(session);
		$scope.account = session;
	});
});


