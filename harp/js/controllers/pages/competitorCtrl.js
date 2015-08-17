"use strict";
app.controller('pages.competitorCtrl', function($scope, $rootScope, $http, $routeParams, $sce, dataSrv) {
	$scope.toURL = function(source) {
		return source ? $sce.trustAsResourceUrl('https://www.google.com/maps/embed/v1/place?key=AIzaSyDMskkBXP5hy7UcOOp0uGxP5r13MsBe0DY&q='+source) : '';
	}
	$scope.id = $routeParams.id;
	dataSrv.getProfileById({id:$routeParams.id}, function(err, profile) {
		profile.info.birthday = hotDate(profile.info.birthday);
		for(var _i in profile.carrer) {
			var i = profile.carrer[_i];
			i.begin = hotDate(i.begin);
			i.end = hotDate(i.end);
		}
		$scope.profile = profile;
		console.log(profile);
		NodeList.prototype.forEach = Array.prototype.forEach;
		setTimeout(function() {
			document.querySelectorAll(".xvideoiframe").forEach(function(e) {
				e.setAttribute('src', e.getAttribute('x-code'));
			});
		}, 500);
	});
});
