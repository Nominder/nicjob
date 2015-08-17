"use strict";

var interviewCtrl = new(require('../controllers/interview.js'))();
var accountCtrl = new(require('../controllers/account.js'))();
var errors = require('../data/errors.json');
var request = require('request'),
	ObjectID = require('mongodb').ObjectID;

var $ = function(args, cb) {
	var $ = this;
	var args = args || {};
	var cb = cb || function() {};
	var app = args.app;
	var answer = app.custom.answer;
	interviewCtrl.init({
		app: app
	}, function(err, data) {});

	app.post('/api/:version/interview/invite', function(req, res) {
		if (req.session.type === 'employer') {
			var comp_id = req.body['comp_id'],
				emp_id = req.session.id,
				times = ['', '', ''],
				vac_id = req.body['vac_id'];
			try {
				times = JSON.parse(req.body['times']);
				interviewCtrl.invite({
					comp_id: comp_id,
					emp_id: emp_id,
					times: times,
					vac_id: vac_id
				}, function(err, data) {
					answer(res, data, err);
					accountCtrl.getById({
						id: comp_id
					}, function(error, _data) {
						var _phone = _data.profile.contacts.phone;
						var emp_name = '';
						var vac_name = '';
						if (_phone) {
							accountCtrl.getById({
								id: emp_id
							}, function(error, _data) {
								emp_name = _data.profile.company.name || '';
								accountCtrl.vacansyGetById({
									id: emp_id,
									vacansyId: vac_id
								}, function(error, _data) {
									vac_name = _data.name || '';
									var _request = 'http://smsc.ru/sys/send.php?login=nominder&psw=azsxdcfvgb&phones=' + _phone + '&mes=Работодатель ' + emp_name + ' назначил Вам собеседование на вакансию ' + vac_name + '. Возможное время собеседования: ' + (times[0][8] + times[0][9] + ':' + times[0][10] + times[0][11] + ' ' + times[0][6] + times[0][7] + '.' + times[0][4] + times[0][5] + '.' + times[0][0] + times[0][1] + times[0][2] + times[0][3]) + ', ' + (times[1][8] + times[1][9] + ':' + times[1][10] + times[1][11] + ' ' + times[1][6] + times[1][7] + '.' + times[1][4] + times[1][5] + '.' + times[1][0] + times[1][1] + times[1][2] + times[1][3]) + ', ' + (times[2][8] + times[2][9] + ':' + times[2][10] + times[2][11] + ' ' + times[2][6] + times[2][7] + '.' + times[2][4] + times[2][5] + '.' + times[2][0] + times[2][1] + times[2][2] + times[2][3]) + '&fmt=3&charset=utf-8';
									request(_request, function(err, response, body) {
										if (JSON.parse(body).error) console.log(body);
									});
								});
							});
						}
					});
				});
			} catch (e) {
				answer(res, data, err);
			};
		} else {
			answer(res, null, true);
		};
	});

	app.get('/api/:version/interview/get', function(req, res) {
		var id = req.session.id;
		var type = req.session.type;
		interviewCtrl.get({
			id: id,
			type: type,
			page: 0
		}, function(err, data) {
			var query = {};
			if (!data || data.length === 0) {
				answer(res, data, err);
			} else {
				var _query = {_id: {$in: []}};
				var _type = '';
				data.forEach(function(e, i) {
					_type = req.session.type;
					/*if (_type === 'competitor')*/ _query._id.$in.push(new ObjectID(e.emp_id));
													_query._id.$in.push(new ObjectID(e.comp_id));
					//else if (_type === 'employer') _query._id.$in.push(new ObjectID(e.comp_id));					
				});
				accountCtrl.find({query: _query, page: 0}, function(err, _res) {
					if (_res && _res.length !== 0) {
						data.forEach(function(e, i) {
							type = req.session.type;
							if (i !== data.length - 1) {
								if (type === 'competitor') {
									data[i].competitor = null;
									type = 'employer';
									_res.forEach(function(_data) {
										if (_data._id.toString() === e.emp_id.toString()) {
											//_data.profile.contacts = null;
											data[i][type] = _data.profile;
											_data.vacansy.forEach(function(__data) {
												if (__data._id.toString() === e.vac_id.toString())
													data[i].vacansy = __data;
											});
										};
									});
								} else if (type === 'employer') {
									data[i].employer = null;
									type = 'competitor';
									_res.forEach(function(_data) {
										if (_data._id.toString() === e.comp_id.toString()) {
											//_data.profile.contacts = null;
											data[i][type] = _data.profile;
											_res.forEach(function(__data) {
												if (__data._id.toString() === e.emp_id.toString()) {
													__data.vacansy.forEach(function(___data) {
														if (___data._id.toString() === e.vac_id.toString())
															data[i].vacansy = ___data;
													});
												}
											});
										};
									});
								}
							} else {
								if (type === 'competitor') {
									data[i].competitor = null;
									type = 'employer';
									_res.forEach(function(_data) {
										if (_data._id.toString() === e.emp_id.toString()) {
											//_data.profile.contacts = null;
											data[i][type] = _data.profile;
											_data.vacansy.forEach(function(__data) {
												if (__data._id.toString() === e.vac_id.toString()) {
													data[i].vacansy = __data;
													answer(res, data, err);
												}
											});
										};
									});
								} else if (type === 'employer') {
									data[i].employer = null;
									type = 'competitor';
									_res.forEach(function(_data) {
										if (_data._id.toString() === e.comp_id.toString()) {
											//_data.profile.contacts = null;
											data[i][type] = _data.profile;
											_res.forEach(function(__data) {
												if (__data._id.toString() === e.emp_id.toString()) {
													__data.vacansy.forEach(function(___data) {
														if (___data._id.toString() === e.vac_id.toString()) {
															data[i].vacansy = ___data;
															answer(res, data, err);
														}
													});
												}
											});
										};
									});
								} else answer(res, data, err);
							}
						});
					} else {
						answer(res, data, err);
					};
				});
			};
		});
	});

	app.get('/api/:version/interview/getById', function(req, res) {
		var id = req.query.id,
			query = {},
			type = req.session.type;
		interviewCtrl.getById({
			id: id
		}, function(err, data) {
			if (data) {
				if (type === 'competitor') {
					data.competitor = null;
					query.id = data.emp_id;
					type = 'employer';
				} else if (type === 'employer') {
					data.employer = null;
					query.id = data.comp_id;
					type = 'competitor'
				}
				accountCtrl.getById(query, function(error, _data) {
					//_data.profile.contacts = null;
					data[type] = _data.profile;
					answer(res, data, err);
				});
			} else {
				answer(res, data, err);
			};
		});
	});

	app.post('/api/:version/interview/accept', function(req, res) {
		var id = req.body['id'],
			selectedTime = req.body['selectedTime'];
		interviewCtrl.accept({
			id: id,
			selectedTime: selectedTime
		}, function(err, data) {
			answer(res, data, err);
		});
	});

	app.post('/api/:version/interview/decline', function(req, res) {
		var id = req.body['id'];
		interviewCtrl.decline({
			id: id
		}, function(err, data) {
			answer(res, data, err);
		});
	});

	app.get('/api/:version/interview/status', function(req, res) {
		var id = req.query.id;
		interviewCtrl.getStatus({
			id: id
		}, function(err, data) {
			answer(res, data, err);
		});
	});

	return $;
}

module.exports = $;

