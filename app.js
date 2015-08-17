"use strict";

var express = require('express');
var harp = require('harp');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var session = require('cookie-session');
var mongo = require('mongodb').MongoClient;
var db = {};
var request = require('request');

var app = express();
app.disable('x-powered-by');
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(multer({ dest: './tmp/'}));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));
app.use(harp.mount(path.join(__dirname, 'harp')));
app.use(session({
	name:"pjs",
	secret:"uXJ0PKVFqZ"
}));

mongo.connect('mongodb://test:test@ds063929.mongolab.com:63929/pjt', function(err, db) {
	if (err) {
		console.log(err)
	} else {
		app.custom = {
			db: db,
			answer: function(res, data, err) {
				if (typeof data !== "string") data = data || null;
				switch (typeof err) {
					case "string": err = (err.match(/[0-9]+/) || [null])[0]; break;
					case "number": break;
					default: err = null;
				}
				if (err) console.warn(err);
				res.json({"error":err,"result":data});
			}
		};
		(require('./controllers/router.js'))({app:app});
		console.log('Connect to databse successfull');
	}
});

module.exports = app;
