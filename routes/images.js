"use strict";
var Images = require("../controllers/images.js");
var images = new Images();

images.init({
	dir: "../tmp"
});

var $ = function(args, cb) {
	var $ = this; var args = args || {}; var cb = cb || function() {};
	var app = args.app;
	var answer = app.custom.answer;
	app.post('/api/:version/images/create', function(req, res) {
		images.create({
			path: req.files['file'].path
		}, function(err, data) {
			answer(res, data, err?"Error":null);
		});
	});

	app.get('/openapi/:version/images/get', function(req, res, next) {
		images.getPath({id: req.query['id'], size: req.query['size']}, function(err, data) {
			if(!err)
				res.download(data)
			else
				res.redirect('/img/avatar.png');
				//next();
		});
	});
	return $;
}

module.exports = $;
