"use strict";

var Viewr = (function() {
	var $ = function(){};
	$.prototype = {
		init: function() {
			var $=this,args=arguments[0]||{},cb=arguments[1]||function(){};
			var config = args.config||[];
			$._config = config;
			$._dataSrv = args.dataSrv;
			cb(null, true);
			return $;
		},
		_exec: function(obj, name) {
			var $=this;
			var q = 0;
			var res = [];
			var getByName = function(name) {
				for(var _i in $._config)
					if($._config[_i].name === name) 
						return $._config[_i];
				return null;
			}
			var v = null;
			switch(type(obj)) {
				case "string":
				case "number":
				case "boolean":
				case "array":
				v = getByName(name);
				if(v) {
					v.value = obj;
					if(v.sub) {
						//console.log(obj);
						v.sub = v.sub.map(function(e) {
							switch(type(e)) {
								case "string":
								case "number":
								case "boolean":
								//console.warn(e);
								return $._exec(obj, e);
								break;
							}
						});
					} else {
						v.sub = [];
					}
					res.push(v);
				}
				break;
				case "object":
				for(var _i in obj) {
					var i = obj[_i];
					v = $._exec(i, _i);
					if(type(v) === 'array') {
						res = res.concat(v);
					} else if(type(v) === 'object') {
						res.push(v);
					} else {
						console.warn(_i, v);
					}
				}
				break;
			}
			return res;
		},
		_transform: function(data) {
			var $=this;

			var groups = [];

			return data.map(function(e) {
				var res = {
					title: e.title,
					value: e.value,
					type: e.type
				};
				/*



div:
{
	value: "",
	array: true
}

tag:
{
	type: "select",
	value: "",
	multi: true,
	name: ""
}

tags:
[
	{
		id: 123,
		parrent: 0,
		type: "select",
		title: "",
		name: "",
		multi: false,
		value: "",
		default: ""
	}
]



				*/
				if(e.type == 'list') {
					res.type = 'select';
					res.value = $._dataSrv.getListSync(e.name);
					res.name = e.name;
				}
				return res;
			});
		},
		build: function() {
			var $=this,args=arguments[0]||{},cb=arguments[1]||function(){};
			cb(null, $._transform($._exec(args.data, args.type)));
			return $;
		}
	};
	return $;
})();








app.controller('officeCtrl', function($scope, $rootScope, $location, $http, $modal, dataSrv) {
	var viwer = new Viewr();
	
	$scope.account = dataSrv.session;
	$scope.profile = {};
	$scope.interviews = {};
	$scope.interviews.all = [];
	$scope.interviews.new = [];
	$scope.interviews.after = [];
	$scope.interviews.before = [];
	$scope.interviews.now = null;
	$scope.lists = {};
	$scope.test = [];

	var readyCompetitor = function() {
		dataSrv.getProfile({}, function(err, data) {
			data.info.birthday = hotDate(data.info.birthday);
			$scope.profile = data;
			console.log(data);
			$scope.lists = dataSrv._lists;
			dataSrv.getInterview({}, function(err, interviews) {
				console.warn(err, interviews);
				$scope.interviews.all = interviews;
				var now = coolDateTime();
				($scope.interviews.all||[]).forEach(function(e) {

				});
			});
			NodeList.prototype.forEach = Array.prototype.forEach;
			setTimeout(function() {
				document.querySelectorAll(".xvideoiframe").forEach(function(e) {
					e.setAttribute('src', e.getAttribute('x-code'));
				});
			}, 500);
			$scope.imageUploadTo = $scope.profile.images;
			if(err) $rootScope.$emit('notification', {title: 'Error', desc: dataSrv.getErrorSync(err), type:'error'});
			else 
				viwer.build({data: data}, function(err, e) {
					$scope.test = e;
				});
		});
		if(dataSrv.session.auth) {
			$scope.profileUrl = '/views/office/'+dataSrv.session.type+'.html';
			$scope.interviewUrl = '/views/interview/'+dataSrv.session.type+'.html';
		} else {
			$location.path("/");
		}
		$rootScope.$on('sessionUpdate', function(a, session) {
			session = session||{};
			$scope.account = session;
			if(session.auth) {
				$scope.profileUrl = '/views/office/'+session.type+'.html';
			} else {
				$location.path("/");
			}
		});
	}

	var readyEmployer = function() {
		viwer.init({config:dataSrv.getFieldsSync(), dataSrv:dataSrv}, function(err, data) {
			dataSrv.getProfile({}, function(err, profile) {
				$scope.profile = profile;
				console.log(profile);
				dataSrv.getVacansy({}, function(err, vacansy) {
					$scope.lists = dataSrv._lists;
					$scope.vacansy = vacansy||[];
					NodeList.prototype.forEach = Array.prototype.forEach;
					setTimeout(function() {
						document.querySelectorAll(".xvideoiframe").forEach(function(e) {
							e.setAttribute('src', e.getAttribute('x-code'));
						});
					}, 500);
					if(err) {
						$rootScope.$emit('notification', {title: 'Error', desc: dataSrv.getErrorSync(err), type:'error'});
					} else {
						viwer.build({data: profile}, function(err, e) {
							$scope.test = e;
						});
					}
				})
			});
		});
		if(dataSrv.session.auth) {
			$scope.profileUrl = '/views/office/'+dataSrv.session.type+'.html';
		} else {
			$location.path("/");
		}
		$rootScope.$on('sessionUpdate', function(a, session) {
			session = session||{};
			$scope.account = session;
			if(session.auth) {
				$scope.profileUrl = '/views/office/'+session.type+'.html';
			} else {
				$location.path("/");
			}
		});
	}
	var ready = function() {
		switch(dataSrv.session.type) {
			case "competitor": readyCompetitor();
			break;
			case "employer": readyEmployer();
			break;
		}
	}
	if(dataSrv.ready) {
		ready();
	} else {
		$rootScope.$on('ready', function() {
			ready();
		});
	}

	$scope.getFromList = function(name, id) {
		return dataSrv.getFromListSync(name, id);
	}

	$scope._new = {
		vacansy: {},
		career: {
			industryPost: {}
		}
	};
	$scope._add = {
		industryPost: function(obj) {
			$scope.profile.industryPost.push({
				industry: $scope._new.industry,
				post: $scope._new.post
			});
				$scope._new.industry = "";
				$scope._new.post = "";
		},
		vacansyLanguage: function() {
			if(!$scope._new.vacansy.languages) $scope._new.vacansy.languages = [];
			if(!$scope._new.language || !$scope._new.language.tag || !$scope._new.language.proficiency) return;
			$scope._new.vacansy.languages.push({
				tag: +$scope._new.language.tag,
				proficiency: +$scope._new.language.proficiency
			});
			$scope._new.language.tag = null;
			$scope._new.language.proficiency = null;
		},
		language: function() {
			if(!$scope._new.language || !$scope._new.language.tag || !$scope._new.language.proficiency) return;
			$scope.profile.languages.push({
				tag: +$scope._new.language.tag,
				proficiency: +$scope._new.language.proficiency
			});
			$scope._new.language.tag = null;
			$scope._new.language.proficiency = null;
		},
		vacansy: function() {
			dataSrv.addVacansy({q:$scope._new.vacansy}, function(err, data) {
				$scope._new.vacansy = {};
				$scope.vacansyFormView = false;
				console.warn(err, data);
			});
		},
		career: function() {
			if(!$scope._new.career) $scope._new.career = {industryPost:{}};
			if(
				!$scope._new.career.organization ||
				!$scope._new.career.vac_industryPost.industry ||
				!$scope._new.career.vac_industryPost.post ||
				!$scope._new.career.begin ||
				type($scope._new.career.end) == 'undefined'
			) return;

			$scope.profile.career.push(
				clone($scope._new.career)
			);
			console.warn($scope.profile)
			$scope._new.career.organization = null;
			$scope._new.career.industryPost.industry = null;
			$scope._new.career.industryPost.post = null;
			$scope._new.career.begin = null;
			$scope._new.career.end = null;
		
		},
		education: function() {
			$scope.profile.education.push({
				level: $scope._new.level,
				hs: $scope._new.hs,
				speciality: $scope._new.speciality,
				year: $scope._new.year
			});
			console.log({
				level: $scope._new.level,
				hs: $scope._new.hs,
				speciality: $scope._new.speciality,
				year: $scope._new.year
			});
				$scope._new.level = "";
				$scope._new.hs = "";
				$scope._new.speciality = "";
				$scope._new.year = 0;
		}
	};
	$scope._remove = function(from, i, upd) {
		from.splice(i, 1);
		if(upd) $scope.updateProfile();
	}






	$scope.geo = "";



	$scope._geo = [];
	$scope.selectGeo = function(a) {
		console.warn(a);
	};

	$scope.getLocation = function(val) {
		return $http.get('http://maps.googleapis.com/maps/api/geocode/json', {
			params: {
				address: val,
				sensor: false
			}
		}).then(function(response){
			return response.data.results;
			return response.data.results.map(function(item){
				return item.formatted_address;
			});
		});
	};






	$scope.cstmModal = false;







	$scope.updateProfile = function() {
		dataSrv.updateProfile(clone($scope.profile), function(err, data) {
			console.log(err, data, $scope.profile);
			setTimeout(function() {
				document.querySelectorAll(".xvideoiframe").forEach(function(e) {
					e.setAttribute('src', e.getAttribute('x-code'));
				});
			}, 2000);
			$rootScope.$emit('notification', {
				title: '',
				desc: 'Информация сохранена',
				type: 'info'
			});
		});
	}

	$scope.removeImage = function(from, i) {
		if(confirm("Удалить изображение?")) {
			from.splice(i, 1);
			$scope.updateProfile();
		}
	}

	$scope.removeVideo = function(from, i) {
		if(confirm("Удалить видео?")) {
			from.splice(i, 1);
			$scope.updateProfile();
		}
	}

	/* UPLOAD IMAGE */
	$scope.openUploadImage = function(to) {
		$scope.imageUploadTitle = "";
		$scope.imageUploadDescription = "";
		$scope.imageUploadTo = to;
		var img = document.createElement("img");
		document.querySelector(".imageUpload .preview").innerHTML = "";
		document.querySelector(".imageUpload .preview").appendChild(img);
		document.querySelector(".imageUpload form input").outerHTML = document.querySelector(".imageUpload form input").outerHTML;
		$scope.imageUploadFormView = true;
		$scope.cstmModal = 'image';
	}
	var imageCanvas, image, dui, imageFile;
	$scope.imageChange = function(event) {
		$scope.imageUploadFormView = false;
		$scope.$apply();
		imageFile = event.target.files[0];
		var reader = new FileReader();
		reader.onload = function(event) {
			var dataUri = reader.result;
			jQuery(".imageUpload .preview img").attr("src",dataUri);
			image = jQuery(".imageUpload .preview img").imgAreaSelect({handles: true, instance: true, onSelectEnd: function() {
				$scope.imageCut();
			}});
		};
		reader.readAsDataURL(imageFile);
		return;
	}
	$scope.imageCut = function() {
			var temp_canvas = document.createElement('canvas');
			var temp_ctx = temp_canvas.getContext('2d');
			var s = image.getSelection();
			if(s.width == 0) return dui = null;
			var img = document.querySelector(".imageUpload .preview img");
			var lw = img.naturalWidth;
			var lh = img.naturalHeight;
			var mw = img.width;
			var mh = img.height;
			var pw = lw/mw;
			var ph = lh/mh;
			s.w = s.width*pw;
			s.h = s.height*ph;
			s.x = s.x1*ph;
			s.y = s.y1*ph;
			temp_canvas.width = s.w;
			temp_canvas.height = s.h;
			temp_ctx.drawImage(img, s.x, s.y, s.w, s.h, 0, 0, s.w, s.h);
			var vData = temp_canvas.toDataURL();
			dui = vData;
	}
	$scope.imageUpload = function() {
		var formData=new FormData();
		formData.append("file",dui? dataURItoBlob(dui) : imageFile);
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
			// debugger;
			switch(type($scope.imageUploadTo)) {
				case "array":
					$scope.imageUploadTo.push({
						title:$scope.imageUploadTitle,
						description:$scope.imageUploadDescription,
						image:data.result
					});
					$scope.updateProfile();
					break;
				default:
					if($scope.profile && $scope.profile.company && type($scope.profile.company.logo) == "string") {
							$scope.profile.company.logo = data.result;
							$scope.updateProfile();
						}
					break;
			}
			$scope.cstmModal = false;
			$scope.imageUploadTitle = "";
			$scope.imageUploadDescription = "";
		})
		.error(function(data, status) {
			console.warn(data);
		});
		jQuery(".imageUpload .preview img").imgAreaSelect({remove:true});
	};
	$scope.imageUploadTo = null;
	$scope.imageUploadTitle = "";
	$scope.imageUploadDescription = "";
	/* / UPLOAD IMAGE */






	/* VIDEO IMAGE */
	var videoData = {};
	$scope.openUploadVideo = function(to) {
		$scope.videoUploadTo = to;
		$scope.cstmModal = 'video';
		var q = function() {
			$http({
				method: 'GET',
				url: '/api/0.1/media/upload'
			})
			.success(function(data, status) {
				console.log(data);
				videoData.progressUri = data.result.progress;
				videoData.uploadUri = data.result.upload;
				window.videoProgressUri =data.result.progress;
				$scope.videoUploadFormView = true;
				$scope.videoUploadTitle = "";
				$scope.videoUploadDescription = "";
				$scope.videoUpload()
			})
			.error(function(data, status) {
				console.warn(data);
			});
		}
		q();
	}
	$scope.videoUpload = function() {
		var uploadUri = videoData.uploadUri;
		var progressUri = videoData.progressUri;
		var refreshIntervalId;
		var refresh = 1000;
		var code = "<script>function submitForm() {parent.runVideoUpload();document.querySelector('#form1').submit();}</script><form action='"+uploadUri+"' method='POST' enctype='multipart/form-data' id='form1'><input type='file' name='file' accept='video/*' onchange='submitForm()'></form>";
		var pageUrl = URL.createObjectURL(new Blob([code], {type : 'text/html'}));
		var iframe = document.createElement('iframe');
		iframe.width = 300;
		iframe.height = 50;
		iframe.src = pageUrl;
		document.querySelector('.videoUpload .videoIframe').innerHTML = "";
		document.querySelector('.videoUpload .videoIframe').appendChild(iframe);
		var getPercent = function() {
			console.log(progressUri+"&format=json");
			$.ajax({
				type: 'GET',
				url: '/api/0.1/media/progress',
				data: {url: progressUri+"&format=json"},
				dataType: 'json',
				success: function(data) {
					console.log(data);
					if(data.Action=='done') {
						var code = data.Code;
						document.querySelector('.videoUpload .videoProgress').innerHTML = "Готово!";
						dataSrv.getVideo({code:code}, function(err, data) {
							console.log(data);
							$scope.videoUploadTo.push({
								title: $scope.videoUploadTitle,
								description: $scope.videoUploadDescription,
								video:code
							});
							$scope.updateProfile();
						});
						$scope.cstmModal = false;
						console.log("DONE");
					} else {
						document.querySelector('.videoUpload .videoProgress progress').value = data.Percent;
						document.querySelector('.videoUpload .videoProgress progress span').innerHTML = data.Percent;
						refreshIntervalId = setTimeout(function(){getPercent()}, refresh);
					}
				}
			});
		}
		window.runVideoUpload = function() {
			document.querySelector('.videoUpload .videoProgress').innerHTML = "<progress max=\"100\" value=\"0\">Загружено на <span id=\"value\">0</span>%</progress>";
			$scope.videoUploadFormView = false;
			$scope.$apply();
			refreshIntervalId = setTimeout(function(){getPercent()}, refresh);
		}
	}
	$scope.videoUploadTo = null;
	$scope.videoUploadTitle = "";
	$scope.videoUploadDescription = "";
	/* / VIDEO IMAGE */

















});


