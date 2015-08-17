"use strict";
var changeProfileCtrl = function($http, $scope, $rootScope, $resource) {
	var image, dui;
	$scope.test = function() {
		console.log($scope.profile, clone($scope.profile));
	}
	var normalizeModel = function(obj, type) {
		var profiles = {
			competitor: {
				images: [],
				videos: [],
				industryPost: [],
				salary: {
					period: "",
					summ: 0
				},
				part: "", // занятость
				education: [],
				diplomas: [],
				career: [],
				portfolio: {
					images: [],
					videos: []
				},
				languages: [],
				nationality: "",
				sitizenship: "",
				religion: "",
				maritalStatus: false,
				children: 0,
				hobby: "",
				smoking: false,
				passport: false,
				driverLicense: "",
				car: false,
				about: "",
				skills: "",
				positiveQualities: "",
				negativeQualities: "",
				move: false,
				trip: true,
				info: {
					firstName: "",
					lastName: "",
					patronymic: "",
					sex: true,
					birthday: new Date(1993, 11, 23)
				},
				contacts: {
					country: "",
					city: "",
					metro: "",
					address: "",
					locate: {
						lt: 0,
						lg: 0
					},
					phone: "",
					email: $rootScope.account.email,
					skype: "",
					socialNetwork: "",
					other: ""
				}
			},
			team: {
				images: [],
				videos: [],
				industryPost: [],
				count: 0,
				salary: {
					period: "",
					summ: 0
				},
				portfolio: {
					images: [],
					videos: []
				},
				about: "",
				skills: "",
				looking: "",
				info: {
					name: ""
				},
				contacts: {
					firstName: "",
					lastName: "",
					patronymic: "",
					country: "",
					city: "",
					metro: "",
					address: "",
					locate: {
						lt: 0,
						lg: 0
					},
					phone: "",
					email: "",
					skype: "",
					socialNetwork: "",
					other: ""
				}
			},
			employer:{
				company: {
					name: "",
					logo: "",
					industry: "",
					description: ""
				},
				contacts: {
					firstName: "",
					lastName: "",
					patronymic: "",
					photo: "",
					phone: "",
					email: "",
					other: ""
				}
			}
		};
		if(!obj) return profiles[type];
		for(var _i in profiles[type]) {
			if(!obj[_i]) {
				obj[_i] = profiles[type][_i];
			}
		}
		return obj;
	}
	$scope.uploadFile = function() {
		var formData=new FormData();
		console.log(file);
		formData.append("file",dui? dataURItoBlob(dui) : file.files[0]);
		$http({
			method: 'POST',
			url: '/api/0.1/images/create',
			headers: { 'Content-Type': undefined},
			data: formData,
			transformRequest: function(data, headersGetterFunction) {
				return data;
			}
		})
		.success(function(data, status) {
			console.log(data);
			$scope.profile.images.push({title:"lol",description:"xxx",image:data.result});
		})
		.error(function(data, status) {
			console.warn(data);
		});
	};
	$scope.type = $rootScope.account.type;
	$scope.profile = normalizeModel({}, $scope.type);
	$scope.imageChange = function(event) {
		var file = event.target.files[0];
		var reader = new FileReader();
		reader.onload = function(event) {
			var dataUri = reader.result;
			jQuery(".preview img").attr("src",dataUri);
			image = jQuery(".preview img").imgAreaSelect({handles: true, instance: true, onSelectEnd: function() {
				$scope.cut();
			}});
			console.log(dataUri);
		};
		
		reader.readAsDataURL(file);
		
		
		return;
	}

	$scope.cut = function() {
			var temp_canvas = document.createElement('canvas');
			var temp_ctx = temp_canvas.getContext('2d');
			var s = image.getSelection();
			console.log(s);
			if(s.width == 0) return dui = null;
			var lw = document.querySelector(".preview img").naturalWidth;
			var lh = document.querySelector(".preview img").naturalHeight;
			var mw = document.querySelector(".preview img").width;
			var mh = document.querySelector(".preview img").height;
			var pw = lw/mw;
			var ph = lh/mh;
			s.w = s.width*pw;
			s.h = s.height*ph;
			s.x = s.x1*ph;
			s.y = s.y1*ph;
			temp_canvas.width = s.w;
			temp_canvas.height = s.h;
			temp_ctx.drawImage(document.querySelector(".preview img"), s.x, s.y, s.w, s.h, 0, 0, s.w, s.h);
			var vData = temp_canvas.toDataURL();
			dui = vData;
			console.log(vData);
	}

	var loadList = function(title) {
		if(!localStorage['list'+title]) {
			$http.get("/openapi/0.1/list/"+title+"/get").success(function(data) {
				$scope['list'+title] = data.result;
				localStorage['list'+title] = JSON.stringify(data.result);
			});
		} else {
			$scope['list'+title] = JSON.parse(localStorage['list'+title]);
		};
	}
	loadList('religion');
	loadList('sitizenship');
	loadList('tag');
	$http.get("/api/0.1/profile/get", {}).success(function(data) {
		console.log(data)
		if(!data.error) {
			var profile = normalizeModel(data.result, $scope.type);
			profile && profile.info && profile.info.birthday && !(profile.info.birthday instanceof Date) ? profile.info.birthday = hotDate(profile.info.birthday) : false;
			$scope.profile = profile;
		} else console.warn(data);
	});
	$scope.save = function() {
		var profile = clone($scope.profile);
		/*
		if(profile && profile.info && profile.info.birthday) 
			profile.info.birthday = coolDate($scope.profile.info.birthday)
		*/
		console.log(profile);
		$http.post("/api/0.1/profile/update", {changes:JSON.stringify(profile)}).success(function(data) {
			if(!data.error) {
				//data.result && data.result.info && data.result.info.birthday ? data.result.info.birthday = hotDate(data.result.info.birthday) : false;
				console.log(data.result);
				//$scope.profile = data.result;
				$rootScope.addError(
					"Готово!",
					"Профиль обновлён."
				);
			} else console.warn(data);
		});
	}
}