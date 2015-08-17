"use strict";

var menuCtrl = function ($rootScope, $http, $location) {
	
	$rootScope.reg = {
		email: "",
		passwd: "",
		passwd2: "",
		type: "competitor"
	}
	$rootScope.login = {
		email: "",
		passwd: ""
	}
	$rootScope.confirmEmail = {
		email: ""
	}
	$rootScope.errors = [];
	$rootScope.removeError = function(id) {
		return $rootScope.errors.splice(id||0,1);
	}
	$rootScope.addError = function(title, description) {
		if(typeof description == "number") description = $rootScope.Errors[description];
		$rootScope.errors.push({title:title, description:description});
	}
	$rootScope.signup = function() {
		if(!$rootScope.reg.email || !$rootScope.reg.email.length) {
			$rootScope.addError(
				"Не достаточно данных.",
				"Укажите свой email."
			);
		} else if($rootScope.reg.passwd.length < 3) {
			$rootScope.addError(
				"Проблема с паролем.",
				"Пароль должен быть не короче трёх символов."
			);
		} else if($rootScope.reg.passwd !== $rootScope.reg.passwd2) {
			$rootScope.addError(
				"Будьте внимательней!",
				"Пароли должны совпадать."
			);
		} else {
			jQuery.loader.show();
			$http.post("/openapi/0.1/account/signup", $rootScope.reg).success(function(data) {
				console.warn(data);
				if(!data.error) {
					$rootScope.addError(
						"Поздравляю!",
						"Ваш аккаунт зарегистрирован, проверьте Вашу почту ("+data.result.email+"), и перейдите по ссылке, спасибо."
					);
					$rootScope.reg = {};
					$('.ng-modal').hide(500);
				} else {
					$rootScope.addError("Ошибка", +data.error);
				}
				jQuery.loader.hide();
			}).error(function(data) {
				console.log("error", data);
				jQuery.loader.hide();
			});
		}
	}
	$rootScope.signin = function() {
		if(!$rootScope.login.email || !$rootScope.login.email.length) {
			$rootScope.addError(
				"Не достаточно данных.",
				"Укажите свой email."
			);
		} else if(!$rootScope.login.passwd || !$rootScope.login.passwd.length) {
			$rootScope.addError(
				"Не достаточно данных.",
				"Укажите свой пароль."
			);
		} else {
			jQuery.loader.show();
			var result = $http.post("/openapi/0.1/account/signin", $rootScope.login);
			result.success(function(data) {
				if(data.error) {
					$rootScope.addError("Ошибка", +data.error);
				} else {
					$rootScope.account.auth = true;
					$rootScope.account.email = data.result.email;
					$rootScope.account.type = data.result.type;
					$rootScope.account.id = data.result.id;
					localStorage.account = JSON.stringify($rootScope.account);
					$rootScope.login = {};
					$('.ng-modal').hide(500);
					$location.path('/Office');
					console.warn(data);
				}
				jQuery.loader.hide();
			});
			result.error(function(data) {
				console.log("error", data);
				jQuery.loader.hide();
			});
		}
	}
	$rootScope.confirm = function() {
		if(!$rootScope.confirmEmail.email || !$rootScope.confirmEmail.email.length) {
			$rootScope.addError(
				"Не достаточно данных.",
				"Укажите свой email."
			);
		} else {
			jQuery.loader.show();
			$http.post("/openapi/0.1/account/updatePasswd", {email:$rootScope.confirmEmail.email}).success(function(data) {
				$rootScope.addError(
					"Готово!",
					"Новый пароль выслан на указанный email."
				);
				$rootScope.confirmEmail.email = "";
				$('.ng-modal').hide(500);
				jQuery.loader.hide();
			}).error(function(data) {
				console.warn(data);
			});
		}
	}
	$rootScope.signout = function() {
		jQuery.loader.show();
		$http.post("/api/1.0/account/signout").success(function(data) {
			console.warn(data);
			$rootScope.account.auth = false;
			$rootScope.account.email = "";
			$rootScope.account.id = "";
			localStorage.account = JSON.stringify($rootScope.account);
			$location.path("/");
			jQuery.loader.hide();
		}).error(function(data) {
			console.warn(data);
		});
	}
	$rootScope.signinForm = function() {
		$('.ng-modal').toggle(500);
	}
	/*
	var User = $resource("/api/1.0/account/:action", paramDefaults, actions)
	$rootScope.user 
	$rootScope.test = 222;
	*/
}


