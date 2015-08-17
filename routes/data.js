"use strict";

var fs = require('fs');

var $ = function(args, cb) {
	var $ = this;
	var args = args || {};
	var cb = cb || function() {};
	var app = args.app || {};
	var answer = app.custom.answer;
	app.get('/openapi/:version/data/getFields', function(req, res) {
		fs.readFile('./data/fields.json', 'utf8', function(err, data) {
			answer(res, JSON.parse(data), err);
		});
	});

	app.get('/openapi/:version/data/getErrors', function(req, res) {
		fs.readFile('./data/errors.json', 'utf8', function(err, data) {
			answer(res, JSON.parse(data), err);
		});
	});

	return $;
}

module.exports = $;
