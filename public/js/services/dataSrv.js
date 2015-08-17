"use strict";


app.factory('dataSrv', function($http, $resource, $rootScope) {
	
	var Raccount = $resource('/:publ/:version/account/:method', {version: '0.1'}, {
		signIn: {method: 'POST', cache: false, params: {publ:'openapi', method: 'signin'}},
		signOut: {method: 'POST', cache: false, params: {publ:'api', method: 'signout'}},
		signUp: {method: 'POST', cache: false, params: {publ:'openapi', method: 'signup'}},
		sessionGet: {method: 'POST', cache: false, params: {publ:'openapi', method: 'sessionGet'}},
		checkEmail: {method: 'GET', cache: false, params: {publ:'openapi', method: 'checkEmail'}},
		getById: {method: 'POST', cache: false, params: {publ:'api', method: 'getById'}},
		get: {method: 'GET', cache: false, params: {publ:'api', method: 'get'}},
		update: {method: 'POST', cache: false, params: {publ:'api', method: 'update'}},
		updatePasswd: {method: 'POST', cache: false, params: {publ:'api', method: 'updatePasswd'}},
		profileFind: {method: 'GET', cache: false, params: {publ:'openapi', method: 'profileFind', page: 0}},
		profileUpdate: {method: 'POST', cache: false, params: {publ:'api', method: 'profileUpdate'}},
		profileGetById: {method: 'POST', cache: false, params: {publ:'openapi', method: 'profileGetById'}},
		profileGet: {method: 'GET', cache: false, params: {publ:'api', method: 'profileGet'}},
		vacansyFind: {method: 'GET', cache: false, params: {publ:'openapi', method: 'vacansyFind', page: '0'}},
		vacansyUpdate: {method: 'POST', cache: false, params: {publ:'api', method: 'vacansyUpdate'}},
		vacansyGetById: {method: 'POST', cache: false, params: {publ:'openapi', method: 'vacansyGetById'}},
		vacansyGet: {method: 'GET', cache: false, params: {publ:'api', method: 'vacansyGet'}},
		vacansyAdd: {method: 'POST', cache: false, params: {publ:'api', method: 'vacansyAdd'}}
	});
	
	var Rdata = $resource('/:publ/:version/data/:method', {version: '0.1', method: 'GET', publ: 'openapi'}, {
		getFields: {cache: true, params: {method: 'getFields'}},
		getErrors: {cache: true, params: {method: 'getErrors'}}
	});

	var Rmedia = $resource('/:publ/:version/media/:method', {version: '0.1', method: 'GET', publ: 'api'}, {
		upload: {cache: false, params: {method: 'upload'}},
		get: {cache: false, params: {method: 'get'}}
	});

	var Rlist = $resource('/:publ/:version/list/:name/:method', {version: '0.1', publ: 'openapi'}, {
		get: {cache: true, params: {method: 'get'}}
	});

	var Rinterview = $resource('/:publ/:version/interview/:method', {version: '0.1', publ: 'api'}, {
		invite: {method: 'POST', cache: true, params: {method: 'invite'}}, // comp_id: String, //id соискателя; emp_id: String, //id нанимателя; times: []  //max 3, варианты времени собеседования
		get: {method: 'GET', cache: true, params: {method: 'get'}}, // id: id акка
		getById: {method: 'GET', cache: true, params: {method: 'getById'}}, // id: id собеседования
		accept: {method: 'POST', cache: true, params: {method: 'accept'}}, // id: id собеседования, time: String  //выбранное время собеседования
		decline: {method: 'POST', cache: true, params: {method: 'decline'}}, // id: id собеседования, time: String  //выбранное время собеседования
		status: {method: 'GET', cache: true, params: {method: 'status'}} // id: id собеседования, time: String  //выбранное время собеседования
	});

	var RgoogleMapsGeocoding = $resource('http://maps.googleapis.com/maps/api/geocode/json', {}, {
		address: {method: 'GET', cache: true, params: {}}
	});
	

/*
	Rmedia.upload({}, function(a,b,c) {
		console.warn(a,b,c);
	})
*/

	// Raccount.vacansyGet({}, function(a,b,c) {
	// 	console.warn(a,b,c);
	// });

	// Raccount.vacansyFind({query:"{}"}, function(a,b,c) {
	// 	console.warn(a,b,c);
	// });


	// Raccount.vacansyAdd({vacansy:"{}"}, function(a,b,c) {
	// 	console.warn(a,b,c);
	// });


	// Rinterview.get({}, function(a,b,c) {
	// 	console.warn(a,b,c);
	// });


	return {
		profile:null,
		session: {},
		_errors: {},
		_fields: {},
		_lists: {},
		ready:false,
		init: function() {
			var $=this,args=arguments[0]||{},cb=arguments[1]||function(){};
			Rdata.getErrors({}, function(a1) {
				if(!a1.error) {
					$._errors = a1.result;
					Rdata.getFields({}, function(a2) {
						if(!a2.error) {
							$._fields = a2.result;

							var ready = function() {
								Raccount.sessionGet({}, function(a3) {
									if(!a3.error) {
										$.session = a3.result;
										$rootScope.$emit('sessionUpdate', $.session);
										cb(a3.error, true);
										$.ready = true;
										$rootScope.$emit('ready');
									}
									cb(a3.error, a3.result);
								});
							}

							var a = [], b = {}, c = 0;
							for(var i in $._fields) {
								a.push($._fields[i]);
							}
							a = a.filter(function(e) {
								return e.type == 'list';
							}).map(function(e) {
								return e.name;
							});
							a.push('industry');
							a.forEach(function(e) {
								(function(q) {
									if(localStorage[('list_'+q)]) {
										b[q] = JSON.parse(localStorage[('list_'+q)]);
										c++;
										if(c == a.length) {
											$._lists = b;
											ready();
										}
									} else {
										Rlist.get({name:q}, function(data) {
											if(!data.error) {
												b[q] = data.result;
												localStorage[('list_'+q)] = JSON.stringify(data.result||[]);
												c++;
											}
											if(c == a.length) {
												$._lists = b;
												ready();
												console.log($._lists)
											}
										});
									}
								})(e);
							});
						} else {
							cb(a2.error, a2.result);
						}
					});
				} else {
					cb(a1.error, a1.result);
				}
			});
			return $;
		},
		getGeocoding: function() {
			var $=this,args=arguments[0]||{},cb=arguments[1]||function(){};
			RgoogleMapsGeocoding.get({address: args.address}, function(data) {
				if(data.results) {
					cb(null, data.results);
				} else {
					cb('not found', null);
				}
			});
			return $;
		},

		getFromListSync: function(name, id) {
			var $=this;
			if($._lists[name]) {
				return ($._lists[name].filter(function(e) {
					return e.id == id;
				})[0]||{}).title;
			}
			return null;
		},



		findVacansy: function() {
			var $=this,args=arguments[0]||{},cb=arguments[1]||function(){};
			Raccount.vacansyFind({query:JSON.stringify(args.query||args.q||args.fields||{})}, function(data) {
				cb(data.error, data.result);
			});
			return $;
		},
		getVacansy: function() {
			var $=this,args=arguments[0]||{},cb=arguments[1]||function(){};
			Raccount.vacansyGet({}, function(data) {
				cb(data.error, data.result);
			});
			return $;
		},
		addVacansy: function() {
			var $=this,args=arguments[0]||{},cb=arguments[1]||function(){};
			Raccount.vacansyAdd({vacansy:JSON.stringify(args.q||args.q||args.query||args.vacansy||{})}, function(data) {
				cb(data.error, data.result);
			});
			return $;
		},
		removeVacansy: function() {
			var $=this,args=arguments[0]||{},cb=arguments[1]||function(){};
			Raccount.vacansyAdd({vacansy:JSON.stringify(args.q||args.q||args.query||args.vacansy||{})}, function(data) {
				cb(data.error, data.result);
			});
			return $;
		},





		getInterview: function() {
			var $=this,args=arguments[0]||{},cb=arguments[1]||function(){};
			Rinterview.get({}, function(data) {
				cb(data.error, data.result);
			});
			return $;
		},


		getVideo: function() {
			var $=this,args=arguments[0]||{},cb=arguments[1]||function(){};
			Rmedia.get({code:args.code||args.id||args.video}, function(data) {
				cb(data.error, data.result);
			});
			return $;
		},
		getList: function() {
			var $=this,args=arguments[0]||{},cb=arguments[1]||function(){};
			cb(null, $._lists[args.name]);
			return $;
		},
		getListSync: function(name) {
			var $=this;
			return $._lists[name];
		},
		getFields: function() {
			var $=this,args=arguments[0]||{},cb=arguments[1]||function(){};
			cb(null, $._fields);
			return $;
		},
		getFieldsSync: function() {
			var $=this,args=arguments[0]||{},cb=arguments[1]||function(){};
			return $._fields;
		},
		getErrors: function() {
			var $=this,args=arguments[0]||{},cb=arguments[1]||function(){};
			cb(null, $._errors);
			return $;
		},
		getErrorsSync: function() {
			var $=this,args=arguments[0]||{},cb=arguments[1]||function(){};
			return $._errors;
		},
		getError: function() {
			var $=this,args=arguments[0]||{},cb=arguments[1]||function(){};
			cb(null, $._errors[args.error||args.err||args.id]);
			return $;
		},
		getErrorSync: function() {
			var $=this,args=arguments[0]||{},cb=arguments[1]||function(){};
			return $._errors[args.error||args.err||args.id||args];
		},
		login: function() {
			var $=this,args=arguments[0]||{},cb=arguments[1]||function(){};
			Raccount.signIn(args, function(data) {
				if(!data.error) {
					$.session.email = data.result.email;
					$.session.id = data.result.id;
					$.session.type = data.result.type;
					$.session.auth = !!data.result.auth;
					$rootScope.$emit('sessionUpdate', $.session);
				}
				cb(data.error, $.session);
			});
			return $;
		},
		register: function() {
			var $=this,args=arguments[0]||{},cb=arguments[1]||function(){};
			Raccount.signUp(args, function(data) {
				if(!data.error) {
					$.session.email = data.result.email;
					$.session.id = data.result.id;
					$.session.type = data.result.type;
					$.session.auth = !!data.result.auth;
					$rootScope.$emit('sessionUpdate', $.session);
				}
				cb(data.error, $.session);
			});
			return $;
		},
		exit: function() {
			var $=this,args=arguments[0]||{},cb=arguments[1]||function(){};
			Raccount.signOut(args, function(data) {
				if(!data.error) {
					$.session.email = "";
					$.session.id = "";
					$.session.auth = false;
					$rootScope.$emit('sessionUpdate', $.session);
				}
				cb(data.error, $.session);
			});
			return $;
		},
		getProfile: function() {
			var $=this,args=arguments[0]||{},cb=arguments[1]||function(){};
			Raccount.profileGet(args, function(data) {
				cb(data.error, data.result);
			});
			return $;
		},
		getProfileById: function() {
			var $=this,args=arguments[0]||{},cb=arguments[1]||function(){};
			Raccount.profileGetById(args, function(data) {
				cb(data.error, data.result);
			});
			return $;
		},
		updateProfile: function() {
			var $=this,args=arguments[0]||{},cb=arguments[1]||function(){};
			Raccount.profileUpdate({
				changes: JSON.stringify(args)
			}, function(data) {
				cb(data.error, data.result);
			});
			return $;
		},
		findProfiles: function() {
			var $=this,args=arguments[0]||{},cb=arguments[1]||function(){};
			var query = args.query || args.q || args.find || args.params || args.fields || {};
			Raccount.profileFind({query:JSON.stringify(query)}, function(data) {
				cb(data.error, data.result);
			});
			return $;
		}
	};
});








