"use strict";

var accountCtrl = new(require('../controllers/account.js'))();

var $ = function(args, cb) {
	var $ = this; var args = args || {}; var cb = cb || function() {};

	return $;
}


module.exports = $;