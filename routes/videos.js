"use strict";

var express = require('express');
var request = require('request');

var $ = function(args, cb) {
	var $ = this; var args = args || {}; var cb = cb || function() {};
	var app = args.app;
	var answer = app.custom.answer;

	app.post('/api/:version/media/compile', function(req, res) {
		var FFmpeg = require('fluent-ffmpeg');
		new FFmpeg({source:req.files.video.path})
			.input(req.files.audio.path)
			.format('webm')
			.on('start', function(cmd) {
				console.log('Started ', cmd);
			})
			.on('error', function (err, stdout, stderr) {
				console.log(new Date, '  ffmpeg-error: ', err, err.message);
				console.log("stdout: ", stdout);
				console.log("stderr: ", stderr);
			})
			.on('progress', function (progress) {
				console.log('ffmpeg-output', Math.round(progress.percent));
			})
			.on('end', function () {
				console.log('Merging finished !');
			})
			.pipe(res, {end: true});
	});

	app.get('/api/:version/media/upload', function(req, res) {
		request('http://boomstream.com/api/media/upload?apikey=959a9bd1ba6b47d3ce7e7a0b4b8aa0e8&title=ololo&format=json', function(err, response, body) {
			var _body = JSON.parse(body);
			if (!err && response.statusCode === 200) {
				answer(res, {
					upload: _body.UploadUrl,
					progress: _body.ProgressBarUrl
				}, err);
			}
		});
	});

	app.get('/api/:version/media/progress', function(req, res) {
		var url = req.query.url;
		request(url, function(err, response, body) {
			if (!err && response.statusCode === 200) {
				res.end(body);
			} else {
				res.end('err');
			}
		});
	});

	app.get('/api/:version/media/get', function(req, res) {
		request('http://boomstream.com/api/media/info?code=' + req.query['code'] + '&format=json', function(err, response, body) {
			if (!err && response.statusCode === 200) {
				answer(res, JSON.parse(body), err);
	  		}
		});
	});

	return $;
}


module.exports = $;