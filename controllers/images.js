"use strict";

var gm = require('gm').subClass({ imageMagick: true });
var fs = require('fs');
var path = require('path');

var genId = function() {
	return (new Date).getTime().toString() + Math.random().toString().substring(2);
}

var Images = (function() {
	var $ = function() {

	}
	$.prototype = {
		init: function(args, cb) {
			var $ = this; var args = args || {}; var cb = cb || function() {};
			$.__path = path.join(__dirname, args.path || args.dir || args.folder || args.directory || '../images/');
			$.__sizes = args.sizes || [50, 150, 320, 480];
			$.__label = args.label || 'Flash_X';
			return $;
		},
		create: function(args, cb) {
			var $ = this; var args = args || {}; var cb = cb || function() {};
			var id = genId();
			var _path = args.path;
			var i = $.__sizes.length;
			gm(_path).drawText(30, 20, $.__label).write(path.join($.__path, id + '_thumb_original'), function(err) {
				if(err) console.warn(err);
				$.__sizes.forEach(function(size) {
					gm(_path).resize(size).write(path.join($.__path, id + '_thumb_'+size), function(err) {
						if(!--i) {
							fs.unlinkSync(_path);
							cb(null, id);
						}
						if(err) console.warn(err);
					});
				});
			});
			return $;
		},
		getPath: function(args, cb) {
			var $ = this; var args = args || {}; var cb = cb || function() {};
			var id = args.id || args.picture || args.pic || args.img || args.image;
			var size = args.size || 'original';
			var _path = path.join($.__path, id + '_thumb_'+size);
			fs.exists(_path, function(e) {
				cb(e?null:"none", e?_path:null);
				
			})
			return $;
		}
	}
	return $;
})();



module.exports = Images;