"use strict";

var accountCtrl = new (require('../controllers/account.js'))(); 

var $ = function(args, cb) {
	var $ = this; var args = args || {}; var cb = cb || function() {};
	var app = args.app;

	accountCtrl.init({app:app}, function(err, data) {});


	app.set('view engine', 'ejs');

	app.get('/nojs', function(req, res) {
		res.render('index');
	});

	app.get('/nojs/competitors', function(req, res) {
		var _page = req.query.page;
		accountCtrl.find({page: _page, query: {banned: false, type: 'competitor'}}, function(err, data) {
			err ? res.render('index') : res.render('competitors', {items: data});
		});
	});

	app.get('/nojs/teams', function(req, res) {
		var _page = req.query.page;
		accountCtrl.find({page: _page, query: {banned: false, type: 'team'}}, function(err, data) {
			console.log(err + ' ' + data)
			err ? res.render('index') : res.render('teams', {items: data});
		});
	});

	app.get('/nojs/vacansies', function(req, res) {
		var _page = req.query.page;
		accountCtrl.find({page: _page, query: {banned: false, type: 'employer'}}, function(err, data) {
			err ? res.render('index') : res.render('vacansies', {items: data});
		});
	});

	app.get('/nojs/employer', function(req, res) {
		var id = req.query.id;
		accountCtrl.getById({id: id}, function(err, data) {
			err ? res.render('index') : res.render('employer', {item: data});
		});
	});
	return $;
};

module.exports = $;