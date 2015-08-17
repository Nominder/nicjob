"use strict";

var ObjectID = require('mongodb').ObjectID;

var $ = (function() {

	var $ = function() {}

	$.prototype = {
		_db: {},
		init: function(args, cb) {
			var $ = this,
				args = args || {},
				cb = cb || function() {};
			$._db = args.app.custom.db;
			if ($._db) cb(null, !0);
			else cb('models.account: Cannot get db', null);
			return $;
		},
		create: function(args, cb) {
			var $ = this,
				args = args || {},
				cb = cb || function() {},
				comp_id = args.comp_id || '',
				emp_id = args.emp_id || '',
				times = args.times || [],
				vac_id = args.vac_id || '';
			if (comp_id && emp_id && times && vac_id) {
				$._db.collection("interviewes").insert({
					comp_id: comp_id,
					emp_id: emp_id,
					times: times,
					selectedTime: '',
					status: 'pending',
					vac_id: vac_id
				}, function(err, _data) {
					err ? cb('models.account.create: Cannot write to db ' + err, null) : cb(null, true);
				});
			} else cb('models.account.create: 9 - Cannot get object', null);
			return $;
		},
		update: function(args, cb) {
			var $ = this,
				args = args || {},
				cb = cb || function() {},
				changes = args.changes || {},
				id = args.id || args.account || 0,
				length = 0;
			for (var i in changes) length++;
			if (changes && length > 0) {
				$._db.collection("interviewes").update({
					_id: new ObjectID(id)
				}, {
					'$set': changes
				}, function(err) {
					err ? cb('models.account.update: 12 - Cannot update account', null) : cb(null, !0);
				});
			} else cb('', null);
			return $;
		},
		findById: function(args, cb) {
			var $ = this,
				args = args || {},
				cb = cb || function() {},
				id = args.id || args.account || 0;
			$._db.collection("interviewes").find({
				_id: new ObjectID(id)
			}).toArray(function(err, res) {
				if (err) cb('models.account.findByEmail: Cannot read data ' + err, null);
				else cb(null, res);
			});
			return $;
		},
		find: function(args, cb) {
			var $ = this,
				args = args || {},
				cb = cb || function() {},
				query = args.query,
				page = args.page;
			$._db.collection("interviewes").find(query).skip(page * 50).limit(50).toArray(function(err, res) {
				err ? cb('models.account.find: 1 - Connot read data', null) : cb(null, res);
			});
			return $;
		},
		read: function(args, cb) {
			var $ = this,
				args = args || {},
				cb = cb || function() {};
			$._db.collection("interviewes").find({}, function(err, res) {
				if (err) cb('', null);
				else res ? cb(null, res) : cb('', null);
			});
			return $;
		},
		remove: function(args, cb) {
			var $ = this,
				args = args || {},
				cb = cb || function() {},
				id = args.id || '';
			$._db.collection("interviewes").remove({
				_id: new ObjectID(id)
			}, function(err, res) {
				if (err) cb('', null);
				else cb(null, !0);
			});
			return $;
		}
	}

	return $;
})();

module.exports = $;
