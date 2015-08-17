"use strict";
app.controller('office.competitorCtrl', function($scope, $rootScope, $interval, $location, $http, dataSrv) {
	$scope._add = {
		_dob: {
			d:23,
			m:11,
			y:1993
		},
		address: {},
		methods: {
			industryPost: function() {
				var obj = {
					industry: $rootScope.getListId('industry', $scope._add.industryPost.industry),
					post: $rootScope.getListId('post', $scope._add.industryPost.post)
				};
				$scope.profile.industryPost.push(obj);
				$scope._add.industryPost={};
			},
			education: function() {
				var obj = {
					level: $rootScope.getListId('level', $scope._add.education.level),
					hs: $scope._add.education.hs,
					speciality: $rootScope.getListId('speciality', $scope._add.education.speciality)||$scope._add.education.speciality,
					year: $scope._add.education.year
				};
				$scope.profile.education.push(obj);
				$scope._add.education={};
			},
			career: function() {
				var obj = {
					vac_industryPost: {
						industry: $rootScope.getListId('industry', $scope._add.career.vac_industryPost.industry),
						post: $rootScope.getListId('post', $scope._add.career.vac_industryPost.post)
					},
					address: $scope._add.career.address,
					speciality: $rootScope.getListId('speciality', $scope._add.career.speciality)||$scope._add.career.speciality,
					organization: $scope._add.career.organization,
					begin: $rootScope.coolDate($scope._add.career.begin),
					end: _add.careerEndNull ? 0 : $rootScope.coolDate($scope._add.career.end)
				};
				$scope.profile.career.push(obj);
				$scope._add.career={};
			},
			language: function() {
				var obj = {
					tag: $scope._add.language.tag,
					proficiency: $scope._add.language.proficiency
				};
				$scope.profile.languages.push(obj);
				$scope._add.language={proficiency:3};
			},
			skills: function() {
				var obj = {
					skill: $scope._add.skills.skill,
					proficiency: $scope._add.skills.proficiency
				};
				$scope.profile.skills.push(obj);
				$scope._add.skills={proficiency:3};
			}
		}
	}


	dataSrv.getProfile({}, function(err, profile) {
		//profile.info.birthday = profile.info.birthday ? hotDate(profile.info.birthday) : profile.info.birthday;
		profile.info.birthday = profile.info.birthday || coolDate();
		$scope._add._dob.y = parseInt(profile.info.birthday.toString().substr(0,4));
		$scope._add._dob.m = parseInt(profile.info.birthday.toString().substr(4,2));
		$scope._add._dob.d = parseInt(profile.info.birthday.toString().substr(6,2));
		/*
		for(var _i in profile.career) {
			var i = profile.career[_i];
			i.begin = hotDate(i.begin);
			i.end = hotDate(i.end);
		}
		*/
		// console.log(JSON.stringify(profile, true, '	'));
		/*
		profile.industryPost = profile.industryPost.map(function(e) {
			return {
				industry: $rootScope.getFromList('industry', e.industry),
				post: $rootScope.getFromList('post', e.post)
			}
		});
		*/
		profile.education = profile.education.map(function(e) {
			return {
				hs: $rootScope.getFromList('hs', e.hs),
				speciality: $rootScope.getFromList('speciality', e.speciality)
			}
		});
		profile.education = profile.education.length ? profile.education : [{}];
		profile.career = profile.career.map(function(e) {
			return {
				vac_industryPost: {
					industry: $rootScope.getFromList('industry', e.vac_industryPost.industry),
					post: $rootScope.getFromList('post', e.vac_industryPost.post)
				},
				organization: e.organization,
				begin: hotDate(e.begin),
				end: hotDate(e.end)
			}
		});
		/*
		profile.languages = profile.languages.map(function(e) {
			return {
				tag: e.tag.toString(),//$rootScope.getFromList('tag', e.tag),
				proficiency: e.proficiency
			}
		});
		*/
		profile.skills = profile.skills.map(function(e) {
			return {
				skill: $rootScope.getFromList('skill', e.skill),
				proficiency: e.proficiency
			}
		});
		//console.log(JSON.stringify(profile, true, '	'));
		$scope.profile = profile;
		$scope.profile.maritalStatus = profile.maritalStatus ? "true" : "false";
		$scope.profile.smoking = profile.smoking ? "true" : "false";
		$scope.profile.passport = profile.passport ? "true" : "false";
		$scope.profile.trip = profile.trip ? "true" : "false";
		$scope.profile.move = profile.move ? "true" : "false";
		$scope.profile.driverLicense = profile.driverLicense ? "true" : "false";
		$scope.profile.car = profile.car ? "true" : "false";
		$scope.profile.info.sex = profile.info.sex ? "true" : "false";
		$scope.profile.contacts.email = $scope.profile.contacts.email || dataSrv.session.email;
		$scope._add.address = {lt: profile.contacts.locate.lt, lg: profile.contacts.locate.lg, address: profile.contacts.address};
		console.log(profile);
		NodeList.prototype.forEach = Array.prototype.forEach;
		setTimeout(function() {
			document.querySelectorAll(".xvideoiframe").forEach(function(e) {
				e.setAttribute('src', e.getAttribute('x-code'));
			});
		}, 500);
	});

	$scope.typeOf = function(e) {
		return typeof e;
	}
	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	$scope.interviews = [];
	var getInterview = function() {
		dataSrv.getInterview({}, function(err, data) {
			//console.warn(data);
			$scope.interviews = data;
			$scope.nowtime = {d:100000000000000000000};
			$scope.nowinterview = null;
		});
	}
	getInterview();
	$scope.accept = function(vac, time) {
		dataSrv.acceptInterview({id:vac, selectedTime:time}, function(err, data) {
			//console.warn(err, data, vac, time);
			getInterview();
		});
	}
	$scope.decline = function(vac) {
		dataSrv.declineInterview({id:vac}, function(err, data) {
			//console.warn(err, data);
			getInterview();
		});
	}
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
			}
		})
	}, 1000);

	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~



	dataSrv.getBlacklist({}, function(err, data) {
		console.warn(err, data);
	});


	dataSrv.getRespond({}, function(err, data) {
		$scope.responds = data;
		console.warn('getRespond', err, data);
	});

	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~





	$scope.saveSettings = function(data) {
		dataSrv.accountUpdate(data, function(err, data) {
			console.warn(err, data);
		});
	}

	$scope.removeAccount = function() {
		dataSrv.removeAccount({}, function(err, data) {
			console.warn(err, data);
			$location.path('/');
		});
	}

	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

	$scope.save = function() {
		var profile = clone($scope.profile);
		profile.salary.summa = +profile.salary.summa;
		profile.maritalStatus = profile.maritalStatus == "true";
		profile.smoking = profile.smoking == "true";
		profile.passport = profile.passport == "true";
		profile.trip = profile.trip == "true";
		profile.move = profile.move == "true";
		profile.driverLicense = profile.driverLicense == "true";
		profile.car = profile.car == "true";
		profile.info.sex = profile.info.sex == "true";
		profile.info.birthday = parseInt(
			$scope._add._dob.y.toString()+
			(($scope._add._dob.m<10?'0'+($scope._add._dob.m):($scope._add._dob.m)).toString())+
			($scope._add._dob.d<10?'0'+$scope._add._dob.d:$scope._add._dob.d).toString()
			);
		
		/*
		profile.industryPost = profile.industryPost.map(function(e) {
			return {
				industry: $rootScope.getListId('industry', e.industry),
				post: $rootScope.getListId('post', e.post)
			}
		});
		*/
		profile.education = profile.education.map(function(e) {
			return {
				hs: $rootScope.getListId('hs', e.hs),
				speciality: $rootScope.getListId('speciality', e.speciality)
			}
		});
		profile.career = profile.career.map(function(e) {
			return {
				vac_industryPost: {
					industry: $rootScope.getListId('industry', e.vac_industryPost.industry),
					post: $rootScope.getListId('post', e.vac_industryPost.post)
				},
				organization: e.organization,
				begin: coolDate(e.begin),
				end: coolDate(e.end)
			}
		});
		/*
		profile.languages = profile.languages.map(function(e) {
			return {
				tag: e.tag,//$rootScope.getListId('tag', e.tag),
				proficiency: e.proficiency//$rootScope.getListId('proficiency', e.proficiency)
			}
		});
		*/
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


