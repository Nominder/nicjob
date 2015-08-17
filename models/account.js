"use strict";

var model = new(require('./model.js'))(),
    ObjectID = require('mongodb').ObjectID,
    fs = require('fs');

var $ = (function() {

    var $ = function() {}

    $.prototype = {
        _db: {},
        init: function(args, cb) {
            var $ = this,
                args = args || {},
                cb = cb || function() {};
            $._db = args.app.custom.db;
            model.init();
            if ($._db) cb(null, !0);
            else cb('models.account: Cannot get db', null);
            return $;
        },
        create: function(args, cb) {
            var $ = this,
                args = args || {},
                cb = cb || function() {},
                account = args.account,
                type = account.type || null,
                email = account.email || null,
                passwd = args.passwd || null;
            if (account) {
                if (type && email && passwd) {
                    console.log(passwd, passwd.length)
                    if (passwd.length >= 6) {
                        if (passwd.search(/([0-9]+)/) != -1) {
                            if (passwd.search(/([a-zа-я]+)/) != -1 && passwd.search(/([A-ZА-Я]+)/) != -1) {
                                if (email.search(/[0-9a-z_]+@[0-9a-z_^.]+\.[a-z]{2,3}/i) != -1) {
                                    $.findByEmail({
                                        email: email
                                    }, function(err, res) {
                                        if (err) cb('models.account.create: 1 - Cannot read data', null);
                                        else if (res.length === 0) {
                                            account.banned = false;
                                            account.confirmed = false;
                                            account.online = false;
                                            account.profile = {};
                                            model.build({
                                                object: account.profile,
                                                type: type
                                            }, function(err, res) {
                                                if (err) cb('models.account.create: Cannot build object ' + err, null);
                                                else {
                                                    account.profile = res;
                                                    account.blacklist = [];
                                                    account.watchlist = [];
                                                    if (type === "employer") account.vacansy = [];
                                                    $._db.collection("accounts").insert(account, function(err, _data) {
                                                        err ? cb('models.account.create: Cannot write to db ' + err, null) : cb(null, _data.ops[0]);
                                                    });
                                                }
                                            });
                                        } else cb('models.account.create: 3 - Account with such email has been exist yet', null);
                                    });
                                } else cb("models.account.create: 5 - Invalid email", null);
                            } else cb("models.account.create: 6 - Invalid password, does not contain different cases", null);
                        } else cb("models.account.create: 7 - Invalid password, does not contain numbers", null);
                    } else cb("models.account.create: 8 - Invalid password, contain less then 6 symbols", null);
                } else cb("models.account.create: 9 - Does not have arguments", null);
            } else cb('models.account.create: 9 - Cannot get object', null);
            return $;
        },
        remove: function(args, cb) {
            var $ = this,
                args = args || {},
                cb = cb || function() {},
                id = args.id || args.account || '';
            $._db.collection("accounts").remove({
                _id: new ObjectID(id)
            }, function(err, res) {
                err ? cb('models.account.update: 12 - Cannot remove account', null) : cb(null, id);
            });
            return $;
        },
        update: function(args, cb) {
            var $ = this,
                args = args || {},
                cb = cb || function() {},
                changes = args.changes || {},
                id = args.id || args.account || 0,
                length = 0;
            for (var i in changes) length++;
            if (changes && length > 0) {
                $._db.collection("accounts").update({
                    _id: new ObjectID(id)
                }, {
                    '$set': changes
                }, function(err) {
                    err ? cb('models.account.update: 12 - Cannot update account', null) : cb(null, changes);
                });
            } else cb('', null);
            return $;
        },
        updateByEmail: function(args, cb) {
            var $ = this,
                args = args || {},
                cb = cb || function() {},
                changes = args.changes || {},
                email = args.email || '',
                length = 0;
            for (var i in changes) length++;
            if (changes && length > 0) {
                $._db.collection("accounts").find({
                    email: email
                }).toArray(function(err, res) {
                    if (err || res.length === 0) cb('models.account.update: 5 - Invalid email', null);
                    else {
                        $._db.collection("accounts").update({
                            email: email
                        }, {
                            '$set': changes
                        }, function(err) {
                            err ? cb('models.account.update: 12 - Cannot update account', null) : cb(null, changes);
                        });
                    };
                });
            } else cb('models.account.update: 12 - Cannot update account', null);
            return $;
        },
        profileUpdate: function(args, cb) {
            var $ = this,
                args = args || {},
                cb = cb || function() {},
                changes = args.changes || {},
                id = args.id || args.account || 0,
                length = 0,
                type = args.type;
            for (var i in changes) length++;
            if (changes.salary && changes.salary.summa) changes.salary.summa = parseInt(changes.salary.summa);
            if (changes) {
                model.build({
                    object: changes,
                    type: type
                }, function(err, res) {
                    if (err) cb(err, null);
                    else {
                        if(type == 'competitor') {
                            res.experience = 0;
                            res.career.forEach(function(___data) {
                                res.experience += parseInt(___data.end.toString()[0] + ___data.end.toString()[1] + ___data.end.toString()[2] + ___data.end.toString()[3]) - parseInt(___data.begin.toString()[0] + ___data.begin.toString()[1] + ___data.begin.toString()[2] + ___data.begin.toString()[3]);
                            });
                        };
                        $._db.collection("accounts").update({
                            _id: new ObjectID(id)
                        }, {
                            '$set': {
                                profile: res
                            }
                        }, function(err) {
                            err ? cb('models.account.update: 12 - Cannot update account', null) : cb(null, res);
                        });
                    }
                });
            } else cb('', null);
            return $;
        },
        findById: function(args, cb) {
            var $ = this,
                args = args || {},
                cb = cb || function() {},
                id = args.id || args.account || 0;
            $._db.collection("accounts").find({
                _id: new ObjectID(id)
            }).toArray(function(err, res) {
                if (err) cb('models.account.findByEmail: Cannot read data ' + err, null);
                else cb(null, res);
            });
            return $;
        },
        findByEmail: function(args, cb) {
            var $ = this,
                args = args || {},
                cb = cb || function() {},
                email = args.email || '';
            $._db.collection("accounts").find({
                email: email
            }).toArray(function(err, res) {
                if (err) cb('models.account.findByEmail: Cannot read data ' + err, null);
                else cb(null, res);
            });
            return $;
        },
        search: function(args, cb) {
            var $ = this,
                args = args || {},
                cb = cb || function() {},
                query = args.query || {},
                _query = {
                    banned: false
                },
                page = args.page || 0,
                text = query.text || '',
                regex = new RegExp(text, 'i');
            if (query['birthdayMin'] || query['birthdayMax']) _query["profile.info.birthday"] = {};
            if (query['summMin'] || query['summMax']) _query["profile.salary.summa"] = {};
            if (query['children']) _query["profile.children"] = {};
            if (query['text'] === "") delete query['text'];

            for (var i in query) {
                switch (i) {
                    case 'type':
                        _query['type'] = query[i];
                        break;
                    case 'industry':
                        _query["profile.industryPost.industry"] = {
                            $in: query[i]
                        };
                        break;
                    case 'level':
                        _query["profile.education.education"] = {
                            $in: query[i]
                        };
                        break;
                    case 'part':
                        _query["profile.part"] = query[i];
                        break;
                    case 'tag':
                        _query["profile.languages.tag"] = {
                            $in: query[i]
                        };
                        break;
                    case 'country':
                        _query["profile.contacts.country"] = {
                            $in: query[i]
                        };
                        break;
                    case 'images':
                        if (query[i]) {
                            _query["profile.images"] = {};
                            _query["profile.images"].$ne = [];
                        };
                        break;
                    case 'videos':
                        if (query[i]) {
                            _query["profile.videos"] = {};
                            _query["profile.videos"].$ne = [];
                        };
                        break;
                    case 'birthdayMin':
                        var today = new Date();
                        var month = today.getMonth() + 1;
                        if (month !== 10 || month !== 11 || month !== 12) month = '0' + month;
                        _query["profile.info.birthday"].$lt = parseInt('' + (today.getFullYear() - query[i]) + month + today.getDate());
                        break;
                    case 'birthdayMax':
                        var today = new Date();
                        var month = today.getMonth() + 1;
                        if (month !== 10 || month !== 11 || month !== 12) month = '0' + month;
                        _query["profile.info.birthday"].$gt = parseInt('' + (today.getFullYear() - query[i] - 1) + month + today.getDate());
                        break;
                    case 'summMin':
                        _query["profile.salary.summa"].$gte = query[i];
                        break;
                    case 'summMax':
                        _query["profile.salary.summa"].$lte = query[i];
                        break;
                    case 'period':
                        _query["profile.salary.period"] = query[i].toString();
                        break;
                    case 'portfolio':
                        if (query[i]) {
                            _query["profile.portfolio"] = {};
                            _query["profile.portfolio"].$ne = [];
                        };
                        break;
                    case 'diplomas':
                        if (query[i]) {
                            _query["profile.diplomas"] = {};
                            _query["profile.diplomas"].$ne = [];
                        };
                        break;
                    case 'smoking':
                        _query["profile.smoking"] = query[i];
                        break;
                    case 'move':
                        _query["profile.move"] = query[i];
                        break;
                    case 'passport':
                        _query["profile.passport"] = query[i];
                        break;
                    case 'car':
                        _query["profile.car"] = query[i];
                        break;
                    case 'religion':
                        _query["profile.religion"] = {
                            $in: query[i]
                        };
                        break;
                    case 'children':
                        if (query[i]) {
                            _query["profile.children"].$gt = 0;
                        };
                        break;
                    case 'sex':
                        _query["profile.info.sex"] = query[i];
                        break;
                    case 'maritalStatus':
                        _query["profile.maritalStatus"] = query[i];
                        break;
                    case 'online':
                        _query["online"] = query[i];
                        break;
                    case 'text':
                        _query["$or"] = [{
                            'profile.industryPost.post': {
                                $regex: regex
                            }
                        }, {
                            'profile.education.hs': {
                                $regex: regex
                            }
                        }, {
                            'profile.education.speciality': {
                                $regex: regex
                            }
                        }, {
                            'profile.nationality': {
                                $regex: regex
                            }
                        }, {
                            'profile.religion': {
                                $regex: regex
                            }
                        }, {
                            'profile.citizenship': {
                                $regex: regex
                            }
                        }, {
                            'profile.hobby': {
                                $regex: regex
                            }
                        }, {
                            'profile.about': {
                                $regex: regex
                            }
                        }, {
                            'profile.skills': {
                                $regex: regex
                            }
                        }, {
                            'profile.negativeQualities': {
                                $regex: regex
                            }
                        }, {
                            'profile.positiveQualities': {
                                $regex: regex
                            }
                        }, {
                            'profile.info.firstname': {
                                $regex: regex
                            }
                        }, {
                            'profile.lastname': {
                                $regex: regex
                            }
                        }, {
                            'profile.middlename': {
                                $regex: regex
                            }
                        }, {
                            'profile.company.name': {
                                $regex: regex
                            }
                        }, {
                            'profile.company.description': {
                                $regex: regex
                            }
                        }, {
                            'profile.company.industry': {
                                $regex: regex
                            }
                        }, {
                            'profile.name': {
                                $regex: regex
                            }
                        }];
                        break;
                }
            }
            console.log(_query);
            $._db.collection("accounts").find(_query).skip(page * 50).limit(50).toArray(function(err, res) {
                if (err) cb('models.account.search: 1 - Connot read data', null);
                else cb(null, res);
            });
            return $;
        },
        find: function(args, cb) {
            var $ = this,
                args = args || {},
                cb = cb || function() {},
                query = args.query,
                page = args.page;
            $._db.collection("accounts").find(query).skip(page * 50).limit(50).toArray(function(err, res) {
                err ? cb('models.account.find: 1 - Connot read data', null) : cb(null, res);
            });
            return $;
        },
        read: function(args, cb) {
            var $ = this,
                args = args || {},
                cb = cb || function() {};
            $._db.collection("accounts").find({}, function(err, res) {
                if (err) cb('', null);
                else res ? cb(null, res) : cb('', null);
            });
            return $;
        },
        addVacansy: function(args, cb) {
            var $ = this,
                args = args || {},
                cb = cb || function() {},
                vacansy = args.vacansy || {},
                id = args.id || '';
            model.build({
                object: vacansy,
                type: "vacansy"
            }, function(err, res) {
                if (err) cb('models.account.addVacansy ' + err, null);
                else {
                    res._id = (new Date).getTime().toString() + Math.random().toString();
                    $._db.collection("accounts").update({
                        _id: new ObjectID(id)
                    }, {
                        $push: {
                            vacansy: res
                        }
                    }, function(err, res) {
                        err ? cb('models.account.addVacansy: 12 - Cannot update account', null) : cb(null, res);
                    });
                }
            });
            return $;
        },
        vacansyRemove: function(args, cb) {
            var $ = this,
                args = args || {},
                cb = cb || function() {},
                id = args.id || '',
                vacansyId = args.vacansyId;
            $._db.collection("accounts").update({
                _id: new ObjectID(id)
            }, {
                $pull: {
                    vacansy: {
                        _id: vacansyId
                    }
                }
            }, function(err, res) {
                err ? cb('models.account.addVacansy: 12 - Cannot update account', null) : cb(null, res);
            });
        },
        vacansyGetById: function(args, cb) {
            var $ = this,
                args = args || {},
                cb = cb || function() {},
                id = args.id || '',
                vacansyId = args.vacansyId;
            $._db.collection("accounts").find({
                _id: new ObjectID(id),
                "vacansy._id": vacansyId
            }, {
                _id: 0,
                "vacansy.$": 1,
                profile: 1
            }).toArray(function(err, res) {
                err ? cb('models.account.vacansyGetById: 1 - Connot read data', null) : cb(null, res);
            });
            return $;
        },
        vacansyGet: function(args, cb) {
            var $ = this,
                args = args || {},
                cb = cb || function() {},
                id = args.id || '';
            $._db.collection("accounts").find({
                _id: new ObjectID(id)
            }, {
                _id: 0,
                "vacansy": 1
            }).toArray(function(err, res) {
                if (res[0]) {
                    var _query = {
                        emp_id: id.toString(),
                        vac_id: {
                            $in: []
                        }
                    };
                    res[0].vacansy.forEach(function(data, i) {
                        res[0].vacansy[i].responds = [];
                        _query.vac_id.$in.push(data._id.toString());
                    });
                    //console.log(_query)
                    $._db.collection("responds").find(_query).toArray(function(err, data) {
                        //fs.writeFileSync('./data/tmpData.json', JSON.stringify(data));
                        var query = {
                            _id: {
                                $in: []
                            }
                        };
                        data.forEach(function(_res) {
                            query._id.$in.push(new ObjectID(_res.comp_id));
                        });
                        $.find({
                            query: query
                        }, function(err, _res) {
                            data.forEach(function(_data, i) {
                                _res.forEach(function(__res, k) {
                                    if (_data.comp_id.toString() === __res._id.toString()) {
                                        _res[k].profile.contacts = null;
                                        data[i].competitor = _res[k].profile;
                                    };
                                });
                            });
                            res[0].vacansy.forEach(function(_data, i) {
                                data.forEach(function(__data) {
                                    if (_data._id.toString() === __data.vac_id.toString()) {
                                        res[0].vacansy[i].responds.push(__data);
                                    };
                                });
                            });
                            err ? cb('models.account.vacansyGetById: 1 - Connot read data', null) : cb(null, res);
                        });
                    });
                } else {
                    err ? cb('models.account.vacansyGetById: 1 - Connot read data', null) : cb(null, res);
                };
            });
            return $;
        },
        vacansyUpdate: function(args, cb) {
            var $ = this,
                args = args || {},
                cb = cb || function() {},
                changes = args.changes || {},
                id = args.id || args.account || 0,
                length = 0,
                vacansyId = args.vacansyId || '';
            for (var i in changes) length++;
            if (changes && length > 0) {
                console.log(changes)
                model.build({
                    object: changes,
                    type: "vacansy"
                }, function(err, res) {
                    if (err) cb(err, null);
                    else {
                        console.log(res)
                        $._db.collection("accounts").update({
                            _id: new ObjectID(id),
                            "vacansy._id": vacansyId
                        }, {
                            '$set': {
                                "vacansy.$": res
                            }
                        }, function(err) {
                            err ? cb('models.account.update: 12 - Cannot update account', null) : cb(null, !0);
                        });
                    }
                });
            } else cb('', null);
            return $;
        },
        vacansySearch: function(args, cb) {
            var $ = this,
                args = args || {},
                cb = cb || function() {},
                query = args.query || {},
                _query = {
                    banned: false
                },
                page = args.page || 0,
                k = 0,
                text = query.text || '',
                regex = new RegExp(text, 'i');
            if (query['summMin'] || query['summMax']) _query["vacansy.salary.summa"] = {};
            if (query['text'] === "") delete query['text'];
            for (var i in query) {
                k++;
                switch (i) {
                    case 'industry':
                        _query["vacansy.vac_industryPost.industry"] = {
                            $in: query[i]
                        };
                        break;
                    case 'post':
                        _query["vacansy.vac_industryPost.post"] = {
                            $in: query[i]
                        };
                        break;
                    case 'level':
                        _query["vacansy.education.education"] = {
                            $in: query[i]
                        };
                        break;
                    case 'part':
                        _query["vacansy.part"] = {
                            $in: query[i]
                        };
                        break;
                    case 'country':
                        _query["vacansy.locating.country"] = {
                            $in: query[i]
                        };
                        break;
                    case 'city':
                        _query["vacansy.locating.city"] = {
                            $in: query[i]
                        };
                        break;
                    case 'summMin':
                        _query["vacansy.salary.summa"].$gte = query[i];
                        break;
                    case 'summMax':
                        _query["vacansy.salary.summa"].$lte = query[i];
                        break;
                    case 'period':
                        _query["vacansy.salary.period"] = query[i]
                        break;
                    case 'experience':
                        _query["vacansy.experience"] = query[i];
                        break;
                    case 'individual':
                        _query["profile.individual"] = query[i];
                        break;
                    case 'text':
                        _query["$or"] = [{
                            'vacansy.name': {
                                $regex: regex
                            }
                        }, {
                            'vacansy.vac_industryPost.post': {
                                $regex: regex
                            }
                        }, {
                            'vacansy.requirements': {
                                $regex: regex
                            }
                        }, {
                            'vacansy.about': {
                                $regex: regex
                            }
                        }, {
                            'vacansy.acting': {
                                $regex: regex
                            }
                        }];
                        break;
                }
            }
            if (k === 0) _query["vacansy.name"] = {
                $regex: new RegExp("(.*)", 'i')
            }
            var sort = {
                "vacansy": 1,
                "profile": 1
            };
            if(query.sortby) {
                sort[query.sortby] = 1;
            }
            console.log(_query, '!!!!', sort);
            $._db.collection("accounts").find(_query, {'sort':sort}).skip(page * 50).limit(50).toArray(function(err, res) {
                if (err) cb('models.account.search: 1 - Connot read data', null);
                else cb(null, res);
            });
            return $;
        },
        addBlackList: function(args, cb) {
            var $ = this,
                args = args || {},
                cb = cb || function() {},
                id = args.id || '',
                blackId = args.blackId || '',
                reason = args.reason || '';
            $._db.collection("accounts").update({
                _id: new ObjectID(id)
            }, {
                $push: {
                    blacklist: {
                        id: blackId,
                        reason: reason
                    }
                }
            }, function(err, res) {
                err ? cb('models.account.addVacansy: 12 - Cannot update account', null) : cb(null, {
                    id: blackId,
                    reason: reason
                });
            });
            return $;
        },
        removeBlackList: function(args, cb) {
            var $ = this,
                args = args || {},
                cb = cb || function() {},
                id = args.id || '',
                blackId = args.blackId || '';
            $._db.collection("accounts").update({
                _id: new ObjectID(id)
            }, {
                $pull: {
                    blacklist: {
                        id: blackId
                    }
                }
            }, function(err, res) {
                console.log(err)
                err ? cb('models.account.addVacansy: 12 - Cannot update account', null) : cb(null, res);
            });
            return $;
        },
        addWatchList: function(args, cb) {
            var $ = this,
                args = args || {},
                cb = cb || function() {},
                id = args.id || '',
                _id = args._id || '';
            $._db.collection("accounts").update({
                _id: new ObjectID(id)
            }, {
                $push: {
                    watchlist: {
                        id: _id
                    }
                }
            }, function(err, res) {
                err ? cb('models.account.addVacansy: 12 - Cannot update account', null) : cb(null, _id);
            });
            return $;
        },
        removeWatchList: function(args, cb) {
            var $ = this,
                args = args || {},
                cb = cb || function() {},
                id = args.id || '',
                _id = args._id || '';
            $._db.collection("accounts").update({
                _id: new ObjectID(id)
            }, {
                $pull: {
                    watchlist: {
                        id: _id
                    }
                }
            }, function(err, res) {
                err ? cb('models.account.addVacansy: 12 - Cannot update account', null) : cb(null, res);
            });
            return $;
        },
        getBlackList: function(args, cb) {
            var $ = this,
                args = args || {},
                cb = cb || function() {},
                id = args.id || '';
            $._db.collection("accounts").find({
                _id: new ObjectID(id)
            }, {
                _id: 0,
                blacklist: 1
            }).toArray(function(err, res) {
                err ? cb('models.account.vacansyGetById: 1 - Connot read data', []) : cb(null, res[0].blacklist);
            });
            return $;
        },
        getWatchList: function(args, cb) {
            var $ = this,
                args = args || {},
                cb = cb || function() {},
                id = args.id || '';
            $._db.collection("accounts").find({
                _id: new ObjectID(id)
            }, {
                _id: 0,
                watchlist: 1
            }).toArray(function(err, res) {
                err ? cb('models.account.vacansyGetById: 1 - Connot read data', []) : cb(null, res[0].watchlist);
            });
            return $;
        }
    }

    return $;
})();

module.exports = $;
