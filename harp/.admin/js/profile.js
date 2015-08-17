function showProfile() {
	sendTextNew('/openapi/1.0/account/sessionGet', '', function(res) {
		var res = JSON.parse(res).result;
		if (!res || (res.type !== "admin" && res.type !== "moder")) location.href = '/admin/auth.html';
		else {
			document.querySelector('.avatar').setAttribute('src', "http://robohash.org/" + Math.round((Math.random() * 10)) + ".png?set=set3");
			document.querySelector('.type').innerHTML = ((res.type === "admin") ? 'Администатор портала' : 'Модератор портала');
			sendTextNew('/api/1.0/account/profileGet', '', function(res1) {
				var res1 = JSON.parse(res1).result;
				document.querySelector('.fio').innerHTML = res1.info.firstname + ' ' + res1.info.middlename + ' ' + res1.info.lastname + ' <h5 class="mail"></h5>';
				document.querySelector('.about').innerHTML = res1.about;
				document.querySelector('.mail').innerHTML = res.email;
			});
		}
	});
};

function edit() {
	sendTextNew('/openapi/1.0/account/sessionGet', '', function(res) {
		var res = JSON.parse(res).result;
		if (!res || (res.type !== "admin" && res.type !== "moder")) location.href = '/admin/auth.html';
		else {
			sendTextNew('/api/1.0/account/profileGet', '', function(res1) {
				var res1 = JSON.parse(res1).result;
				document.querySelector('.firstname').value = res1.info.firstname
				document.querySelector('.middlename').value = res1.info.middlename
				document.querySelector('.lastname').value = res1.info.lastname;
				document.querySelector('.eabout').value = res1.about;
				document.querySelector('.minfo').innerHTML = 'Изменить email (' + res.email + ')';
			});
		}
	});
};

function update() {
	sendTextNew('/openapi/1.0/account/sessionGet', '', function(res) {
		var res = JSON.parse(res).result;
		if (!res || (res.type !== "admin" && res.type !== "moder")) location.href = '/admin/auth.html';
		else {
			sendTextNew('/api/1.0/account/profileGet', '', function(res1) {
				var res1 = JSON.parse(res1).result;
				var profile = {
					about: document.querySelector('.eabout').value,
					info: {
						firstname: document.querySelector('.firstname').value,
						middlename: document.querySelector('.middlename').value,
						lastname: document.querySelector('.lastname').value
					}
				}
				var changes = {};
				var nrm = false;
				if (document.querySelector('.firstname').value !== res1.info.firstname || document.querySelector('.middlename').value !== res1.info.middlename || document.querySelector('.lastname').value !== res1.info.lastname || document.querySelector('.eabout').value !== res1.about) {
					post('/api/1.0/account/profileUpdate', {changes: JSON.stringify(profile)}, function(data) {
						showProfile();
					});
				}				
				if (document.querySelector('.email1').value === document.querySelector('.email2').value && document.querySelector('.email1').value !== res.email && document.querySelector('.email1').value !== '') {
					changes['email'] = document.querySelector('.email1').value;
					nrm = true;
				}
				if (document.querySelector('.pass1').value === document.querySelector('.pass2').value && document.querySelector('.pass1').value !== '') {
					changes['password'] = document.querySelector('.pass1').value;
					nrm = true;
				}
				if (nrm) {
					post('/api/1.0/account/update', {changes: JSON.stringify(changes)}, function(data) {
						document.querySelector('.pass1').value = '';
						document.querySelector('.pass2').value = '';
						document.querySelector('.email1').value = '';
						document.querySelector('.email2').value = '';
						showProfile();
					});
				}
			});
		}
	});
};

function asout() {
	$.post('/api/1.0/account/signout');
	location.href = '/admin/auth.html';
};
