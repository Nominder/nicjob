"use strict";


var TYPES = {
	'undefined'        : 'undefined',
	'number'           : 'number',
	'boolean'          : 'boolean',
	'string'           : 'string',
	'[object Function]': 'function',
	'[object RegExp]'  : 'regexp',
	'[object Array]'   : 'array',
	'[object Date]'    : 'date',
	'[object Error]'   : 'error'
},
TOSTRING = Object.prototype.toString;
function type(o) {
	return TYPES[typeof o] || TYPES[TOSTRING.call(o)] || (o ? 'object' : 'null');
};


function coolDate(e) {
	var d = new Date(e||new Date);
	return +(d.getFullYear().toString()+((d.getMonth()+1) < 10 ? "0"+(d.getMonth()+1).toString() : (d.getMonth()+1).toString())+(d.getDate() < 10 ? "0"+d.getDate().toString() : d.getDate().toString()));
}

function hotDate(e) {
	var t = e.toString().match(/([0-9]+)([0-9]{2})([0-9]{2})$/);
	return !t ? t : new Date(+t[1],--t[2],+t[3]);
}

function coolDateTime(e) {
	var d = new Date(e||new Date);
	return +(
		d.getFullYear().toString()+
		((d.getMonth()+1) < 10 ? "0"+(d.getMonth()+1).toString() : (d.getMonth()+1).toString())+
		(d.getDate() < 10 ? "0"+d.getDate().toString() : d.getDate().toString()) +
		(d.getHours() < 10 ? "0"+d.getHours().toString() : d.getHours().toString()) +
		(d.getMinutes() < 10 ? "0"+d.getMinutes().toString() : d.getMinutes().toString()) +
		(d.getSeconds() < 10 ? "0"+d.getSeconds().toString() : d.getSeconds().toString())
	);
}

function hotDateTime(e) {
	var t = e.toString().match(/([0-9]+)([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})$/);
	return new Date(+t[1],--t[2],+t[3],+t[4],+t[5],+t[6]);
}

function clone(obj) {
	if(obj == null || typeof(obj) != 'object')
		return obj;
	if(obj.constructor == Array) 
		return obj.map(function(e,i) {return clone(e);});
	if(obj instanceof Date)
		return coolDate(obj);
	var temp = {};
	for(var key in obj) 
		key.substring(0,2) != "$$" ? temp[key] = clone(obj[key]) : false;
	return temp;
}

function dataURItoBlob(dataURI) {
	// convert base64/URLEncoded data component to raw binary data held in a string
	var byteString;
	if (dataURI.split(',')[0].indexOf('base64') >= 0)
		byteString = atob(dataURI.split(',')[1]);
	else
		byteString = unescape(dataURI.split(',')[1]);
	// separate out the mime component
	var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
	// write the bytes of the string to a typed array
	var ia = new Uint8Array(byteString.length);
	for (var i = 0; i < byteString.length; i++) {
		ia[i] = byteString.charCodeAt(i);
	}
	return new Blob([ia], {type:mimeString});
}
