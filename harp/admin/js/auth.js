function asin() {
	var email = document.querySelector('.mail').value;
	var pass = document.querySelector('.pass').value;
	post("/openapi/1.0/account/asin", {
		email: email,
		passwd: pass
	}, function(data) {
		var res = JSON.parse(data).result;
		if (res.auth)
			location.href = '/admin/';
		else
			location.href = '/admin/auth.html';
	});
};

function check() {
	sendTextNew('/api/1.0/account/sessionGet', '', function(res) {
		var res = JSON.parse(res).result;
		if (res && (res.type === "admin" || res.type === "moder")) location.href = '/admin/';
	});
};
