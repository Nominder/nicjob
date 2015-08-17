"use strict"

var fs = require('fs');
var validator = require('./validator.js');

var listCtrl = require('../controllers/list.js');

var lists = {};
var listsNames = [
	'citizenship',
	'driverLicense',
	'hs',
	'industry',
	'level',
	'nationality',
	'organization',
	'part',
	'period',
	'post',
	'religion',
	'speciality',
	'tag',
	'skill'
];

listsNames.forEach(function(e) {
	lists[e] = (new listCtrl()).init({path: "./data/" + e + ".json"}, function(err, res) {
		if (err) console.warn("List.$: cann`t load list '" + e + "' + err");
	});
});

var $ = (function() {

	var $ = function() {}

	$.prototype = new validator();
	$.prototype.create = function(args, cb) {
		var $ = this,
			args = args || {},
			cb = cb || function() {},
			field = args.field || {};
		if (field.type && field.name) {
			for (var i in field) {
				switch (i) {
					case 'type':
						if (typeof field[i] !== 'string' || field[i] !== 'objectArray' && field[i] !== 'array' && field[i] !== 'object' && field[i] !== 'string' && field[i] !== 'number' && field[i] !== 'boolean' && field[i] !== 'list') {
							cb('models.model: Cannot create new model, invalid type:' + field[i], null);
							return $;
						}
						break;
					case 'name':
						if (typeof field[i] !== 'string') {
							cb('models.model: Cannot create new model, invalid name:' + field[i], null);
							return $;
						} else if (field[i] in $._fields) {
							cb('models.model: Cannot create new model, this name:' + field[i] + ' has been exist yet', null);
							return $;
						}
						break;
					case 'sub':
						if (!(typeof field[i] === 'object' && field[i] instanceof Array)) {
							field[i] = [];
						} else
							field[i].forEach(function(e, index) {
								if (!(e in $._fields)) field[i].splice(index, 1);
							});
						break;
					case 'ext':
						if (typeof field[i] !== 'boolean') field[i] = !1;
						break;
					case 'max':
						if (typeof field[i] !== 'number') delete field[i];
						break;
					case 'array':
						if (typeof field[i] !== 'string' || field[i] !== 'string' && field[i] !== 'number' && field[i] !== 'boolean' && field[i] !== 'list') field[i] = 'string';
						break;
					case 'maxCount':
						if (typeof field[i] !== 'number') delete field[i];
						break;
					default:
						delete field[i];
				}
			}
			if (typeof field.title !== 'string')
				field.title = field.name;
			switch (field.type) {
				case 'string':
				case 'list':
					if (typeof field.value !== 'string') field.value = '';
					break;
				case 'number':
					if (typeof field.value !== 'number') field.value = 0;
					break;
				case 'boolean':
					if (typeof field.value !== 'boolean') field.value = !1;
					break;
				case 'array':
				case 'objectArray':
					if (!(typeof field.value === 'object' && field.value instanceof Array)) field.value = [];
					break;
				case 'object':
					if (typeof field.value !== 'object' || !field.value) field.value = {};
					break;
			}
			$._fields[field.name] = field;
			$.save();
			cb(null, field);
		} else cb('models.model: Cannot create new model, type or name param does not exist', null);
		return $;
	};
	$.prototype.update = function(args, cb) {
		var $ = this,
			args = args || {},
			cb = cb || function() {},
			changes = args.changes || {},
			name = args.name || '';
		if (!(name in $._fields)) {
			cb('models.model: Cannot update model:' + name + ', invalid name', null);
			return $;
		}
		for (var i in changes) {
			if (i === 'sub') {
				changes[i].forEach(function(e) {
					var tmp = !0;
					$._fields[name][i].forEach(function(_e) {
						if (_e === e) tmp = !1;
					});
					if (tmp) $._fields[name].sub.push(e);
				});
			} else if (i === 'name') {
				var field = $._fields[name];
				field[i] = changes[i];
				delete $._fields[name];
				name = changes[i];
				$._fields[name] = field;
				cb(null, $._fields[name]);
			} else {
				$._fields[name][i] = changes[i];
				cb(null, $._fields[name]);
			}
			$.save();
		}
		return $;
	};
	$.prototype.remove = function(args, cb) {
		var $ = this,
			args = args || {},
			cb = cb || function() {},
			name = args.name;
		delete $._fields[name];
		$.save();
		return $;
	};
	$.prototype.removeSub = function(args, cb) {
		var $ = this,
			args = args || {},
			cb = cb || function() {},
			name = args.name,
			sub = args.sub;
		$._fields[name].sub.forEach(function(e, i) {
			if (sub === e) $._fields[name].sub.splice(i, 1);
		});
		$.save();
		return $;
	};
	$.prototype.init = function(args, cb) {
		var $ = this,
			args = args || {},
			cb = cb || function() {};
		$._fields = $.read(null, function(err, res) {
			if (err) cb('models.model: 1 - Cannot read data' + err, null);
			else {
				$._fields = res || {};
				cb(null, $._fields);
			};
		});
		$._lists = lists;
		return $;
	};
	$.prototype.read = function(args, cb) {
		var $ = this,
			args = args || {},
			cb = cb || function() {},
			fields = {};
		fs.readFile('./data/fields.json', 'utf8', function(err, data) {
			if (err) cb('models/model: 1 - Cannot read file ' + './data/fields.json ' + err, null);
			else {
				fields = JSON.parse(data) || {};
				cb(null, fields);
			};
		});
		return $;
	};
	$.prototype.save = function(args, cb) {
		var $ = this,
			args = args || {},
			cb = cb || function() {};
		fs.writeFile('./data/fields.json', JSON.stringify($._fields), function(err) {
			if (err) cb('models/model: 2 - Cannot save to file ' + './data/fields.json ' + err, null);
			else cb(null, $._fields);
		});
		return $;
	};

	return $;
})();

module.exports = $;
