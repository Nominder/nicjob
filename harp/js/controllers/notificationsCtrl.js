"use strict";

app.controller('notificationsCtrl', ['$scope', '$timeout', '$rootScope', 'dataSrv', function($scope, $timeout, $rootScope, dataSrv) {
	$scope.notifications = [];
	$scope.del = function(id) {
		$scope.notifications.splice(id||0, 1);
	}
	$rootScope.$on('notification', function(a, data) {
		$scope.notifications.push({
			title:data.title||"",
			desc:data.desc||data.description||"",
			icon:data.icon||'cog',
			type:data.type||'info'
		});
		$timeout(function() {
			$scope.del();
		}, 5000);
	});
}]);




