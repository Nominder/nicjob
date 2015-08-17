"use strict";

var respondCtrl = new(require('../controllers/respond.js'))();
var accountCtrl = new(require('../controllers/account.js'))();
var fs = require('fs');
var errors = require('../data/errors.json');
var request = require('request'),
	ObjectID = require('mongodb').ObjectID;

var $ = function(args, cb) {
	var $ = this;
	var args = args || {};
	var cb = cb || function() {};
	var app = args.app;
	var answer = app.custom.answer;
	respondCtrl.init({
		app: app
	}, function(err, data) {});

	app.post('/api/:version/respond/send', function(req, res) {
		if (req.session.type === 'competitor') {
			var comp_id = req.session.id,
				emp_id = req.body['emp_id'],
				vac_id = req.body['vac_id'];
			respondCtrl.send({
				comp_id: comp_id,
				emp_id: emp_id,
				vac_id: vac_id
			}, function(err, data) {
				answer(res, data, err);
			});
		} else {
			answer(res, null, true);
		};
	});

	app.get('/api/:version/respond/get', function(req, res) {
		var id = req.session.id;
		var type = req.session.type;
		respondCtrl.get({
			id: id,
			type: type,
			page: 0
		}, function(err, data) {
			var query = {};
			if (!data || data.length === 0) {
				answer(res, data, err);
			} else {
				var _query = {_id: {$in: []}};
				//var _type = '';
				data.forEach(function(e, i) {
					//_type = req.session.type;
					/*if (_type === 'competitor')*/ _query._id.$in.push(new ObjectID(e.emp_id));
													_query._id.$in.push(new ObjectID(e.comp_id));
					//else if (_type === 'employer') _query._id.$in.push(new ObjectID(e.comp_id));
				});
				accountCtrl.find({query: _query, page: 0}, function(err, _res) {
					if (_res && _res.length !== 0) {
						console.log('respond:', data);
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
													var norm = true;
													__data.vacansy.forEach(function(___data) {
														if (___data._id.toString() === e.vac_id.toString()) {
															data[i].vacansy = ___data;
															norm = false;
															answer(res, data, err);
														}
													});
													if (norm) answer(res, data, err);
												}
											});
										};
									});
								}
							}
						});
					} else {
						answer(res, data, err);
					};
				});
			};
		});
	});

	app.get('/api/:version/respond/getById', function(req, res) {
		var id = req.query.id,
			type = req.session.type;
		respondCtrl.getById({
			id: id
		}, function(err, data) {
			if (data) {
				var _query = {_id: {$in: []}};
				_query._id.$in.push(new ObjectID(data.emp_id));
				_query._id.$in.push(new ObjectID(data.comp_id));
				accountCtrl.find({query: _query, page: 0}, function(err, _data) {
					type = req.session.type;
					if (type === 'competitor') {
						data.competitor = null;
						type = 'employer';
						_data.forEach(function(_res, i) {
							if (_res._id.toString() === data.emp_id.toString()) {
								//_data[i].profile.contacts = null;
								data[type] = _data[i].profile;
								_data[i].vacansy.forEach(function(__data) {
									if (__data._id.toString() === data.vac_id.toString()) {
										data.vacansy = __data;
										answer(res, data, err);
									};
								});
							};
						});
					} else if (type === 'employer') {
						data.employer = null;
						type = 'competitor'
						_data.forEach(function(_res, i) {
							if (_res._id.toString() === data.comp_id.toString()) {
								//_data[i].profile.contacts = null;
								data[type] = _data[i].profile;
								_data.forEach(function(__data) {
									if (__data._id.toString() === data.emp_id.toString()) {
										__data.vacansy.forEach(function(___data) {
											if (___data._id.toString() === data.vac_id.toString()) {
												data.vacansy = ___data;
												answer(res, data, err);
											};
										});
									};
								});
							};
						});
					};
				});
			} else {
			};
		});
	});

	app.post('/api/:version/respond/accept', function(req, res) {
		var id = req.body['id'];
		respondCtrl.accept({
			id: id
		}, function(err, data) {
			answer(res, data, err);
		});
	});

	app.post('/api/:version/respond/decline', function(req, res) {
		var id = req.body['id'];
		respondCtrl.decline({
			id: id
		}, function(err, data) {
			answer(res, data, err);
		});
	});

	app.get('/api/:version/respond/status', function(req, res) {
		var id = req.query.id;
		respondCtrl.getStatus({
			id: id
		}, function(err, data) {
			answer(res, data, err);
		});
	});

	return $;
}

module.exports = $;

