"use strict";
app.controller('office.teamCtrl', function($scope, $rootScope, $interval, $http, dataSrv) {
	$scope._add = {
	};
	dataSrv.getProfile({}, function(err, profile) {
		console.log(profile);
		profile.industryPost = profile.industryPost.map(function(e) {
			return {
				industry: $rootScope.getFromList('industry', e.industry),
				post: $rootScope.getFromList('post', e.post)
			}
		});
		profile.skills = profile.skills.map(function(e) {
			return {
				skill: $rootScope.getFromList('skill', e.skill),
				proficiency: e.proficiency
			}
		});
		console.log(profile);
		$scope.profile = profile;
		NodeList.prototype.forEach = Array.prototype.forEach;
	});





	$scope.save = function() {
		var profile = clone($scope.profile);
		profile.salary.summa = +profile.salary.summa;
		profile.industryPost = profile.industryPost.map(function(e) {
			return {
				industry: $rootScope.getListId('industry', e.industry),
				post: $rootScope.getListId('post', e.post)
			}
		});
		profile.skills = profile.skills.map(function(e) {
			return {
				skill: $rootScope.getListId('skill', e.skill),
				proficiency: e.proficiency
			}
		});
		console.log(profile);
		dataSrv.updateProfile(profile, function(err, data) {
			if(!err) {
				console.log(data.result);
				$rootScope.message({title:'Профиль успешно обновлён!', type:'info'});
			} else console.warn(data);
		});
	}



});






