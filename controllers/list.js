"use strict";

//Object 'args' has fields: value, id, title, index, path;

var fs = require('fs');

var List = (function() {

	var Class = function() {}

	Class.prototype = {
		_path: "",
		_values: null,
		_alias: "",
		add: function(args, cb) { // takes 2 optional params: value, path
			var $ = this;
			var args = args || {};
			var cb = cb || function() {};
			var _title = args.title;
			var _id = (new Date).getTime().toString(32) + Math.random().toString(32).slice(3);
			var _index = args.index || (Math.random().toString(32).slice(3) + (new Date).getTime().toString(32));
			if (_title && _id && _index) {
				$._values.push({
					title: _title,
					id: _id,
					index: _index
				});
				$.save(null, function(err, res) {
					if (err) {
						cb(err, null);
					} else cb(null, true);
				});
			} else cb("List.add: hasn`t required arguments", null);
			return $;
		},
		findByTitle: function(args, cb) {
			var $ = this;
			var args = args || {};
			var cb = cb || function() {};
			var title = args.title || "";
			var limit = args.limit;
			var values = [];
			$._values.forEach(function(e) {
				if (e.title.toLowerCase().search(title.toLowerCase()) !== -1 && (limit && (values.length < limit))) values.push(e);
			});
			cb(null, values);
			return $;
		},
		findById: function(args, cb) {
			var $ = this;
			var args = args || {};
			var cb = cb || function() {};
			var id = args.id || 0;
			var values = [];
			$._values.forEach(function(e, i) {
				if (parseInt(e.id) == parseInt(id) && values.length === 0) values.push(e);
			});
			cb(null, values);
			return $;
		},
		findByIndex: function(args, cb) {
			var $ = this;
			var args = args || {};
			var cb = cb || function() {};
			var index = args.index || "";
			var limit = args.limit;
			var values = [];
			$._values.forEach(function(e) {
				if (e.index.toLowerCase().search(index.toLowerCase()) !== -1 && (limit && (values.length < limit))) values.push(e);
			});
			cb(null, values);
			return $;
		},
		find: function(args, cb) {
			var $ = this;
			var args = args || {};
			var cb = cb || function() {};
			var title = args.title || " ";
			var index = args.index || " ";
			var id = args.id || 0;
			var values = [];
			if (id) $.findById(args, function(err, res) {
				cb(err, res);
			});
			else {
				$._values.forEach(function(e) {
					if ((!title || e.title.toLowerCase().search(title.toLowerCase()) !== -1) && (!index || e.index.toLowerCase().search(index.toLowerCase()) !== -1)) values.push(e);
				});
				cb(null, values);
			}
			return $;
		},
		update: function(args, cb) {
			var $ = this;
			var args = args || {};
			var cb = cb || function() {};
			var title = args.title;
			var new_title = args.new_title;
			if (title && new_title) {
				$._values.forEach(function(e, i) {
						if (e.title.toLowerCase() === title.toLowerCase()) {
							$._values[i].title = new_title;
							$.save(null, function(err, res) {
								if (err) {
									cb(err, null);
								} else cb(null, true);
								return $;
							});
						} else if (i === $._values.length)  {
							cb("List.delete: no such element", null);
						}
				});
			} else cb("List.delete: hasn`t required arguments", null);
			return $;
		},
		remove: function(args, cb) {
			var $ = this;
			var args = args || {};
			var cb = cb || function() {};
			var title = args.title;
			var id = args.id;
			var index = args.index;
			var norm = true;
			if (title || id || index) {
				$._values.forEach(function(e, i) {
					if (norm) {
						if (title) {
							if (e.title.toLowerCase() === title.toLowerCase()) {
								$._values.splice(i, 1);
								$.save(null, function(err, res) {
									if (err) {
										cb(err, null);
									} else cb(null, true);
								});
								norm = false;
							} else if (i === $._values.length) cb("List.delete: no such element", null);
						} else if (id) {
							if (e.id === id) {
								$._values.splice(i, 1);
								$.save(null, function(err, res) {
									if (err) {
										cb(err, null);
									} else cb(null, true);
								});
								norm = false;
							} else if (i === $._values.length) cb("List.delete: no such element", null);
						} else if (index) {
							if (e.index === index) {
								$._values.splice(i, 1);
								$.save(null, function(err, res) {
									if (err) {
										cb(err, null);
									} else cb(null, true);
								});
								norm = false;
							} else if (i === $._values.length) cb("List.delete: no such element", null);
						} else cb("List.delete: hasn`t required arguments", null);
					}
				});
			} else cb("List.delete: hasn`t required arguments", null);
			return $;
		},
		read: function(args, cb) {
			var $ = this;
			var args = args || {};
			var cb = cb || function() {};
			fs.readFile($._path, "utf8", function(err, data) {
				if (err) {
					cb("List.init: can`t read file", null);
				} else {
					$._values = JSON.parse(data) || [];
					cb(null, true);
				};
			});
		},
		init: function(args, cb) {
			var $ = this;
			var args = args || {};
			var cb = cb || function() {};
			$._path = args.path || null;
			$._alias = args.alias || 'Untitled';
			if ($._path) {
				$.read({}, function(err, res) {
					cb(err, res);
				});
			} else cb("List.delete: invalid path", null);
			return $;
		},
		save: function(args, cb) {
			var $ = this;
			var args = args || {};
			var cb = cb || function() {};
			fs.writeFile($._path, JSON.stringify($._values), function(err) {
				if (err) {
					console.log(err);
					cb("List.save: can`t write to file", null);
				} else cb(null, true);
			});
			return $;
		},
		get: function(args, cb) {
			var $ = this;
			var args = args || {};
			var cb = cb || function() {};
			cb(null, $._values);
		}
	}

	return Class;

})();

module.exports = List;
