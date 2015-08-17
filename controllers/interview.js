"use strict";

var interview = new(require('../models/interview.js'))();

var $ = (function() {

	var $ = function() {};

	$.prototype = {
		init: function(args, cb) {
			var $ = this;
			var args = args || {};
			var cb = cb || function() {};
			interview.init({
				app: args.app
			});
			cb(null, !0);
			return $;
		},
		get: function(args, cb) {
			var $ = this;
			var args = args || {};
			var cb = cb || function() {};
			var id = args.id || '',
				page = args.page || 0,
				query = {},
				type = args.type || '';
			if (type === 'competitor') query.comp_id = id;
			else if (type === 'employer') query.emp_id = id;
			interview.find({
				query: query,
				page: page
			}, function(err, res) {
				cb(err, res);
			});
			return $;
		},
		getById: function(args, cb) {
			var $ = this;
			var args = args || {};
			var cb = cb || function() {};
			var id = args.id || '';
			interview.findById({
				id: id
			}, function(err, res) {
				cb(err, res[0]);
			});
			return $;
		},
		invite: function(args, cb) {
			var $ = this;
			var args = args || {};
			var cb = cb || function() {};
			var comp_id = args.comp_id || '',
				emp_id = args.emp_id || '',
				vac_id = args.vac_id || '',
				times = args.times || [];
			interview.create({
				comp_id: comp_id,
				emp_id: emp_id,
				times: times,
				vac_id: vac_id
			}, function(err, res) {
				cb(err, res);
			});
			return $;
		},
		accept: function(args, cb) {
			var $ = this;
			var args = args || {};
			var cb = cb || function() {};
			var id = args.id || '',
				selectedTime = args.selectedTime || '';
			interview.update({
				id: id,
				changes: {
					selectedTime: selectedTime,
					status: 'accepted'
				}
			}, function(err, res) {
				cb(err, res);
			});
			return $;
		},
		decline: function(args, cb) {
			var $ = this;
			var args = args || {};
			var cb = cb || function() {};
			var id = args.id || '';
			interview.update({
				id: id,
				changes: {
					status: 'declined'
				}
			}, function(err, res) {
				cb(err, res);
			});
			return $;
		},
		getStatus: function(args, cb) {
			var $ = this;
			var args = args || {};
			var cb = cb || function() {};
			var id = args.id || '';
			interview.findById({
				id: id
			}, function(err, res) {
				if (err) cb(err, res);
				else {
					if (res[0]) cb(!1, res[0].status);
					else cb(err, !1);
				};
			});
			return $;
		}
	}

	return $;
})();

module.exports = $;
