"use strict";
app.controller('office.employerCtrl', function($scope, $rootScope, $interval, $http, dataSrv) {
	$scope._add = {
		logo: []
	};
	dataSrv.getProfile({}, function(err, profile) {
		/*
		profile.info.birthday = hotDate(profile.info.birthday);
		for(var _i in profile.carrer) {
			var i = profile.carrer[_i];
			i.begin = hotDate(i.begin);
			i.end = hotDate(i.end);
		}
		*/
		if(profile.company.logo.length > 0) {
			$scope._add.logo = [{image:profile.company.logo}];
		}
		$scope.profile = profile;
		console.log(profile);
		NodeList.prototype.forEach = Array.prototype.forEach;
	});


	dataSrv.getVacansy({}, function(err, data) {
		console.warn(data)
		$scope.vacansy = data;
	});

	$scope.addVacansy = function() {
		dataSrv.addVacansy({q:$scope._add.vacansy}, function(err, data) {
			$scope._add.vacansy = {};
			console.warn(err, data);
		});
	}

	$scope.removeVacansy = function(id) {
		$scope.vacansy = $scope.vacansy.filter(function(e) {
			return e._id != id;
		});
		dataSrv.removeVacansy({id:id}, function(err, data) {
			console.warn(err, data);
		});
	}












	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	$scope.interviews = [];
	var getInterview = function() {
		dataSrv.getInterview({}, function(err, data) {
			console.warn(data);
			$scope.interviews = data;
			$scope.nowtime = {d:100000000000000000000};
			$scope.nowinterview = null;
		});
	}
	getInterview();
	$interval(function() {
		$scope.interviews.forEach(function(e) {
			var delta = Math.floor((hotDateTime(e.selectedTime).getTime() - hotDateTime().getTime()) / 1000);
			if(e.selectedTime && delta > 0 && delta < $scope.nowtime.d) {
				$scope.nowinterview = e;
				e = Math.abs(delta);
				var h = Math.floor(e / (60*60));
				var m = Math.floor((e - (h*60*60)) / 60);
				var s = Math.floor(e - (h*60*60) - (m*60));
				$scope.nowtime.h = h;
				$scope.nowtime.m = m;
				$scope.nowtime.s = s;
				$scope.nowtime.d = delta;
				if(delta == 1) {
					$rootScope.startCall($scope.nowinterview.comp_id);
				}
			}
		})
	}, 1000);
	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~



	var getBlacklist = function() {
		dataSrv.getBlacklist({}, function(err, data) {
			console.warn(err, data);
			$scope.blacklist = data;
		});
	};

	getBlacklist();


	$scope.removeOfBlacklist = function(id) {
		dataSrv.removeOfBlacklist({id:id}, function(err, data) {
			getBlacklist();
		});
	}


	$scope.removeOfWatchlist = function(id) {
		dataSrv.removeOfWatchlist({id:id}, function(err, data) {
			getWatchlist();
		});
	}



	var getWatchlist = function() {
		dataSrv.getWatchlist({}, function(err, data) {
			console.warn(err, data);
			$scope.watchlist = data;
		});
	}

	getWatchlist()







	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~













	$scope.save = function() {
		var profile = clone($scope.profile);
		if($scope._add.logo.length > 0) {
			profile.company.logo = $scope._add.logo[$scope._add.logo.length-1].image;
		}
		console.log('zzz', profile);
		dataSrv.updateProfile(profile, function(err, data) {
			if(!err) {
				console.log(data.result);
			} else console.warn(data);
		});
	}
	/*
	setInterval(function() {
		console.log($scope.profile);
	}, 10000);
	*/
});
//hghjgjuhgljkhknmj








