"use strict";

var accountCtrl = new(require('../controllers/account.js'))();
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport();
var errors = require('../data/errors.json'),
	request = require('request'),
	ObjectID = require('mongodb').ObjectID;

var $ = function(args, cb) {
	var $ = this;
	var args = args || {};
	var cb = cb || function() {};
	var app = args.app;
	var answer = app.custom.answer;
	var minMax = {
		competitor: {
			age: {},
			salary: {},
			experience: {}
		},
		team: {
			salary: {}
		},
		vacansy: {
			salary: {},
			experience: {}
		}
	};
	accountCtrl.init({
		app: app
	}, function(err, data) {});

	app.get('/openapi/:version/account/getLimits', function(req, res) {
		res.end("window._searchLimits = " + JSON.stringify(minMax));
	});

	app.post('/openapi/:version/account/signup', function(req, res) {
		accountCtrl.signup({
			account: {
				type: req.body['type'],
				email: req.body['email'],
				password: req.body['passwd']
			}
		}, function(err, data) {
			if (err) answer(res, null, err);
			else {
				req.session.type = data['type'];
				req.session.id = data['_id'].toString();
				req.session.email = data['email'];
				answer(res, {
					id: data['_id'].toString(),
					email: data['email'],
					type: data['type'],
					auth: true
				}, err);
				transporter.sendMail({
					from: 'bot@viparts.ru',
					to: data['email'],
					subject: 'Support',
					html: 'login:' + req.body['email'] + '\n\npassword: ' + req.body['passwd'] + ''
				}, function(error, info) {
					console.log(error ? error : 'Message sent: ' + info.response);
				});
			}
		});
	});

	app.post('/openapi/:version/account/signin', function(req, res) {
		accountCtrl.signin({
			email: req.body['email'],
			password: req.body['passwd']
		}, function(err, data) {
			var _data = {};
			if (data) {
				req.session.type = data['type'];
				req.session.id = data['_id'].toString();
				req.session.email = data['email'];
				_data = {
					id: req.session.id,
					email: req.session.email,
					type: req.session.type,
					auth: true
				};
			}
			answer(res, _data, err);
		});
	});

	app.post('/openapi/:version/account/asin', function(req, res) {
		accountCtrl.signin({
			email: req.body['email'],
			password: req.body['passwd']
		}, function(err, data) {
			var _data = {};
			if (data && (data['type'] === "admin" || data['type'] === "moder")) {
				req.session.type = data['type'];
				req.session.id = data['_id'].toString();
				req.session.email = data['email'];
				_data = {
					id: req.session.id,
					email: req.session.email,
					type: req.session.type,
					auth: true
				};
			}
			answer(res, _data, err);
		});
	});

	app.post('/api/:version/account/signout', function(req, res) {
		delete req.session.id;
		delete req.session.email;
		delete req.session.type;
		answer(res, true, null);
	});

	app.get('/openapi/:version/account/sessionGet', function(req, res) {
		var data = {};
		if (req.session.type) {
			data = {
				id: req.session.id,
				email: req.session.email,
				type: req.session.type,
				auth: true
			}
		} else {
			data = {
				id: '',
				email: '',
				type: '',
				auth: false
			}
		}
		answer(res, data, null);

	});

	app.get('/openapi/:version/account/checkEmail', function(req, res) {
		accountCtrl.checkEmail({
			email: req.query['email']
		}, function(err, data) {
			answer(res, data, err);
		});
	});

	app.post('/api/:version/account/confirmSend', function(req, res) {
		var _phone = req.body['phone'] || '';
		var code = Math.random().toString(32);
		code = code[2] + code[3] + code[4] + code[5] + code[6];
		var _request = 'http://smsc.ru/sys/send.php?login=nominder&psw=azsxdcfvgb&phones=' + _phone + '&mes=Код подтверждения на People.Jobs ' + code + '&fmt=3&charset=utf-8';
		request(_request, function(err, response, body) {
			if (JSON.parse(body).error) console.log(body);
			req.session.confirmCode = code;
			answer(res, !err, err);
		});
		req.session.confirmCode = code;
	});

	app.post('/api/:version/account/confirmInput', function(req, res) {
		var code = req.body['code'] || '';
		if (code === req.session.confirmCode) {
			accountCtrl.update({
				id: req.session.id,
				changes: {
					confirmed: true
				}
			}, function(err, data) {
				delete req.session.confirmCode;
				answer(res, !err, err);
			});
		} else {
			answer(res, false, '18 - Invalid confirm code');
		};
	});

	app.post('/api/:version/account/getById', function(req, res) {
		accountCtrl.getById({
			id: req.body['id']
		}, function(err, data) {
			var _data = {};
			_data.id = data['_id'].toString();
			_data.email = data['email'];
			_data.type = data['type'];
			_data.banned = data['banned'];
			answer(res, _data, err);
		});
	});

	app.post('/api/:version/account/update', function(req, res) {
		accountCtrl.update({
			id: req.session.id,
			changes: JSON.parse(req.body['changes'])
		}, function(err, data) {
			var _data = {};
			if (data.email) {
				req.session.email = data.email;
				_data = {
					id: req.session.id,
					email: req.session.email
				};
			}
			answer(res, _data, err);
		});
	});

	app.post('/api/:version/account/remove', function(req, res) {
		accountCtrl.remove({
			id: req.session.id
		}, function(err, data) {
			if (data) {
				delete req.session.id;
				delete req.session.email;
				delete req.session.type;
			};
			answer(res, data, err);
		});
	});

	app.post('/openapi/:version/account/updatePasswd', function(req, res) {
		var randWD = function(l, possible) {
			var text = "";
			possible = possible || "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
			l = l || 5;
			for (var i = 0; i < l; i++)
				text += possible.charAt(Math.floor(Math.random() * possible.length));
			return text;
		}
		var email = req.body['email'];
		var passwd = randWD(3, "ABCDEFGHIJKLMNOPQRSTUVWXYZ") + randWD(3, "0123456789") + randWD(3, "abcdefghijklmnopqrstuvwxyz");
		accountCtrl.updateByEmail({
			email: email,
			changes: {
				password: passwd
			}
		}, function(err, data) {
			if (!err) {
				transporter.sendMail({
					from: 'bot@viparts.ru',
					to: email,
					subject: 'Support',
					html: 'login:' + email + '\n\npassword: ' + passwd + ''
				}, function(error, info) {
					console.log(error ? error : 'Message sent: ' + info.response);
				});
			};
			answer(res, true, null);
		});
	});

	app.post('/openapi/:version/account/profileGetById', function(req, res) {
		console.log(req.body['id']);
		accountCtrl.getById({
			id: req.body['id']
		}, function(err, data) {
			var _data = {};
			if (data && data.profile) {
				_data.id = data._id.toString() || '';
				_data = data.profile || {};
				//_data.contacts = null;
			}
			answer(res, _data, err);
		});
	});

	app.get('/api/:version/account/profileGet', function(req, res) {
		accountCtrl.getById({
			id: req.session.id
		}, function(err, data) {
			var _data;
			answer(res, (data && data.profile ? data.profile : {}), err);
		});
	});

	app.get('/openapi/:version/account/profileFind', function(req, res) {
		var _data = [];
		accountCtrl.search({
			page: req.query['page'],
			query: JSON.parse(req.query['query']||'{}')
		}, function(err, data) {
			if (data) {
				data.forEach(function(e) {
					var __data = {};
					__data.profile = e.profile || {};
					if (JSON.parse(req.query['query']).type != 'competitor' || ((__data.profile.info && __data.profile.info.firstname !== '' && __data.profile.info.middlename !== '' && __data.profile.info.lastname !== '' && __data.profile.info.birthday !== 0) || (__data.profile.name && __data.profile.name !== '')) && __data.profile.industryPost.length !== 0 && __data.profile.salary && __data.profile.salary.summa !== 0 && __data.profile.salary.period !== '') {
						__data.id = e._id.toString() || '';
						__data.online = e.online;
						//__data.profile.contacts = null;
						_data.push(__data);
					}
				});
			};
			answer(res, _data, err);
		});
	});

	app.post('/api/:version/account/profileUpdate', function(req, res) {
		accountCtrl.updateProfile({
			id: req.session.id,
			changes: JSON.parse(req.body['changes']),
			type: req.session.type
		}, function(err, data) {
			var _data = {};
			_data = {
				id: req.session.id,
				email: req.session.email
			};
			answer(res, _data, err);
		});
	});

	app.post('/api/:version/account/vacansyUpdate', function(req, res) {
		accountCtrl.vacansyUpdate({
			id: req.session.id,
			vacansyId: req.body['vacansyId'],
			changes: JSON.parse(req.body['changes'])
		}, function(err, data) {
			var _data = {};
			_data = {
				id: req.session.id,
				email: req.session.email
			};
			answer(res, _data, err);
		});
	});

	app.post('/api/:version/account/vacansyRemove', function(req, res) {
		accountCtrl.vacansyRemove({
			id: req.session.id,
			vacansyId: req.body['vacansyId'],
		}, function(err, data) {
			answer(res, !!data, err);
		});
	});

	app.get('/openapi/:version/account/vacansyFind', function(req, res) {
		var _data = [],
			query = JSON.parse(req.query['query']||{});
		accountCtrl.vacansySearch({
			page: req.query['page'],
			query: query
		}, function(err, data) {
			if (data) {
				data.forEach(function(e) {
					!e.vacansy ? _data=[] : e.vacansy.forEach(function(elem) {
						if(!elem.vac_industryPost) return false;
						if ((query.industry && elem.vac_industryPost.industry !== query.industry) || (query.post && elem.vac_industryPost.post !== query.post) || (query.education && elem.education.education !== query.education) || (query.part && elem.part !== query.part) || (query.country && elem.locating.country !== query.country) || (query.city && elem.locating.city !== query.city) || (query.summMin && elem.salary.summa < query.summMin) || (query.summMax && elem.salary.summa > query.summMax) || (query.period && elem.salary.period !== query.period) || (query.experience && elem.experience !== query.experience) || (query.individual && e.profile.individual !== query.individual) || (query.text && (elem.name.search(query.text) === -1) && (elem.vac_industryPost.post.search(query.text) === -1) && (elem.requirements.search(query.text) === -1) && (elem.about.search(query.text) === -1) && (elem.acting.search(query.text) === -1))) {} else {
							if (elem.name !== '' && elem.vac_industryPost.industry !== '' && elem.vac_industryPost.post !== '') {
								elem.emp_profile = e.profile;
								elem.emp_id = e._id.toString();
								//elem.emp_profile.contacts = null;
								_data.push(elem);
							}
						};
					});
				});
			}
			answer(res, _data, err);
		});
	});

	app.post('/api/:version/account/vacansyAdd', function(req, res) {
		accountCtrl.addVacansy({
			id: req.session.id,
			vacansy: JSON.parse(req.body['vacansy'])
		}, function(err, data) {
			answer(res, data, err);
		});
	});

	app.post('/openapi/:version/account/vacansyGetById', function(req, res) {
		accountCtrl.vacansyGetById({
			id: req.body['id'],
			vacansyId: req.body['vacansyId']
		}, function(err, data) {
			answer(res, data, err);
		});
	});

	app.get('/api/:version/account/vacansyGet', function(req, res) {
		accountCtrl.vacansyGet({
			id: req.session.id
		}, function(err, data) {
			answer(res, data, err);
		});
	});

	app.get('/api/:version/account/blacklistGet', function(req, res) {
		accountCtrl.getBlackList({
			id: req.session.id
		}, function(err, data) {
			var data = data || [];
			var query = {
				_id: {
					$in: []
				}
			};
			data.forEach(function(_data) {
				query._id.$in.push(new ObjectID(_data.id));
			});
			accountCtrl.find({
				query: query,
				page: 0
			}, function(err, _res) {
				if (_res && _res.length != 0) {
					_res.forEach(function(_data, _i) {
						if (_i != _res.length - 1) {
							//_data.profile.contacts = null;
							data.forEach(function(__data, i) {
								if (__data.id.toString() === _data._id.toString())
									data[i].profile = _data.profile;
							});
						} else {
							//_data.profile.contacts = null;
							data.forEach(function(__data, i) {
								if (_i != data.length - 1) {
									if (__data.id.toString() === _data._id.toString())
										data[i].profile = _data.profile;
								} else {
									if (__data.id.toString() === _data._id.toString()) {
										data[i].profile = _data.profile;
										answer(res, data, err);
									};
								};
							});
						};
					});
				} else {
					answer(res, data, err);
				};
			});
		});
	});

	app.get('/api/:version/account/watchlistGet', function(req, res) {
		accountCtrl.getWatchList({
			id: req.session.id
		}, function(err, data) {
			var data = data || [];
			var query = {
				_id: {
					$in: []
				}
			};
			data.forEach(function(_data) {
				query._id.$in.push(new ObjectID(_data.id));
			});
			accountCtrl.find({
				query: query,
				page: 0
			}, function(err, _res) {
				if (_res && _res.length != 0) {
					_res.forEach(function(_data, _i) {
						if (_i != _res.length - 1) {
							//_data.profile.contacts = null;
							data.forEach(function(__data, i) {
								if (__data.id.toString() === _data._id.toString())
									data[i].profile = _data.profile;
							});
						} else {
							//_data.profile.contacts = null;
							data.forEach(function(__data, i) {
								if (__data.id.toString() === _data._id.toString()) {
									data[i].profile = _data.profile;
									answer(res, data, err);
								}
							});
						};
					});
				} else {
					answer(res, data, err);
				};
			});
		});
	});

	app.post('/api/:version/account/blacklistAdd', function(req, res) {
		accountCtrl.addBlackList({
			id: req.session.id,
			blackId: req.body['id'],
			reason: req.body['reason']
		}, function(err, data) {
			answer(res, data, err);
		});
	});

	app.post('/api/:version/account/watchlistAdd', function(req, res) {
		accountCtrl.addWatchList({
			id: req.session.id,
			_id: req.body['id']
		}, function(err, data) {
			answer(res, data, err);
		});
	});

	app.post('/api/:version/account/blacklistRemove', function(req, res) {
		accountCtrl.removeBlackList({
			id: req.session.id,
			blackId: req.body['id']
		}, function(err, data) {
			answer(res, data, err);
		});
	});

	app.post('/api/:version/account/watchlistRemove', function(req, res) {
		accountCtrl.removeWatchList({
			id: req.session.id,
			_id: req.body['id']
		}, function(err, data) {
			answer(res, data, err);
		});
	});

	function hotDate(e) {
		var t = e.toString().match(/([0-9]+)([0-9]{2})([0-9]{2})$/);
		return !t ? t : new Date(+t[1], --t[2], +t[3]);
	};

	function coolDate(e) {
		var d = new Date(e || new Date);
		return +(d.getFullYear().toString() + ((d.getMonth() + 1) < 10 ? "0" + (d.getMonth() + 1).toString() : (d.getMonth() + 1).toString()) + (d.getDate() < 10 ? "0" + d.getDate().toString() : d.getDate().toString()));
	};

	function timer() {
		accountCtrl.search({
			page: 0,
			query: {}
		}, function(err, data) {
			if (data) {
				data.forEach(function(e) {
					var __data = {};
					__data.profile = e.profile || {};
					if (((__data.profile.info && __data.profile.info.firstname !== '' && __data.profile.info.middlename !== '' && __data.profile.info.lastname !== '' && __data.profile.info.birthday !== 0) || (__data.profile.name && __data.profile.name !== '')) && __data.profile.industryPost.length !== 0 && __data.profile.salary && __data.profile.salary.summa !== 0 && __data.profile.salary.period !== '') {
						if (e.type === 'competitor') {
							var date = hotDate(__data.profile.info.birthday || coolDate(new Date));
							var age = ((new Date().getTime() - new Date(date)) / (24 * 3600 * 365.25 * 1000)) | 0;
							if ((minMax.competitor.age.min && (minMax.competitor.age.min > age)) || !minMax.competitor.age.min) minMax.competitor.age.min = age;
							if ((minMax.competitor.age.max && (minMax.competitor.age.max < age)) || !minMax.competitor.age.max) minMax.competitor.age.max = age;
							if ((minMax.competitor.salary.min && (minMax.competitor.salary.min > __data.profile.salary.summa)) || !minMax.competitor.salary.min) minMax.competitor.salary.min = __data.profile.salary.summa;
							if ((minMax.competitor.salary.max && (minMax.competitor.salary.max < __data.profile.salary.summa)) || !minMax.competitor.salary.max) minMax.competitor.salary.max = __data.profile.salary.summa;
							__data.profile.career.forEach(function(___data) {
								if (___data.end && ___data.begin) {
									var experience = parseInt(___data.end.toString()[0] + ___data.end.toString()[1] + ___data.end.toString()[2] + ___data.end.toString()[3]) - parseInt(___data.begin.toString()[0] + ___data.begin.toString()[1] + ___data.begin.toString()[2] + ___data.begin.toString()[3]);
									if ((minMax.competitor.experience.min && (minMax.competitor.experience.min > experience)) || !minMax.competitor.experience.min) minMax.competitor.experience.min = experience;
									if ((minMax.competitor.experience.max && (minMax.competitor.experience.max < experience)) || !minMax.competitor.experience.max) minMax.competitor.experience.max = experience;
								}
							});
						} else if (e.type === 'team') {
							if ((minMax.team.salary.min && (minMax.team.salary.min > __data.profile.salary.summa)) || !minMax.team.salary.min) minMax.team.salary.min = __data.profile.salary.summa;
							if ((minMax.team.salary.max && (minMax.team.salary.max < __data.profile.salary.summa)) || !minMax.team.salary.max) minMax.team.salary.max = __data.profile.salary.summa;
						};
					};
				});
			};
		});

		accountCtrl.vacansySearch({
			page: 0,
			query: {}
		}, function(err, data) {
			if (data) {
				data.forEach(function(e) {
					e.vacansy.forEach(function(elem) {
						if (elem.name !== '' && elem.vac_industryPost.industry !== '' && elem.vac_industryPost.post !== '') {
							if ((minMax.vacansy.salary.min && (minMax.vacansy.salary.min > elem.salary.summa)) || !minMax.vacansy.salary.min) minMax.vacansy.salary.min = elem.salary.summa;
							if ((minMax.vacansy.salary.max && (minMax.vacansy.salary.max < elem.experience)) || !minMax.vacansy.salary.max) minMax.vacansy.salary.max = elem.salary.summa;
							if ((minMax.vacansy.experience.min && (minMax.vacansy.experience.min > elem.experience)) || !minMax.vacansy.experience.min) minMax.vacansy.experience.min = elem.experience;
							if ((minMax.vacansy.experience.max && (minMax.vacansy.experience.max < elem.experience)) || !minMax.vacansy.experience.max) minMax.vacansy.experience.max = elem.experience;
						};
					});
				});
			};
		});

		setTimeout(function() {
			timer();
		}, 3600000);

	};

	timer();

	return $;
}


module.exports = $;
