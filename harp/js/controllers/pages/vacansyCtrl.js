"use strict";
app.controller('pages.vacansyCtrl', function($scope, $rootScope, $http, $routeParams, $sce, dataSrv) {
	$scope.toURL = function(source) {
		return source ? $sce.trustAsResourceUrl('https://www.google.com/maps/embed/v1/place?key=AIzaSyDMskkBXP5hy7UcOOp0uGxP5r13MsBe0DY&q='+source) : '';
	}
	dataSrv.getVacansyById({id:$routeParams.id, vacansyId:$routeParams.vacansyId}, function(err, data) {
		$scope.vacansy = data.vacansy;
		$scope.profile = data.profile;
		console.log(data);
		NodeList.prototype.forEach = Array.prototype.forEach;
		setTimeout(function() {
			document.querySelectorAll(".xvideoiframe").forEach(function(e) {
				e.setAttribute('src', e.getAttribute('x-code'));
			});
		}, 500);
	});
});

