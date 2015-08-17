function showLists() {
	sendTextNew('/api/0.1/moder/lists/getAll', '', function(res) {
		var lists = JSON.parse(res)['result'];
		var html = '';
		for (var i in lists)
			html += '<a hrefs="#' + i + '" class="list-group-item" onclick="showList(\'' + i + '\', \'' + lists[i]._alias + '\')">' + lists[i]._alias + '</a>';
		document.querySelector('.lists').innerHTML = html;
	});
};

function addValue(name, title) {
	sendTextNew('/api/0.1/list/' + name + '/add?title=' + title, '', function(res) {});
};

function removeValue(name, title) {
	sendTextNew('/api/0.1/list/' + name + '/remove?title=' + title, '', function(res) {});
};

function updateValue(name, title, new_title) {
	sendTextNew('/api/0.1/list/' + name + '/update?title=' + title + '&new_title=' + new_title, '', function(res) {});
};

function setUpdate(name, title, alias) {
	document.querySelector('.updateValue123').setAttribute('onclick', "updateValue(\'" + name + "\', '" + title + "', document.querySelector(\'.value1\').value); showList(\'" + name + "\', \'" + alias + "\')");
};

function showList(name, alias) {
	sendTextNew('/api/0.1/list/' + name + '/get', '', function(res) {
		var list = JSON.parse(res)['result'];
		var html = '<li class="list-group-item" style="font-weight: bold">Элементы списка "' + alias + '"<i class="fa fa-plus" style="float: right; cursor: pointer" data-toggle="modal" data-target="#modal"></i></li>';
		document.querySelector('.addValue').setAttribute('onclick', "addValue('" + name + "', document.querySelector('.value').value); showList('" + name + "', '" + alias + "'); document.querySelector('.value').value=''");
		list.forEach(function(e) {
			html += '<li class="list-group-item">' + e.title + '<i class="fa fa-close" style="float: right; cursor: pointer" onclick="removeValue(\'' + name + '\', \'' + e.title + '\'); showList(\'' + name + '\', \'' + alias + '\');"></i><i class="fa fa-edit" style="padding-right: 10px; float: right; cursor: pointer" data-toggle="modal" data-target="#modal1" onclick="document.querySelector(\'.value1\').value=\'' + e.title + '\'; setUpdate(\'' + name + '\', \'' + e.title + '\', \'' + alias + '\')"></i></li>';
		});
		document.querySelector('.list').innerHTML = html;
	});
};
