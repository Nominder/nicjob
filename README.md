project01
=========

## Errors

```json

{
	"1": "Can not find data",
	"2": "Account with such email has been exist yet",
	"3": "Invalid type of account",
	"4": "Can not save data",
	"5": "Invalid email",
	"6": "Invalid password, does not contain different cases",
	"7": "Invalid password, does not contain numbers",
	"8": "Invalid password, contain less then 3(three) symbols",
	"9": "Does not have arguments",
	"10": "Incorrect password",
	"11": "Does not have such account",
	"12": "Cannot update account",
	"13": "Invalid types",
	"14": "Does not have such param in list",
	"15": "Too big data",
	"16": "No such file",
	"17": "Invalid email or password"
}

```


## Specification API

### account

**account.signup**

-----------

POST /openapi/:version/account/signup

```
in: {
	type: String,
	email: String,
	passwd: String
}
```

```
out: {
	error: String,
	result: {
		id: String,
		email: String
	}
}
```

**account.signin**

-----------

POST /openapi/:version/account/signin

```
in: {
	email: String,
	passwd: String
}
```

```
out: {
	error: String,
	result: {
		id: String,
		email: String
	}
}
```

**account.signout**

-----------

POST /api/:version/account/signout

```
in: {}
```

```
out: {
	error: String,
	result: Boolean
}
```

### account.checkAuth

-----------

GET /openapi/:version/account/sessionGet

```
in: {}
```

```
out: {
	error: String,
	result: {
		id: String,
		email: String,
		type: String,
		auth: Boolean
	}
}
```

**account.checkEmail**

-----------

GET /openapi/:version/account/checkEmail

```
in: {
	email: String
}
```

```
out: {
	error: String,
	result: Boolean
}
```

**account.getById**

-----------

POST /api/:version/account/getById

```
in: {
	id: String
}
```

```
out: {
	error: String,
	result: {
		id: String
		type: String,
		email: String,
		banned: Boolean
	}
}
```

**account.get**

-----------

GET /api/:version/account/get

```
in: {}
```

```
out: {
	error: String,
	result: Object
}
```

**account.update**

-----------

POST /api/:version/account/update

```
in: {
	changes: Array
}
```

```
out: {
	error: String,
	result: {
		id: String,
		email: String
	}
}
```

**account.updatePasswd**

-----------

POST /openapi/:version/account/updatePasswd

```
in: {
	email: String
}
```

```
out: {
	error: String,
	result: Boolean
}
```

### profile

**profile.find**

-----------

POST /openapi/:version/account/profileFind

```
in: {
	query: {
			type: String,
			industry: String,
			education: String,
			part: String,
			language: String,
			country: String,
			images: Boolean,
			videos: Boolean,
			bithdayMin: Number,
			birthdayMax: Number,
			summMin: Number,
			summMax: Number,
			period: String
		},
	page: Number
}
```

```
out: {
	error: String,
	result: {
		id: String,
		profile: Object //without contacts
	}
}
```

-----------

**profile.update**

POST /api/:version/account/profileUpdate

```
in: {
	changes: {}
}
```

```
out: {
	error: String,
	result: {
		id: String,
		email: String
	}
}
```

**profile.getById**

-----------

POST /openapi/:version/account/profileGetById

```
in: {
	id: String
}
```

```
out: {
	error: String,
	result:	Object //without contacts
}
```

**profile.get**

-----------

GET /api/:version/account/profileGet

```
in: {}
```

```
out: {
	error: String,
	result: Object
}
```

### vacansy

**vacansy.find**

-----------

POST /openapi/:version/account/vacansyFind

```
in: {
	query:  {
			industry: String,
			post: String,
			education: String,
			part: String,
			country: String,
			city: String,
			summMin: Number,
			summMax: Number,
			period: String,
			experience: Number,
			individual: Boolean
		},
	page: Number
}
```

```
out: {
	error: String,
	result: {
		id: String,
		vacansy: Array
	}
}
```

-----------

**vacansy.update**

POST /api/:version/account/vacansyUpdate

```
in: {
	changes: Array
}
```

```
out: {
	error: String,
	result: {
		id: String,
		email: String
	}
}
```

**vacansy.getById**

-----------

POST /openapi/:version/account/vacansyGetById

```
in: {
	id: String
}
```

```
out: {
	error: String,
	result: Array
}
```

**vacansy.get**

-----------

GET /api/:version/account/vacansyGet

```
in: {}
```

```
out: {
	error: String,
	result: Array
}
```

**vacansy.add**

-----------

POST /api/:version/account/vacansyAdd

```
in: {
	vacansy: Object
}
```

```
out: {
	error: String,
	result: Object
}
```
### list

GET /openapi/:version/list/:name/:type

```
in: {
	title: String,
	index: String,
	id: String
}
```

```
out: {
	
}
```
```
methods: find, findByTitle, findByIndex, findById, get
```
---------------------------------------------------

GET /api/:version/list/:name/:type

```
in: {
	title: String,
	index: String,
	id: String
}
```

```
out: {
	
}
```

```
adminMethods: add, remove
methods: find, findByTitle, findByIndex, findById, get
```

---------------------------------------------------------

### data

GET /openapi/:version/data/getFileds

```
in: {}
```

```
out: {
	error: String,
	result: Object
}
```
---------------------------------------------------

GET /openapi/:version/data/getErrors

```
in: {}
```

```
out: {
	error: String,
	result: Object
}
```
---------------------------------------------------

### media

GET /api/:version/media/upload

```
in: {}
```

```
out: {
	error: String,
	result: {
		upload: String,
		progress: String
	}
}
```
-----------------------------------------------------

GET /api/:version/media/progress

```
in: {
	url: String
}
```

```
out: {
	// server response
}
```
-----------------------------------------------------

GET /api/:version/media/get

```
in: {
	code: String
}
```

```
out: {
	error: String,
	result: {
		// полный ответ, как в примере в доках бумстрима
	}
}
```
-----------------------------------------------------
### images

POST /api/:version/images/create

```
in: {
	file: file
}
```

```
out: {
	error: String,
	result: String
}
```
-----------------------------------------------------

GET /openapi/:version/images/get

```
in: {
	id: String,
	size: String
}
```

```
out: {
	error: String,
	result: {
		file: file
	}
}
```
-----------------------------------------------------
### respond

POST /api/:version/respond/invite  //отправить приглашение на видео-собеседование

```
in: {
	comp_id: String, //id соискателя
	emp_id: String, //id нанимателя
	times: []  //max 3, варианты времени собеседования
}
```

```
out: {
	error: String,
	result: Object
}
```
-----------------------------------------------------

GET /api/:version/respond/get //назначеные собеседования аккаунта

```
in: {
	id: String //id аккаунта
}
```

```
out: {
	error: String,
	result: []
```

GET /api/:version/respond/getById //тут я думаю всё предельно понятно

```
in: {
	id: String //id собеседования
}
```

```
out: {
	error: String,
	result: {
		comp_id: String,
		emp_id: String,
		times: [],
		selectedTime,
		status: String
	}
```

POST /api/:version/respond/accept // принять приглашение

```
in: {
	id: String, //id собеседования
	time: String  //выбранное время собеседования
}
```

```
out: {
	error: String,
	result: Object
}
```

POST /api/:version/respond/decline //отклонить приглашение

```
in: {
	id: String // id собеседования
}
```

```
out: {
	error: String,
	result: Object
}
```
-----------------------------------------------------
POST /api/:version/respond/remove //удалить приглашение

```
in: {
	id: String // id собеседования
}
```

```
out: {
	error: String,
	result: Object
}
```
-----------------------------------------------------

GET /api/:version/respond/status //статус приглашения

```
in: {
	id: String // id собеседования
}
```

```
out: {
	error: String,
	result: String
}
```
-----------------------------------------------------

### WebRTC

getId

```
in: {}
```

```
out: String // id
```

startCall

```
in: {
	id: String,
	selector: String
}
```

```
out: {}
```

```
endCall() {...} // end call and close socket
```

init

```
in: {
	id: String, 
	mySelector: String, 
	selector: String,
	error: Function
}
```

```
out: {}
```

###black, watch lists

GET /api/:version/account/blacklistGet 

```
in: {
}
```

```
out: {
	error: String,
	result: [
		{
			id: 123,
			reason: ""
		},
		{}
	]
}
```
-----------------------------------------------------

GET /api/:version/account/watchlistGet 

```
in: {
}
```

```
out: {
	error: String,
	result: [
		"123",
		""
	]
}
```
-----------------------------------------------------

POST /api/:version/account/blacklistAdd 

```
in: {
	id: String,
	reason: String
}
```

```
out: {
	error: String,
	result: {
		id: "123",
		reason: ""
	}
}
```
-----------------------------------------------------

POST /api/:version/account/watchlistAdd 

```
in: {
	id: String
}
```

```
out: {
	error: String,
	result: "123"
}
```
-----------------------------------------------------

POST /api/:version/account/blacklistReamove 

```
in: {
	id: String
}
```

```
out: {
	error: String,
	result: {}
}
```
-----------------------------------------------------

POST /api/:version/account/watchlistRemove

```
in: {
	id: String
}
```

```
out: {
	error: String,
	result: {}
}
```
-----------------------------------------------------

### respond

POST /api/:version/respond/send  //откликнуться

```
in: {
	emp_id: String, //id нанимателя
	vac_id
}
```

```
out: {
	error: String,
	result: Object
}
```
-----------------------------------------------------

GET /api/:version/respond/get //назначеные собеседования аккаунта

```
in: {
	id: String //id аккаунта
}
```

```
out: {
	error: String,
	result: []
```

GET /api/:version/respond/getById //тут я думаю всё предельно понятно

```
in: {
	id: String //id собеседования
}
```

```
out: {
	error: String,
	result: Object
```

POST /api/:version/respond/accept // принять отклик

```
in: {
	id: String //id отклика
}
```

```
out: {
	error: String,
	result: Object
}
```

POST /api/:version/respond/decline //отклонить отклик

```
in: {
	id: String // id отклика
}
```

```
out: {
	error: String,
	result: Object
}
```
-----------------------------------------------------

GET /api/:version/respond/status //статус отклика

```
in: {
	id: String // id отклика
}
```

```
out: {
	error: String,
	result: String
}
```
-----------------------------------------------------

### phone confirm

POST /api/:version/account/confirmSend //отправка кода подтверждения

```
in: {
	phone: String
}
```

```
out: {
	error: String,
	result: Boolean
}
```

---------------------------------------------------------------------

POST /api/:version/account/confirmInput //ввод кода подтверждения	

```
in: {
	code: String
}
```

```
out: {
	error: String,
	result: Boolean
}
```
