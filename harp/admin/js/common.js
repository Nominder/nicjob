'use strict';


function coolDate(e) {
	var d = new Date(e||new Date);
	return +(d.getFullYear().toString()+((d.getMonth()+1) < 10 ? "0"+(d.getMonth()+1).toString() : (d.getMonth()+1).toString())+(d.getDate() < 10 ? "0"+d.getDate().toString() : d.getDate().toString()));
}

function hotDate(e) {
	var t = e.toString().match(/([0-9]+)([0-9]{2})([0-9]{2})$/);
	return !t ? t : new Date(+t[1],--t[2],+t[3]);
}

function years(d) {
	var p = function(n) {
		var m=n%10, l=n%100; return n + ' ' + (((m==1)&&(l!=11))?'год':(((m==2)&&(l!=12)||(m==3)&&(l!=13)||(m==4)&&(l!=14))?'года':'лет'))
	}
	function b(birth) {
		var now = new Date(),
		age = now.getFullYear() - birth.getFullYear();
		return now.setFullYear(1972) < birth.setFullYear(1972) ? age - 1 : age;
	}
	return p(b(d));
}


var Admin = (function() {
	var $ = function() {};
	$.prototype = {
		_lists: [],
		init: function() {
			var $=this,args=arguments[0]||{},cb=arguments[1]||function(){};
			
			return $;
		},
		loadLists: function() {
			var $=this,args=arguments[0]||{},cb=arguments[1]||function(){};
			jQuery.get('/api/0.1/moder/lists/getAll', {}, function(e) {
				$._lists = e.result;
			});
			return $;
		},
		getFromList: function(name, id) {
			var list = this._lists[name]||{};
			var res = list._values.filter(function(e) {
				return e.id == id;
			});
			return res.length ? res[0] : {};
		},
		loadProfiles: function() {
			var $=this,args=arguments[0]||{},cb=arguments[1]||function(){};
			jQuery.get('/openapi/0.1/account/profileFind', {
				query:JSON.stringify({type:'competitor'}),
				page: 0
			}, function(e) {
				var profiles = (e.result||[]).map(function(e) {
					var industry = e.profile.industryPost.length ? $.getFromList('industry', e.profile.industryPost[0].industry) : {};
					industry = industry.title ? industry.title + ' ' : '';
					console.log(e);
					return {
						id: e.id,
						name: e.profile.info.firstname+' '+e.profile.info.lastname,
						years: years(hotDate(e.profile.info.birthday)),
						post: industry,
						locating: e.profile.contacts.city,
						image: e.profile.images[0] ? e.profile.images[0].image : ''
					};
				});
				jQuery( "#resume-acc" ).html(
					jQuery("#resume-tmpl").render(profiles)
				);
			});
			return $;
		},
		loadVacansy: function() {
			var $=this,args=arguments[0]||{},cb=arguments[1]||function(){};
			jQuery.get('/openapi/0.1/account/vacansyFind', {
				query:JSON.stringify({}),
				page: 0
			}, function(e) {
				var vacansies = (e.result||[]).map(function(e) {
					var industry = $.getFromList('industry', e.vac_industryPost.industry);
					industry = industry.title ? industry.title + ' ' : ''
					console.log(e.emp_id);
					return {
						id: e._id,
						emp: e.emp_id,
						name: e.name,
						company: e.emp_profile.company.name,
						post: industry + e.vac_industryPost.post,
						locating: e.locating.city,
						image: e.emp_profile.company.logo
					};
				});
				jQuery( "#vacancy-acc" ).html(
					jQuery("#vacansy-tmpl").render(vacansies)
				);
			});
			return $;
		},
		blockAccount: function() {
			var $=this,args=arguments[0]||{},cb=arguments[1]||function(){};
			var id = args.id;
			console.log(id);
			jQuery.ajax({
				url: '/api/0.1/admin/account/ban',
				dataType: 'json',
				contentType: "application/json;charset=UTF-8",
				type: 'POST',
				data: '{"id":"'+id+'"}',
				success: function(e) {
					console.debug(e);
				}
			});
			return $;
		},
		unblockAccount: function() {
			var $=this,args=arguments[0]||{},cb=arguments[1]||function(){};
			var id = args.id;
			console.log(id);
			jQuery.ajax({
				url: '/api/0.1/admin/account/unban',
				dataType: 'json',
				contentType: "application/json;charset=UTF-8",
				type: 'POST',
				data: '{"id":"'+id+'"}',
				success: function(e) {
					console.debug(e);
				}
			});
			return $;
		},
		openProfile: function(id) {
			jQuery.ajax({
				url: '/openapi/0.1/account/profileGetById',
				dataType: 'json',
				contentType: "application/json;charset=UTF-8",
				type: 'POST',
				data: '{"id":"'+id+'"}',
				success: function(e) {
					console.log(e);
					var profile = {
						firstname: e.result.info.firstname,
						lastname: e.result.info.lastname,
						middlename: e.result.info.middlename,
						date: hotDate(e.result.info.birthday).toISOString().substr(0,10),
						images: e.result.images
					};
					jQuery( "#modal-body" ).html(
						jQuery("#profile-tmpl").render(profile)
					);
					jQuery('#myModal').modal('toggle');
				}
			});
		},
		openVacansy: function(id, emp) {
			jQuery.ajax({
				url: '/openapi/0.1/account/vacansyGetById',
				dataType: 'json',
				contentType: "application/json;charset=UTF-8",
				type: 'POST',
				data: '{"id": "'+emp+'", "vacansyId": "'+id+'"}',
				success: function(e) {
					console.log(e);
					jQuery( "#modal-body" ).html(
						jQuery("#vac-tmpl").render(e.result.vacansy)
					);
					jQuery('#myModal').modal('toggle');
				}
			});
		}
	};
	return $;
})();



var admin = new Admin();


jQuery(function() {
	admin.loadLists();
	jQuery( "#resume-acc-btn" ).click(function() { admin.loadProfiles() });
	jQuery( "#vacansy-acc-btn" ).click(function() { admin.loadVacansy() });
});


















