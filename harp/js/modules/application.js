"use strict";

var app = angular.module('application', ['ngRoute', 'ngResource', 'ui.bootstrap', 'ui.bootstrap.datetimepicker', 'uiGmapgoogle-maps', 'ui.utils.masks']).config(function($routeProvider, $locationProvider) {
	document.body.style.opacity = 1;
	$routeProvider
		.when('/search/competitors', {
			templateUrl: '/views/search/competitors.html'
		})
		.when('/search/vacansy', {
			templateUrl: '/views/search/vacansy.html'
		})
		.when('/search/teams', {
			templateUrl: '/views/search/teams.html'
		})
		.when('/office', {
			templateUrl: '/views/office/main.html'
		})
		.when('/competitor/:id', {
			templateUrl: '/views/pages/competitor.html',
		})
		.when('/team/:id', {
			templateUrl: '/views/pages/team.html'
		})
		.when('/map/competitors', {
			templateUrl: '/views/pages/map/competitors.html'
		})
		.when('/vacansy/:id/:vacansyId', {
			templateUrl: '/views/pages/vacansy.html'
		})
		.when('/employer/:id', {
			templateUrl: '/views/pages/employer.html'
		})
		.when('/', { redirectTo: '/search/competitors' })
		.otherwise({ redirectTo: '/' });
	//$locationProvider.html5Mode({enable:true});
}).run(function(dataSrv, callSrv, $rootScope, $http) {
	dataSrv.init()

	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`

$rootScope.age_text = function (age) {
	var txt;
	count = age % 100;
	if (count >= 5 && count <= 20) {
		txt = 'лет';
	} else {
		count = count % 10;
		if (count == 1) {
			txt = 'год';
		} else if (count >= 2 && count <= 4) {
			txt = 'года';
		} else {
			txt = 'лет';
		}
	}
	return txt;
}



	$rootScope.confirm = function (text) {
		return confirm(text);
	}

	$rootScope.TYPE = function (obj) {
		return (typeof obj);
	}

	$rootScope.coolDate = function (date) {
		return coolDate(date);
	}

	$rootScope.formatDate = function (date, format) {
		if(typeof date == 'number') date = hotDate(date);
		date = date||new Date();
		var day = date.getDate(),
			month = date.getMonth() + 1,
			year = date.getFullYear(),
			hours = date.getHours(),
			minutes = date.getMinutes(),
			seconds = date.getSeconds();
		if (!format) {
			format = "MM.dd.yyyy";
		}
		format = format.replace("MM", month.toString().replace(/^(\d)$/, '0$1'));
		if (format.indexOf("yyyy") > -1) {
			format = format.replace("yyyy", year.toString());
		} else if (format.indexOf("yy") > -1) {
			format = format.replace("yy", year.toString().substr(2, 2));
		}
		format = format.replace("dd", day.toString().replace(/^(\d)$/, '0$1'));
		if (format.indexOf("t") > -1) {
			if (hours > 11) {
				format = format.replace("t", "pm");
			} else {
				format = format.replace("t", "am");
			}
		}
		if (format.indexOf("HH") > -1) {
			format = format.replace("HH", hours.toString().replace(/^(\d)$/, '0$1'));
		}
		if (format.indexOf("hh") > -1) {
			if (hours > 12) {
				hours -= 12;
			}
			if (hours === 0) {
				hours = 12;
			}
			format = format.replace("hh", hours.toString().replace(/^(\d)$/, '0$1'));
		}
		if (format.indexOf("mm") > -1) {
			format = format.replace("mm", minutes.toString().replace(/^(\d)$/, '0$1'));
		}
		if (format.indexOf("ss") > -1) {
			format = format.replace("ss", seconds.toString().replace(/^(\d)$/, '0$1'));
		}
		return format;
	}
	$rootScope.hotDate = function (date) {
		return hotDate(date);
	}
	$rootScope.coolDateTime = function (date) {
		return coolDateTime(date);
	}
	$rootScope.hotDateTime = function (date) {
		return hotDateTime(date);
	}
	$rootScope.get_current_age = function (date) {
		date = hotDate(date||coolDate(new Date));
		return ((new Date().getTime() - new Date(date)) / (24 * 3600 * 365.25 * 1000)) | 0;
	}
	$rootScope.get_avatar_uri = function(data) {
		if(type(data) === 'array' && data[0] && data[0].image) {
			return '/openapi/0.1/images/get?id='+data[0].image+'&size=320';
		} else if(type(data) === 'string') {
			return '/openapi/0.1/images/get?id='+data+'&size=320';
		} else {
			return '/img/avatar.png';
		}
	}
	$rootScope.getFromList = function(name, id) {
		return dataSrv.getFromListSync(name, id);
	}
	$rootScope.getList = function(name, index) {
		if(!index) return dataSrv._lists[name];
		return dataSrv._lists[name].filter(function(e) {
			return e.index == index;
		});
	}
	$rootScope.getListTitles = function(name) {
		return (dataSrv._lists[name]||[]).map(function(e) {
			return e.title;
		});
	}
	$rootScope.getListId = function(name, title) {
		return ((((dataSrv._lists[name]||[]).filter(function(e) {
			return e.title == title;
		}))[0])||{id:null}).id;
	}
	$rootScope.getLocation = function(val) {
		return $http.get('http://maps.googleapis.com/maps/api/geocode/json', {
			params: {
				address: val,
				sensor: false
			}
		}).then(function(response){
			return response.data.results.map(function(item) {
				return {lt:item.geometry.location.lat, lg:item.geometry.location.lng, address:item.formatted_address};
			});
		});
	};

	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`
	$rootScope.modalType = false;
	$rootScope.modalData = null;
	$rootScope.modal = function(type, data) {
		if(jQuery && jQuery.imgAreaSelect && type == false) {
			jQuery('*').imgAreaSelect({remove:true});
		}
		$rootScope.modalData = data||null;
		$rootScope.modalType = type;
		$rootScope.$emit('modal', {type: type, data: data})
	}
	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`
	$rootScope.message = function(inData) {
		var data = {
			id: Math.floor(Math.random() * (10000000000 - 1)),
			title: inData.title||"",
			description: inData.description||inData.desc||"",
			bgcolor: inData.bgcolor||"#333",
			color: inData.color||"#ddd",
			timeout: inData.timeout||10000,
			icon: inData.icon||null,
			buttons: []
		};
		switch(inData.type) {
			case "error": 
			case "err": 
				data.bgcolor = "rgba(255, 0, 0, 0.5)";
				data.color = "#fff";
			break;
			case "info": 
				data.bgcolor = "rgba(0, 0, 255, 0.5)";
				data.color = "#fff";
			break;
			case "warn": 
				data.bgcolor = "rgba(255, 255, 0, 0.5)";
				data.color = "#fff";
			break;
		}
		for(var _i in inData.buttons||[]) {
			var i = inData.buttons[_i];
			data.buttons.push({
				text: i.text || "&bull;",
				color: i.color || "#111",
				callback: i.callback || function() {}
			});
		}
		var id = $rootScope._data.messages.push(data);
		setTimeout(function(id) {
			$rootScope.removeMessage(id);
			$rootScope.$apply();
		}, data.timeout, data.id);
	}
	$rootScope.removeMessage = function(id) {
		var _id = -1;
		for(var _id in $rootScope._data.messages) {
			var i = $rootScope._data.messages[_id];
			if(i.id == id) {
				break;
			}
		};
		if(_id != -1) {
			$rootScope._data.messages.splice(_id, 1);
		}
	}
	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`
	$rootScope._data = {
		session: {
			auth:false
		},
		messages: [
		],
		header: {
			active:false,
			forms: {
				makePhoto: {
					to: []
				},
				signin: {

				},
				signup: {

				},
				remember: {

				},
				tabs: {
					
				}
			}
		},
		search: {
			competitors: {
				fields: {
					type: "competitor",
					text: ""
				},
				results: [],
				page: 0,
				scroll: 0
			},
			teams: {
				fields: {
					type: "team",
					text: ""
				},
				results: [],
				page: 0,
				scroll: 0
			},
			vacansy: {
				fields: {},
				results: [],
				page: 0,
				scroll: 0
			}
		}
	};
	
	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`

	$rootScope._data.errors = {
		"1": "Can not find data",
		"2": "Account with such email has been exist yet",
		"3": "Invalid type of account",
		"4": "Can not save data",
		"5": "Invalid email",
		"6": "Invalid password, does not contain different cases",
		"7": "Invalid password, does not contain numbers",
		"8": "Invalid password, contain less then 3(three) symbols",
		"9": "Does not have arguments",
		"10": "Incorrect password",
		"11": "Does not have such account",
		"12": "Cannot update account",
		"13": "Invalid types",
		"14": "Does not have such param in list",
		"15": "Too big data",
		"16": "No such file",
		"17": "Проверьте правильность вводимых полей"
	}

	$rootScope.search = function(type, additional) {
		type = type || $rootScope._data.header.active;
		var competitors = function(additional) {
			var lists = dataSrv._lists;
			var q = {};
			var proc = function(key, value) {
				var res = undefined;
				switch(key) {
					case "industry":
					case "level":
					case "part":
					case "religion":
					case "post":
					case "tag":
						var res = [];
						if(value.length == 0) {
							res = undefined;
						} else {
							for(var _i in value) {
								var i = value[_i];
								var m = lists[key].filter(function(e) {
									return e.title == i;
								});
								if(m[0]) {
									res.push(m[0].id.toString());
								}
							}
						}
					break;
					case "period":
					res = +value;
					break;
					case "sex":
					case "maritalStatus":
					res = value == "true";
					break;
					default: res = value;
				}
				return res;
			}
			for(var _i in $rootScope._data.search.competitors.fields) {
				var i = $rootScope._data.search.competitors.fields[_i];
				var e = proc(_i, i);
				if(window.type(e) != 'undefined') {
					q[_i] = e;
				}
				console.warn('----------------', q);
			}
			dataSrv.findProfiles({q:q}, function(err, data) {
				console.log(data);
				if(additional) {
					$rootScope._data.search.competitors.results = ($rootScope._data.search.competitors.results||[]).concat(data);
					$rootScope._data.search.competitors.page++;
				} else {
					$rootScope._data.search.competitors.results = data;
					$rootScope._data.search.competitors.page = 0;
				}
			});
		};
		var teams = function(additional) {
			var lists = dataSrv._lists;
			var q = {};
			var proc = function(key, value) {
				var res = undefined;
				switch(key) {
					case "industry":
					case "level":
					case "part":
					case "tag":
						var res = [];
						if(value.length == 0) {
							res = undefined;
						} else {
							for(var _i in value) {
								var i = value[_i];
								var m = lists[key].filter(function(e) {
									return e.title == i;
								});
								if(m[0]) {
									res.push(m[0].id);
								}
							}
						}
					break;
					case "period":
					res = +value;
					break;
					default: res = value;
				}
				return res;
			}
			for(var _i in $rootScope._data.search.teams.fields) {
				var i = $rootScope._data.search.teams.fields[_i];
				var e = proc(_i, i);
				if(window.type(e) != 'undefined') {
					q[_i] = e;
				}
				console.warn('----------------', q);
			}
			console.log('query:', q);
			dataSrv.findProfiles({q:q}, function(err, data) {
				console.log(data);
				if(additional) {
					$rootScope._data.search.teams.results = ($rootScope._data.search.teams.results||[]).concat(data);
					$rootScope._data.search.teams.page++;
				} else {
					$rootScope._data.search.teams.results = data;
					$rootScope._data.search.teams.page = 0;
				}
			});
		};
		var vacansy = function(additional) {
			var lists = dataSrv._lists;
			var q = {};
			var proc = function(key, value) {
				var res = undefined;
				switch(key) {
					case "industry":
					case "level":
					case "part":
					case "tag":
					case "period":
						res = [];
						if(value.length == 0) {
							res = undefined;
						} else {
							for(var _i in value) {
								var i = value[_i];
								var m = lists[key].filter(function(e) {
									return e.title == i;
								});
								if(m[0]) {
									res.push(m[0].id);
								}
							}
						}
					break;
					case "individual":
						res = value =='true';
					break;
					default: res = value;
				}
				return res;
			}
			for(var _i in $rootScope._data.search.vacansy.fields) {
				var i = $rootScope._data.search.vacansy.fields[_i];
				var e = proc(_i, i);
				if(window.type(e) != 'undefined') {
					q[_i] = e;
				}
				console.warn('----------------', q);
			}
			dataSrv.findVacansy({q:q}, function(err, data) {
				if(q.sortby == 'vacansy.summa') {
					data = data.sort(function(a,b) {
						return a.salary.summa - b.salary.summa;
					});
				}
				console.log(data);
				if(additional) {
					$rootScope._data.search.vacansy.results = ($rootScope._data.search.vacansy.results||[]).concat(data);
					$rootScope._data.search.vacansy.page++;
				} else {
					$rootScope._data.search.vacansy.results = data;
					$rootScope._data.search.vacansy.page = 0;
				}
			});
		};
		switch(type) {
			case "competitors": competitors(); break;
			case "vacansy": vacansy(); break;
			case "teams": teams(); break;
		}
	}

	$rootScope.$watch('_data.search.competitors.fields', function() {
		$rootScope.search();
	}, true);
	$rootScope.$watch('_data.search.vacansy.fields', function() {
		$rootScope.search();
	}, true);
	$rootScope.$watch('_data.search.teams.fields', function() {
		$rootScope.search();
	}, true);
	


	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`


	$rootScope.addCompetitorToFavorites = function(id) {
		if($rootScope._data.session.type == "employer") {
			dataSrv.addToWatchlist({id:id}, function(err, data) {
				console.warn(err, data);
			});
		} else {
			$rootScope._data.header.forms.signin.type = 'employer';
			$rootScope._data.header.forms.tabs.reg = true;
			$rootScope.modal('login');
		}
	}

	$rootScope.addCompetitorToBlacklist = function(id) {
		if($rootScope._data.session.type == "employer") {
			dataSrv.addToBlacklist({id:id}, function(err, data) {
				console.warn(err, data);
			});
		} else {
			$rootScope._data.header.forms.signin.type = 'employer';
			$rootScope._data.header.forms.tabs.reg = true;
			$rootScope.modal('login');
		}
	}



	$rootScope.setInterview = function(id) {
		if($rootScope._data.session.type == "employer") {
			$rootScope.modal('createInterview', id);
		} else {
			$rootScope._data.header.forms.signin.type = 'employer';
			$rootScope._data.header.forms.tabs.reg = true;
			$rootScope.modal('login');
		}
	}

	$rootScope.sendRespond = function(emp, vac) {
		if($rootScope._data.session.type == "competitor" || $rootScope._data.session.type == "team") {
			dataSrv.sendRespond({emp_id: emp, vac_id:vac}, function(err, data) {
				console.warn(err, data);
			});
		} else {
			$rootScope._data.header.forms.signin.type = 'competitor';
			$rootScope._data.header.forms.tabs.reg = true;
			$rootScope.modal('login');
		}
	}



	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`






	$rootScope.setField = function(obj, key, value) {
		obj[name] = value;
	}


	$rootScope.setGeo = function(data, obj) {
		console.log(data, obj);
		obj.address = data.address;
		if(obj.locate) {
			obj.locate.lt = data.lt;
			obj.locate.lg = data.lg;
		}
	}


	$rootScope.formatLabel = function(data) {
		return data ? data.address : '';
	}


	$rootScope.isNull = function(data) {
		if((typeof data) == 'undefined') return true;
		if((typeof data) == 'null') return true;
		if((typeof data) == 'string' && data.length == 0) return true;
		return false;
	}



	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`




	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`






});







