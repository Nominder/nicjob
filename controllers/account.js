"use strict";

var account = new(require('../models/account.js'))();
var crypto = require("crypto");

var SaltLength = 9;

function hash(password) {
	var salt = generateSalt(SaltLength);
	var hash = md5(password + salt);
	return salt + hash;
}

function validate(hash, password) {
	var salt = hash.substr(0, SaltLength);
	var validHash = salt + md5(password + salt);
	return hash === validHash;
}

function generateSalt(len) {
	var set = "0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ",
		setLen = set.length,
		salt = "";
	for (var i = 0; i < len; i++) {
		var p = Math.floor(Math.random() * setLen);
		salt += set[p];
	}
	return salt;
}

function md5(string) {
	return crypto.createHash("md5").update(string).digest("hex");
}

var $ = (function() {

	var $ = function() {};

	$.prototype = {
		init: function(args, cb) {
			var $ = this;
			var args = args || {};
			var cb = cb || function() {};
			account.init({
				app: args.app
			});
			cb(null, !0);
			return $;
		},
		checkEmail: function(args, cb) {
			var $ = this;
			var args = args || {};
			var cb = cb || function() {},
				email = args.email || '';
			account.findByEmail({
				email: email
			}, function(err, res) {
				cb((err ? 'controllers.account: 1 - Cannot read data' : null), !!res);
			});
			return $;
		},
		getById: function(args, cb) {
			var $ = this;
			var args = args || {};
			var cb = cb || function() {},
				id = args.id || args.account || 0;
			account.findById({
				id: id
			}, function(err, res) {
				if (err || res.length === 0) {
					cb('controllers.account: 11 - Does not have such account', null);
				} else {
					cb(null, res[0]);
				}
			});
		},
		getByEmail: function(args, cb) {
			var $ = this;
			var args = args || {};
			var cb = cb || function() {},
				email = args.email || '';
			account.findByEmail({
				email: email
			}, function(err, res) {
				cb((err ? 'controllers.account.getByEmail: ' + err : null), res);
			});
		},
		signup: function(args, cb) {
			var $ = this;
			var args = args || {};
			var cb = cb || function() {},
				acc = args.account || {},
				passwd = acc.password;
			acc.password = hash(acc.password);
			account.create({
				account: acc,
				passwd: passwd
			}, function(err, res) {
				console.log(err)
				err ? cb('controllers.account.signup: ' + err, null) : cb(null, res);
			});
			return $;
		},
		signin: function(args, cb) {
			var $ = this;
			var args = args || {};
			var cb = cb || function() {},
				email = args.email || '',
				passwd = args.password || '';
			$.getByEmail({
				email: email
			}, function(err, res) {
				if (err || res.length === 0) cb('controllers.account.signin: 17 - Invalid email or password', null);
				else if (res.length !== 0) validate(res[0].password, passwd) ? cb(null, res[0]) : cb('controllers.account.signin: 17 - Invalid email or password', null);
			});
			return $;
		},
		ban: function(args, cb) {
			var $ = this;
			var args = args || {};
			var cb = cb || function() {},
				id = args.id || args.account || 0;
			account.update({
				id: id,
				changes: {
					banned: !0
				}
			}, function(err, res) {
				cb((err ? '' : null), res);
			});
			return $;
		},
		unban: function(args, cb) {
			var $ = this;
			var args = args || {};
			var cb = cb || function() {},
				id = args.id || args.account || 0;
			account.update({
				id: id,
				changes: {
					banned: !1
				}
			}, function(err, res) {
				cb((err ? '' : null), res);
			});
			return $;
		},
		find: function(args, cb) {
			var $ = this;
			var args = args || {};
			var cb = cb || function() {},
				query = args.query || {},
				page = +(args.page) || 0;
			account.find({
				query: query,
				page: page
			}, function(err, res) {
				err ? cb(err, null) : cb(null, res);
			});
			return $;
		},
		remove: function(args, cb) {
			var $ = this,
				args = args || {},
				cb = cb || function() {},
				id = args.id || '';
			account.remove({
				id: id
			}, function(err, res) {
				err ? cb('controllers.account: ' + err, null) : cb(null, res);
			});
			return $;
		},
		search: function(args, cb) {
			var $ = this;
			var args = args || {};
			var cb = cb || function() {},
				query = args.query || {},
				page = +(args.page) || 0;
			account.search({
				query: query,
				page: page
			}, function(err, res) {
				err ? cb('controllers.account: ' + err, null) : cb(null, res);
			});
			return $;
		},
		update: function(args, cb) {
			var $ = this,
				args = args || {},
				cb = cb || function() {},
				changes = args.changes || {},
				id = args.id || '',
				type = args.type || '';
			if (changes.password) changes.password = hash(changes.password);
			account.update({
				changes: changes,
				id: id
			}, function(err, res) {
				cb((err ? 'controllers.account: ' + err : null), res);
			});
			return $;
		},
		updateByEmail: function(args, cb) {
			var $ = this,
				args = args || {},
				cb = cb || function() {},
				changes = args.changes || {},
				email = args.email || '';
			if (changes.password) changes.password = hash(changes.password);
			account.updateByEmail({
				changes: changes,
				email: email
			}, function(err, res) {
				cb((err ? 'controllers.account: ' + err : null), res);
			});
			return $;
		},
		updateProfile: function(args, cb) {
			var $ = this,
				args = args || {},
				cb = cb || function() {},
				changes = args.changes || {},
				id = args.id || '',
				type = args.type || '';
			console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',changes);
			account.profileUpdate({
				changes: changes,
				id: id,
				type: type
			}, function(err, res) {
				cb((err ? 'controllers.account: ' + err : null), res);
			});
			return $;
		},
		addVacansy: function(args, cb) {
			var $ = this;
			var args = args || {};
			var cb = cb || function() {},
				vacansy = args.vacansy || {},
				id = args.id;
			account.addVacansy({
				vacansy: vacansy,
				id: id
			}, function(err, res) {
				cb((err ? 'controllers.account: ' + err : null), res);
			});
			return $;
		},
		vacansyGetById: function(args, cb) {
			var $ = this,
				args = args || {},
				cb = cb || function() {},
				id = args.id || '',
				vacansyId = args.vacansyId;
			account.vacansyGetById({
				id: id,
				vacansyId: vacansyId
			}, function(err, res) {
				var data = {vacansy: ((res[0] || {}).vacansy || [])[0] || {}, profile: (res[0] || {}).profile || {}};
				cb((err ? 'controllers.account: ' + err : null), data);
			});
			return $;
		},
		vacansyGet: function(args, cb) {
			var $ = this,
				args = args || {},
				cb = cb || function() {},
				id = args.id || '';
			account.vacansyGet({
				id: id
			}, function(err, res) {
				var vacansy = (res[0] || {}).vacansy || [];
				cb((err ? 'controllers.account: ' + err : null), vacansy);
			});
			return $;
		},
		vacansyUpdate: function(args, cb) {
			var $ = this,
				args = args || {},
				cb = cb || function() {},
				changes = args.changes || {},
				id = args.id || '',
				vacansyId = args.vacansyId || '';
			account.vacansyUpdate({
				changes: changes,
				id: id,
				vacansyId: vacansyId
			}, function(err, res) {
				cb((err ? 'controllers.account: ' + err : null), res);
			});
			return $;
		},
		vacansyRemove: function(args, cb) {
			var $ = this,
				args = args || {},
				cb = cb || function() {},
				id = args.id || '',
				vacansyId = args.vacansyId || '';
			account.vacansyRemove({
				id: id,
				vacansyId: vacansyId
			}, function(err, res) {
				cb((err ? 'controllers.account: ' + err : null), res);
			});
			return $;
		},
		vacansySearch: function(args, cb) {
			var $ = this;
			var args = args || {};
			var cb = cb || function() {},
				query = args.query || {},
				page = +(args.page) || 0;
			account.vacansySearch({
				query: query,
				page: page
			}, function(err, res) {
				err ? cb('controllers.account: ' + err, null) : cb(null, res);
			});
			return $;
		},
		addBlackList: function(args, cb) {
			var $ = this,
				args = args || {},
				cb = cb || function() {},
				id = args.id || '',
				blackId = args.blackId || '',
				reason = args.reason || '';
			account.addBlackList({
				id: id,
				blackId: blackId,
				reason: reason
			}, function(err, res) {
				err ? cb('controllers.account: ' + err, null) : cb(null, res);
			});
			return $;
		},
		removeBlackList: function(args, cb) {
			var $ = this,
				args = args || {},
				cb = cb || function() {},
				id = args.id || '',
				blackId = args.blackId || '';
			account.removeBlackList({
				id: id,
				blackId: blackId
			}, function(err, res) {
				err ? cb('controllers.account: ' + err, null) : cb(null, res);
			});
			return $;
		},
		addWatchList: function(args, cb) {
			var $ = this,
				args = args || {},
				cb = cb || function() {},
				id = args.id || '',
				_id = args._id || '';
			account.addWatchList({
				id: id,
				_id: _id
			}, function(err, res) {
				err ? cb('controllers.account: ' + err, null) : cb(null, res);
			});
			return $;
		},
		removeWatchList: function(args, cb) {
			var $ = this,
				args = args || {},
				cb = cb || function() {},
				id = args.id || '',
				_id = args._id || '';
			account.removeWatchList({
				id: id,
				_id: _id
			}, function(err, res) {
				err ? cb('controllers.account: ' + err, null) : cb(null, res);
			});
			return $;
		},
		getBlackList: function(args, cb) {
			var $ = this,
				args = args || {},
				cb = cb || function() {},
				id = args.id || '';
			account.getBlackList({
				id: id
			}, function(err, res) {
				err ? cb('controllers.account: ' + err, []) : cb(null, res);				
			});
			return $;				
		},
		getWatchList: function(args, cb) {
			var $ = this,
				args = args || {},
				cb = cb || function() {},
				id = args.id || '';
			account.getWatchList({
				id: id
			}, function(err, res) {
				err ? cb('controllers.account: ' + err, []) : cb(null, res);				
			});
			return $;				
		}
	}

	return $;

})();

module.exports = $;
