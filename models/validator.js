"use strict"

var $ = (function() {

	var $ = function() {}

	$.prototype = {
		/**
		 * Инициализация происходит в наследуемом классе
		 */
		_fields: {}, // объект конфигов
		_lists: {}, // объект листов
		init: function(args, cb) {
			var $ = this,
				args = args || {},
				cb = cb || function() {};
			$._fields = args.fields || {};
			$._lists = args.lists || {};
			return $;
		},
		_exec: function(args) {
			var $ = this,
				args = args || {},
				cb = cb || function() {},
				object = args.object || {},
				_object = {},
				field = args.field;
			$._fields[field].sub.forEach(function(e) {
				var model = $._fields[e];
				if (model && e.search('@') === -1) {
					switch (model.type) {
						case 'string':
							_object[e] = object[e];
							if (typeof object[e] !== 'string')
								_object[e] = model.value;
							else if (model.max && object[e].length > model.max) {
								_object[e] = '';
								for (var k = 0; k < model.max; k++)
									_object[e][k] += object[e][k];
							}
							delete object[e];
							break;
						case 'number':
							console.log('number: ', e, object[e], (typeof object[e]), object[e], model.value)
							_object[e] = parseInt(object[e]);
							if (typeof object[e] == 'undefined' || typeof object[e] == 'null') {
								console.log('numberA: ', e, object[e], (typeof object[e]), model.value)
								_object[e] = parseInt(model.value);
							} else if (model.max && object[e] > model.max) {
								console.log('numberB: ', e, object[e], (typeof object[e]), model.value)
								_object[e] = parseInt(model.max);
							}
							delete object[e];
							break;
						case 'boolean':
							_object[e] = object[e];
							if (typeof object[e] !== 'boolean')
								_object[e] = model.value;
							delete object[e];
							break;
						case 'list':
							_object[e] = object[e];
							var list = $._lists[e],
								id = object[e];
							//if(e == 'period') console.log('list: ', e, list, (typeof object[e]), 'DATA: ', object[e]) // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
							if (id) {
								list.find({
									id: id
								}, function(err, res) {
									//console.log(':::::::::::::::::  ', e, res)
									if ((err || res.length === 0) && model.ext) {
										var _data = id.split('&');
										list.add({
											title: _data[0],
											index: _data[1]
										}, function(err, res) {
										});
									}
									else if (err || res.length === 0) {
										_object[e] = model.value;
									}
								});
							} else _object[e] = model.value;
							delete object[e];
							break;
						case 'array':
							_object[e] = object[e];
							if (!(typeof object[e] === 'object' && object[e] instanceof Array))
								_object[e] = model.value;
							else {
								_object[e].forEach(function(_e, index) {
									if (!model.maxCount || index < model.maxCount) {
										switch (model.array) {
											case 'string':
												if (typeof _e !== 'string')
													_object[e][index] = model.value;
												else if (model.max && _e.length > model.max) {
													_object[_e][index] = '';
													for (var k = 0; k < model.max; k++)
														_object[e][index][k] += object[e][index][k];
												}
												break;
											case 'number':
												if (typeof _e !== 'number')
													_object[e][index] = model.value;
												else if (model.max && _e > model.max)
													_object[e][index] = model.max;
												break;
											case 'boolean':
												if (typeof _e !== 'boolean')
													_object[e][index] = model.value;
												break;
											case 'list':
												var list = $._lists[e],
													id = object[e][index] || '';
												list.find({
													id: id
												}, function(err, res) {
													if ((err || res.length === 0) && model.ext) {
														var _data = id.split('&');
														list.add({
															title: _data[0],
															index: _data[1]
														}, function(err, res) {
														});
													}
													else if (err || res.length === 0) _object[e][index] = model.value;
												});
												break;
											default:
												_object[e] = model.value;
										}
									}
								});
							}
							delete object[e];
							break;
						case 'objectArray':
							_object[e] = object[e];
							if (!(typeof object[e] === 'object' && object[e] instanceof Array))
								_object[e] = model.value;
							else {
								_object[e].forEach(function(_e, index) {
									if (!model.maxCount || index < model.maxCount) {
										if (typeof object[e][index] !== 'object' || !object[e][index])
											_object[e].splice(index, 1);
										else {
											for (var k in _e) {
												var tmp = !0;
												model.sub.forEach(function(_e) {
													if (k === _e) tmp = !1;
												})
												if (tmp) delete _object[e][index][k];
											}
										}
										_object[e][index] = $._exec({
											object: _object[e][index],
											field: e
										});
									}
								});
							}
							delete object[e];
							break;
						case 'object':
							_object[e] = object[e];
							if (typeof object[e] !== 'object' || object[e] instanceof Array || !object[e])
								_object[e] = model.value;
							else {
								for (var k in object[e]) {
									var tmp = !0;
									model.sub.forEach(function(_e) {
										if (k === _e) tmp = !1;
									})
									if (tmp) {
										delete _object[e][k];
									}
								}
							}
							_object[e] = $._exec({
								object: _object[e],
								field: e
							});
							delete object[e];
							break;
					}
				}
			});
			var normal = false;
			$._fields[field].sub.forEach(function(e) {
				if (e.search('@') !== -1) normal = true;
			});
			if (normal) {
				var model = $._fields['@'];
				for (var e in object) {
					switch (model.type) {
						case 'string':
							if (typeof object[e] !== 'string' || model.max && object[e].length > model.max)
								break;
							_object[e] = object[e];
							break;
						case 'number':
							if (typeof object[e] !== 'number' || model.max && object[e] > model.max)
								break;
							_object[e] = object[e];
							break;
						case 'boolean':
							if (typeof object[e] !== 'boolean')
								break;
							_object[e] = object[e];
							break;
						case 'list':
							var list = $._lists[e];
							var normal = true;
							list.find({
								id: object[e]
							}, function(err, res) {
								if ((err || res.length === 0) && ext) list.add({
									title: object[e]
								}, function(err, res) {});
								else if (err || res.length === 0) normal = false;
							});
							if (normal) _object[e] = object[e];
							break;
						case 'array':
							if (!(typeof object[e] === 'object' && object[e] instanceof Array))
								break;
							else {
								object[e].forEach(function(_e, index) {
									if (!model.maxCount || index < model.maxCount) {
										switch (model.array) {
											case 'string':
												if (typeof _e !== 'string' || model.max && _e.length > model.max)
													object[e].splice(index, 1);
												break;
											case 'number':
												if (typeof _e !== 'number' || model.max && _e > model.max)
													object[e].splice(index, 1);
												break;
											case 'boolean':
												if (typeof _e !== 'boolean')
													object[e].splice(index, 1);
												break;
											case 'list':
												var list = $._lists[e];
												list.find({
													id: object[e]
												}, function(err, res) {
													if (err && ext) list.add({
														title: object[e]
													}, function(err, res) {});
													else if (err)
														object[e].splice(index, 1);
												});
												break;
											default:
												object[e].splice(index, 1);
										}
									}
								});
							}
							_object[e] = object[e];
							break;
						case 'objectArray':
							if (!(typeof object[e] === 'object' && object[e] instanceof Array))
								break;
							else {
								object[e].forEach(function(_e, index) {
									if (!model.maxCount || index < model.maxCount) {
										if (typeof object[e][index] !== 'object' || !object[e][index])
											object[e].splice(index, 1);
										else {
											for (var k in _e) {
												var tmp = !0;
												model.sub.forEach(function(_e) {
													if (k === _e || _e.search('@') === -1) tmp = !1;
												})
												if (tmp) delete object[e][index][k];
											}
										}
										object[e][index] = $._exec({
											object: object[e][index],
											field: e
										});
									}
								});
							}
							_object[e] = object[e];
							break;
						case 'object':
							if (typeof object[e] !== 'object' || object[e] instanceof Array || !object[e])
								break;
							else {
								for (var k in object[e]) {
									var tmp = !0;
									model.sub.forEach(function(_e) {
										if (k === _e || _e.search('@') === -1) tmp = !1;
									})
									if (tmp)
										delete object[e][k];
								}
							}
							object[e] = $._exec({
								object: object[e],
								field: e
							});
							_object[e] = object[e];
							break;
					}
				}
			}
			return _object;
		},
		/**
		 * Функция валидирует объект, изменяя неправильные поля, удаляя ненужные и добавляя недостающие.
		 * Рекурссивно вызывается функция $._exec()
		 */
		build: function(args, cb) {
			var $ = this,
				args = args || {},
				cb = cb || function() {},
				object = args.object || {}, // объект для валидации
				type = args.type || '', // "тип профиля(competitor, team, employer), если отсутствует - значит вакансия";
				field = '';
			switch (type) {
				case 'admin':
				case 'moder':
				case 'competitor':
					field = 'competitorProfile';
					break;
				case 'team':
					field = 'teamProfile';
					break;
				case 'employer':
					field = 'employerProfile';
					break;
				case 'vacansy':
					field = 'vacansy';
					break;
				default:
					cb('models.validator.build: Invalid type', null);
					return $;
			}
			object = $._exec({
				object: object,
				field: field
			});
			cb(null, object);
			return $;
		},
		get: function(args, cb) {
			var $ = this,
				args = args || {},
				cb = cb || function() {};
			cb(null, $, _fields);
			return $;
		}

	}

	return $;
})();

module.exports = $;
