"use strict";

var listCtrl = require('../controllers/list.js');

var lists = {};
var listsNames = [
	{name: 'citizenship', alias: 'Гражданство'},
	{name: 'driverLicense', alias: 'Водительские права'},
	{name: 'hs', alias: 'Учебное заведение'},
	{name: 'industry', alias: 'Сфера деятельности'},
	{name: 'level', alias: 'Уровень образования'},
	{name: 'nationality', alias: 'Национальность'},
	{name: 'organization', alias: 'Организация'},
	{name: 'part', alias: 'Занятость'},
	{name: 'period', alias: 'Период'},
	{name: 'post', alias: 'Должность'},
	{name: 'religion', alias: 'Религия'},
	{name: 'speciality', alias: 'Специальность'},
	{name: 'tag', alias: 'Язык'},
	{name: 'skill', alias: 'Умение'}
];

listsNames.forEach(function(e) {
	lists[e.name] = (new listCtrl()).init({
		path: "./data/" + e.name + ".json",
		alias: e.alias
	}, function(err, res) {
		if (err) console.warn("List.$: cann`t load list '" + e + "' + err");
	});
});

var switchFunc = function(args, cb) {
	args = args || {};
	cb = cb || function() {};
	var func = args.func || '';
	var type = args.type || '';
	var user = args.user || '';
	var res = null;

	switch (func) {
		case "add":
		case "update":
		case "remove":
			if (user !== "admin" && user !== "moder") {
				cb("List.switchFunc: user does not have permission", null);
				return null;
				break;
			};
		case "find":
		case "findByTitle":
		case "findByIndex":
		case "findById":
		case "get":
			break;
		default:
			cb("List.switchFunc: no such method", null);
			return null;
	}

	switch (type) {
		case "citizenship":
		case "driverLicense":
		case "hs":
		case "industry":
		case "level":
		case "nationality":
		case "organization":
		case "part":
		case "period":
		case "post":
		case "religion":
		case "speciality":
		case "tag":
			lists[type][func](args, function(err, res) {
				cb(err, res);
			});
			break;
		default:
			cb("List.switchFunc: no such list", null);
			return null;
	}
}
var $ = function(args, cb) {
	var $ = this;
	var args = args || {};
	var cb = cb || function() {};
	var app = args.app;
	var answer = app.custom.answer;
	app.custom.lists = lists;
	app.get('/openapi/:version/list/:name/:type', function(req, res) {
		switchFunc({
			func: req.params['type'],
			type: req.params['name'],
			title: req.query.title,
			index: req.query.index,
			id: req.query.id
		}, function(err, res1) {
			answer(res, res1, err);
		});
	});

	app.get('/api/:version/list/:name/:type', function(req, res) {
		switchFunc({
			func: req.params['type'],
			type: req.params['name'],
			title: req.query.title,
			new_title: req.query.new_title,
			user: req.session.type,
			index: req.query.index,
			id: req.query.id
		}, function(err, res1) {
			answer(res, res1, err);
		});
	});

	app.get('/api/:version/moder/lists/getAll', function(req, res) {
		answer(res, lists, !1);
	});

	return $;
}


module.exports = $;
