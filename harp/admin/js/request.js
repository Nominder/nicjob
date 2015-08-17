function sendTextNew(path, txt, cb) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', path, true);
	xhr.onload = function(e) {
		if (this.status == 200) {
			cb(this.response);
		};
	};
	xhr.send(txt);
};

function post(path, data, cb) {
	var boundary = String(Math.random()).slice(2);
	var boundaryMiddle = '--' + boundary + '\r\n';
	var boundaryLast = '--' + boundary + '--\r\n'

	var body = ['\r\n'];
	for (var key in data) {
		body.push('Content-Disposition: form-data; name="' + key + '"\r\n\r\n' + data[key] + '\r\n');
	}
	body = body.join(boundaryMiddle) + boundaryLast;

	var xhr = new XMLHttpRequest();
	xhr.open('POST', path, true);
	xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);
	xhr.onreadystatechange = function() {
		if (this.readyState != 4) return;
		cb(this.responseText);
	}
	xhr.send(body);
};
