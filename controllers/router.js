"use strict";

var $ = function (args, cb) {
	var $ = this; var args = args || {}; var cb = cb || function() {};
	var app = args.app;
	var answer = app.custom.answer;

	app.use('*', function(req, res, next) {
		req.header('Access-Control-Allow-Origin', req.headers.origin);
		req.session.xxx =222;
		next();
	});
	app.use('/api/*', function(req, res, next) {
		req.session.type ? next() : answer(res, null, "NAuth");
	});
	app.use('/api/:version/admin/*', function(req, res, next) {
		(req.session.type === 'admin') ? next() : answer(res, null, "nauth");
	});
	app.use('/api/:version/moder/*', function(req, res, next) {
		(req.session.type === 'admin' || req.session.type === 'moder') ? next() : answer(res, null, "nauth");
	});

	(require('../routes/account.js'))({app:app});
	(require('../routes/list.js'))({app:app});
	(require('../routes/videos.js'))({app:app});
	(require('../routes/images.js'))({app:app});
	(require('../routes/nojs.js'))({app:app});
	(require('../routes/data.js'))({app:app});
	(require('../routes/interview.js'))({app:app});
	(require('../routes/respond.js'))({app:app});
	(require('../routes/apm.js'))({app:app});	

	app.use(function(req, res, next) {
		res.status(404).send('Not found');
	});

	return $;
};

module.exports = $;