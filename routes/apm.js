"use strict";

var accountCtrl = new(require('../controllers/account.js'))();
var errors = require('../data/errors.json');

var $ = function(args, cb) {
	var $ = this;
	var args = args || {};
	var cb = cb || function() {};
	var app = args.app;
	var answer = app.custom.answer;
	accountCtrl.init({
		app: app
	}, function(err, data) {});

	app.post('/api/:version/admin/account/ban', function(req, res) {
		accountCtrl.ban({
			id: req.body['id']
		}, function(err, data) {
			answer(res, data, err);
		});
	});

	app.post('/api/:version/admin/account/unban', function(req, res) {
		accountCtrl.unban({
			id: req.body['id']
		}, function(err, data) {
			answer(res, data, err);
		});
	});

	app.post('/api/:version/admin/account/profileUpdate', function(req, res) {
		var id = req.body['id'] || '';
		accountCtrl.getById({
			id: id
		}, function(error, data) {
			if (data.type) {
				accountCtrl.updateProfile({
					id: id,
					changes: JSON.parse(req.body['changes']),
					type: data.type
				}, function(err, data) {
					var _data = {};
					_data = {
						id: req.session.id,
						email: req.session.email
					};
					answer(res, _data, err);
				});
			}
		});
	});

	app.post('/api/:version/admin/account/vacansyUpdate', function(req, res) {
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

	app.post('/api/:version/moder/account/profileUpdate', function(req, res) {
		var id = req.body['id'] || '';
		accountCtrl.getById({
			id: id
		}, function(error, data) {
			if (data.type) {
				accountCtrl.updateProfile({
					id: id,
					changes: JSON.parse(req.body['changes']),
					type: data.type
				}, function(err, data) {
					var _data = {};
					_data = {
						id: req.session.id,
						email: req.session.email
					};
					answer(res, _data, err);
				});
			}
		});
	});

	return $;
}


module.exports = $;
